---
name: MiniMax MCP
digest: 官方 MiniMax 模型上下文协议 (MCP) 服务器，支持与强大的文本到语音、图像生成和视频生成 API 进行交互。
author: MiniMax
repository: https://github.com/MiniMax-AI/MiniMax-MCP
homepage: https://www.minimax.io/platform
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - TTS
  - 图像生成
  - 视频生成
icon: https://mcp.programnotes.cn/MiniMaxLogo-Light.png
createTime: 2025-04-22
---

# MiniMax MCP

官方 MiniMax 模型上下文协议 (MCP) 服务器，支持与强大的文本到语音、图像生成和视频生成 API 进行交互。此服务器允许 MCP 客户端（如 [Claude Desktop](https://www.anthropic.com/claude)、[Cursor](https://www.cursor.so/)、[Windsurf](https://codeium.com/windsurf), [OpenAI Agents](https://github.com/openai/openai-agents-python) 等）生成语音、克隆声音、生成视频、生成图像等。

## 功能

- 将文本转换为具有给定声音的音频
- 列出所有可用的声音
- 使用提供的音频文件克隆声音
- 从提示生成视频
- 从提示生成图像

## 安装

1. 从 [MiniMax](https://www.minimax.io/platform/user-center/basic-information/interface-key) 获取您的 API 密钥。
2. 安装 `uv`（Python 包管理器），使用 `curl -LsSf https://astral.sh/uv/install.sh | sh` 安装，或参阅 `uv` [repo](https://github.com/astral-sh/uv) 获取其他安装方法。

### Claude Desktop

转到 `Claude > 设置 > 开发者 > 编辑配置 > claude_desktop_config.json` 以包含以下内容：

```json
{
  "mcpServers": {
    "MiniMax": {
      "command": "uvx",
      "args": [
        "minimax-mcp"
      ],
      "env": {
        "MINIMAX_API_KEY": "insert-your-api-key-here",
        "MINIMAX_MCP_BASE_PATH": "local-output-dir-path, such as /User/xxx/Desktop",
        "MINIMAX_API_HOST": "api host, ​https://api.minimaxi.chat|https://api.minimax.chat",
        "MINIMAX_API_RESOURCE_MODE": "optional, [url|local], url is default, audio/image/video are downloaded locally or provided in URL format"
      }
    }
  }
}
```

### Cursor

转到 `Cursor -> 偏好设置 -> Cursor 设置 -> MCP -> 添加新的全局 MCP 服务器` 以添加上述配置。

## 可用工具

| tool             | description                    |
| ---------------- | ------------------------------ |
| `text_to_audio`  | 将文本转换为具有给定声音的音频 |
| `list_voices`    | 列出所有可用的声音             |
| `voice_clone`    | 使用提供的音频文件克隆声音     |
| `generate_video` | 从提示生成视频                 |
| `text_to_image`  | 从提示生成图像                 |

## 使用示例

### 1. 播放一段晚间新闻

![broadcast a segment of the evening news](https://camo.githubusercontent.com/c3ef94ba60ab7ccb19766b30da5ed5edd6423076186885b0e7836d9562d1a3b7/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f32302d30372d35332e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

### 2. 克隆声音

![clone a voice](https://camo.githubusercontent.com/785af7de72937f77f360f14a049e9138ce3e2aa4a986e4200dec5223ba3270e6/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f31392d34352d31332e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

### 3. 生成视频

![generate a video](https://camo.githubusercontent.com/93779eee4bd56569ca8094387b01b28c3d041e19c0b75dd2e055eed8b9f424b0/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f31392d35382d35322e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

![generate a video 2](https://camo.githubusercontent.com/b664348606a70b9e387367345e827d6da31760cca85f0a4b4f892800903928e2/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f31392d35392d34332e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

### 4. 生成图像

![generate images](https://camo.githubusercontent.com/89c6ecb3831159fa25f42bd82cd4ba3b3739e064f83ea4290071b5519d80f50b/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f67656e5f696d6167652e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

![generate images 2](https://camo.githubusercontent.com/ff112467f82fbb50034ba5bc7628177f5d89b25b1d11820218b113801f8f75e0/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f67656e5f696d616765312e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)
