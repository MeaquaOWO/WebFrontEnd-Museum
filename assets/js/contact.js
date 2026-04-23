(function () {
  function validateContact(values) {
    if (!values.name || values.name.trim().length < 2) {
      return { ok: false, message: "姓名至少需要 2 个字符。" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || "")) {
      return { ok: false, message: "请输入正确的邮箱地址。" };
    }
    if (!/^\d{11}$/.test(values.phone || "")) {
      return { ok: false, message: "请输入 11 位手机号。" };
    }
    if (!values.message || values.message.trim().length < 10) {
      return { ok: false, message: "留言内容至少需要 10 个字符。" };
    }
    return { ok: true, message: "留言提交成功，我们会将展馆信息发送给你。" };
  }

  function bindContactForm() {
    if (typeof document === "undefined" || typeof localStorage === "undefined" || !window.heritageCommon) {
      return;
    }

    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("contactFeedback");
    const historyRoot = document.getElementById("messageHistory");
    if (!form || !feedback || !historyRoot) {
      return;
    }

    function drawMessages() {
      const messages = window.heritageCommon.readMessages(localStorage);
      historyRoot.innerHTML = `
        <p class="eyebrow">留言墙</p>
        <h2>最近留言</h2>
        ${messages.length
          ? `<div class="message-list">${messages.map((item) => `
              <article class="msg-card">
                <h3>${item.name}</h3>
                <p>${item.message}</p>
                <span>${item.time || "刚刚留言"}</span>
              </article>
            `).join("")}</div>`
          : "<p>还没有新的留言记录。</p>"}
      `;
    }

    drawMessages();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const values = {
        name: document.getElementById("contactName").value.trim(),
        email: document.getElementById("contactEmail").value.trim(),
        phone: document.getElementById("contactPhone").value.trim(),
        message: document.getElementById("contactMessage").value.trim()
      };

      const result = validateContact(values);
      feedback.textContent = result.message;
      feedback.style.color = result.ok ? "#1f4d4f" : "#b44b3f";
      if (!result.ok) {
        return;
      }

      values.time = new Date().toLocaleString("zh-CN", {
        hour12: false
      });
      const next = [values].concat(window.heritageCommon.readMessages(localStorage)).slice(0, 6);
      window.heritageCommon.saveMessages(localStorage, next);
      form.reset();
      drawMessages();
    });
  }

  const api = {
    validateContact,
    bindContactForm
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageContact = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindContactForm);
      } else {
        bindContactForm();
      }
    }
  }
})();
