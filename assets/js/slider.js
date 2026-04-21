(function () {
  const slides = [
    {
      title: "千年器物里的东方温度",
      text: "在青瓷、宣纸与蓝印花布之间，观看技艺如何穿越时代。",
      image: "assets/images/banners/banner-1.svg",
      page: "category-tradition.html",
      buttonLabel: "进入传统技艺馆"
    },
    {
      title: "节令与戏台交织的生活史",
      text: "从二十四节气到昆曲京剧，非遗不是过去式，而是仍在发生的生活。",
      image: "assets/images/banners/banner-2.svg",
      page: "category-opera.html",
      buttonLabel: "进入戏曲馆"
    },
    {
      title: "在数字展馆里继续看见手工之美",
      text: "拖动展品、绘制纹样、生成脸谱，把参观变成一次参与。",
      image: "assets/images/banners/banner-3.svg",
      page: "category-handcraft.html",
      buttonLabel: "进入手工馆"
    }
  ];

  function nextIndex(current, length) {
    return (current + 1) % length;
  }

  function previousIndex(current, length) {
    return (current - 1 + length) % length;
  }

  function renderCategoryEntrances() {
    const root = document.getElementById("categoryEntrances");
    if (!root || !window.heritageData) {
      return;
    }

    const categories = [
      {
        key: "tradition",
        title: "传统技艺",
        page: "category-tradition.html",
        image: "assets/images/categories/tradition.svg",
        text: "观看器物、纸墨和染织中的匠作逻辑。"
      },
      {
        key: "folk",
        title: "民俗",
        page: "category-folk.html",
        image: "assets/images/categories/folk.svg",
        text: "从节令礼俗与日常生活理解文化传承。"
      },
      {
        key: "opera",
        title: "戏曲",
        page: "category-opera.html",
        image: "assets/images/categories/opera.svg",
        text: "在唱念做打与脸谱身段之间进入舞台世界。"
      },
      {
        key: "handcraft",
        title: "手工",
        page: "category-handcraft.html",
        image: "assets/images/categories/handcraft.svg",
        text: "看见针线、剪刀和竹篾里被时间磨亮的手感。"
      }
    ];

    root.innerHTML = `
      <div style="padding: 28px;">
        <p class="eyebrow">四大展馆入口</p>
        <h2 class="section-title">分类数字展陈</h2>
        <div class="intro-grid">
          ${categories.map((item) => `
            <a class="entry-card" href="${item.page}">
              <img src="${item.image}" alt="${item.title}">
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </a>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderStoryScroll() {
    const root = document.getElementById("storyScroll");
    if (!root) {
      return;
    }

    const stories = [
      ["古艺留痕", "从火候、纸性、染色，到竹篾与针脚，材料经验决定了传统技艺的质感。"],
      ["节令成俗", "春节、端午与二十四节气构成了中国人对时间、自然和家庭关系的理解方式。"],
      ["戏台流光", "昆曲、京剧和越剧把文学、音乐、服饰与表演程式凝聚成舞台艺术。"]
    ];

    root.innerHTML = `
      <div style="padding: 28px;">
        <p class="eyebrow">数字长卷</p>
        <h2 class="section-title">非遗如何在时间里被看见</h2>
        <div class="story-grid">
          ${stories.map(([title, text]) => `
            <article class="story-card">
              <h3>${title}</h3>
              <p>${text}</p>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderVideoSpotlight() {
    const root = document.getElementById("videoSpotlight");
    if (!root) {
      return;
    }

    root.innerHTML = `
      <div style="padding: 28px;">
        <p class="eyebrow">精选视频</p>
        <h2 class="section-title">一段视频，先看见工艺的节奏</h2>
        <div class="video-grid">
          <article class="video-card">
            <h3>推荐观看：京剧脸谱与行当导览</h3>
            <p>通过详情页中的视频入口，快速了解戏曲中的脸谱色彩、人物类型和舞台程式。</p>
            <a class="btn" href="detail-jingju.html">进入京剧详情页</a>
          </article>
          <article class="video-card">
            <h3>推荐路线</h3>
            <p>先看主页轮播，再拖放精选展品，之后进入分类页分页浏览，最后在详情页打开视频演示。</p>
          </article>
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

    root.innerHTML = `
      <div class="hero-slider">
        ${slides.map((slide, index) => `
          <article class="hero-slide${index === 0 ? " is-active" : ""}" data-slide-index="${index}">
            <div class="hero-slide__copy">
              <p class="eyebrow">数字长卷开篇</p>
              <h1>${slide.title}</h1>
              <p>${slide.text}</p>
              <a class="btn" href="${slide.page}">${slide.buttonLabel}</a>
            </div>
            <div class="hero-slide__image">
              <img src="${slide.image}" alt="${slide.title}">
            </div>
          </article>
        `).join("")}
        <div class="hero-actions">
          <button type="button" id="heroPrev" aria-label="上一张">上一张</button>
          <button type="button" id="heroNext" aria-label="下一张">下一张</button>
        </div>
        <div class="hero-dots">
          ${slides.map((_, index) => `<button type="button" data-dot="${index}" class="${index === 0 ? "is-active" : ""}" aria-label="切换到第 ${index + 1} 张">${index + 1}</button>`).join("")}
        </div>
      </div>
    `;

    let current = 0;
    const slideNodes = Array.from(root.querySelectorAll("[data-slide-index]"));
    const dotNodes = Array.from(root.querySelectorAll("[data-dot]"));

    function update(index) {
      current = index;
      slideNodes.forEach((node, nodeIndex) => {
        node.classList.toggle("is-active", nodeIndex === current);
      });
      dotNodes.forEach((node, nodeIndex) => {
        node.classList.toggle("is-active", nodeIndex === current);
      });
    }

    root.querySelector("#heroPrev").addEventListener("click", function () {
      update(previousIndex(current, slides.length));
    });

    root.querySelector("#heroNext").addEventListener("click", function () {
      update(nextIndex(current, slides.length));
    });

    dotNodes.forEach((node) => {
      node.addEventListener("click", function () {
        update(Number(node.getAttribute("data-dot")));
      });
    });

    setInterval(function () {
      update(nextIndex(current, slides.length));
    }, 4800);

    renderCategoryEntrances();
    renderStoryScroll();
    renderVideoSpotlight();
  }

  const api = {
    slides,
    nextIndex,
    previousIndex,
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
