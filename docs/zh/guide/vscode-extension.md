---
title: VS Code 插件
---

# VS Code 插件

这款插件让你可以直接在 VS Code 中使用 Scholarly 的模板、布局、组件、引用、主题设置和项目检查。侧边栏按照创建、制作、定制和检查的顺序组织。

## 安装

从 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jxpeng98.slidev-scholarly-snippets) 安装 **Slidev Scholarly**。

## 打开插件

1. 打开一个 Markdown 文件。
2. 打开右侧的 Secondary Side Bar。
3. 选择 **Slidev Scholarly**。

侧边栏按任务排列：

| 阶段 | 视图 | 作用 |
|---|---|---|
| 开始 | **Start · Templates** | 从模板创建演示 |
| 制作 | **Build · Layouts** | 插入整张幻灯片的结构 |
| 制作 | **Build · Components** | 插入定理、指标、证据等内容 |
| 制作 | **Build · Citations & Anchors** | 插入 BibTeX key、论文摘要和内部链接 |
| 定制 | **Customize · Themes** | 设置预设、颜色、字体和明暗模式 |
| 参考 | **Reference · CLI Actions** | 运行 CLI 任务、项目检查和帮助 |

<figure class="docs-screenshot docs-screenshot--narrow">
  <img src="/images/vscode/sidebar-overview.png" alt="VS Code 中的 Slidev Scholarly 侧边栏，包含模板、布局、组件、引用和主题设置" loading="lazy">
  <figcaption>将侧边栏放在 Markdown 编辑器旁，按顺序从上往下操作。</figcaption>
</figure>

## 1. 创建演示

从 **Start · Templates** 选择模板，或运行：

```text
Slidev Scholarly: Create Presentation
```

模板生成的是普通 Markdown 文件，可以直接编辑。

### 使用 GUI Builder

想先通过界面搭一份初稿，可以运行 `Slidev Scholarly: Open GUI Builder`。它支持：

- 添加、排序和删除幻灯片；
- 编辑常用内容字段；
- 选择颜色、字体和页面模式；
- 新建文件，或将结果插入当前编辑器。

生成的内容仍是普通的 Slidev Markdown。

<figure class="docs-screenshot">
  <img src="/images/vscode/gui-builder.png" alt="Slidev Scholarly GUI Builder，包含演示信息、主题设置、布局库和幻灯片列表" loading="lazy">
  <figcaption>先在这里搭好初稿，再编辑生成的 Markdown。</figcaption>
</figure>

## 2. 制作幻灯片

### 插入布局和组件

从侧边栏选择布局或组件。点击项目会在光标处插入 Markdown；点击眼睛图标可以先看预览。

三类内容的分工如下：

- [布局](../layouts/)安排整张幻灯片；
- [组件](../components/)加入定理、指标和证据；
- [引用](../components/cite)管理 BibTeX 文献和注脚。

### 输入时补全

| 触发内容 | 补全结果 |
|---|---|
| `layout:` | 布局名称 |
| `colorTheme:`、`fontTheme:` | 主题值 |
| `contentMode:`、`chromeMode:`、`sectionMode:` | 浅色和深色模式 |
| `<` | Scholarly 组件 |
| `:::` | Markdown 指令 |
| `](#`、`href="#`、`to="#` | 内部锚点 |
| `ss-`、`scholarly-` | 内置代码片段 |

如果补全没有自动出现，按 `Ctrl+Space`。

### 插入引用和锚点

**Build · Citations & Anchors** 会列出当前文档中的 BibTeX 条目和内部锚点。

常用命令：

- `Slidev Scholarly: Insert Citation`
- `Slidev Scholarly: Insert Internal Anchor`
- `Slidev Scholarly: Insert Internal Anchor Reference`
- `Slidev Scholarly: Insert Paper Summary`

### 使用代码片段

输入前缀后按 `Tab`：

| 前缀 | 插入内容 |
|---|---|
| `ss-cover` | 封面 |
| `ss-section` | 章节页 |
| `ss-figure` | 带说明的图片 |
| `ss-theorem` | 定理组件 |
| `ss-results` | 结果布局 |
| `ss-cite` | BibTeX 引用 |
| `ss-anchor` | 内部锚点 |
| `ss-frontmatter` | Scholarly 文件头配置 |

完整列表在补全菜单和侧边栏中都能找到。旧的 `scholarly-*` 前缀仍然可用。

## 3. 定制演示

**Customize · Themes** 包含四组设置：

- **Presets**
- **Color Themes**
- **Font Themes**
- **Light & Dark Modes**

主题操作只会更新当前 Markdown 文件的 frontmatter，不会改写幻灯片内容。

<figure class="docs-screenshot">
  <img src="/images/vscode/theme-controls.png" alt="VS Code 中打开的 Slidev Scholarly 颜色主题选择器" loading="lazy">
  <figcaption>在侧边栏或命令面板里选好主题，插件会把设置写入 frontmatter。</figcaption>
</figure>

## 4. 检查并获取帮助

**Reference · CLI Actions** 按任务整理命令：

| 分组 | 操作 |
|---|---|
| Start | 创建演示或查看模板 |
| Build | 查看布局和组件、添加片段或应用工作流 |
| Customize | 设置主题或查看预设 |
| Check & Help | 运行 `doctor` 或查看 CLI 帮助 |

### 引用诊断

文档中出现 `@citekey` 或 `!@citekey` 时，插件会检查：

- 是否缺少 `bibFile` 配置；
- `.bib` 文件是否存在；
- key 是否重复或无法解析；
- 是否缺少 `layout: references` 参考文献页。

常见问题可以通过 Quick Fix 自动修复。

## 故障排除

### 补全或代码片段没有出现

1. 确认插件已安装并启用。
2. 打开一个 `.md` 文件。
3. 按 `Ctrl+Space`。

### 侧边栏没有显示

1. 运行 `View: Toggle Secondary Side Bar`。
2. 如果仍未出现，运行 `View: Reset View Locations`。

## 插件开发

<details>
<summary>安装本地 VSIX</summary>

1. 下载或构建 `.vsix` 文件。
2. 按 `Cmd+Shift+P` 或 `Ctrl+Shift+P` 打开命令面板。
3. 运行 `Extensions: Install from VSIX...`。
4. 选择文件并重新加载 VS Code。

</details>

<details>
<summary>打开开发诊断</summary>

运行 `Slidev Scholarly: Toggle Dev Mode`。开启后，状态栏会显示 `Scholarly Dev`，**Slidev Scholarly** 输出通道会记录操作耗时。

设置项：

- `slidevScholarly.devMode.enabled`
- `slidevScholarly.devMode.slowThresholdMs`（默认 `25`）

</details>

发现问题或希望增加功能，请在 [GitHub](https://github.com/jxpeng98/slidev-theme-scholarly/issues) 提交 issue。
