---
title: Write a TypeScript MCP Server
description: How to write your first TypeScript MCP server
section: write_server
prev: quickstart
pubDate: 2024-12-03
---

# Write a TypeScript MCP Server

In the previous section, we learned how to use the MCP protocol by following the [Quick Start](./quickstart). However, we have been using the MCP servers built in by Claude Desktop directly. So how can we implement our own MCP server?

Next, we will demonstrate how to write an MCP server through a TypeScript example. We will create a weather server that provides current weather data as a resource and allows Claude to use tools to get weather forecasts.

We need to use the [OpenWeatherMap API](https://openweathermap.org/api) to get weather data. After registering, you can get a free API key on the [API keys](https://home.openweathermap.org/api_keys) page.

## Environment Preparation

We need to prepare a TypeScript development environment, so we need to install [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com).

```bash
# Check Node.js version, need v18 or higher version
node --version

# Check npm version
npm --version
```

Next, we can use the `@modelcontextprotocol/create-server` tool to create an MCP server scaffold:

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

Then install the dependencies:

```bash
npm install --save axios dotenv
```

Next, we need to set the environment variables, create a `.env` file:

```
OPENWEATHER_API_KEY=your-api-key-here
```

Ensure to add the `.env` file to the `.gitignore` file.

After the project is created, we can see the project structure as follows:

![MCP Server Project Structure](/images/claude-write-ts-server-layout.png)

## Template Analysis

We use the scaffold to create a project, which creates a template for an MCP server by default. This template implements a simple note system, which explains the core MCP concepts of resources and tools in the following ways:

- List notes as resources
- Read personal notes
- Create new notes through tools
- Summarize all notes through prompts

Before writing our own MCP server, we can learn how this note system is implemented, and then we can implement our own MCP server based on this template.

First, let's look at the imported dependency packages:

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

The first line of code is importing the `Server` object from the MCP SDK, which represents an MCP server. This server will automatically respond to the initialization process initiated by the client. Later, we will also see that objects such as `ListResourcesRequestSchema` and `ReadResourceRequestSchema` are imported, which represent the request types defined in the MCP protocol.

For example, the template creates an MCP server through `Server`:

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

This code creates an MCP server with resources (for listing/reading notes), tools (for creating new notes), and prompts (for summarizing notes), and specifies the server's name and version.

After the server is initialized, we can register handlers through the `setRequestHandler` method of the `Server` object. When the protocol object receives a request for a specified method, it will be called, which is actually equivalent to writing an HTTP server. When an HTTP request with a specified method is received, the registered handler will be called.

In the template, we can see that several handlers are registered:

### Resources

Here we need to explain the `Resources` concept in the MCP protocol. Resources represent an object that can be read and manipulated, and we can expose data and content from the server to LLMs, and then LLMs can operate on these resources through tools. For example, we can treat a note, a file, a database table, etc. as resources.

> ⚠️ Note that resources are designed to be controlled by the application, which means that the client application can decide how and when to use them. Different MCP clients may handle resources differently. For example:
>
> - Claude Desktop currently requires users to explicitly select resources before using them
> - Other clients may automatically select resources
> - Some implementations even allow the AI model itself to determine which resources to use
>
> So server developers should be prepared to handle any of these interaction patterns when implementing resource support. To automatically expose data to the model, server authors should use model control primitives, such as tools.

Resources represent any type of data that the MCP server wants to provide to the client, which can include:

- File content
- Database records
- API response
- Real-time system data
- Screenshots and images
- Log files
- And more

Each resource is identified by a unique `URI`, and can contain text or binary data.

The template exposes all the note resources to the client, and registers a handler to process the client's `resources/list` request through `setRequestHandler`:

```typescript
/**
 * Handler for listing available notes as resources.
 * Each note is exposed as a resource with the following characteristics:
 * - note:// URI scheme
 * - MIME type
 * - Human-readable name and description (including note title)
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

#### Resource URI

Resources are identified using URIs in the following format:

```
[protocol]://[host]/[path]
```

For example:

- `file:///home/user/documents/report.pdf`
- `postgres://database/customers/schema`
- `screen://localhost/display1`

Where `protocol` is the protocol and `path` is the path defined by the MCP server implementation, of course, the server can define its own custom URI schemes.

#### Resource Types

Resources can contain two types of content:

**Text Resources**

Text resources contain UTF-8 encoded text data, which are suitable for:

- Source code
- Configuration files
- Log files
- JSON/XML data
- Plain text

**Binary Resources**

Binary resources contain raw binary data encoded in `base64`, which are suitable for:

- Images
- PDF files
- Audio files
- Video files
- Other non-text formats

#### Resource Discovery

Clients can discover available resources in two main ways:

**Direct Resources**

The server exposes a list of specific resources through the `resources/list` endpoint. Each resource includes:

```json
{
  uri: string;           // The unique identifier of the resource
  name: string;          // A human-readable name
  description?: string;  // An optional description
  mimeType?: string;     // An optional MIME type
}
```

**Resource Templates**

For dynamic resources, the server can expose **URI templates**, and clients can use these templates to construct valid resource URIs:

```json
{
  uriTemplate: string;   // URI template following RFC 6570
  name: string;          // A human-readable name for this type
  description?: string;  // An optional description
  mimeType?: string;     // An optional MIME type for all matching resources
}
```

#### Reading Resources

To read a resource, the client sends a `resources/read` request with the resource URI. The server responds with a list of resource content as follows:

```json
{
  contents: [
    {
      uri: string;        // The URI of the resource
      mimeType?: string;  // An optional MIME type
      // One of the following:
      text?: string;      // For text resources
      blob?: string;      // For binary resources (base64 encoded)
    }
  ]
}
```

The server may return multiple resources to respond to a `resources/read` request, such as returning a list of files in a directory when reading a directory.

For example, the processor implementation for reading a note is as follows:

```typescript
/**
 * Handler for reading the content of a specified note.
 * Accepts a note:// URI and returns the note content as plain text.
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

#### Resource Updates

MCP supports real-time updates of resources through two mechanisms:

**List Changes**

When the list of available resources changes, the server can notify the client through `notification/resources/list_changed`.

**Content Changes**

Clients can subscribe to updates of a specified resource:

- The client sends a `resources/subscribe` request with the resource URI
- When the resource changes, the server sends a `notification/resources/update` notification
- The client can get the latest content through `resources/read`
- The client can unsubscribe from the resource

### Tools

Tools allow LLMs to perform operations through your server, and allow servers to expose executable functions to clients, through tools, LLMs can interact with external systems, perform calculations, and execute real-world actions. Tools are exposed to clients from the server, with the purpose of AI models being able to automatically invoke them (with approval).

MCP tools allow servers to expose executable functions that can be called by clients, and are used by LLMs to perform operations, the implementation of tools mainly includes the following aspects:

- **Discoverability**：Clients can list available tools through the `tools/list` endpoint
- **Invocation**：Use the `tools/call` endpoint to invoke tools, where the server performs the requested operation and returns the result
- **Flexibility**：The scope of tools can range from simple calculations to complex API interactions

Like resources, tools are identified by unique names and can include descriptions to identify their purpose, but unlike resources, tools represent dynamic operations that can modify state or interact with external systems.

Each tool is defined with the following structure:

```json
{
  name: string;          // The unique identifier of the tool
  description?: string;  // A human-readable description
  inputSchema: { // The JSON Schema for the tool's parameters
    type: "object";
    properties: { ... } // The tool's specific parameters
  }
}
```

For example, in the template code, a tool list processor is registered through `setRequestHandler`:

```typescript
/**
 * Handler for listing available tools.
 * Exposes a "create_note" tool, allowing clients to create new notes.
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

The above code defines a tool named `create_note` according to the tool structure defined earlier, which represents creating a new note, and requires two parameters: `title` and `content`, i.e., the title and content of the note. This way, the client knows that there is a `create_note` tool that can be called, and knows that the tool requires `title` and `content` parameters when called.

To actually implement the tool, we need to register a tool call processor, as shown in the following code:

```typescript
/**
 * Handler for creating a new note.
 * Creates a new note with the provided title and content, and returns a success message.
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

The above code is very simple, it creates a new note with the provided title and content, and returns a success message. When the client calls the `create_note` tool, it will trigger the above processor code.

### Prompts

`Prompts` are a mechanism in the MCP protocol for defining reusable prompt templates and workflows, clients can easily display these templates and workflows to users and LLMs. Prompts are designed to be controlled by users, which means they are exposed to clients from the server, so users can explicitly select and use them.

MCP prompts are predefined templates that can:

- Accept dynamic parameters
- Include context from resources
- Chain multiple interactions
- Guide specific workflows
- Be used as UI elements (such as slash commands)

Each prompt is defined with the following structure:

```json
{
  name: string;              // The unique identifier of the prompt
  description?: string;      // A human-readable description
  arguments?: [              // An optional list of arguments
    {
      name: string;          // The identifier of the argument
      description?: string;  // The description of the argument
      required?: boolean;    // Whether it is required
    }
  ]
}
```

Clients can discover all available prompts through the `prompts/list` endpoint, for example, by sending the following request:

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

Then, you can get the detailed information of a specified prompt through the `prompts/get` endpoint:

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

For example, the template registers a prompt list processor through `setRequestHandler`, as shown in the following code:

```typescript
/**
 * Handler for listing available prompts.
 * Exposes a "summarize_notes" prompt, for summarizing all notes.
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

We can see that the template registers a prompt named `summarize_notes`, which is used to summarize all notes, but this prompt does not define any parameters, so the client does not need to pass any parameters when calling this prompt.

Then, to get the detailed information of a prompt, you can get it through the `prompts/get` endpoint, the template also registers a prompt get processor through `setRequestHandler`, as shown in the following code:

```typescript
/**
 * Handler for summarizing all notes.
 * Returns a prompt for requesting to summarize all notes, and embeds the note content as resources.
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

From the above code, we can see that when generating the prompt, all note content is embedded into the prompt, so the context now has the related content of the notes.

### Start the Server

Here, we have implemented a simple MCP server and registered resource, tool, and prompt processors. Of course, we still need to start the server so that the server we wrote can actually run.

The template starts the server using the `stdio` transport, as shown in the following code:

```typescript
/**
 * Start the server using the stdio transport.
 * Allows the server to communicate via standard input/output streams.
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

The `stdio` transport supports communication via standard input/output streams, which is particularly useful for local integration and command line tools. We can use `stdio` in the following cases:

- Build command line tools
- Implement local integration
- Need simple process communication
- Use shell scripts

In addition to the `stdio` transport, MCP also supports the Server-Sent Events (SSE) transport based on HTTP, the SSE transport supports server-to-client streaming through HTTP POST requests, for client-to-server communication. We can use `SSE` in the following cases:

- Only need server-to-client streaming
- Use restricted networks
- Implement simple updates
