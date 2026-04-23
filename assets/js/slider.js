(function () {
  const slides = [
    {
      title: "指尖触碰历史，器物仍有温度",
      text: "在青瓷、宣纸和蓝印花布之间，感受东方工艺如何从材料里长出审美。",
      image: "assets/images/banners/banner-1.jpg",
      page: "expo.html?category=tradition",
      buttonLabel: "进入传统技艺馆"
    },
    {
      title: "节令、戏台与日常，共同构成非遗",
      text: "从年俗到京剧，非遗不是陈列在过去的标本，而是仍在发生的生活秩序。",
      image: "assets/images/banners/banner-2.jpg",
      page: "expo.html?category=opera",
      buttonLabel: "进入戏曲馆"
    },
    {
      title: "在数字展馆里继续看见手工之美",
      text: "拖动展品、脸谱上色、视频导览和问答助手，让浏览变成一次轻量参与。",
      image: "assets/images/banners/banner-3.jpg",
      page: "expo.html?category=handcraft",
      buttonLabel: "进入手工馆"
    }
  ];

  function nextIndex(current, length) {
    return (current + 1) % length;
  }

  function previousIndex(current, length) {
    return (current - 1 + length) % length;
  }

  function typeTitle(node, text) {
    if (!node) {
      return;
    }

    let idx = 0;
    node.textContent = "";
    clearInterval(node._timer);
    node._timer = setInterval(function () {
      idx += 1;
      node.textContent = text.slice(0, idx);
      if (idx >= text.length) {
        clearInterval(node._timer);
      }
    }, 55);
  }

  function renderCategoryEntrances() {
    const root = document.getElementById("categoryEntrances");
    if (!root) {
      return;
    }

    const list = [
      {
        title: "传统技艺",
        page: "expo.html?category=tradition",
        image: "assets/images/categories/tradition.jpg",
        text: "青瓷、宣纸、蓝印花布，聚焦火候、纤维和染色。"
      },
      {
        title: "民俗",
        page: "expo.html?category=folk",
        image: "assets/images/categories/folk.jpg",
        text: "从春节、端午到节气，理解非遗里的时间感。"
      },
      {
        title: "戏曲",
        page: "expo.html?category=opera",
        image: "assets/images/categories/opera.jpg",
        text: "行当、脸谱和程式动作，是最直观的舞台入口。"
      },
      {
        title: "手工",
        page: "expo.html?category=handcraft",
        image: "assets/images/categories/handcraft.jpg",
        text: "剪纸、苏绣、竹编，让手工逻辑被看见。"
      }
    ];

    root.innerHTML = `
      <div class="sec-head">
        <div>
          <p class="eyebrow">博览页入口</p>
          <h2 class="section-title">四馆并行的数字导览</h2>
        </div>
        <p>点击任意分类卡片，即可进入带分页和快速预览的博览页。</p>
      </div>
      <div class="intro-grid">
        ${list.map((item) => `
          <a class="entry-card" href="${item.page}">
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </a>
        `).join("")}
      </div>
    `;
  }

  function renderStoryScroll() {
    const root = document.getElementById("storyScroll");
    if (!root) {
      return;
    }

    const list = [
      ["材料有记忆", "器物、丝线、纸张和竹篾，本身就保存着工艺的节奏。"],
      ["节令有秩序", "民俗不是静态知识点，而是和季节、家庭、地域一起变化。"],
      ["舞台有语言", "戏曲把唱腔、脸谱、服饰和动作编成了一整套视觉系统。"]
    ];

    root.innerHTML = `
      <div class="sec-head">
        <div>
          <p class="eyebrow">数字长卷</p>
          <h2 class="section-title">三段式认识非遗</h2>
        </div>
      </div>
      <div class="story-grid">
        ${list.map((item) => `
          <article class="story-card">
            <h3>${item[0]}</h3>
            <p>${item[1]}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderVideoSpotlight() {
    const root = document.getElementById("videoSpotlight");
    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="sec-head">
        <div>
          <p class="eyebrow">精选视频</p>
          <h2 class="section-title">从一个片段进入整座展馆</h2>
        </div>
      </div>
      <div class="video-grid">
        <article class="video-card">
          <h3>推荐从京剧详情页开始</h3>
          <p>京剧最适合串联脸谱、颜色寓意和表演程式，也能和下方脸谱工坊直接联动。</p>
          <a class="btn" href="detail-jingju.html">去看京剧视频</a>
        </article>
        <article class="video-card">
          <h3>推荐浏览路线</h3>
          <p>首页开篇 → 四馆导览 → 快速预览 → 详情页视频 → 脸谱工坊 → 问答小助手。</p>
        </article>
      </div>
    `;
  }

  function buildHeroMarkup() {
    return `
      <div class="hero-slider">
        ${slides.map((slide, index) => `
          <article class="hero-slide${index === 0 ? " is-active" : ""}" data-slide-index="${index}">
            <div class="hero-slide__copy">
              <p class="eyebrow">卷首长幕</p>
              <h1 data-title="${slide.title}">${index === 0 ? "" : slide.title}</h1>
              <p>${slide.text}</p>
              <div class="hero-links">
                <a class="btn" href="${slide.page}">${slide.buttonLabel}</a>
                <a class="btn btn--secondary" href="#categoryEntrances">进入展馆</a>
              </div>
            </div>
            <div class="hero-slide__image">
              <img src="${slide.image}" alt="${slide.title}">
            </div>
          </article>
        `).join("")}
        <div class="hero-dots">
          ${slides.map((_, index) => `<button type="button" data-dot="${index}" class="${index === 0 ? "is-active" : ""}" aria-label="切换到第 ${index + 1} 张">${index + 1}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function renderSlider() {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.getElementById("hero");
    if (!root) {
      return;
    }

    root.innerHTML = buildHeroMarkup();

    let cur = 0;
    const slideNodes = Array.from(root.querySelectorAll("[data-slide-index]"));
    const dotNodes = Array.from(root.querySelectorAll("[data-dot]"));

    function update(index) {
      cur = index;
      slideNodes.forEach((node, idx) => {
        node.classList.toggle("is-active", idx === cur);
      });
      dotNodes.forEach((node, idx) => {
        node.classList.toggle("is-active", idx === cur);
      });
      const title = slideNodes[cur].querySelector("[data-title]");
      typeTitle(title, title.getAttribute("data-title"));
    }

    dotNodes.forEach((node) => {
      node.addEventListener("click", function () {
        update(Number(node.getAttribute("data-dot")));
      });
    });

    update(0);
    setInterval(function () {
      update(nextIndex(cur, slides.length));
    }, 5200);

    renderCategoryEntrances();
    renderStoryScroll();
    renderVideoSpotlight();
  }

  const api = {
    slides,
    nextIndex,
    previousIndex,
    buildHeroMarkup,
    renderSlider
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageSlider = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderSlider);
      } else {
        renderSlider();
      }
    }
  }
})();