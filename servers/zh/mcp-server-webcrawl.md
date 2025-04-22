---
name: mcp-server-webcrawl
digest: 搜索和检索网络爬虫内容。连接到具有高级过滤和内容检索功能的爬虫。
author: pragmar
repository: https://github.com/pragmar/mcp_server_webcrawl
homepage: https://pragmar.com/mcp-server-webcrawl/
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - crawler
  - search
  - indexing
icon: https://pragmar.com/media/static/images/home/mcp-server-webcrawl.png
createTime: 2025-03-26
---

这是一个提供网络爬虫搜索和检索功能的模型上下文协议(MCP)服务器。该服务器允许 MCP 客户端使用高级过滤功能搜索和访问已爬取站点的网络内容。

## 功能

🔍 **全文搜索**。通过关键词、标签、CSS 类等过滤网络内容。

🔬 **高级搜索**。按状态、内容类型和/或站点进行搜索。

🕸️ **多爬虫支持**。支持诸如 WARC、wget、InterroBot、Katana、SiteOne 等爬虫。

✂️ **API 上下文形成**。字段选项决定 API 返回的内容，在 LLM 交互中保持上下文轻量。

## 安装

需要 Python 3.10 或更高版本。

### 使用 pip 安装

使用 pip 安装包：

```bash
pip install mcp-server-webcrawl
```

## 配置

配置因爬虫而异。你需要将--datasource 示例替换为目标路径。

### wget 配置

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "wget", "--datasrc", "/path/to/wget/archives/"]
    }
  }
}
```

**测试过的 wget 命令：**

```bash
# --adjust-extension用于文件扩展名，例如：*.html
wget --mirror https://example.com
wget --mirror https://example.com --adjust-extension
```

### WARC 配置

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "warc", "--datasrc", "/path/to/warc/archives/"]
    }
  }
}
```

**用于 WARC 的测试过的 wget 命令：**

```bash
wget --warc-file=example --recursive https://example.com
wget --warc-file=example --recursive --page-requisites https://example.com
```

### InterroBot 配置

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": [
        "--crawler",
        "interrobot",
        "--datasrc",
        "/home/user/Documents/InterroBot/interrobot.v2.db"
      ]
    }
  }
}
```

**注意：**

- 爬虫必须在 InterroBot 内部运行（窗口模式）
- macOS/Windows：--datasource 路径在 InterroBot 选项页面中提供

### Katana 配置

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "katana", "--datasrc", "/path/to/katana/crawls/"]
    }
  }
}
```

**测试过的 Katana 命令：**

```bash
# -store-response用于存储爬取内容
# -store-response-dir允许在单个目录中爬取多个站点
katana -u https://example.com -store-response -store-response-dir crawls/
```

### SiteOne 配置

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": [
        "--crawler",
        "siteone",
        "--datasrc",
        "/path/to/siteone/archives/"
      ]
    }
  }
}
```

**注意：**

- 爬虫必须在 SiteOne 内部运行（窗口模式）
- 必须选择"Generate offline website"选项

## 可用工具

### `webcrawl_sites`

获取站点列表（项目站点或爬取目录）。

**可选参数**

- `fields`（字符串数组，可选）：除了基本字段（id、url）外，要包含在响应中的附加字段。选项包括：
- `ids`（整数数组，可选）：按项目 ID 过滤的列表。为空表示所有项目。

**可选字段**

- `modified` 最后修改的 ISO 8601 时间戳
- `created` 创建的 ISO 8601 时间戳
- `robots` Robots.txt 信息（有限支持）

**使用示例**

列出所有爬取的站点："你能列出网络爬虫吗？"

获取特定站点的基本爬取信息："你能获取 example.com 的网络爬虫信息吗？"

### `webcrawl_search`

搜索项目范围内的资源（网页、CSS、PDF 等）并检索指定字段。

**可选参数：**

- `query`（字符串，可选）：全文搜索查询字符串。支持全文和布尔运算符，语法匹配 SQLite FTS5 的布尔模式（AND, OR, NOT, 引号短语, 后缀通配符）。
- `sites`（整数数组，可选）：项目 ID 列表，用于将搜索结果过滤到特定站点。
- `limit`（整数，可选）：要返回的最大结果数。默认为 20，最大为 100。
- `offset`（整数，可选）：为分页而跳过的结果数。默认为 0。
- `sort`（字符串，可选）：结果的排序顺序。`+`前缀表示升序，`-`表示降序。
- `statuses`（整数数组，可选）：按 HTTP 状态码过滤（例如[200]表示成功响应，[404, 500]表示错误）。
- `types`（字符串数组，可选）：过滤到特定资源类型。
- `thumbnails`（布尔值，可选）：启用图像缩略图的 base64 编码数据。默认为 false。
- `fields`（字符串数组，可选）：除了基本字段（id、URL、status）外，要包含在响应中的附加字段。空列表表示仅基本字段。内容字段可能会很大，应谨慎与 LIMIT 一起使用：
- `ids`（整数数组，可选）：通过 ID 直接查找特定资源。

**可选字段**

- `created`：创建的 ISO 8601 时间戳
- `modified`：最后修改的 ISO 8601 时间戳
- `content`：如果是 text/\*，则为资源的实际内容（HTML/CSS/JS/纯文本）
- `name`：资源名称或标题信息
- `size`：文件大小信息
- `time`：与资源相关的时间指标（支持因爬虫类型而异）
- `headers`：与资源关联的 HTTP 头（支持因爬虫类型而异）

**排序选项**

- `+id`, `-id`：按资源 ID 排序
- `+url`, `-url`：按资源 URL 排序
- `+status`, `-status`：按 HTTP 状态码排序
- `?`：随机排序（对统计抽样有用）

**使用示例：**

搜索站点关键词："你能在 example.com 爬虫中搜索关键词吗？"

搜索和过滤内容摘要："你能在网络爬虫中搜索关键词，收集并总结内容吗？"

获取图像信息："你能列出 example.com 网络爬虫中的图片吗？"

查找带有关键词的 404 错误（WARC/Katana/InterroBot）："你能在 example.com 爬虫中搜索 404 错误吗？"

## 许可证

本项目采用 MPL 2.0 许可证。有关详细信息，请参阅存储库中的 LICENSE 文件。
