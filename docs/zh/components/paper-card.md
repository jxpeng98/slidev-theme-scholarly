---
title: PaperCard
---

# PaperCard

`PaperCard` 用于展示论文标题、作者、会议、状态和贡献摘要。适合 related work、paper summary 和 reading group deck。

![PaperCard 示例](/images/components/paper-card.png)

## 基本用法

```markdown
<PaperCard
  title="Efficient Adaptation for Scientific Models"
  :authors="['A. Smith', 'B. Lee']"
  venue="ICML"
  year="2026"
  status="Accepted"
  contribution="在 task-specific fine-tuning 前加入轻量 routing。"
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

## Props

| Prop | 类型 | 默认值 | 说明 |
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
| `contribution` | `string` | - | 一句话贡献或 takeaway |
| `variant` | `string` | `'primary'` | `primary`、`success`、`warning`、`danger` 或 `info` |
| `compact` | `boolean` | `false` | 使用紧凑间距 |
