# 项目审查后的修复与 UI 优化执行计划

日期：2026-09-05

基线：`52d067e`；审查范围为本地 `main`（`49db8ff`）至该提交。

状态：执行中。阶段 1–4 已修复并通过对应检查；继续派生资源同步、原生宿主与集成验收。新增边界问题也纳入执行记录。

当前实现基于 `9ef7f4a`。最终总检查、局部浏览器回归、独立包检查及本地 Node 20/24 构建均已补跑；完整视觉检查与后续补验范围见执行记录。远程 CI 与完整读屏输出仍未通过验收。

### 当前执行入口

| 顺序 | 下一项交付 | 验收后才能关闭的事项 |
|---|---|---|
| 已完成 | 阶段 1–2：检查契约、首页生成、布局草稿、操作范围与输入类型校验 | R01、R02 主场景、R03、R08、R09；R11 随校验提前修复 |
| 已完成 | 阶段 3：实验与结果页裁切、示例引用、目录首页标题边界 | R04、R07、R02 补充场景，已有播放与 PNG/PDF 证据 |
| 已完成 | 阶段 4：Builder 窄窗口、键盘与文档 Hero | R05、R06、R10、R12；浏览器回归通过，原生宿主抽查仍待完成 |
| 已完成 | 阶段 5A：收尾 VSIX 中 YAML 运行时打包，固化独立解包检查 | 最终打包配置通过；包外运行 8 个模板，91 个预览哈希与许可证通过 |
| 已完成 | 阶段 5B：同步最终截图与双语容量说明 | 34 个布局预览映射完整；Builder 截图反映当前界面；双语容量提示已更新 |
| 下一步 | 阶段 5C：读屏实际输出验收 | 插入、新建、未保存目标、空环境及高对比错误反馈已通过；实际读屏输出仍未取得完整证据 |
| 最后 | 阶段 5D：最终集成检查、兼容性记录与分批提交 | 明确区分本地 Node 20/24 构建和 Ubuntu CI；全部必需项有证据后才能关闭计划 |

执行时每批只处理一个行为边界：复现 → 最小修复 → 针对性回归 → 更新证据和计划 → 提交。先解决内容丢失、裁切与操作阻断，再处理视觉密度；保持现有学术风格，不扩展产品范围。

依据：[审查报告](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/.impeccable/critique/2026-09-04T23-00-52Z__vscode-extension-src-guibuilderview-ts.md)、[导出与检查证据](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/artifacts/review-2026-09-04/)、[产品约定](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/PRODUCT.md)。

## 1. 目标与范围

把当前“功能基本齐全、验收和交互尚未收尾”的版本推进到可验收状态：生成的 Markdown 正确，编辑内容不会因布局试用而丢失，关键研究结果在播放和导出时完整可见，常见 VS Code 分栏尺寸下能够顺畅建稿。

延续现有海军蓝、纸色背景和学术排版。Builder 继续承担“选择工作流 → 编辑大纲与必要内容 → 交付 Markdown”的任务；保留布局 ID、公开参数、CLI 与共享目录。此次不扩展为所见即所得编辑器，不增加布局数量或更换前端框架。

审查时根目录 65 项、插件 29 项测试通过，编译和构建也通过，但总检查失败，且已有导出内容裁切。以上是历史基线，不是本轮修复的通过记录；Builder 的 23/40 是抽样交互评分，不是项目完成百分比。

## 2. 执行顺序与通过条件

| 阶段 | 范围 | 交付结果 | 进入下一阶段前的条件 |
|---|---|---|---|
| 1. 恢复检查 | R01 | 检查适配当前实现，保留有效约束 | 两处独立失败消除，现有总检查通过 |
| 2. 修复生成和内容保护 | R02、R03、R08、R09 | 页数正确，布局草稿可恢复，校验范围与类型正确 | 实际解析与状态回归通过 |
| 3. 修复演示内容与排版 | R04、R07 | 关键结果完整可见，参考文献有效 | 16:9、4:3 播放及导出验收通过 |
| 4. 优化编辑与文档界面 | R05、R06、R10、R11、R12 | 窄窗口可操作，键盘和错误定位连续 | 响应式与键盘场景通过 |
| 5. 集成验收 | 全部 | 更新截图、使用说明、验证记录和本地包 | 所有必需项有新证据；未验证项不得勾选 |

默认按 1 → 2 → 3 → 4 → 5 执行。阶段 2 与阶段 4 都修改 Builder 脚本，应先稳定状态和生成逻辑，再调整交互。每个问题随修复加入最小行为回归；阶段 5 负责综合验证，不把测试全部推迟到最后。

## 3. 问题清单

| 编号 | 优先级 | 已证实的问题 | 修复定位 |
|---|---|---|---|
| R01 | P1 | 引用诊断检查匹配旧文案；模板检查忽略新增派生 `deck` 字段 | 检查契约与共享数据同步 |
| R02 | P1 | 8 个模板生成后均多出一张正文为空的首页 | Markdown headmatter 与第一页的序列化 |
| R03 | P1 | 切换布局清空配置和分区内容 | 按页保留各布局草稿 |
| R04 | P1 | 实验矩阵 PNG 裁掉指标；结果页浏览器中也有局部裁切 | 内容高度分配、标题层级及导出检查 |
| R05 | P2 | 1024×576 下编辑区距页面顶部约 3634px | 布局库按需展开，当前页优先 |
| R06 | P2 | 文档首页在中等桌面宽度横向溢出 | Hero 图片受所在列宽度约束 |
| R07 | P2 | 学术示例参考文献页为空 | 示例接入实际 citation key |
| R08 | P2 | 插入当前页被其他未完成页阻断 | 按操作范围校验 |
| R09 | P2 | `images: string[]` 接受 `{}` 等错误形状 | 表单反馈与生成边界校验 |
| R10 | P2 | 大纲重绘后焦点回到 BODY | 按稳定页面 ID 恢复焦点 |
| R11 | P2 | 标题错误后，输入仍在折叠区域内 | 展开错误所在区域并聚焦 |
| R12 | P3 | 工作流单选组没有正确的键盘行为 | 优先使用原生 radio |

