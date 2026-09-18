# README 与文档站审查、重构记录

审查基线：`b29ea7b`。审查范围包括原有 82 个双语文档页面、语言入口首页、13 份 README，以及 VitePress 导航、搜索和页面样式。对照了 CLI 命令、34 个布局、17 个公开组件、9 组配色、8 组字体和 8 个起步模板的当前实现。

审查结果：文档覆盖面已较完整，主要问题是操作说明与实现不同步、参考内容难以发现，以及多个入口重复介绍相同内容。此次保留原有页面地址，将内容按读者任务重组；准确且已经清楚的参考段落保留原文。

## 发现与处理

| 优先级 | 原问题与证据 | 本次处理 |
|---|---|---|
| P1 | README 和 quick-start 写“Node 20+”，但安装的 Vite 要求 `^20.19.0 \|\| >=22.12.0`；早期 Node 20/22 不满足条件。 | 推荐 Node 24 LTS、pnpm 10，列出工具链要求，并链接官方说明。 |
| P1 | 起步模板没有 `playwright-chromium`，文档却直接让读者运行 CLI PDF 导出。 | 补齐 Playwright、Chromium 的一次性安装步骤，并说明浏览器导出入口。 |
| P1 | 定理编号示例在同一 YAML 块重复声明 `theoremNumberFormat`；迁移示例重复声明 `themeConfig`。解析器实际报告 `duplicated mapping key`。 | 前者改为单个可复制配置加格式对照表，后者拆成两个代码块。双语共修复四个错误示例。 |
| P1 | VS Code 文档将模板入口与命令面板“新建演示”混为一谈。`createNewPresentation(template)` 的模板分支创建完整项目，无参数分支只创建 Markdown。 | 明确完整项目、起步 Markdown、Deck Builder 草稿三种输出；解释引用文件与生成后通知的作用。 |
| P2 | README 将 `build` 描述为发布网站；明暗指南要求普通演示项目运行仅在主题仓库中存在的 `theme:matrix`。 | 区分构建、部署、导出。普通项目运行 doctor/export；维护者矩阵检查链接到贡献指南。 |
| P2 | 升级页主要描述尚未确定的大版本改动，并把发布标签规则混入使用说明。 | 改为版本核对、更新、兼容配置、验证和回退的实际步骤；预发布渠道先查询再使用。 |
| P2 | 配置表把 `themeColors` 放进 `themeConfig`，并使用与引用指南不一致的 Chicago 样式名。 | 将 `themeColors` 明确为顶层字段；统一为 `chicago-author-date`。 |
| P2 | 部分参考说明与代码不符：`figure` 默认最大高度为 `55vh`、不声明 `fill`；`compare` 支持 gray 而非 amber/purple；MetricGrid 已固定列数。 | 按实现修正属性、默认值和列数说明，纠正 Block 类型颜色、intro 对齐方式和中文 references 默认标题。 |
| P2 | results 示例写死 `bg-white`，无法随深色模式保持一致。 | 使用已有 `MetricCard` 组件；实际构建并导出检查。 |
| P2 | 功能概览中的 JSON/CSV 片段缺少完整使用位置；引用文件示例在引用用法之后；工作流命令省略切换项目目录。 | 新增双语数据指南，将数据文件、导入与组件放在同一流程；重排引用指南；补充 `cd` 和安装步骤。 |
| P2 | README、首页、指南索引重复导航；侧边栏没有直接列出布局和组件子页；配色页先展示 36 张图，再重复配置代码。 | 首页保留入门和写作入口，指南索引承担完整文档地图；增加可折叠子目录；配色与字体改为对照表，画廊移后。 |
| P2 | 中文页面仍列出英文插件命令和部分英文网站控件；示例含未核实的名人引语与来源。 | 命令名按插件中文资源校准，补齐中文搜索与目录文案；引语示例改为明确的示例研究笔记，不再展示未经核实的署名。 |
| P3 | 配色画廊每行四张图，在正文栏内过小，且两种语言重复内联 CSS。 | 复用一份站点样式，桌面两列、窄屏一列，图片延迟加载；保留已有预览图和原配色/字体锚点。 |
| P3 | 贡献指南只安装根依赖，但完整检查还需要插件依赖；模板 README 没说明导出条件；README 图片引用不随 npm 包发布的目录。 | 补齐两处安装命令，说明仓库根目录的文档命令，更新模板 README，并使用文档站的图片地址。 |

