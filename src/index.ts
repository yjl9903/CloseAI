import useReflare from 'reflare';

import type { Env } from './types';

import { getOriginalKey, handleCloseAI } from './closeai';
import { checkLocationInfo } from './location';

const OPENAI_API_HOST = 'api.openai.com';

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(
        '[CloseAI](https://github.com/yjl9903/CloseAI) is an OpenAI proxy cloudflare worker.',
        {
          headers: {
            'content-type': 'text/plain;charset=UTF-8',
          },
        }
      );
    } else if (url.pathname.startsWith('/_')) {
      return handleCloseAI(request, env, ctx);
    } else if (await checkLocationInfo()) {
      const reflare = await useReflare();
      const headers: Record<string, string> = {};

      if (request.headers.has('Authorization')) {
        headers['Authorization'] = await getOriginalKey(
          env,
          request.headers.get('Authorization')!
        );
      }

      reflare.push({
        path: '/*',
        upstream: {
          domain: OPENAI_API_HOST,
          protocol: 'https',
        },
        headers: {
          request: headers,
        },
      });

      return reflare.handle(request);
    } else {
      return new Response('Worker Internal Error', {
        status: 500,
        headers: {
          'content-type': 'text/plain;charset=UTF-8',
        },
      });
    }
  },
};