R04 的两种表现需要分开验证：实验页已经证实 PNG 裁切；结果页只证实浏览器裁切，本次审查的 PNG 完整。

## 4. 分阶段任务

### 阶段 1：恢复可信的检查基线

主要文件：[引用检查](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/scripts/check-vscode-citation-diagnostics.mjs)、[元数据检查](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/scripts/check-vscode-metadata-previews.mjs)、[共享数据同步](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/scripts/sync-shared-data.mjs)。

- [x] R01：引用诊断检查改为验证“缺少参考页时提供添加操作”的行为契约，避免仅匹配某句英文文案。复用插件现有测试方式和 VS Code mock；需要加载编译产物的行为检查放到插件编译后，编译前仅保留不依赖产物的合同检查。
- [x] R01：公共模板字段按结构比较；插件新增的 `deck` 单独对照 CLI 模板解析结果验证，包括页数、布局、正文和配置。保留缺失模板、陈旧同步结果和预览映射的失败检查。
- [x] 分别运行 `pnpm run check:vscode-citations` 和 `pnpm run check:vscode-sync`，再运行一次 `pnpm run check`。记录实际结果，遇到新的独立失败先定位，不通过删除断言让检查变绿。

阶段完成条件：两处失配消除，生成数据与源数据关系仍受检查保护，现有总检查通过。此时只恢复检查基线，R02–R12 仍未验收。

### 阶段 2：修复生成逻辑、布局草稿与输入校验

主要文件：[生成模型](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/src/guiBuilderModel.ts)、[Webview 状态与交互](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/src/guiBuilderWebview.ts)、[宿主消息处理](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/src/guiBuilder.ts)、[现有模型测试](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/test/guiBuilderModel.test.mjs)。

**A. R02：消除额外首页。**

- [x] 追踪整份生成、选中页预览、插入当前页三个入口；整份生成把第一页合入 headmatter，后续页继续使用页面分隔符。
- [x] 明确演示标题、第一页标题、模板附加 frontmatter 与布局配置之间的优先级，覆盖首页需要 `title` 参数的场景；不得靠重复 YAML 键或丢弃原有配置完成合并。
- [x] 保留第一页面的正文、具名 slots、布局，以及演示的语言、主题、作者、参考文献和画幅配置；已覆盖封面重排与非封面首页。目录布局的布尔标题边界已在阶段 3C 验收。
- [x] `renderBuilderSlides` 保持可插入片段的语义：不附带整份演示的主题 headmatter，继续保留页面分隔符。
- [x] 对全部 8 个模板实际调用已安装的 Slidev parser：输出页数等于大纲页数，第一页内容正确；增加非封面首页、特殊字符、配置和 slots 的回归。

实际解析检查放在根目录，建议新增 `scripts/check-builder-output.mjs`，接入 `scripts/release-ready.mjs` 的插件编译步骤之后。通过正常模块解析访问现有 Slidev 依赖，不硬编码 `.pnpm` 内部目录；插件独立测试和打包继续不依赖根目录安装的 Slidev。该检查已实现并接入编译后的检查步骤。

**B. R03：按页保留各布局的草稿。**

- [x] 在每页状态内保存访问过的布局草稿，只缓存布局专属的 `configSource`、`config`、`slots`、`heading`、`titleKey`；标题和通用正文继续由该页共享。
- [x] 切换前保存当前布局，切回已访问布局时恢复草稿，新布局只初始化自己的字段。保存值时隔离可变对象，避免不同布局共享对象后互相覆盖。
- [x] 使用现有 `getState/setState` 持久化；旧状态没有缓存字段时正常初始化。编辑中的无效配置文本也应保留，不能因为校验失败或切换布局被替换为空值。
- [x] 生成、预览和插入只读取当前激活布局，其他布局的配置和 slots 不得混入 Markdown。
- [x] 验证“双栏 A → 标准 B → 双栏 A”内容逐字段恢复、再次编辑后可恢复、不同页面互不串数据，以及 Webview 恢复后的状态一致。

这里复用页面状态，不引入全局撤销栈、草稿数据库或新的状态库。

**C. R08、R09：校验范围与类型一致。**

- [x] 提取现有单页校验逻辑：生成整份文件检查演示标题和所有页面；插入只检查选中页；预览只检查当前页。其他页的缺失字段不能阻断当前页插入。
- [x] 依据共享布局元数据校验支持的类型：区分数组、对象和标量，对 `string[]` 检查每个元素；数字与布尔值保持相应类型。只实现目录实际使用的类型，不编写通用 TypeScript 类型解析器。
- [x] 验证 `{}`、`null`、混合元素数组、非法 JSON、合法字符串数组、可选空值和必填空数组；错误显示到字段并保留输入，必填图片数组不能用 `[]` 绕过。
- [x] 在表单中即时反馈，在模型或宿主生成边界重新校验恢复状态及消息载荷；预览、插入、整份生成采用相同类型规则。审查 `configSource` 跳过校验的现有路径，确保结构化字段不能借旧状态绕过校验，同时保持 CLI 模板原始 YAML 兼容。
- [x] 复用现有依赖和测试环境。Webview 是独立编译脚本，不直接导入仅适用于 Node 的模型；如果需要共享规则，只提取三条路径实际共用的最小纯逻辑。

阶段完成条件：所有模板页数正确；已写内容可恢复且不串页；完整的选中页可独立插入；错误类型不能产生误导性的有效预览或 Markdown。编译、插件测试和 lint 通过。

### 阶段 3：让研究结果在播放和导出中完整可读

主要文件：[实验矩阵](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/layouts/experiment-grid.vue)、[结果强调页](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/layouts/result-highlight.vue)、[排版变量](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/styles/layout.css)、[学术示例](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/examples/example-academic.md)。

**A. R04：优先给证据和指标分配空间。**

