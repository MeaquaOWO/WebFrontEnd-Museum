(function () {
  function validateLogin(username, password) {
    const cleanUsername = String(username || "").trim();
    const cleanPassword = String(password || "").trim();

    if (cleanUsername.length < 2 || cleanUsername.length > 12) {
      return { ok: false, message: "用户名长度需为 2 到 12 位。" };
    }

    if (cleanPassword.length < 6 || cleanPassword.length > 16) {
      return { ok: false, message: "密码长度需为 6 到 16 位。" };
    }

    return { ok: true, message: "登录成功，正在进入展馆。" };
  }

  function bindLoginForm() {
    if (typeof document === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    const form = document.getElementById("loginForm");
    const feedback = document.getElementById("loginFeedback");
    if (!form || !feedback) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const result = validateLogin(username, password);
      feedback.textContent = result.message;
      feedback.style.color = result.ok ? "#1f4d4f" : "#b44b3f";

      if (result.ok) {
        window.heritageCommon.setUsername(localStorage, username);
        setTimeout(function () {
          window.location.href = "index.html";
        }, 500);
      }
    });
  }

  const api = {
    validateLogin,
    bindLoginForm
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageLogin = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindLoginForm);
      } else {
        bindLoginForm();
      }
    }
  }
})();
