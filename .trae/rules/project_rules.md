---
name: front-homework-vibe
description: 约束基础 HTML/CSS/JS 前端作业的 vibe coding 输出。用于 Codex 生成或修改原生 HTML、CSS、JavaScript 课程作业页面，尤其是博物馆展示页、小型 DOM 游戏、非遗/脸谱/画板类页面；要求避免每个 HTML 重复写同一套 layout，避免过度工程化，变量、id、class、文件等命名简略，并在已有画板或脸谱画板时保留画板，小小游戏优先用 DOM 而不是 canvas。
---

# Front Homework Vibe

## 目标

让生成结果像一份干净、完整、基础的前端三件套作业，而不是复杂的工程项目。优先使用简单 HTML/CSS/JS、共享布局、简短命名和容易看懂的 DOM 逻辑。

## 硬性要求

- 只使用前端三件套：HTML、CSS、原生 JavaScript。不要引入框架、构建工具、TypeScript、路由库、包管理器或组件系统，除非用户明确要求。
- 不要在每个 HTML 文件里复制同一套 layout 代码。页头、导航、页脚、卡片、页面间距等公共样式要抽到公共 CSS，并复用同一批 class。
- 如果项目里已经有画板，要保留画板。如果有画脸谱、画面具之类的画板，也要保留对应画板。
- 小小游戏默认不要用 `canvas`。优先用 DOM 元素、CSS 定位、CSS 过渡和 JS 事件完成。
- 作业评分要求有“图形绘制”时，要保留或补一个轻量 `canvas` 绘图功能，例如画板、脸谱画板、绘制文字、绘制简单图形。
- 除图形绘制功能外，不要把整个小游戏都改成 `canvas`。小游戏仍然优先用 DOM。
- 只有在真正需要自由绘制、像素级处理、图片涂鸦，或用户明确要求时，才扩大使用 `canvas`。
- 结果要符合基础课程作业水平：结构清楚、效果适中、不要写得像大型生产项目。

## 作业评分要求

- 页面要覆盖：登录页面、联系页面、主页面、分类展示子页面、详情展示子页面。
- 主页要包含：页眉区、网站 logo、导航区、banner 广告区、正文区、副栏区、页脚区。
- 页脚可以包含：版权、技术支持、分享链接等基础信息。
- 页面元素要尽量齐全：列表、文字、图片、视频、Canvas 图形绘制。
- 整体样式要围绕网站主题统一设计，包括布局、配色、边距、导航、广告、图文混排。
- 交互功能尽量覆盖评分项：登录验证、联系表单验证、主页显示当前用户名、图片切换广告、图形绘制、浮动广告、拖放、分页导航。
- 特色部分要有一两个明确亮点即可，例如主题化视觉、简单动画、特色交互、非遗相关小功能。不要堆太多复杂特效。
- 如果同时写报告或说明文档，要能对应评分项说明：内容完整性、样式设计、交互功能、特色、个人总结。

## 命名要求

- 文件名简短且有意义，例如：`index.html`、`cat.html`、`detail.html`、`game.html`、`style.css`、`main.js`、`data.js`。
- 变量名短一点但要能看懂，例如：`list`、`item`、`btn`、`box`、`cur`、`idx`、`score`、`time`、`imgs`。
- `id` 简短且唯一，例如：`nav`、`hero`、`list`、`game`、`board`、`score`、`timer`、`msg`。
- `class` 简短且可复用，例如：`wrap`、`card`、`grid`、`btn`、`tag`、`pic`、`txt`、`hide`、`on`、`active`。
- 避免过长的 BEM 或工程化命名，例如 `museum-homepage-category-card-wrapper`。
- 避免 AI 味很重的随机长命名，例如 `featureSectionContainer`、`immersiveExperienceModule`、`dynamicCulturalHeritageVisualization`。

## 布局写法

- 多个页面使用统一的布局风格，不要每个页面单独重写一套大段布局。
- 重复视觉样式放进 `assets/css/style.css` 或 `style.css`。
- 重复交互逻辑放进 `assets/js/main.js` 或 `main.js`。
- 多个页面需要相同导航和页脚时，HTML 保持简单一致即可，不要为了复用而引入复杂 include 逻辑。
- 优先使用普通语义标签：`header`、`nav`、`main`、`section`、`footer`、`ul`、`li`、`button`。

## DOM 小游戏写法

- 游戏对象用普通元素实现，例如 `div`、`button`、`span`、`img`。
- 状态切换用 class 控制，例如 `on`、`hit`、`hide`、`active`。
- JS 使用基础 API，例如 `querySelector`、`addEventListener`、`setInterval` 和简单数组。
- 游戏代码尽量保持在一个文件里能看懂。不要写类、游戏引擎、物理库、canvas 渲染循环或复杂状态机。

示例方向：

```js
const box = document.querySelector('#game');
const scoreEl = document.querySelector('#score');
let score = 0;

box.addEventListener('click', e => {
  if (!e.target.classList.contains('item')) return;
  score++;
  scoreEl.textContent = score;
  e.target.classList.add('hide');
});
```

## 风格控制

- 页面要整洁完整，但要像学生基础前端作业。
- 使用少量配色、统一间距、简单 hover 效果。
- 优先静态页面和轻量交互，不要堆很多炫技动画。
- 不要为了显得丰富而生成大段空泛内容。
- 修改已有代码时，保留原有主题，只简化和合并重复部分。