- [x] 先定位页眉与正文的重复标题，在主题标题规则允许的情况下只保留一个主标题。
- [x] 保留 `experiment-grid` 的公开参数和列数语义，把卡片内部“多层标题和留白”压缩为清楚的实验名、设置、指标、数值与备注；指标数值成为第一视觉重点。现有四实验样例必须完整保留。
- [x] 调整结果页证据区的高度分配，减少容器嵌套与重复间距；播放中的核心证据不能依赖内部滚动才能读全。
- [x] 在受影响区域复用字号与间距变量：以 980px 逻辑画布为参照，关键数值、单位和来源优先达到至少 16 CSS px，正文以约 18–20px 为目标。字号只是排版目标，仍需实际截图确认；不靠继续缩小字或隐藏溢出来通过验收。
- [x] 检查 16:9 与 4:3，覆盖浅色与深色。内容等待字体和图片完成加载、进入最终点击状态后再测量。
- [x] 在现有导出/视觉检查流程增加受影响容器的溢出断言：核心内容超出可见区域时报告页面、元素和溢出量，提示减少内容或拆页。作者超量内容不得仅凭“导出进程退出成功”被判合格；不自动分页。

**B. R07：让示例参考文献形成闭环。**

- [x] 检查现有 BibTeX 库，给示例中的相关研究接入相符的 citation key；没有对应条目的文字改为与现有真实来源一致的表述，不编造文献。
- [x] 保留 13 页研究叙事与示例数据的说明，确认参考页实际出现被引用条目，引用跳转可用。
- [x] 在浏览器和导出的 PNG/PDF 中检查主结果页、实验比较页和参考页。以布局或页面标题定位，避免仅依赖审查时的第 7、9、12 页序号。

**C. R02 补充：目录页作为首页的标题边界。**

- [x] 追踪 Builder 首页合并、Slidev 全局标题解析和目录标题渲染，避免合法的 `title: false` 被当作全局字符串标题。修复共享路径，保留现有“隐藏目录标题”的意图和演示名称。
- [x] 分别验证目录作为第一页及普通页面时，默认标题、自定义标题、隐藏标题三种情况；实际解析和浏览器加载通过，生成时不增加空白页、不产生重复 YAML 键。
- [x] 将隐藏标题的首页纳入实际导出回归；如确需新增兼容参数，同步共享目录与双语说明，保留原有公开用法。

阶段完成条件：当前四实验的指标、数值和备注全部可见；结果页播放时的证据完整；参考页非空且与正文引用对应；目录首页的隐藏标题语义可用。单纯构建成功或导出文件存在不算通过。

### 阶段 4：优化窄窗口、键盘操作和错误恢复

主要文件：[Builder 样式](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/media/gui-builder.css)、[Builder 结构](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/src/guiBuilderView.ts)、[Builder 交互](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/vscode-extension/src/guiBuilderWebview.ts)、[文档样式](/Users/pengjiaxin/Work/web/playground/slidev-theme-scholarly/docs/.vitepress/theme/style.css)。

**A. R05：围绕当前页安排界面。**

- [x] 宽度大于 1100px 时保留清晰的三栏结构，调整必要的密度与滚动边界。
- [x] 701–1100px 时让大纲和编辑区成为主区域；工作流、主题和布局库使用紧凑入口与折叠区，布局库默认收起。
- [x] 700px 及以下优先显示当前页编辑区，大纲可折叠且切换入口持续可达；优先用原生 `details` 和现有控件实现。
- [x] 主要生成动作保持在稳定可达的位置；缩略图预览限制高度，标题与主要内容输入在常见分栏尺寸下无需越过整套布局库才能到达。
- [x] 限制布局库自身高度并允许必要的内部滚动；检查初次打开、添加、切换、删除、恢复状态后的布局。不用一次 `scrollIntoView` 掩盖信息层级问题。
- [x] 在 1024×576、700×800、520×800 下，当前页标题和主要内容输入的起点在初始可视区内，大纲入口及生成动作可达，页面无横向溢出；聚焦输入不会被固定操作区遮挡。

**B. R10–R12：保留键盘操作的连续性。**

- [x] R10：按稳定页面 ID 与操作类型恢复重绘后的焦点；选择后仍可继续操作，移动后焦点留在该页，删除后落到相邻页面或安全的新增入口。
- [x] R11：校验失败先展开对应 `details`，再聚焦并显示字段错误；大纲选择与错误位置一致。折叠的演示标题错误可以立即修改。
- [x] R12：工作流优先改为原生 radio 与 label，支持 Tab 进入单选组、方向键选择和清晰的选中状态；保留现有替换工作流确认，取消后恢复选择与焦点。
- [x] 检查 Enter、Space、Tab、Shift+Tab 和方向键流程，保留可见焦点。新增提示补齐现有中英文本地化，不用仅颜色表达错误。

**C. R06：修复文档中间宽度。**

- [x] Hero 图片的宽度与最大宽度受实际网格列约束，检查父容器尺寸和最小宽度；不使用全局 `overflow-x: hidden` 掩盖问题。
- [x] 验证中英文首页 960、1024、1152、1200px 宽度及 390px 移动宽度，浅深主题均无文档级横向滚动，图片与文字没有裁切。

阶段完成条件：常见分栏尺寸的编辑入口直接可达，布局库不会把正文推到数屏之外；键盘连续操作不落到 BODY；错误字段可见且可修改；文档首页无横向溢出。

### 阶段 5：综合验收、同步交付材料

- [x] 增加小型浏览器回归入口 `scripts/check-ui-workflows.mjs`，复用已安装的 `playwright-chromium` 和真实编译后的 Webview、样式、共享元数据；已覆盖布局往返与校验，宿主 mock 仅负责消息和持久化，并已接入 `check:visual`。
- [x] 在该入口补齐键盘焦点与窄窗口场景；将受影响演示/文档页面的可见性检查接入 `check:visual`。常规 `check` 保持无需启动浏览器；脚本管理本地服务并在失败时清理，不新增测试框架。
- [ ] 按下表做一次完整的代表性验收，集中处理发现的问题，再对改变的部分确认；已有通过项无变化时不反复运行昂贵导出。
- [x] 使用现有主题矩阵做完整导出检查；普通 `check` 内的 `--dry-run` 只能证明命令规划正确，不能代替视觉验证。
- [ ] 在真实 VS Code 宿主中验证新建 Markdown 和插入当前页，特别检查 Webview 获得焦点后目标编辑器是否仍正确。执行高对比主题和读屏基本流程抽查。
- [x] UI 定稿后通过现有截图与插件预览同步脚本更新受影响资源，核对截图清单与页面映射完整；避免手工修改派生目录或因部分导出覆盖其他截图。
- [x] 更新中英文 Builder 使用说明、布局容量提示及预览截图；文档如说明“可恢复布局草稿”，必须与实现一致。
- [ ] 执行插件 lint、总检查、视觉检查和本地打包；验证包内预览/元数据和现有包体积约束。在 Node 20/24 的既有 CI 环境补齐兼容结果。
- [ ] 保存修复后的对比图、命令日志和验收记录，逐项关闭 R01–R12；记录环境、视口、画幅和剩余限制。此阶段到本地可验收包为止，发布另行安排。

