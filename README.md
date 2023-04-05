# CloseAI

OpenAI proxy cloudflare worker.

## Features

+ Proxy OpenAI API endpoints
+ Support API key mask

## Usage

Use `https://closeai.onekuma.cn/` or your deployed worker domain.

Or use in [openai](https://www.npmjs.com/package/openai) module.

```ts
import { Configuration } from 'openai'

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath: 'https://closeai.onekuma.cn/v1'
})
```

## API key mask

Generate a new CloseAI API key to replace the usage of the original OpenAI API key, so that you can use the generated key instead of the original one to avoid the leak of your real API key.

```bash
$ curl -X POST -H "Content-Type: application/json" \
       -d '{"key": "sk-<your original api key>"}' \
       https://closeai.onekuma.cn/_/key
{"key":"sk-<your generated api key>"}
```

## Deploy

```bash
pnpm install
pnpm run deploy
```

## Inspiration

+ [justjavac/openai-proxy](https://github.com/justjavac/openai-proxy): OpenAI/ChatGPT 免翻墙代理.
+ [egoist/openai-proxy](https://github.com/egoist/openai-proxy): OpenAI proxy on Cloudflare Worker.

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
