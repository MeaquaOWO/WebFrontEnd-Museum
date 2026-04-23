(function () {
  const catMeta = {
    tradition: {
      title: "传统技艺馆",
      image: "assets/images/categories/tradition.svg",
      text: "围绕器物、纸墨与印染，展示东方工艺里的火候和手感。",
      note: "支持分页浏览、拖放收藏和详情预览。"
    },
    folk: {
      title: "民俗馆",
      image: "assets/images/categories/folk.svg",
      text: "从岁时礼俗和节令经验出发，看见非遗如何嵌入日常生活。",
      note: "可通过预览卡片快速了解节庆背景。"
    },
    opera: {
      title: "戏曲馆",
      image: "assets/images/categories/opera.svg",
      text: "聚焦唱腔、行当、脸谱和舞台程式，适合结合视频一起看。",
      note: "支持快速预览和详情页继续浏览。"
    },
    handcraft: {
      title: "手工馆",
      image: "assets/images/categories/handcraft.svg",
      text: "从针法、折剪到竹篾编织，展现手工技艺的温度和秩序。",
      note: "推荐配合收藏馆功能生成你的观展路线。"
    }
  };

  function paginate(items, page, size) {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  }

  function getTotalPages(totalItems, size) {
    return Math.ceil(totalItems / size);
  }

  function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("category") || "tradition";
  }

  function getCategoryMeta(category) {
    return catMeta[category] || catMeta.tradition;
  }

  function getCategoryPage(category) {
    return `expo.html?category=${category}`;
  }

  function updatePageTitle(category) {
    const info = getCategoryMeta(category);
    document.title = `${info.title} · 锦绣非遗`;
  }

  function buildPreviewHtml(item) {
    if (!item) {
      return "<p>暂无项目预览。</p>";
    }

    return `
      <div class="preview-top">
        <img src="${item.image}" alt="${item.title}">
        <div>
          <p class="eyebrow">快速预览</p>
          <h2>${item.title}</h2>
          <p>${item.summary}</p>
        </div>
      </div>
      <div class="preview-grid">
        <article class="preview-card">
          <h3>历史渊源</h3>
          <p>${item.history}</p>
        </article>
        <article class="preview-card">
          <h3>工艺看点</h3>
          <p>${item.feature}</p>
        </article>
        <article class="preview-card">
          <h3>文化价值</h3>
          <p>${item.value}</p>
        </article>
      </div>
      <div class="preview-actions">
        <a class="video-link" href="${item.video}" target="_blank" rel="noreferrer">打开演示视频</a>
        <a class="btn" href="${item.detailPage}">查看完整详情</a>
      </div>
    `;
  }

  function ensurePreviewBox() {
    if (typeof document === "undefined") {
      return null;
    }

    let modal = document.getElementById("previewModal");
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.id = "previewModal";
    modal.className = "preview-modal";
    modal.innerHTML = `
      <div class="preview-dialog">
        <button type="button" id="previewClose" class="preview-close" aria-label="关闭预览">×</button>
        <div id="previewBody"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.classList.remove("is-open");
      }
    });

    modal.querySelector("#previewClose").addEventListener("click", function () {
      modal.classList.remove("is-open");
    });

    if (!document.body.dataset.previewEsc) {
      document.body.dataset.previewEsc = "true";
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          const current = document.getElementById("previewModal");
          if (current) {
            current.classList.remove("is-open");
          }
        }
      });
    }

    return modal;
  }

  function renderSideBox(category) {
    const root = document.getElementById("sideBox") || document.querySelector(".subpage-aside");
    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="side-nav">
        <h2>博览导览</h2>
        <a class="${category === "tradition" ? "is-on" : ""}" href="expo.html?category=tradition">传统技艺</a>
        <a class="${category === "folk" ? "is-on" : ""}" href="expo.html?category=folk">民俗</a>
        <a class="${category === "opera" ? "is-on" : ""}" href="expo.html?category=opera">戏曲</a>
        <a class="${category === "handcraft" ? "is-on" : ""}" href="expo.html?category=handcraft">手工</a>
      </div>
      <div class="side-note">
        <h2>迷你收藏馆</h2>
        <p>把卡片拖到下方，生成你的个人路线。</p>
        <div id="miniCollection" class="collection-list"></div>
      </div>
    `;
  }

  function wirePreviewButtons() {
    if (typeof document === "undefined" || !window.heritageData) {
      return;
    }

    const modal = ensurePreviewBox();
    const body = modal ? modal.querySelector("#previewBody") : null;
    if (!modal || !body) {
      return;
    }

    document.querySelectorAll("[data-preview]").forEach((btn) => {
      if (btn.dataset.previewReady === "true") {
        return;
      }

      btn.dataset.previewReady = "true";
      btn.addEventListener("click", function () {
        const item = window.heritageData.getProjectById(btn.getAttribute("data-preview"));
        body.innerHTML = buildPreviewHtml(item);
        modal.classList.add("is-open");
      });
    });
  }

  function renderCategoryPage() {
    if (typeof document === "undefined" || !window.heritageData) {
      return;
    }

    const category = getCategoryFromUrl();
    const listRoot = document.getElementById("categoryList");
    const pagerRoot = document.getElementById("pager");
    const heroRoot = document.querySelector(".subpage-hero");
    if (!category || !listRoot || !pagerRoot || !heroRoot) {
      return;
    }

    updatePageTitle(category);
    const info = getCategoryMeta(category);
    const items = window.heritageData.getProjectsByCategory(category);
    let cur = 1;
    const size = 2;
    const total = getTotalPages(items.length, size);

    heroRoot.innerHTML = `
      <p class="eyebrow">博览页</p>
      <div class="detail-meta">
        <img src="${info.image}" alt="${info.title}">
        <div>
          <h1>${info.title}</h1>
          <p>${info.text}</p>
          <p>${info.note}</p>
        </div>
      </div>
    `;

    renderSideBox(category);

    function draw() {
      const list = paginate(items, cur, size);
      listRoot.innerHTML = list.map((item) => `
        <article class="exhibit-card" draggable="true" data-drag-id="${item.id}">
          <img src="${item.image}" alt="${item.title}">
          <h2>${item.title}</h2>
          <p>${item.summary}</p>
          <div class="card-actions">
            <button type="button" class="btn btn--secondary" data-preview="${item.id}">快速预览</button>
            <a class="btn" href="${item.detailPage}">查看详情</a>
          </div>
        </article>
      `).join("");

      pagerRoot.innerHTML = `
        <button type="button" id="pagePrev" ${cur === 1 ? "disabled" : ""}>上一页</button>
        ${Array.from({ length: total }, function (_, idx) {
          return `<button type="button" data-page="${idx + 1}" class="${idx + 1 === cur ? "is-active" : ""}">${idx + 1}</button>`;
        }).join("")}
        <button type="button" id="pageNext" ${cur === total ? "disabled" : ""}>下一页</button>
      `;

      const prev = document.getElementById("pagePrev");
      const next = document.getElementById("pageNext");
      if (prev) {
        prev.addEventListener("click", function () {
          cur -= 1;
          draw();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          cur += 1;
          draw();
        });
      }

      pagerRoot.querySelectorAll("[data-page]").forEach((btn) => {
        btn.addEventListener("click", function () {
          cur = Number(btn.getAttribute("data-page"));
          draw();
        });
      });

      wirePreviewButtons();
      if (window.heritageDrag) {
        window.heritageDrag.bindCollection();
      }
    }

    draw();
  }

  function renderDetailPage() {
    if (typeof document === "undefined" || !window.heritageData) {
      return;
    }

    const id = document.body.getAttribute("data-detail-id");
    const hero = document.getElementById("detailHero");
    const body = document.getElementById("detailBody");
    const video = document.getElementById("detailVideo");
    const related = document.getElementById("detailRelated");
    if (!id || !hero || !body || !video || !related) {
      return;
    }

    const item = window.heritageData.getProjectById(id);
    if (!item) {
      return;
    }

    hero.innerHTML = `
      <p class="eyebrow">详情页</p>
      <div class="detail-meta">
        <img src="${item.image}" alt="${item.title}">
        <div>
          <h1>${item.title}</h1>
          <p>${item.summary}</p>
          <p>所属展馆：${getCategoryMeta(item.category).title}</p>
          <a class="btn btn--secondary" href="${getCategoryPage(item.category)}">继续浏览同馆</a>
        </div>
      </div>
    `;

    body.innerHTML = `
      <div class="detail-sections">
        <section>
          <h2>历史渊源</h2>
          <p>${item.history}</p>
        </section>
        <section>
          <h2>工艺特点</h2>
          <p>${item.feature}</p>
        </section>
        <section>
          <h2>传承价值</h2>
          <p>${item.value}</p>
        </section>
      </div>
    `;

    video.innerHTML = `
      <h2>视频演示</h2>
      <p>点击按钮打开外部视频，查看制作工序或舞台片段。</p>
      <a class="video-link" href="${item.video}" target="_blank" rel="noreferrer">打开演示视频</a>
    `;

    related.innerHTML = `
      <h2>相关项目</h2>
      <div class="related-grid">
        ${window.heritageData.getRelatedProjects(id).map((entry) => `
          <article class="exhibit-card">
            <h3>${entry.title}</h3>
            <p>${entry.summary}</p>
            <a class="btn btn--secondary" href="${entry.detailPage}">继续浏览</a>
          </article>
        `).join("")}
      </div>
    `;
  }

  const api = {
    paginate,
    getTotalPages,
    getCategoryMeta,
    buildPreviewHtml,
    renderCategoryPage,
    renderDetailPage
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritagePager = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          renderCategoryPage();
          renderDetailPage();
        });
      } else {
        renderCategoryPage();
        renderDetailPage();
      }
    }
  }
})();