**剩余执行批次与退出条件：**

| 批次 | 具体操作 | 验收与提交边界 |
|---|---|---|
| 5A · 包内运行时 | 复用 `js-yaml` 自带 standalone 构建，将运行文件和许可证随编译复制入 `out/vendor`；统一 VSCE 依赖扫描配置；为现有解包检查提供稳定命令入口 | 用最终配置重新生成 VSIX；在仓库外解包运行全部 8 个模板，检查预览哈希及许可证；compile、模型回归和 lint 通过后单独提交打包修复 |
| 5B · UI 交付材料 | 核对已重新生成的 34 张布局图与插件同步清单；更新 Builder 文档截图；在中英文 academic 布局说明中补充四实验样例的适用边界与超量拆页建议 | 抽看实验、结果、目录的浅深色导出，确认截图对应当前实现；不缩小关键文字来容纳超量内容；图片、映射与相应说明一起提交 |
| 5C · 原生操作 | 在隔离 VS Code 配置中安装最终包，依次检查 Markdown 目标、非 Markdown 活动文件、未保存文件和空编辑环境；Webview 聚焦后执行插入与新建 | 记录目标文件前后内容，确认无误写；高对比下检查焦点、选中与错误；实际读屏检查名称、角色、状态、错误和生成反馈。浏览器 mock、安装成功或开启 accessibilitySupport 均不能替代 |
| 5D · 最终验收 | 最终资源与运行时定稿后执行完整 `check:visual`、插件 lint、打包与解包检查，保存退出状态和日志；复核 Node 20/24 兼容记录与 CI 差异 | `check:visual` 已包含普通 `check` 的步骤，无需立即再重复全部检查；已有矩阵无相关变化时不单独再跑一次。按受影响范围补验，整理状态并提交验收记录 |

5A 和 5B 不互相依赖，可按当前工作区先完成打包修复；5C 使用 5A 的最终包，5D 在实现及资源定稿后执行。若 5C 发现缺陷，应先复现并单独修复，再重跑受影响用例，不扩大为整套编辑器重构。

**当前已有证据及缺口：**

- 主题矩阵日志包含 54 次实际导出成功，布局截图生成日志为 34/34。仍需把代表性目检结果与最终资源清单写入验收记录，不能据此声称全部 UI 已验收。
- 最终 manifest 配置 `vsce.dependencies: false` 已实际打包通过，VSIX 为 147 个文件、4.37 MB。`pnpm --dir vscode-extension run check:package` 验证仓库外生成 8 个模板、91 个预览哈希、包版本和 YAML 许可证；插件 32/32 测试及 lint 通过。预览同步仍待单独提交。
- 最终实现已重新执行 Node 20.20.2 和 24.14.0 的三份示例构建，两组退出 0，日志完整保存在 `phase-5-node20-final.log`、`phase-5-node24-final.log`。这是 macOS 证据，不等于既有 Ubuntu、pnpm 10、全新安装的 CI；不再用早期截断日志作为最终证据。
- 完整视觉集成检查已通过，见 `phase-5-full-visual.log`；后续宿主与标题错误反馈修复已单独补跑插件 33/33、lint、打包、浏览器和原生验证。实际读屏输出仍待补齐。
- 远程 CI 需要已推送的最终提交及对应运行记录。本计划执行范围不自动包含 push、tag 或发布；在本地交付具体可审查之后，再单独处理远程验证所需的授权。

## 5. 验收矩阵

尺寸均指实际 CSS 视口或 Slidev 逻辑画布，记录 `innerWidth/innerHeight`；不得用截图像素宽度代替视口宽度。

| 对象 | 最小覆盖 | 通过标准 |
|---|---|---|
| Markdown 生成 | 8 个模板；重排/删除封面；配置、slots、特殊字符 | 解析页数等于大纲；首页内容正确；片段插入语义保持 |
| 布局草稿 | 同页 A→B→A；两页分别编辑；无效配置；恢复旧状态及新状态 | 内容恢复、不串页；只输出激活布局；无效草稿仍可纠正 |
| 操作校验 | 其他页不完整；标题为空；错误 JSON/类型；必填与可选空值 | 当前页独立插入；整份生成正确阻断；错误字段可见 |
| Builder 响应式 | 1280×800、980×800、1024×576、700×800、520×800 | 当前内容优先；大纲和动作可达；无文档级横向溢出 |
| Builder 语言与主题 | 中英文；浅色、深色；原生 VS Code 高对比抽查 | 标签不截断；焦点和错误可辨；不破坏宿主主题 |
| Builder 键盘 | 选择、移动、删除、工作流、折叠错误定位；取消替换 | 焦点连续；单选组行为正确；取消不损坏草稿 |
| 演示重点页 | 主结果、实验矩阵、参考页；16:9、4:3；浅深模式 | 指标/单位/备注可见，证据完整，引用有效 |
| 导出 | 上述重点页 PNG、PDF 与浏览器播放 | 导出内容完整；超量示例触发可定位诊断 |
| 主题矩阵 | 现有 9 套主题 × 6 种模式检查 | 实际导出成功；抽看受影响样式，无已知裁切或对比度退化 |
| 文档首页 | 中英文；390×844；960/1024/1152/1200 桌面宽度；浅深模式 | 图片在列内；标题、按钮可见；无文档级横向溢出 |
| 原生宿主 | 已打开的 Markdown、非 Markdown 活动文件、空/未保存编辑环境 | 插入到正确目标；不支持时提示清楚；不意外改写其他文件 |
| 读屏抽查 | 页面选择、工作流选择、必填错误、生成反馈 | 名称、角色、状态和错误可被识别；记录实际工具和结果 |
| 运行与打包 | 当前环境；Node 20/24 既有 CI；本地 VSIX | 检查通过；资源齐全；安装后主要工作流可用 |

