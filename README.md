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

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
