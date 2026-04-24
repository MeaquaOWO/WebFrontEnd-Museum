class HeritageContact extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  validate(values) {
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

  getMessages() {
    try {
      const data = localStorage.getItem("heritage.messages");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMessages(messages) {
    localStorage.setItem("heritage.messages", JSON.stringify(messages));
  }

  drawMessages() {
    const historyRoot = document.getElementById("messageHistory");
    if (!historyRoot) return;

    const messages = this.getMessages();
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

  bindEvents() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("contactFeedback");

    this.drawMessages();

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = {
        name: document.getElementById("contactName")?.value.trim() || "",
        email: document.getElementById("contactEmail")?.value.trim() || "",
        phone: document.getElementById("contactPhone")?.value.trim() || "",
        message: document.getElementById("contactMessage")?.value.trim() || ""
      };

      const { ok, message } = this.validate(values);
      feedback.textContent = message;
      feedback.style.color = ok ? "#1f4d4f" : "#b44b3f";
      if (!ok) {
        return;
      }

      values.time = new Date().toLocaleString("zh-CN", { hour12: false });
      this.saveMessages([
        values,
        ...this.getMessages(),
      ]);
      form.reset();
      this.drawMessages();
    });
  }

  render() {
    this.hidden = true;
    const templateDom = document.createElement("template");
    this.parentElement.insertBefore(templateDom, this);
    templateDom.outerHTML = `
      <section class="panel form-card">
        <p class="eyebrow">留言板</p>
        <h2>留下你的观展建议</h2>
        <form id="contactForm">
          <div class="field">
            <label for="contactName">姓名</label>
            <input id="contactName" type="text" placeholder="请输入姓名">
          </div>
          <div class="field">
            <label for="contactEmail">邮箱</label>
            <input id="contactEmail" type="email" placeholder="请输入邮箱">
          </div>
          <div class="field">
            <label for="contactPhone">手机号</label>
            <input id="contactPhone" type="tel" placeholder="请输入 11 位手机号">
          </div>
          <div class="field">
            <label for="contactMessage">留言</label>
            <textarea id="contactMessage" rows="6" placeholder="请填写你的留言内容"></textarea>
          </div>
          <p id="contactFeedback" class="feedback" aria-live="polite"></p>
          <button type="submit" class="btn">提交留言</button>
        </form>
      </section>
      <section id="messageHistory" class="panel detail-card message-history"></section>
    `;
  }
}

customElements.define("heritage-contact", HeritageContact);