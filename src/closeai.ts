import type { Env } from './types';

export async function handleCloseAI(
  request: Request,
  env: Env,
  _ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/_/key') && request.method === 'POST') {
    const data = (await request.json()) as { key: string };
    if (data.key && typeof data.key === 'string') {
      const generated = { key: await generateKey(env, data.key) };
      return new Response(JSON.stringify(generated), {
        headers: { 'content-type': 'application/json;charset=UTF-8' },
      });
    } else {
      return new Response('Wrong OpenAI API key', {
        status: 400,
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
      });
    }
  } else {
    return new Response('Unknown Close AI API endpoints', {
      status: 400,
      headers: { 'content-type': 'text/plain;charset=UTF-8' },
    });
  }
}

const cacheKey = new Map<string, string>();

export async function generateKey(env: Env, original: string) {
  const generated = `sk-${randomString(48)}`;
  await env.apikey.put(`key/${generated}`, original);
  cacheKey.delete(generated);
  return generated;
}

export async function getOriginalKey(env: Env, key: string) {
  if (key.startsWith('Bearer ')) {
    const generated = key.slice(7);
    if (cacheKey.has(generated)) {
      return cacheKey.get(generated)!;
    } else {
      const original = await env.apikey.get(`key/${generated}`);
      if (original) {
        const o = `Bearer ${original}`;
        cacheKey.set(generated, o);
        return o;
      } else {
        cacheKey.set(generated, key);
        return key;
      }
    }
  } else {
    return key;
  }
}

function random(l: number, r: number): number {
  return l + Math.round(Math.random() * (r - l));
}

const character_table = '0123456789abcdefghijklmnopqrstuvwxyz';
function randomString(length = 8): string {
  return Array.apply(null, Array(length))
    .map(() => character_table[random(0, character_table.length - 1)])
    .join('');
}
