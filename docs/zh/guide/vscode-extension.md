---
title: VS Code 插件
---

# VS Code 插件

我们提供了 VS Code 插件，以提高使用此主题创建 Slidev 演示文稿的效率。

## 功能特点

- 🎯 **侧边栏面板** - 快速访问布局、组件、模板、主题、参考文献和 CLI 操作
- ✨ **代码片段** - 输入 `ss-` 或 `scholarly-` 触发布局和组件的代码片段
- ⚡ **智能补全** - 对 `layout:`、`themeConfig`、组件（`<...>`）和指令（`:::`）提供上下文候选
- 📝 **一键插入/应用** - 点击面板中的项目即可插入内容或更新 frontmatter
- 🚀 **新建演示** - 创建带有预配置模板的新演示文稿
- 🎨 **主题控制** - 在 Themes 面板中一键应用 `themeConfig.colorTheme`、`themeConfig.fontTheme`、`contentMode`、`chromeMode` 和 `sectionMode`
- 📚 **参考文献与锚点** - BibTeX 引用补全/悬浮预览、内部锚点补全、统一的 References 面板，以及命令面板里的锚点创建/引用插入
- 🧭 **Citation 诊断** - 对缺失 bibliography 配置、未解析 cite key、重复 BibTeX key 和缺失 references 页提供编辑器内 warning 与 quick fix
- 🧪 **Dev Mode** - 内置性能诊断，提供耗时日志与慢操作标记

## 安装方法

### 从 VSIX 文件安装