几何断言只作用于本轮受影响的关键内容容器：比较内容边界与裁切祖先的可见内容区，统一使用逻辑 CSS 坐标，允许最多 1px 的舍入误差。文档移动端表格、布局库和 Markdown 预览的合理内部滚动不作为演示内容裁切。数值断言通过后仍需人工查看导出图，避免位置正确但文字无法阅读。

## 6. 检查接入与提交顺序

复用已有 `node:test`、合同检查、Slidev parser、Playwright 和截图工具。测试跟随对应修复提交；仅对本轮已证实的行为补回归，不扩建通用测试平台。

当前已存在的主要命令：

```sh
pnpm run check:vscode-citations
pnpm run check:vscode-sync
pnpm run vscode:compile
pnpm --dir vscode-extension run test
pnpm --dir vscode-extension run lint
pnpm run check
pnpm run check:visual
pnpm run vscode:package
pnpm --dir vscode-extension run check:package
```

这些是执行阶段的命令清单，并非本计划编写时的新通过记录。`check` 已包含根测试、插件编译与测试、文档构建等步骤，综合验收不必再独立重复全部子步骤。模型解析新检查须在插件编译后执行；浏览器新检查只接入视觉分支。VSIX 打包产生的同步文件需要检查后再纳入对应提交。

建议按以下行为边界提交，实际文件仍以最小必要修改为准：

| 顺序 | 建议 commit message | 内容与回归 |
|---|---|---|
| 1 | `fix(checks): align quality gates with generated metadata` | R01 与公共/派生字段检查 |
| 2 | `fix(builder): generate the first slide without an empty page` | R02 与实际解析检查 |
| 3 | `fix(builder): preserve slide content when switching layouts` | R03 与草稿往返回归 |
| 4 | `fix(builder): scope and validate slide generation inputs` | R08、R09 与操作边界检查 |
| 5 | `fix(layouts): keep research evidence visible in exports` | R04、受影响预览与可见性检查 |
| 6 | `fix(examples): populate the model talk bibliography` | R07 与引用闭环 |
| 6a | `fix(builder): preserve hidden headings on first-page outlines` | R02 补充边界、目录标题兼容与实际播放/导出回归 |
| 7 | `fix(builder): improve narrow views and keyboard navigation` | R05、R10–R12、双语说明与交互回归 |
| 8 | `fix(docs): constrain hero images and refresh UI guidance` | R06、最终文档截图与验收记录 |
| 9 | `fix(vscode): bundle the YAML runtime in extension packages` | 阶段 5A：独立运行时、许可证、打包配置与解包检查 |
| 10 | `docs(ui): refresh previews and clarify layout capacity` | 阶段 5B：完整派生预览、Builder 截图、双语容量说明 |
| 11 | `test(ui): stabilize captures and record final acceptance` | 阶段 5C–5D：截图稳定性修正与真实验收记录；未验证项保留明确状态 |

已有检查若断言了旧 DOM 结构或源码文案，应随对应行为改动一起更新，不单独将“放宽检查”作为完成目标。

## 7. 完成定义与回退

- [x] R01–R04 的全部 P1 问题修复并有针对原始失败场景的通过记录。
- [x] R05–R12 的已复现交互、文档与键盘问题通过对应场景验收；更广的真实读屏检查单独列于下一项。
- [ ] 普通检查、真实视觉导出、Node 20/24、插件 lint 和本地包验证均有新结果。
- [ ] 原生宿主插入、高对比与读屏抽查完成；浏览器 mock 的通过不能替代这些记录。
- [x] 截图与共享派生资源已同步，中英文说明与实际行为一致。
- [x] 保存原始证据和修复后对照，未发现本轮检查覆盖范围内公开布局 API、模板数据或现有草稿的非预期损失。
- [x] 未验证或未通过的事项明确列出；存在必需项缺口时，不标记本计划全部完成。

以单个问题的提交为回退单位，同时回退其对应测试、文档和派生截图，避免实现与预览错位。优先局部回退新增样式，保持生成和内容保护修复；如必须回退草稿状态改动，先保留新状态数据，禁止用清空持久化草稿处理兼容问题。回退后重跑受影响的检查，撤销对应验收勾选。


## 8. 执行记录

### 阶段 1 · 2026-09-05

- 修复了引用检查的文案耦合；新增编译后真实 provider 的诊断与 WorkspaceEdit 行为检查，覆盖不同换行、参考页修复后重分析、本地化文案、bibFile 插入位置和其他插件诊断隔离。
- 复用模板解析函数，分别比较公共元数据和完整派生 deck；导入同步脚本不再产生写入副作用。
- 两个针对性检查及完整 `pnpm run check` 通过：根目录 65/65，插件 30/30；文档构建和既有合同检查通过。主题矩阵此阶段仅 dry-run。
- 负例检查确认公共标签错误、派生正文过期、模板缺失都会失败，验证后已恢复原始模板文件。
- 本地证据：`artifacts/remediation-2026-09-05/phase-1-check.log`、`phase-1-metadata-negative.log`。

### 阶段 2A · 2026-09-05

- R02 已修复。8 个模板经安装的 Slidev parser 实际解析，basic 4、academic 6、paper-talk 8、seminar 7、thesis-defense 7、reading-group 6、conference-lightning 5、zh 4 页，均与大纲一致。
- 新增 `scripts/check-builder-output.mjs`，已接入插件编译之后；覆盖首尾重排、双栏首页、具名 slots、特殊字符、元数据和独立插入片段。
- 明确覆盖顺序：原始配置 → Builder 管理字段 → 首页显式布局字段。首页显式标题优先；与演示名不同时，通过 Slidev 原生 `titleTemplate` 保留演示的浏览器标题。自定义主题字段、作者与引用设置按 YAML 数据保留。
- 实施调整：把插件工具链已安装的 `js-yaml@4.2.0` 提升为显式运行依赖，以实际解析和合并 YAML，避免手写解析器。未新增状态库或验证框架；插件独立安装仍不依赖根目录 Slidev。
- 编译、插件 30/30 测试、lint、元数据同步检查和实际解析检查通过；历史失败 `basic: 5 != 4` 已保存。
- 本地证据：`artifacts/remediation-2026-09-05/phase-2-pages-before.log`、`phase-2-pages-after.log`、`phase-2-compile.log`、`phase-2-extension-tests.log`。

