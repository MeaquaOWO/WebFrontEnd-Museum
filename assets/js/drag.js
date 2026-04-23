(function () {
  function getGuideLinks() {
    return [
      { href: "#hero", label: "卷首导览" },
      { href: "#featuredExhibits", label: "精选展品" },
      { href: "expo.html", label: "博览" },
      { href: "workshop.html", label: "工坊" },
      { href: "library.html", label: "智库问答" }
    ];
  }

  function addUniqueItem(collection, item) {
    return collection.some((entry) => entry.id === item.id) ? collection : collection.concat(item);
  }

  function renderCollection(target, items) {
    if (!target) {
      return;
    }

    if (!items.length) {
      target.innerHTML = '<p class="side-empty">把感兴趣的展品拖到这里。</p>';
      return;
    }

    target.innerHTML = `
      <ul class="collection-items">
        ${items.map((item) => `
          <li class="collection-item" data-id="${item.id}">
            <span class="collection-item-title">${item.title}</span>
            <button type="button" class="collection-remove" aria-label="移除收藏">×</button>
          </li>
        `).join("")}
      </ul>
    `;

    target.querySelectorAll(".collection-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const item = btn.closest(".collection-item");
        const itemId = item.dataset.id;
        const next = window.heritageCommon.removeCollectionItem(localStorage, itemId);
        renderCollection(target, next);
      });
    });
  }

  function renderFloatingGuide() {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.getElementById("floatingGuide");
    if (!root) {
      return;
    }

    root.classList.add("panel--guide");
    root.innerHTML = `
      <p class="side-kicker">导览索引</p>
      <h2 class="side-title">导览</h2>
      <ul class="side-nav">
        ${getGuideLinks().map((item, idx) => `<li><a href="${item.href}"><span>0${idx + 1}</span>${item.label}</a></li>`).join("")}
      </ul>
    `;
  }

  function renderSideTabs() {
    const sideFix = document.querySelector(".side-fix");
    if (!sideFix) {
      return;
    }

    let tabsContainer = sideFix.querySelector(".side-fix__tabs");
    if (!tabsContainer) {
      tabsContainer = document.createElement("div");
      tabsContainer.className = "side-fix__tabs";
      sideFix.insertBefore(tabsContainer, sideFix.firstChild);
    }

    tabsContainer.innerHTML = `
      <button type="button" class="side-tab is-active" data-tab="guide">导览</button>
      <button type="button" class="side-tab" data-tab="collection">收藏馆</button>
    `;
  }

  function bindTabSwitch() {
    const sideFix = document.querySelector(".side-fix");
    if (!sideFix) {
      return;
    }

    const tabs = sideFix.querySelectorAll(".side-tab");
    const guidePanel = sideFix.querySelector(".panel--guide");
    const collectionPanel = sideFix.querySelector(".panel--collection");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabName = tab.dataset.tab;

        tabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        if (tabName === "guide") {
          guidePanel.classList.remove("hidden");
          collectionPanel.classList.add("hidden");
        } else {
          guidePanel.classList.add("hidden");
          collectionPanel.classList.remove("hidden");
        }
      });
    });
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
      <p class="eyebrow">推荐非遗概览</p>
      <h2 class="section-title">拖动展品加入你的收藏馆</h2>
      <p class="drag-note">把感兴趣的展品拖到右侧收藏馆，快速整理你的观展路线。</p>
      <div class="featured-grid">
        ${featured.map((item) => `
          <article class="exhibit-card" draggable="true" data-drag-id="${item.id}">
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <a class="btn btn--secondary" href="detail.html?id=${item.id}">查看详情</a>
          </article>
        `).join("")}
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

    dropzone.classList.add("panel--collection", "hidden");
    dropzone.innerHTML = `
      <p class="side-kicker">个人路线</p>
      <h2 class="side-title">我的收藏馆</h2>
      <p class="side-note">拖入展品后，这里会自动生成你的收藏清单。</p>
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
    renderSideTabs();
    bindTabSwitch();
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