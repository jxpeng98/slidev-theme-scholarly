---
theme: ../
footerMiddle: Princeton Orange Theme
aspectRatio: 4/3
lang: en
themeConfig:
  colorTheme: princeton-orange
  fontTheme: contemporary
  contentMode: light
  chromeMode: dark
  sectionMode: dark
  outlineToc: true
  outlineTocOpen: false
authors:
  - name: Dr. O.P. Clark
    institution: JKL Institute
---

# Princeton Orange Theme

Bold engineering and technology presentations

---
layout: section
---

# Machine Learning

## Neural Architecture Search at Scale

---
layout: default
title: Introduction
subtitle: Problem Statement
---

## Research Challenge

<Block type="info" title="The Challenge">

Designing optimal neural network architectures requires extensive expertise and computational resources.

</Block>

<Block type="success" title="Our Solution">

AutoML framework that discovers architectures **5x faster** than previous methods.

</Block>

---
layout: quote
author: Prof. A.B. Foster
source: Computing Machinery and Intelligence, 1950
---

We can only see a short distance ahead, but we can see plenty there that needs to be done.

---
layout: fact
color: primary
---

# 5x

Faster Architecture Search

---
layout: default
title: Technical Approach
---

## Algorithm Design

<Theorem type="definition" title="Neural Architecture Search">

The process of automating architecture engineering using machine learning techniques.

</Theorem>

<Theorem type="theorem" title="Search Efficiency Bound">

Given search space $\mathcal{A}$ with $|\mathcal{A}| = N$, our method achieves $O(\sqrt{N})$ sample complexity.

</Theorem>

---
layout: focus
color: primary
icon: ⚡
---

# Core Innovation

How can we efficiently explore exponentially large architecture spaces?

---
layout: two-cols
ratio: "1:1"
title: Method Comparison
---

## Previous Approaches

- Random search: slow convergence
- RL-based: high variance
- Gradient-based: local optima

<Block type="danger" title="Limitation">

Requires 1000+ GPU hours for single search.

</Block>

::right::

## Our Approach

- Weight sharing strategy
- Progressive search space
- Early stopping criteria

<Block type="success" title="Efficiency">

Reduces search to under 200 GPU hours.

</Block>

---
layout: default
title: Benchmark Results
---

## ImageNet Classification Accuracy

| Method | Top-1 Acc | GPU Hours | Params |
|--------|-----------|-----------|--------|
| NASNet | 82.7% | 48,000 | 88M |
| DARTS | 83.1% | 1,000 | 73M |
| **Ours** | **84.2%** | **196** | **67M** |
| Manual (EfficientNet) | 84.0% | - | 66M |

<Highlight type="success">State-of-the-art with minimal search cost.</Highlight>

---
layout: center
---

## Thank You

Code available at github.com/example/automl

<Keywords :keywords="['AutoML', 'Deep Learning', 'NAS', 'Optimization']" />