### 阶段 2B · 2026-09-05

- R03 已修复：每页按布局保存配置、具名分区、标题模式和配置输入原文；共享标题和正文继续保留。切回布局时从隔离的快照恢复，通过既有 Webview 持久化保存。
- 新增真实编译 Webview 的 Playwright 检查，复现修复前的双栏内容丢失，并验证修复后布局往返、二次编辑、不同页面隔离、原模板 YAML、无效 JSON/null/混合数组原文、刷新恢复和空标题保留。
- 生成模型检查确认未激活布局的配置与 slots 不会进入输出。双语界面补充布局草稿恢复说明。
- 编译、插件 30/30 测试、lint 及浏览器回归通过；浏览器入口已接入 `check:visual`，后续继续扩充响应式与键盘场景。这里的宿主为 mock，尚不能证明原生 VS Code 插入成功。
- 本地证据：`artifacts/remediation-2026-09-05/phase-2-drafts-before.log`、`phase-2-drafts-after.log`、`phase-2-drafts-compile.log`、`phase-2-drafts-tests.log`。

### 阶段 2C · 2026-09-05

- R08、R09 已修复。表单与生成模型共用同一份配置解析/校验函数，覆盖共享目录实际使用的标量、联合类型、数组和扁平对象字段；保留有效数字、布尔值和字符串，不引入验证框架。
- 插入仅验证当前页；整份生成验证标题与所有页面。无效配置显示双语字段提示，停止无效预览；宿主对原始 YAML、恢复状态和直接消息重新校验，预览错误不会反复弹出宿主通知。
- R11 随校验一并修复：展开标题设置后聚焦输入，定位配置错误时同时保存选中页，刷新后仍能回到需要修正的页面。
- 实际模板校验发现并修复两处原数据错误：seminar 的议程对象改为布局要求的文本数组，完整保留主题与描述；thesis-defense 的数字实验结果按声明改为文本。派生模板已同步。
- `pnpm run check` 通过：根目录 65/65、插件 32/32、全部 8 个模板实际解析、文档构建和合同检查均通过。插件 lint 及扩展后的浏览器校验通过。完整主题视觉矩阵和原生宿主验证仍待后续阶段。
- 本地证据：`artifacts/remediation-2026-09-05/phase-2-check.log`、`phase-2-validation-browser.log`、`phase-2-validation-pages.log`、`phase-2-validation-tests.log`。
- 新发现待处理：目录布局作为首页且配置 `title: false` 时会与 Slidev 的全局字符串标题冲突；需要在后续布局修复中保留“隐藏目录标题”的语义，并补充首页回归。

### 阶段 3A · 2026-09-05

- R04 已修复：两个布局取消与 Slidev 默认内边距的叠加；实验页去除重复标题，标签与内容同排，保留四实验及公开列数配置。结果页减少指标区嵌套与留白，证据区不再依赖内部滚动。
- 实验指标与备注至少 16px，描述和证据正文 18px，指标数值进一步强调；继续使用主题语义色，未隐藏内容或缩小字号。
- 新增 `scripts/check-slide-content.mjs` 并接入 `check:visual`：依据布局定位示例页，验证 16:9、4:3 × 浅/深模式的播放与打印几何，统一为逻辑像素并允许 1px 舍入；等待字体、图片和最终点击状态。四组均通过实际 PNG/PDF 导出。
- 四组超量内容负例均被检测，报告元素与溢出量，并给出减少内容或拆页提示。检查服务与临时 Markdown 在 finally 中清理。无头浏览器使用 Slidev 现有设置关闭屏幕唤醒，不屏蔽浏览器异常。
- 已查看实际导出 PNG 与 PDF 重点页渲染，指标、数值、备注和证据完整；学术布局合同检查通过。当前 Slidev PDF 导出保留完整 13 页，因此 PDF 抽查按原页码定位；不把其余页面视为已验收。
- 本地证据：`artifacts/remediation-2026-09-05/phase-3-geometry-before.json`、`phase-3-geometry-after.json`、`phase-3-content-check.log`、`content-check/`。布局检测器未报告机械问题。文档/插件派生截图统一留到阶段 5 同步；R07、目录首页边界及阶段 4–5 仍未完成。

### 阶段 3B · 2026-09-05

