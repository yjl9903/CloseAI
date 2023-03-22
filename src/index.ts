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
        'This is CloseAI (https://github.com/yjl9903/CloseAI)',
        {
          headers: {
            'content-type': 'text/plain;charset=UTF-8',
          },
        }
      );
    } else {
      url.host = OPENAI_API_HOST;
      return await fetch(url, request);
    }
  },
};
