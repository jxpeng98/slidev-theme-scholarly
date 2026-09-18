---
title: PaperCard
---

# PaperCard

`PaperCard` 把论文标题、作者、发表信息和主要贡献放在一张卡片中，适合用于相关工作、论文概览和读书会。

![PaperCard 示例](/images/components/paper-card.png)

## 基本用法

```markdown
<PaperCard
  title="Efficient Adaptation for Scientific Models"
  :authors="['A. Smith', 'B. Lee']"
  venue="ICML"
  year="2026"
  status="已接收"
  contribution="在针对任务的微调前加入轻量路由模块。"
/>
```

## 带链接

```markdown
<PaperCard
  title="Cost-Aware Fine-Tuning"
  authors="Chen et al."
  venue="NeurIPS"
  year="2025"
  doi="10.0000/example"
  url="https://example.org/paper"
/>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | 必填 | 论文标题 |
| `label` | `string` | `'Paper'` | 标题上方的小标签 |
| `authors` | `string[] \| string` | - | 作者 |
| `venue` | `string` | - | 会议或期刊 |
| `year` | `string \| number` | - | 发表年份 |
| `status` | `string` | - | 评审或发表状态 |
| `doi` | `string` | - | 不带 URL 前缀的 DOI |
| `url` | `string` | - | 论文链接 |
| `urlLabel` | `string` | `'Open paper'` | 链接文字 |
| `contribution` | `string` | - | 一句话贡献或核心结论 |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |
