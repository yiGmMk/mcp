---
title: 编写 TypeScript MCP 服务器
description: 如何编写我们的第一个 TypeScript MCP 服务器
section: write_server
prev: quickstart
pubDate: 2024-12-03
---

# 编写第一个 TypeScript MCP 服务器

在前面我们已经通过 [快速入门](./quickstart) 了解了如何使用 MCP 协议，但是我们都是直接使用的 Claude Desktop 官方内置支持的 MCP 服务器，那么如果我们要自己编写一个 MCP 服务器，该如何实现呢？

接下来我们将通过一个 TypeScript 的 MCP 服务器示例来演示如何编写一个 MCP 服务器。我们将创建一个天气服务器，提供当前天气数据作为资源，并让 Claude 使用工具获取天气预报。

这里我们需要使用 [OpenWeatherMap API](https://openweathermap.org/api) 来获取天气数据，直接注册然后在 [API keys](https://home.openweathermap.org/api_keys) 页面即可获取一个免费的 API 密钥。

## 环境准备

我们需要准备一个 TypeScript 的开发环境，所以需要安装 [Node.js](https://nodejs.org) 和 [npm](https://www.npmjs.com)。

```bash
# 检查 Node.js 版本，需要 v18 或更高版本
node --version

# 检查 npm 版本
npm --version
```

接下来我们可以直接使用 `@modelcontextprotocol/create-server` 这个工具来创建一个 MCP 服务器的脚手架：

```bash
$ npx @modelcontextprotocol/create-server weather-server
Need to install the following packages:
@modelcontextprotocol/create-server@0.3.1
Ok to proceed? (y) y

? What is the name of your MCP server? y
? What is the description of your server? A Model Context Protocol server
? Would you like to install this server for Claude.app? Yes
✔ MCP server created successfully!
✓ Successfully added MCP server to Claude.app configuration

Next steps:
  cd weather-server
  npm install
  npm run build  # or: npm run watch
  npm link       # optional, to make available globally

$ cd weather-server
```

然后安装依赖：

```bash
npm install --save axios dotenv
```

接下来我们需要设置环境变量，创建 `.env` 文件：

```
OPENWEATHER_API_KEY=your-api-key-here
```

确保将 `.env` 文件添加到 `.gitignore` 文件中。

项目创建完成后，我们可以看到项目结构如下：
​
![MCP 服务器项目结构](/images/claude-write-ts-server-layout.png)

## 模板分析

我们使用脚手架创建的项目，默认为我们创建了一个 MCP 服务器的模板，这个模板实现了一个简单的笔记系统，它通过以下方式来说明了资源和工具等核心 MCP 概念：

- 将笔记列为资源
- 阅读个人笔记
- 通过工具创建新笔记
- 通过提示总结所有笔记

我们在编写自己的 MCP 服务器之前，我们可以先来学习下这个笔记系统是如何实现的，然后我们再基于这个模板来实现我们自己的 MCP 服务器。

首先我们看下导入的依赖包：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
```

第一行代码其实就是从 MCP 的 SDK 里面导入了 `Server` 这个对象，这个对象就表示一个 MCP 服务器，该服务器将自动响应来自客户端发起的初始化流程。后面我们还会看到导入了 `ListResourcesRequestSchema`、`ReadResourceRequestSchema` 等对象，这些对象就表示 MCP 协议中定义的请求类型。

比如模板中通过 `Server` 创建了一个 MCP 服务器：

```typescript
const server = new Server(
  {
    name: "weather-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);
```

该段代码创建了一个具有资源(用于列出/读取笔记)、工具(用于创建新笔记)和提示词(用于总结笔记)功能的 MCP 服务器，并指定了服务器的名称和版本。

当服务器初始化完成后，我们就可以通过 `Server` 对象的 `setRequestHandler` 方法来注册处理器了，当协议对象收到指定方法的请求时会被调用，这个过程其实就相当于我们编写了一个 HTTP 服务器，当收到指定 HTTP 方法的请求时，会调用我们注册的处理器。

在模板中，可以看到注册了几个处理器：

### 资源 Resources

这里我们需要对 `Resources` 资源进行一些说明，资源是 MCP 协议中的一种概念，它表示一个可以被读取和操作的对象，我们可以将服务器中的数据和内容作为资源暴露给 LLM，然后 LLM 就可以通过工具来操作这些资源。比如我们可以将一个笔记、一个文件、一个数据库表等作为资源。

> ⚠️ 需要注意的是资源被设计为由应用程序控制，这意味着客户端应用程序可以决定如何以及何时使用它们。不同的 MCP 客户端可能以不同的方式处理资源。例如：
>
> - Claude Desktop 目前要求用户在使用资源之前显式选择资源
> - 其他客户端可能会自动选择资源
> - 有些实现甚至可能允许 AI 模型本身来确定要使用哪些资源
>
> 所以服务器开发者在实现资源支持时应该准备好处理任何这些交互模式。为了自动将数据暴露给模型，服务器作者应该使用模型控制的原语，例如工具。

资源代表 MCP 服务器希望向客户端提供的任何类型的数据，可以包括如下类型：

- 文件内容
- 数据库记录
- API 响应
- 实时系统数据
- 屏幕截图和图像
- 日志文件
- 还有更多

每个资源都由唯一的 `URI` 标识，并且可以包含文本或二进制数据。

模板中将所有的笔记资源作为资源暴露给了客户端，通过 `setRequestHandler` 注册了处理器来处理客户端的 `resources/list` 请求：

```typescript
/**
 * 用于列出可用笔记作为资源的处理程序。
 * 每个笔记都作为具有以下特征的资源公开:
 * - note:// URI scheme
 * - MIME 类型
 * - 人类可读的名称和描述(包括笔记标题)
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(notes).map(([id, note]) => ({
      uri: `note:///${id}`,
      mimeType: "text/plain",
      name: note.title,
      description: `A text note: ${note.title}`,
    })),
  };
});
```

#### 资源 URI

资源使用遵循以下格式的 URI 进行标识：

```
[protocol]://[host]/[path]
```

例如：

- `file:///home/user/documents/report.pdf`
- `postgres://database/customers/schema`
- `screen://localhost/display1`

其中 `protocol` 协议和 `path` 路径结构由 MCP 服务器实现定义，当然服务器可以定义自己的自定义 URI 方案。

#### 资源类型

资源可以包含两种类型的内容：

**文本资源**

文本资源包含 UTF-8 编码的文本数据，这些适用于：

- 源代码
- 配置文件
- 日志文件
- JSON/XML 数据
- 纯文本

**二进制资源**

二进制资源包含以 `base64` 编码的原始二进制数据，这些适用于：

- 图片
- PDF 文件
- 音频文件
- 视频文件
- 其他非文本格式

#### 资源发现

客户端可以通过两种主要方法发现可用资源：

**直接资源**

服务器通过 `resources/list` 端点公开暴露具体资源的列表。每个资源包括：

```json
{
  uri: string;           // 资源的唯一标识符
  name: string;          // 人类可读的名称
  description?: string;  // 可选描述
  mimeType?: string;     // 可选的 MIME 类型
}
```

**资源模板**

对于动态资源，服务器可以暴露 **URI 模板**，客户端可以使用该模板来构造有效的资源 URI：

```json
{
  uriTemplate: string;   // 遵循 RFC 6570 的 URI 模板
  name: string;          // 该类型的人类可读名称
  description?: string;  // 可选描述
  mimeType?: string;     // 所有匹配资源的可选 MIME 类型
}
```

#### 读取资源

要读取资源，客户端用资源 URI 发出 `resources/read` 请求。服务器响应如下所示的资源内容列表：

```json
{
  contents: [
    {
      uri: string;        // 资源的 URI
      mimeType?: string;  // 可选的 MIME 类型
      // 其中之一：
      text?: string;      // 对于文本资源
      blob?: string;      // 对于二进制资源 (base64 编码)
    }
  ]
}
```

服务器可能会返回多个资源来响应一个 `resources/read` 请求，比如在读取目录时返回目录内的文件列表。

比如模板中读取笔记的处理器实现如下：

```typescript
/**
 * 用于读取指定笔记内容的处理程序。
 * 接受一个 note:// URI 并返回笔记内容作为纯文本。
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, "");
  const note = notes[id];

  if (!note) {
    throw new Error(`Note ${id} not found`);
  }

  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "text/plain",
        text: note.content,
      },
    ],
  };
});
```

#### 资源更新

MCP 通过两种机制支持资源的实时更新：

**列表变更**

当可用资源列表发生变化时，服务器可以通过 `notification/resources/list_changed` 通知客户端。

**内容变更**

客户端可以订阅指定资源的更新：

- 客户端使用资源 URI 发送 `resources/subscribe` 请求
- 当资源发生变化时服务器发送 `notification/resources/update` 通知
- 客户端可以通过 `resources/read` 来获取最新内容
- 客户端可以取消订阅资源/取消订阅

### 工具 Tools

工具使 LLM 能够通过你的服务器执行操作，Tools 使服务器能够向客户端暴露可执行功能，通过工具，LLM 可以与外部系统交互、执行计算并在现实世界中执行操作。工具从服务器暴露给客户端，目的是 AI 模型能够自动调用它们（授予批准）。

MCP 中的工具允许服务器暴露可执行函数，这些函数可以被客户端调用，并被 LLM 用来执行操作，实现工具主要包含以下几个方面：

- **发现**：客户端可以通过 `tools/list` 端点列出可用的工具调用
- **调用**：使用 `tools/call` 端点调用工具，服务器在其中执行请求操作并返回结果
- **灵活性**：工具的范围可以从简单的计算到复杂的 API 交互

与资源一样，工具由唯一名称标识，并且可以包含描述来标识其用途，但是与资源不同，工具代表可以修改状态或与外部系统交互的动态操作。

每个工具都定义有以下结构：

```json
{
  name: string;          // 工具的唯一标识符
  description?: string;  // 人类可读的描述
  inputSchema: { // 工具参数的 JSON Schema
    type: "object";
    properties: { ... } // 工具特定参数
  }
}
```

比如在模板代码中就通过 `setRequestHandler` 注册了工具列表处理器，代码如下所示：

```typescript
/**
 * 用于列出可用工具的处理程序。
 * 暴露一个 "create_note" 工具，让客户端创建新笔记。
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_note",
        description: "Create a new note",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the note",
            },
            content: {
              type: "string",
              description: "Text content of the note",
            },
          },
          required: ["title", "content"],
        },
      },
    ],
  };
});
```

上面代码根据前面定义的工具结构定义了一个名为 `create_note` 的工具，该工具表示用来创建新笔记，并且需要接收两个参数：`title` 和 `content`，也就是笔记的标题和内容，这样客户端就知道有 `create_note` 这个工具可以调用，并且知道调用该工具需要传入 `title` 和 `content` 参数。

上面这个注册器只是列出了所有可用的工具，要真正调用实现工具，还需要注册工具调用处理器，代码如下所示：

```typescript
/**
 * 用于创建新笔记的处理程序。
 * 使用提供的标题和内容创建新笔记，并返回成功消息。
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "create_note": {
      const title = String(request.params.arguments?.title);
      const content = String(request.params.arguments?.content);
      if (!title || !content) {
        throw new Error("Title and content are required");
      }

      const id = String(Object.keys(notes).length + 1);
      notes[id] = { title, content };

      return {
        content: [
          {
            type: "text",
            text: `Created note ${id}: ${title}`,
          },
        ],
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});
```

上面代码实现很简单，就是根据工具名称 `create_note` 来创建新笔记，并返回成功消息，当客户端调用 `create_note` 工具时，就会触发上面处理器代码。

### 提示词 Prompts

`Prompts` 提示词是 MCP 协议中用于定义可重复使用的提示词模板和工作流程的机制，客户可以轻松地向用户和 LLM 展示这些模板和工作流程。提示词被设计为由用户控制，这意味着它们从服务器暴露给客户端，以便用户能够显式选择使用它们。

MCP 中的提示词是预定义的模板，可以：

- 接受动态参数
- 从资源中包含上下文
- 链多个交互
- 指导特定工作流程
- 作为 UI 元素（如斜杠命令）

每个 Prompt 定义包含以下结构：

```json
{
  name: string;              // 提示词的唯一标识符
  description?: string;      // 人类可读的描述
  arguments?: [              // 可选的参数列表
    {
      name: string;          // 参数的标识符
      description?: string;  // 参数的描述
      required?: boolean;    // 是否必须
    }
  ]
}
```

客户端可以通过 `prompts/list` 端点来发现所有可用的提示词，比如发起如下所示的请求：

```json
// Request
{
  method: "prompts/list"
}

// Response
{
  prompts: [
    {
      name: "analyze-code",
      description: "Analyze code for potential improvements",
      arguments: [
        {
          name: "language",
          description: "Programming language",
          required: true
        }
      ]
    }
  ]
}
```

然后可以通过 `prompts/get` 端点来获取指定提示词的详细信息：

````json
// Request
{
  "method": "prompts/get",
  "params": {
    "name": "analyze-code",
    "arguments": {
      "language": "python"
    }
  }
}

// Response
{
  "description": "Analyze Python code for potential improvements",
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Please analyze the following Python code for potential improvements:\n\n```python\ndef calculate_sum(numbers):\n    total = 0\n    for num in numbers:\n        total = total + num\n    return total\n\nresult = calculate_sum([1, 2, 3, 4, 5])\nprint(result)\n```"
      }
    }
  ]
}
````

比如模板中通过 `setRequestHandler` 注册了提示词列表处理器，代码如下所示：

```typescript
/**
 * 用于列出可用提示词的处理程序。
 * 暴露一个 "summarize_notes" 提示词，用于总结所有笔记。
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "summarize_notes",
        description: "Summarize all notes",
      },
    ],
  };
});
```

可以看到模板中注册了一个名为 `summarize_notes` 的提示词，该提示词用于总结所有笔记，但是这个提示词并没有定义任何参数，所以客户端在调用该提示词时不需要传入任何参数。

然后要获取提示词的详细信息，可以通过 `prompts/get` 端点来获取，同样模板中也通过 `setRequestHandler` 注册了提示词获取处理器，代码如下所示：

```typescript
/**
 * 用于总结所有笔记的提示词处理器。
 * 返回一个提示词，请求总结所有笔记，并将笔记内容作为资源嵌入。
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "summarize_notes") {
    throw new Error("Unknown prompt");
  }

  const embeddedNotes = Object.entries(notes).map(([id, note]) => ({
    type: "resource" as const,
    resource: {
      uri: `note:///${id}`,
      mimeType: "text/plain",
      text: note.content,
    },
  }));

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Please summarize the following notes:",
        },
      },
      ...embeddedNotes.map((note) => ({
        role: "user" as const,
        content: note,
      })),
      {
        role: "user",
        content: {
          type: "text",
          text: "Provide a concise summary of all the notes above.",
        },
      },
    ],
  };
});
```

从上面代码可以看到，在生成提示词时，会将所有笔记内容嵌入到提示词中，这样上下文就有了笔记的相关内容了。

### 启动服务器

到这里，我们就实现了一个简单的 MCP 服务器，并且注册了资源、工具、提示词等处理器。当然最后我们还需要启动服务器，这样我们编写的服务器才能真正运行起来。

模板中通过 `stdio` 传输启动服务器，代码如下所示：

```typescript
/**
 * 使用 stdio 传输启动服务器。
 * 允许服务器通过标准输入/输出流进行通信。
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

`stdio` 传输支持通过标准输入输出流进行通信，这对于本地集成和命令行工具特别有用，我们可以在以下情况下使用 `stdio`：

- 构建命令行工具
- 实施本地集成
- 需要简单的进程通信
- 使用 shell 脚本

除了 `stdio` 传输，MCP 还支持基于 HTTP 的服务器发送事件 (`SSE`) 传输，SSE 传输支持通过 HTTP POST 请求进行服务器到客户端流式传输，以进行客户端到服务器通信。在以下情况下我们可以使用 `SSE`：

- 只需要服务器到客户端的流式传输
- 使用受限网络
- 实施简单的更新
