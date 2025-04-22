---
name: MiniMax MCP
digest: Official MiniMax Model Context Protocol (MCP) server that enables interaction with powerful Text to Speech, image generation and video generation APIs.
author: MiniMax
repository: https://github.com/MiniMax-AI/MiniMax-MCP
homepage: https://www.minimax.io/platform
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - TTS
  - Image Generation
  - Video Generation
icon: https://mcp.programnotes.cn/MiniMaxLogo-Light.png
createTime: 2025-04-22
---

# MiniMax MCP

Official MiniMax Model Context Protocol (MCP) server that enables interaction with powerful Text to Speech, image generation and video generation APIs. This server allows MCP clients like [Claude Desktop](https://www.anthropic.com/claude), [Cursor](https://www.cursor.so/), [Windsurf](https://codeium.com/windsurf), [OpenAI Agents](https://github.com/openai/openai-agents-python) and others to generate speech, clone voices, generate video, generate image and more.

## Features

- Convert text to audio with a given voice
- List all voices available
- Clone a voice using provided audio files
- Generate a video from a prompt
- Generate a image from a prompt

## Installation

1.  Get your API key from [MiniMax](https://www.minimax.io/platform/user-center/basic-information/interface-key).
2.  Install `uv` (Python package manager), install with `curl -LsSf https://astral.sh/uv/install.sh | sh` or see the `uv` [repo](https://github.com/astral-sh/uv) for additional install methods.

### Claude Desktop

Go to `Claude > Settings > Developer > Edit Config > claude_desktop_config.json` to include the following:

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

Go to `Cursor -> Preferences -> Cursor Settings -> MCP -> Add new global MCP Server` to add above config.

## Available Tools

| tool             | description                              |
| ---------------- | ---------------------------------------- |
| `text_to_audio`  | Convert text to audio with a given voice |
| `list_voices`    | List all voices available                |
| `voice_clone`    | Clone a voice using provided audio files |
| `generate_video` | Generate a video from a prompt           |
| `text_to_image`  | Generate a image from a prompt           |

## Example Usage

### 1. Broadcast a segment of the evening news

![broadcast a segment of the evening news](https://camo.githubusercontent.com/c3ef94ba60ab7ccb19766b30da5ed5edd6423076186885b0e7836d9562d1a3b7/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f32302d30372d35332e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

### 2. Clone a voice

![clone a voice](https://camo.githubusercontent.com/785af7de72937f77f360f14a049e9138ce3e2aa4a986e4200dec5223ba3270e6/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f31392d34352d31332e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

### 3. Generate a video

![generate a video](https://camo.githubusercontent.com/93779eee4bd56569ca8094387b01b28c3d041e19c0b75dd2e055eed8b9f424b0/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f31392d35382d35322e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

![generate a video 2](https://camo.githubusercontent.com/b664348606a70b9e387367345e827d6da31760cca85f0a4b4f892800903928e2/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f536e6970617374655f323032352d30342d30395f31392d35392d34332e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

### 4. Generate images

![generate images](https://camo.githubusercontent.com/89c6ecb3831159fa25f42bd82cd4ba3b3739e064f83ea4290071b5519d80f50b/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f67656e5f696d6167652e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)

![generate images 2](https://camo.githubusercontent.com/ff112467f82fbb50034ba5bc7628177f5d89b25b1d11820218b113801f8f75e0/68747470733a2f2f7075626c69632d63646e2d766964656f2d646174612d616c67656e672e6f73732d636e2d77756c616e63686162752e616c6979756e63732e636f6d2f67656e5f696d616765312e706e673f782d6f73732d70726f636573733d696d6167652f726573697a652c705f35302f666f726d61742c77656270)
