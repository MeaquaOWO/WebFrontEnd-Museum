(function () {
  function getGuideLinks() {
    return [
      { href: "#hero", label: "卷首导览" },
      { href: "#featuredExhibits", label: "精选展品" },
      { href: "#heritageStudio", label: "互动创作" }
    ];
  }

  function addUniqueItem(collection, item) {
    return collection.some((entry) => entry.id === item.id) ? collection : collection.concat(item);
  }

  function renderCollection(target, items) {
    if (!target) {
      return;
    }

    target.innerHTML = items.length
      ? `<ul>${items.map((item) => `<li>${item.title}</li>`).join("")}</ul>`
      : "<p>将展品拖入这里，生成你的收藏馆。</p>";
  }

  function renderFloatingGuide() {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.getElementById("floatingGuide");
    if (!root) {
      return;
    }

    root.innerHTML = `
      <h2>侧边展品导览</h2>
      <ul>
        ${getGuideLinks().map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join("")}
      </ul>
      <p>滚动页面时仍可快速跳转到重点展区。</p>
    `;
  }

  function renderFeaturedExhibits() {
    const root = document.getElementById("featuredExhibits");
    if (!root || !window.heritageData) {
      return;
    }

    const featured = [
      "celadon",
      "spring-festival",
      "jingju",
      "paper-cut"
    ].map((id) => window.heritageData.getProjectById(id)).filter(Boolean);

    root.innerHTML = `
      <div style="padding: 28px;">
        <p class="eyebrow">精选展品</p>
        <h2 class="section-title">拖动展品进入收藏馆</h2>
        <div class="featured-grid">
          ${featured.map((item) => `
            <article class="exhibit-card" draggable="true" data-drag-id="${item.id}">
              <img src="${item.image}" alt="${item.title}">
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
              <a class="btn btn--secondary" href="${item.detailPage}">查看详情</a>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  function getDropzone() {
    return document.getElementById("collectionDropzone") || document.getElementById("miniCollection");
  }

  function getListRoot() {
    return document.getElementById("collectionList") || document.getElementById("miniCollection");
  }

  function ensureCollectionBox() {
    const dropzone = document.getElementById("collectionDropzone");
    if (!dropzone) {
      return;
    }

    dropzone.innerHTML = `
      <h2 class="section-title">我的收藏馆</h2>
      <p>把你感兴趣的展品拖拽到这里，生成个人观展路线。</p>
      <div id="collectionList" class="collection-list"></div>
    `;
  }

  function wireCards() {
    document.querySelectorAll("[data-drag-id]").forEach((card) => {
      if (card.dataset.dragReady === "true") {
        return;
      }

      card.dataset.dragReady = "true";
      card.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", card.getAttribute("data-drag-id"));
      });
    });
  }

  function wireDropTarget() {
    const dropzone = getDropzone();
    if (!dropzone || dropzone.dataset.dropReady === "true") {
      return;
    }

    dropzone.dataset.dropReady = "true";
    dropzone.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    dropzone.addEventListener("drop", function (event) {
      event.preventDefault();
      const id = event.dataTransfer.getData("text/plain");
      const item = window.heritageData.getProjectById(id);
      if (!item) {
        return;
      }

      const next = addUniqueItem(window.heritageCommon.readCollection(localStorage), item);
      window.heritageCommon.saveCollection(localStorage, next);
      renderCollection(getListRoot(), next);
      window.heritageCommon.hydrateCommonUI();
    });
  }

  function bindCollection() {
    if (typeof document === "undefined" || typeof localStorage === "undefined" || !window.heritageCommon) {
      return;
    }

    renderFloatingGuide();
    renderFeaturedExhibits();
    ensureCollectionBox();
    renderCollection(getListRoot(), window.heritageCommon.readCollection(localStorage));
    wireCards();
    wireDropTarget();
  }

  const api = {
    getGuideLinks,
    addUniqueItem,
    renderCollection,
    renderFloatingGuide,
    bindCollection
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageDrag = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindCollection);
      } else {
        bindCollection();
      }
    }
  }
})();
