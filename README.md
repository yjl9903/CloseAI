# CloseAI

OpenAI proxy cloudflare worker.

## Usage

Use `https://closeai.onekuma.cn/`.

Or use in [openai](https://www.npmjs.com/package/openai) module.

```ts
import { Configuration } from 'openai'

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
  basePath: 'https://closeai.onekuma.cn/v1'
})
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
