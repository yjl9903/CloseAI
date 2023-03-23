import useReflare from 'reflare';

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const OPENAI_API_HOST = 'api.openai.com';

export default {
  async fetch(
    request: Request,
    _env: Env,
    _ctx: ExecutionContext
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
    } else {
      const reflare = await useReflare();

      reflare.push({
        path: '/*',
        upstream: {
          domain: OPENAI_API_HOST,
          protocol: 'https',
        },
      });

      return reflare.handle(request);
    }
  },
};
