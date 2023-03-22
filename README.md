# CloseAI

OpenAI proxy worker.

## Usage

```diff
import { Configuration } from 'openai'

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
+ basePath: 'https://closeai.onekuma.cn/v1'
})
```

## Inspiration

[justjavac/openai-proxy](https://github.com/justjavac/openai-proxy): OpenAI/ChatGPT 免翻墙代理.

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
