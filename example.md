---
theme: ./
footerMiddle: Slidev Theme Academic
authors:
  - name: Jiaxin Peng
    institution: Your University
    email: jiaxin@example.edu
  - name: Second Author
    institution: Another University
    email: second@example.edu
  - name: Third Author
    institution: Third University
    email: third@example.edu
---

# Slidev Theme Academic

Presentation slides for developers

<!--
Multi-author example using authors array in frontmatter.
For single author, use:
author: Your Name

Footer configuration:
- footerLeft: Custom text for left footer (overrides author display)
- footerMiddle: Custom text for middle footer (e.g., conference name)
- footerRight: Automatically shows page numbers
-->

---
layout: intro
footerMiddle: Slidev Theme
---

# What is Slidev?

Slidev is a slide maker and presentation tool designed for developers. It includes the following features:

- 📝 **Text-based** - focus on your content with Markdown, then style it later
- 🎨 **Themable** - themes can be shared and reused as npm packages
- 🧑‍💻 **Developer Friendly** - code highlighting, live coding with autocompletion
- 🤹 **Interactive** - embed Vue components to enhance your expressions
- 🎥 **Recording** - built-in recording and camera view
- 📤 **Portable** - export to PDF, PPTX, PNGs, or even a hostable SPA
- 🛠 **Hackable** - virtually anything that's possible on a webpage is possible in Slidev

<br>
<br>

Read more about [Why Slidev?](https://sli.dev/guide/why)

---
layout: default
---

# Navigation

Hover on the bottom-left corner to see the navigation's controls panel

## Keyboard Shortcuts

|     |     |
| --- | --- |
| <kbd>space</kbd> / <kbd>tab</kbd> / <kbd>right</kbd> | next animation or slide |
| <kbd>left</kbd>  / <kbd>shift</kbd><kbd>space</kbd> | previous animation or slide |
| <kbd>up</kbd> | previous slide |
| <kbd>down</kbd> | next slide |

---
layout: default
---

# This Slide Uses Default Layout

Notice that even without specifying `layout: default`, this slide:
- Uses the default layout automatically
- Shows the footer with author information from the frontmatter
- Displays the conference name in the middle
- Shows page numbers on the right

This demonstrates that **all footer configuration is global** and works across all slides.

---
layout: image-right
image: https://cover.sli.dev
---

# Code

Use code snippets and get the highlighting directly!

```ts
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = { ...user, ...update }
  saveUser(id, newUser)
}
```

---
layout: center
class: "text-center"
---

# Learn More

[Documentation](https://sli.dev) / [GitHub Repo](https://github.com/slidevjs/slidev)
