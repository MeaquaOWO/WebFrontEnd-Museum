(function () {
  function paginate(items, page, size) {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
  }

  function getTotalPages(totalItems, size) {
    return Math.ceil(totalItems / size);
  }

  function renderCategoryPage() {
    if (typeof document === "undefined" || !window.heritageData) {
      return;
    }

    const category = document.body.getAttribute("data-category");
    const listRoot = document.getElementById("categoryList");
    const pagerRoot = document.getElementById("pager");
    const heroRoot = document.querySelector(".subpage-hero");
    if (!category || !listRoot || !pagerRoot || !heroRoot) {
      return;
    }

    const meta = {
      tradition: {
        title: "传统技艺馆",
        image: "assets/images/categories/tradition.svg",
        text: "观看火候、纸墨、染色与器物之美。"
      },
      folk: {
        title: "民俗馆",
        image: "assets/images/categories/folk.svg",
        text: "从节令礼俗和生活秩序理解民俗传统。"
      },
      opera: {
        title: "戏曲馆",
        image: "assets/images/categories/opera.svg",
        text: "在唱腔、程式和脸谱中走近戏台世界。"
      },
      handcraft: {
        title: "手工馆",
        image: "assets/images/categories/handcraft.svg",
        text: "看见针脚、剪纸和竹编中的手工温度。"
      }
    };
    const info = meta[category];
    const items = window.heritageData.getProjectsByCategory(category);
    let currentPage = 1;
    const pageSize = 2;
    const totalPages = getTotalPages(items.length, pageSize);

    heroRoot.innerHTML = `
      <p class="eyebrow">分类展馆</p>
      <div class="detail-meta">
        <img src="${info.image}" alt="${info.title}">
        <div>
          <h1>${info.title}</h1>
          <p>${info.text}</p>
          <p>本页支持分页导航与拖拽加入收藏馆。</p>
        </div>
      </div>
    `;

    function draw() {
      const pageItems = paginate(items, currentPage, pageSize);
      listRoot.innerHTML = pageItems.map((item) => `
        <article class="exhibit-card" draggable="true" data-drag-id="${item.id}">
          <img src="${item.image}" alt="${item.title}">
          <h2>${item.title}</h2>
          <p>${item.summary}</p>
          <a class="btn btn--secondary" href="${item.detailPage}">查看详情</a>
        </article>
      `).join("");

      pagerRoot.innerHTML = `
        <button type="button" id="pagePrev" ${currentPage === 1 ? "disabled" : ""}>上一页</button>
        ${Array.from({ length: totalPages }, (_, index) => `
          <button type="button" data-page="${index + 1}" class="${index + 1 === currentPage ? "is-active" : ""}">
            ${index + 1}
          </button>
        `).join("")}
        <button type="button" id="pageNext" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>
      `;

      const prev = document.getElementById("pagePrev");
      const next = document.getElementById("pageNext");
      if (prev) {
        prev.addEventListener("click", function () {
          currentPage -= 1;
          draw();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          currentPage += 1;
          draw();
        });
      }
      pagerRoot.querySelectorAll("[data-page]").forEach((button) => {
        button.addEventListener("click", function () {
          currentPage = Number(button.getAttribute("data-page"));
          draw();
        });
      });

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
      <p class="eyebrow">项目详情</p>
      <div class="detail-meta">
        <img src="${item.image}" alt="${item.title}">
        <div>
          <h1>${item.title}</h1>
          <p>${item.summary}</p>
          <p>所属分类：${item.category === "tradition" ? "传统技艺" : item.category === "folk" ? "民俗" : item.category === "opera" ? "戏曲" : "手工"}</p>
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
          <h2>技艺特点</h2>
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
      <p>点击按钮跳转到项目视频，查看技艺演示或舞台片段。</p>
      <a class="video-link" href="${item.video}" target="_blank" rel="noreferrer">打开演示视频</a>
    `;

    related.innerHTML = `
      <h2>同类推荐</h2>
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