## 执行顺序与结果

1. **核对事实：完成。** 对照 package、CLI、插件命令、Vue 属性、配色与字体源码，复现 YAML 错误。
2. **重组内容：完成。** 保留 URL，区分入门、场景指南、配置和参考；增加两页数据指南，双语页面总数为 84。
3. **Humanizer 润色：完成。** 采用 Polisher Mode 的深度编辑，先保证技术事实，再调整句序与衔接。英文使用直接的操作说明；中文减少翻译腔和抽象表述，统一项目、模板、布局、组件、引用键等术语。
4. **验证：完成。** 构建、解析、链接、浏览器和示例运行证据见下表。

## 验证证据

本地原始日志和截图保存在 `artifacts/docs-review-2026-09-07/`，不随主题或文档站发布。

| 检查 | 结果 | 证据 |
|---|---|---|
| `node scripts/release-ready.mjs` | 通过；66 项根测试、34 项插件测试，包含包检查、模板检查、文档构建和主题矩阵 dry-run | `check.log` |
| `node scripts/check-docs-workflows.mjs` | 84 个双语页面、262 个 YAML/Markdown 示例通过解析；双语页面结构一致 | `check.log` |
| `node scripts/check-docs-links.mjs` | 86 个构建 HTML 页面，6,256 个站内链接与图片引用通过 | `check.log` |
| 链接检查负例 | 缺失锚点、缺失页面、缺失图片均被拒绝；测试后恢复构建文件 | `link-negative-controls.json` |
| 原配色页锚点 | 英文、中文原有锚点全部保留并指向对应内容 | `previous-theme-anchors.json` 与构建 HTML 对照 |
| `node scripts/check-docs-layout.mjs` | 20 组首页 + 48 组正文页面显示检查通过；含中英文、明暗模式、390px 移动端和桌面宽度 | `browser.log`、`browser/` |
| 导航与搜索 | 移动目录可打开、跳转并关闭；两种语言都能搜索到数据指南 | `browser.log` |
| 文档示例生产构建 | 英文、中文 JSON/CSV/结果卡片示例均通过 | `examples-en.log`、`examples-zh.log` |
| 深色幻灯片导出 | 中文示例四页 PNG 导出通过，人工检查数据表与指标卡片 | `example-export.log`、`example-export-zh/` |
| 关键外链 | 官方环境、导出、部署文档及 Marketplace 可访问；在线演示 HTTP 200 | 本轮网页读取与 HTTP 检查 |

本次未修改主题或插件的运行逻辑。代码块解析不代表每种自定义内容都通过视觉验收；实际渲染验证覆盖新增数据示例和本次修改的结果卡片示例。历史执行计划继续排除在文档站构建之外。

## 后续维护建议

- 修改命令或组件属性时，同步更新双语参考页；新代码示例应保持可复制。
- `engines.node` 与 doctor 目前仍只声明或检查 Node 20 大版本，弱于 Vite 的实际要求。文档已说明真实使用条件；后续运行时维护应统一包声明和诊断边界。
- 文档根目录还保留独立的 `docs/package.json`，其 VitePress 版本与根目录不同。本次统一使用仓库根目录 `docs:*` 命令；移除独立安装入口前，需要先确认外部托管平台是否依赖它。

参考：[Vite 环境要求](https://vite.dev/guide/)、[Node.js 版本状态](https://nodejs.org/en/about/previous-releases)、[Slidev 导出](https://sli.dev/guide/exporting)、[Slidev 构建与托管](https://sli.dev/guide/hosting)。
