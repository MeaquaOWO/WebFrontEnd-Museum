(function () {
  const USERNAME_KEY = "heritage.username";

  function getUsername() {
    try {
      return localStorage.getItem(USERNAME_KEY) || "";
    } catch {
      return "";
    }
  }

  function checkAuth() {
    const username = getUsername();
    if (!username) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  if (typeof window !== "undefined") {
    window.authGuard = { checkAuth };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAuth);
  } else {
    checkAuth();
  }
})();