- R07 已修复：相关工作表接入现有真实条目 `lecun2015deep`、`vaswani2017attention`，去掉无法支撑的 Smith/教师模型描述。表格按文献的实际贡献与范围表述，保持 13 页与示例数据说明。来源核对：[Nature 原文](https://www.nature.com/articles/nature14539)、[Transformer 原文](https://arxiv.org/abs/1706.03762)。
- 现有内容检查扩展到参考页：断言两条实际渲染文献及论文题目，点击正文引用并验证跳转至正确参考页；覆盖两种画幅、浅深模式、播放/打印几何与 PNG/PDF 导出。四组全部通过；引用工作流合同检查通过。
- 已查看参考页实际 PNG 和 PDF 渲染，作者、年份和论文信息完整。本地证据：`artifacts/remediation-2026-09-05/phase-3-references-check.log`、`content-check/`。目录首页边界与后续 UI/集成验收仍待完成。

### 阶段 3C · 2026-09-05

- R02 的目录首页边界已修复：可见目录标题通过兼容参数 `heading` 与演示名分开，首页 `title: false` 自动转为 `heading: false`，保留字符串演示标题。显式 undefined 不再覆盖演示名称；页面名称不再覆盖合法的隐藏标题配置。
- 目录从当前页 frontmatter 读取原有 `title`，修复 Vue 对可选布尔联合属性的默认 false 转换；编号和高亮默认值与公开文档一致。没有当前章节时不将整份目录淡化。共享目录与中英文说明已同步。
- `check-builder-output.mjs` 覆盖首页默认、自定义、隐藏、undefined 和中文标题；新增 `check-toc-headings.mjs` 接入 `check:visual`，覆盖三种首页状态及普通目录页，并导出隐藏标题首页的 PNG/PDF。
- 完整 `pnpm run check` 通过：根目录 65/65，插件 32/32，全部模板实际解析、文档构建与合同检查通过；插件 lint 通过。完整主题矩阵此命令仍为 dry-run，未视为视觉验收完成。
- 本地证据：`phase-3-check.log`、`phase-3-toc-parser.log`、`phase-3-toc-browser.log`、`phase-3-toc-tests.log`、`phase-3-toc-lint.log` 和 `content-check/toc-*`，均在 `artifacts/remediation-2026-09-05/`。

### 阶段 4A · 2026-09-05

- R05、R10、R12 已修复：工作流和布局库使用原生 details，在 701–1100px 保留大纲与编辑双栏；700px 以下大纲默认收起，展开后的入口随列表滚动保持可达。顶部生成动作固定在布局自身的首行，缩略图限制尺寸，编辑区独立滚动。
- 新增页面会关闭窄窗口布局库并聚焦标题；按稳定页 ID 与操作恢复重绘后的焦点，边界移动回退到页面本身，删除落到相邻页面，清空大纲后打开布局库并聚焦搜索。
- 工作流改为原生 radio，方向键选择、单次 Tab 进出；取消替换恢复选择与焦点且不修改草稿。中英文使用说明已更新。
- 真实编译 Webview、打包预览资源与代表性宿主主题变量下，中英文 × 明暗 × 5 种视口全部通过；新增、恢复、选择、删除、键盘与取消替换回归通过，原草稿/校验回归保持通过。原生宿主、高对比及读屏仍留待阶段 5。
- 插件 32/32 测试、compile、lint 与 diff 检查通过。证据为 `artifacts/remediation-2026-09-05/phase-4-ui-before.log`、`phase-4-ui-after.log`、`phase-4-tests.log`、`phase-4-lint.log` 与 `ui-after/`。修复前 980px 视口正文输入起点约 3719px，修复后五组视口均进入首屏。

### 阶段 4B · 2026-09-05

- R06 已修复：Hero 图片列允许收缩，容器最大宽度受列宽约束，不使用文档级 overflow 隐藏。截图复查发现移动端负上边距会让导航遮住图片顶部 28px，也已修复并加入断言。
- 新增 `scripts/check-docs-layout.mjs` 接入 `check:visual`，自行启动并清理 VitePress 服务，覆盖中英文、浅深模式及 390/960/1024/1152/1200px，验证文档横向宽度、图片列边界及导航遮挡。20 组通过；查看桌面与移动端实际截图。
- 完整 `pnpm run check` 通过（根目录 65/65、插件 32/32、文档构建与合同检查通过）。布局检测器未报告机械问题；全主题实际导出、原生宿主、兼容性及本地包仍待阶段 5。
- 证据：`artifacts/remediation-2026-09-05/phase-4-docs-before.log`、`phase-4-docs-nav-before.log`、`phase-4-docs-after.log`、`phase-4-check.log` 和 `docs-after/`。

### 阶段 5A · 2026-09-05

- 独立打包暴露了 pnpm 链接与 VSCE 依赖扫描的冲突，且 `.vscodeignore` 排除了 node_modules。使用 `js-yaml` 自带 standalone 构建与许可证随编译进入 `out/vendor`，模型从包内加载；依赖改为构建依赖，未引入新的打包工具。
- VSCE manifest 统一禁用依赖扫描，覆盖普通与预发布打包入口。新增 `check:package` 命令，在临时目录解包并运行真实模型，核对版本、8 个模板、91 个预览哈希和许可证，最后清理临时目录。
- 最终配置打包、独立解包检查、插件 32/32 测试、lint 均通过。日志为 `phase-5-package-final.log`、`phase-5-vsix-final.log`、`phase-5-package-tests.log`、`phase-5-package-lint.log`，位于 `artifacts/remediation-2026-09-05/`。
- 此结果证明包内运行时完整，不能替代真实 VS Code 的插入、新建、高对比和读屏验收。

### 阶段 5B · 列数回归修复 · 2026-09-05

- 预览目检发现阶段 3 的 `grid-row: 3` 被错误应用到卡片与底部说明的共享选择器，导致 `cols: 2` 生成四个隐式列。已将定位规则限制到说明区，恢复卡片自然换行。
- 现有内容检查增加实际渲染列数断言；修复前以 `4 !== 2` 失败，修复后两种画幅、浅深模式的播放与打印几何、PNG/PDF 导出均通过，超量内容负例继续失败。已目检 16:9 导出，四实验为两列两行，指标与备注完整。
- 证据：`phase-5-columns-before.log`、`phase-5-columns-after.log`、`content-columns-after/`。已重新执行全部 34 个布局截图生成，派生资源随 UI 文档批次统一提交。

### 阶段 5C · 原生插入目标修复 · 2026-09-05

- 在真实 VS Code 配置 `Scholarly-Acceptance-20260905` 中复现：打开 Builder 后 `activeTextEditor` 为空，已打开 Markdown 仍收到“请先打开 Markdown”警告。修复为保留最近的明确文本编辑目标；非 Markdown 编辑器也会更新目标，防止回退误写旧文件；目标关闭和面板销毁会清理引用与监听。
- 插入前恢复目标编辑器与选择位置，失败的 edit 返回值会显示本地化错误。新增宿主回归覆盖 Webview 焦点、非 Markdown 拦截、未保存目标、目标关闭、新建、空环境与编辑失败；插件 33/33 测试、编译、lint、重新打包和独立包检查通过。
- 真实宿主复验：从 Webview 插入成功，原 Markdown 内容保留；切换到 `unrelated.txt` 后插入被拦截，未回退修改旧 Markdown；新建文件经实际 Slidev parser 解析为 8 页。临时文件位于 `/tmp/scholarly-vscode-acceptance/fixtures/`；证据为 `phase-5-native-files.log` 及本任务原生 UI 操作记录。
- `phase-5-host-*.log` 保存当前宿主修复的检查结果。真实未保存目标与关闭后的空环境、高对比、读屏抽查仍待补齐；自动化宿主回归不替代这些原生场景。

### 阶段 5B/5D · 资源与视觉集成 · 2026-09-05

- 重新生成并同步全部 34 个布局预览；Builder 文档图取自现有真实 Webview 浏览器检查的 1280×800 浅色截图，属于界面截图，不作为原生宿主证据。中英文 academic 布局说明补充结果页与四实验样例的容量边界和超量拆页建议。
- 以 `SCHOLARLY_FULL_VISUAL=1 node scripts/release-ready.mjs` 执行与 `check:visual` 相同的完整入口，退出 0：常规合同、根测试、文档构建、插件测试、Builder 与文档浏览器检查、目录首页、重点内容 PNG/PDF 和 54 组主题导出全部通过。后续宿主改动的补验见阶段 5C。
- 已查看经典浅色、深色与高对比主题的代表性实际导出，以及修正后的实验预览。文档最终构建、元数据/预览同步与包体积合同通过；根包 126798 bytes，低于现有预算。未宣称完成全部布局的无障碍认证。
- 证据：`phase-5-full-visual.log`、`final-ui/`、`final-content/`、`final-theme-matrix/`、`phase-5-docs-final-build.log`、`phase-5-metadata-final.log`、`phase-5-budget-final.log`。文档截图检查增加 reduced motion、回到顶部及两帧布局稳定等待，避免导航动画与恢复滚动污染截图。

### 阶段 5C · 错误持久反馈与剩余原生场景 · 2026-09-05

- 高对比原生抽查发现标题错误只存在于 7 秒后自动隐藏的状态提示。复用已有字段错误样式，为标题增加持久错误、必填语义、`aria-invalid` 和关联说明；修正标题或切换工作流后清除旧错误。
- 浏览器回归等待超过原 7 秒时限，确认错误仍可见、标题修正后反馈和无效状态清除；中英文、浅深色、五种视口以及既有键盘、草稿、校验检查继续通过。编译、33/33 插件测试、lint、打包及独立解包检查通过，见 `phase-5-title-*.log`。
- 原生未保存目标插入通过，保存后实际解析为原 8 页加选中页，共 9 页，见 `phase-5-native-untitled.log`。关闭所有临时编辑页后，确认宿主显示空编辑组，再打开 Builder 插入会正确提示需要 Markdown；未重新打开或修改旧目标。
- 原生 Dark High Contrast 下检查选中边框、输入焦点、必填错误展开和持久文字反馈，均可辨识。VoiceOver 初始为 off，实际启用后进行了焦点与必填错误操作；但工具无法可靠读取字幕窗口，复制最后朗读短语也未取得内容，不能据此证明朗读名称、角色、状态和生成反馈全部正确。已在系统设置确认恢复为 off；未更改其字幕与命令配置。
- 读屏仍需人工完成四项：页面选择是否报出当前页；工作流是否报出单选与选中状态；标题错误是否随焦点读出且修正后清除；新建 Markdown 是否有可理解的生成反馈。须记录实际工具与结果，才能关闭该必需项。

### 最终本地检查与待验收门槛 · 2026-09-05

| 项目 | 最终证据 | 状态 |
|---|---|---|
| 常规总检查 | `phase-5-check-final.log`，退出 0；根目录 65 项与插件 33 项测试、编译、文档和合同检查 | 通过 |
| 完整视觉检查 | `phase-5-full-visual.log`，退出 0，含 54 组实际主题导出；后续标题反馈以 `phase-5-title-ui.log` 补验 | 通过 |
| Node 20 / 24 本地构建 | 两份 `phase-5-node*-final.log`，每份三次构建成功、整体退出 0；当前最终布局实现 | 通过，macOS |
| 最终 VSIX | `phase-5-title-package.log`、`phase-5-title-vsix.log`，包内 8 模板、91 预览及运行时/许可证通过 | 通过 |
| 原生 VS Code 主流程 | 普通与未保存 Markdown 插入、新建、非 Markdown 拦截、空环境；文件解析与 UI 记录 | 通过 |
| 原生高对比 | Dark High Contrast，焦点/选中边框、标题错误展开与持久文字 | 抽查通过 |
| 原生读屏输出 | 实际启用 VoiceOver，但无法可靠取得朗读记录；已恢复 off | 未完成，需四项人工结果 |
| Ubuntu CI | 已获授权并推送；首次运行的 Node 20/24 构建通过，quality 因临时目录硬编码失败；修复与复验见下文 | 待修复后远程复验 |

本轮收尾提交：`1e3404f` 打包运行时，`0e90361` 实验列数，`5cb3690` 原生插入目标，`1bf2424` 预览与双语说明，`9ef7f4a` 持久标题错误。已跟踪的实现和派生资源均分阶段提交；原有 `.impeccable/`、`PRODUCT.md` 和 `artifacts/` 保留为本地未跟踪材料。

最终门槛仍为未全部就绪。本地检查完成不替代远程 CI 或人工读屏结果；不创建发布标签，不发布包。

### 阶段 5D · 远程 CI 与跨平台检查修复 · 2026-09-07

- 用户授权推送后，已将分支 `feat/vscode-extension-workflow` 推送至远端并手动触发既有 CI。首次运行 [34158561588](https://github.com/jxpeng98/slidev-theme-scholarly/actions/runs/34158561588) 对应 `9636539`；Ubuntu 的 Node 20/24 三份示例构建均通过。
- Full Quality Gate 在 curated template 检查创建 `/private/tmp` 临时目录时失败。排查同类路径后，将 curated template 和 doctor actionability 两处改为现有脚本采用的 `node:os` 的 `tmpdir()`，保留原有创建与清理流程。
- 修复后本地 `pnpm run check` 退出 0，包含上述两项实际 CLI 检查、根目录 65 项和插件 33 项测试；证据为 `artifacts/remediation-2026-09-05/remote-ci-portable-tmp-check.log`。远程复验尚待此修复提交推送后运行；实际读屏输出仍是独立待验收项。