1. 从 [GitHub 发布页面](https://github.com/jxpeng98/slidev-theme-scholarly/releases) 下载 `.vsix` 文件
2. 在 VS Code 中，按 `Cmd+Shift+P`（Mac）或 `Ctrl+Shift+P`（Windows/Linux）打开命令面板
3. 输入 "Extensions: Install from VSIX" 并选择下载的文件
4. 重新加载 VS Code

## 使用方法

### 使用代码片段

在任何 Markdown 文件中输入前缀以触发自动完成：

```markdown
ss-cover      # 插入封面布局
ss-theorem    # 插入定理组件
ss-block      # 插入信息块组件
scholarly-cite # 插入引用
```

按 `Tab` 键在插入的代码片段中的占位符之间移动。

### 输入时智能候选

插件还提供了基于上下文的补全建议：

- `layout:` -> 布局名称候选（`cover`、`section`、`results` 等）
- `colorTheme:` / `fontTheme:` -> 主题配置值候选
- `contentMode:` -> 内容表面模式候选（`light`、`dark`）
- `chromeMode:` / `sectionMode:` -> chrome 与章节表面模式候选（`light`、`dark`、`match`、`inverse`）
- `colorMode:` -> 兼容旧配置的别名候选
- `<` -> Scholarly 组件候选（`Theorem`、`Block`、`Columns` 等）
- `:::` -> Markdown 语法糖指令候选（`theorem`、`block`、`keywords` 等）
- `](#` / `href="#` / `to="#` -> 当前文档中可用的内部锚点 id
- `ss-` / `scholarly-` -> 内置 snippet 候选

如果没有自动弹出建议，可按 `Ctrl+Space`（macOS 也可使用 `Cmd+Space`，若未被系统占用）手动触发。

### Citation 诊断与 Quick Fix

当 Markdown deck 中出现 `@citekey` 或 `!@citekey` 时，插件会检查当前文件：

- 是否缺少 `bibFile` frontmatter 或默认 `references.bib`
- `.bib` 文件是否不存在
- BibTeX key 是否重复
- 引用 key 是否无法解析
- 是否缺少 `layout: references` 页面

Quick Fix 可以自动添加 `bibFile: ./references.bib`、创建缺失的 bibliography 文件、为未解析 key 追加 BibTeX stub，或添加 references slide。诊断复用与 `sch doctor` 相同的 shared citation parser，因此会忽略 Vue 事件处理器、邮箱、URL、inline code 和 fenced code block。

### 插入内部锚点

现在命令面板里有两个专门的锚点命令：

- `Insert Internal Anchor` -> 在光标处创建新锚点，可插入 `::anchor{#anchor-id}`、`{#anchor-id}` 或 `id="anchor-id"`
- `Insert Internal Anchor Reference` -> 从当前 Markdown 文档中选择已有锚点，并插入 `#anchor-id`

如果你更喜欢代码片段，也可以直接输入 `ss-anchor`。

### 用于性能测试的 Dev Mode

当你需要分析插件性能时，可开启 dev mode：

- 命令面板：`Slidev Scholarly: Toggle Dev Mode`
- 设置项：
  - `slidevScholarly.devMode.enabled`
  - `slidevScholarly.devMode.slowThresholdMs`（默认 `25`）

开启后：

- 状态栏会显示 `Scholarly Dev`
- `Slidev Scholarly` 输出通道会打印性能耗时日志
- 超过阈值的操作会标记为 `SLOW`

如果你在本地开发插件，可使用 `vscode-extension/.vscode/launch.json` 中的 `Run Extension (Dev Mode)` 调试配置。

### 使用侧边栏

1. 打开右侧的 **Secondary Side Bar**，然后选择 **Slidev Scholarly**
2. 浏览六个部分：
   - **Layouts（布局）** - 按类别组织的幻灯片布局：
     - *结构布局* - cover、default、intro、section、center、auto-center、auto-size、toc、end
     - *内容布局* - two-cols、image-left/right、bullets、figure、split-image
     - *强调布局* - quote、fact、statement、focus
     - *学术布局* - compare、methodology、results、timeline、agenda、acknowledgments、references
   - **Components（组件）** - 内置 Vue 组件
   - **Templates（模板）** - 预制的演示文稿模板
   - **Themes（主题）** - 应用主题预设（会更新 frontmatter）
   - **References（参考文献）** - 同时浏览 BibTeX 条目和内部锚点，并插入 cite key 或 `#anchor-id`
   - **CLI** - 在侧边栏直接运行 Scholarly CLI：
     - *Create* - 新建演示与模板列表
     - *Theme* - 应用/查看主题，应用预设组合，查看布局/组件清单
     - *Snippets* - 追加/查看/列出片段，追加 workflow
     - *Tools* - 环境检查与帮助
3. 点击任意项目（或有 `+` 的地方点击 `+`）即可插入/应用

### 创建新演示文稿

1. 打开命令面板（`Cmd+Shift+P` / `Ctrl+Shift+P`）
2. 输入 "Slidev Scholarly: New Presentation"
3. 选择位置和文件名
4. 将创建一个包含基本模板的新文件

## 可用的代码片段

### 布局片段

布局按四个类别组织。你可以使用类别前缀（`ss-structure-*`、`ss-content-*`、`ss-emphasis-*`、`ss-academic-*`）或简短的 `ss-*` 前缀。

补全列表中会以 `ss-*` 作为规范前缀显示。旧的 `scholarly-*` 别名仍然通过扩展的智能补全保留兼容。

#### 结构布局

| 前缀 | 描述 |
|------|------|
| `ss-cover` | 封面/标题幻灯片 |
| `ss-default` | 默认内容幻灯片 |
| `ss-intro` | 章节介绍 |
| `ss-section` | 章节分隔符（支持 `sectionMode: dark/light/match/inverse`） |
| `ss-center` | 居中内容 |
| `ss-auto-center` | 自动调整的居中内容 |
| `ss-auto-size` | 带 `autoSizeGrow`、`autoSizeAlign`、`autoSizePadding` 控制项的页面自适应布局 |
| `ss-toc` | 按 section 分组的自动目录页 |
| `ss-end` | 致谢/结束幻灯片 |

说明：如果在 frontmatter 里启用 `themeConfig.outlineToc: true`，放映页脚中的 TOC 也会使用同样的 section 分组；桌面端放映视图下，悬停或聚焦条目时还会显示对应页面预览。

#### 内容布局

| 前缀 | 描述 |
|------|------|
| `ss-two-cols` | 双栏布局 |
| `ss-image-left` | 左图右文 |
| `ss-image-right` | 左文右图 |
| `ss-bullets` | 增强列表 |
| `ss-figure` | 带标题的学术图片 |
| `ss-split-image` | 并排图片对比 |

#### 强调布局

| 前缀 | 描述 |
|------|------|
| `ss-quote` | 带出处的引用 |
| `ss-fact` | 单个事实/统计数据 |
| `ss-statement` | 重要陈述 |
| `ss-focus` | 带图标的聚焦陈述 |

#### 学术布局

| 前缀 | 描述 |
|------|------|
| `ss-compare` | 并排对比 |
| `ss-methodology` | 研究方法 |
| `ss-results` | 结果仪表板 |
| `ss-timeline` | 研究时间线 |
| `ss-agenda` | 议程概览 |
| `ss-acknowledgments` | 致谢幻灯片 |
| `ss-references` | 参考文献幻灯片 |

### 组件片段

| 前缀 | 描述 |
|------|------|
| `ss-theorem` | 定理/引理/定义 |
| `ss-block` | Beamer 风格彩色块 |
| `ss-steps` | 工作流程/步骤 |
| `ss-steps-md` | 工作流程/步骤（Markdown 语法糖） |
| `ss-keywords` | 关键词标签 |
| `ss-keywords-md` | 关键词标签（Markdown 语法糖） |
| `ss-columns` | 多列布局 |
| `ss-columns-md` | 多列布局（Markdown 语法糖） |
| `ss-highlight` | 文本高亮 |
| `ss-highlight-md` | 文本高亮（Markdown 语法糖） |
| `ss-cite` | BibTeX 引用 `@citekey` |
| `ss-cite-multi` | 分组 BibTeX 引用 |
| `ss-cite-note` | 类注脚手动引用说明 |
| `ss-anchor` | 独立内部锚点 `::anchor{#anchor-id}` |
| `ss-cite-comp` | Cite 组件（非 BibTeX） |
| `ss-cite-md` | Cite 组件（Markdown 语法糖） |
| `ss-theme-preview` | ThemePreview 组件 |
| `ss-bibliography` | 参考文献占位符 |
| `ss-references-slide` | 参考文献页面 |

### 主题预设片段

| 前缀 | 描述 |
|------|------|
| `ss-theme-classic` | Classic Blue + Classic 字体 |
| `ss-theme-oxford` | Oxford 酒红 + Traditional 字体 |
| `ss-theme-cambridge` | Cambridge 绿 + Elegant 字体 |
| `ss-theme-modern` | 单色 + Sans-default 字体 |

### 实用片段

| 前缀 | 描述 |
|------|------|
| `ss-frontmatter` | 完整的 frontmatter 配置 |
| `ss-slide` / `---` | 幻灯片分隔符 |

## 使用技巧

### 快速选择布局

当你需要特定布局时，只需输入 `ss-` 并浏览自动完成建议。每个片段都包含常用选项的有用占位符。

### 与 Markdown 语法糖结合使用

该插件与 [Markdown 语法糖](../syntax-sugar.md) 功能配合良好。你可以使用：

```markdown
<!-- 使用 Vue 组件（来自代码片段） -->
<Theorem type="theorem" title="主要结果">
内容
</Theorem>

<!-- 使用 Markdown 指令 -->
:::theorem{type="theorem" title="主要结果"}
内容
:::
```

### 自定义代码片段

如果你想修改代码片段，可以：

1. 打开 VS Code 设置
2. 搜索 "Configure User Snippets"
3. 选择 "markdown.json"
4. 添加你的自定义片段

## 故障排除

### 代码片段不显示

1. 确保插件已安装并启用
2. 检查你是否正在编辑 `.md` 文件
3. 尝试按 `Ctrl+Space` 手动触发建议

### Slidev Scholarly 视图未显示在右侧

1. 运行 `View: Toggle Secondary Side Bar`
2. 如果它仍然不在右侧，运行 `View: Reset View Locations`

## 反馈

发现 bug 或有功能需求？请在 [GitHub](https://github.com/jxpeng98/slidev-theme-scholarly/issues) 上提交 issue。
