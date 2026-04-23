(function () {
  const USERNAME_KEY = "heritage.username";
  const COLLECTION_KEY = "heritage.collection";
  const MESSAGE_KEY = "heritage.messages";

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function getUsername(storage) {
    return ((storage && storage.getItem(USERNAME_KEY)) || "").trim();
  }

  function setUsername(storage, username) {
    storage.setItem(USERNAME_KEY, String(username).trim());
  }

  function clearUsername(storage) {
    storage.removeItem(USERNAME_KEY);
  }

  function readCollection(storage) {
    return safeParse(storage.getItem(COLLECTION_KEY), []);
  }

  function saveCollection(storage, items) {
    storage.setItem(COLLECTION_KEY, JSON.stringify(items));
  }

  function addCollectionItem(storage, item) {
    const current = readCollection(storage);
    if (current.some((entry) => entry.id === item.id)) {
      return current;
    }
    const next = current.concat(item);
    saveCollection(storage, next);
    return next;
  }

  function removeCollectionItem(storage, itemId) {
    const current = readCollection(storage);
    const next = current.filter((entry) => entry.id !== itemId);
    saveCollection(storage, next);
    return next;
  }

  function readMessages(storage) {
    return safeParse(storage.getItem(MESSAGE_KEY), []);
  }

  function saveMessages(storage, messages) {
    storage.setItem(MESSAGE_KEY, JSON.stringify(messages));
  }

  function updateUsernameUI() {
    if (typeof document === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    const target = document.querySelector("[data-username]");
    if (!target) {
      return;
    }

    const username = getUsername(localStorage);
    target.textContent = username ? `欢迎你，${username}` : "未登录访客";
  }

  function updateCollectionBadge() {
    if (typeof document === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    const target = document.querySelector("[data-collection-count]");
    if (!target) {
      return;
    }

    target.textContent = String(readCollection(localStorage).length);
  }

  function highlightNav() {
    if (typeof document === "undefined") {
      return;
    }

    const currentPage = document.body.getAttribute("data-page");
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const active = link.getAttribute("data-nav") === currentPage;
      link.classList.toggle("is-active", active);
    });
  }

  function bindLogout() {
    if (typeof document === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    const trigger = document.querySelector("[data-logout]");
    if (!trigger || trigger.dataset.logoutReady === "true") {
      return;
    }

    trigger.dataset.logoutReady = "true";
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      clearUsername(localStorage);
      window.location.href = "login.html";
    });
  }

  function hydrateCommonUI() {
    highlightNav();
    updateUsernameUI();
    updateCollectionBadge();
    bindLogout();
  }

  const api = {
    USERNAME_KEY,
    COLLECTION_KEY,
    MESSAGE_KEY,
    getUsername,
    setUsername,
    clearUsername,
    readCollection,
    saveCollection,
    addCollectionItem,
    removeCollectionItem,
    readMessages,
    saveMessages,
    hydrateCommonUI
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageCommon = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hydrateCommonUI);
      } else {
        hydrateCommonUI();
      }
    }
  }
})();