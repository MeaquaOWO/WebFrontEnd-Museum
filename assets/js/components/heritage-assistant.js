class HeritageAssistant extends HTMLElement {
  constructor() {
    super();
    this.history = [];
    this.busy = false;
    this.sys = "你是锦绣非遗数字展览馆里的讲解助手。请用简洁自然的中文回答，优先围绕传统技艺、民俗、戏曲、手工四类非遗介绍起源、工艺、寓意、观看路线，不要编造不存在的馆内活动。";
    this.lib = [
      {
        keys: ["剪纸", "起源"],
        text: "剪纸最早和节庆、祈福、窗饰传统紧密相关，常见于春节和婚俗场景。它通过折剪和镂空，把吉祥寓意转成直观图样。"
      },
      {
        keys: ["脸谱", "颜色"],
        text: "京剧脸谱常用颜色来提示人物性格。红色多指忠勇，黑色偏沉稳刚直，白色往往用于复杂或多疑角色，金银色则常见于神怪人物。"
      },
      {
        keys: ["苏绣"],
        text: "苏绣的细腻感来自丝线分劈、针法控制和过渡配色。绣者会把一根丝线拆成更细的线，再用平针、乱针等方法处理光影层次。"
      },
      {
        keys: ["节气"],
        text: "二十四节气本来就是把自然变化转成生活秩序的系统。它既指导农事安排，也影响饮食、节俗和日常起居。"
      },
      {
        keys: ["青瓷"],
        text: "龙泉青瓷最关键的是胎釉配合和烧成火候。梅子青、粉青等釉色变化，往往要靠窑温和还原气氛精准控制。"
      }
    ];
    this.asks = [
      "剪纸的起源是什么？",
      "京剧脸谱颜色代表什么？",
      "苏绣为什么这么细腻？",
      "二十四节气和生活有什么关系？"
    ];
    this.aiConfig = {
      endpoint: "https://api.siliconflow.cn/v1/chat/completions",
      model: "Qwen/Qwen3-8B",
      apiKey: "",
      temperature: 0.7,
      maxTokens: 260
    }
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  buildChatPayload(history, question) {
    const list = history.filter((item) => item && /^(user|assistant)$/.test(item.role) && item.content).slice(-8)

    return {
      model: this.aiConfig.model,
      stream: false,
      enable_thinking: false,
      temperature: this.aiConfig.temperature,
      max_tokens: this.aiConfig.maxTokens,
      messages: [
        { role: "system", content: this.sys },
        ...list,
        { role: "user", content: "(回答不超过150字)" + question }
      ]
    };
  }

  matchReply(text) {
    const hit = this.lib.find((item) => item.keys.every((key) => text.includes(key)) || item.keys.some((key) => text.includes(key)));
    if (hit) {
      return hit.text;
    }

    return "这个问题我暂时没有更细的馆藏答案。可以先从首页推荐区进入分类页，再打开对应详情页和视频演示继续看。";
  }

  addMsg(role, text) {
    const chat = this.querySelector("#aiChat");
    if (!chat) return;

    const item = document.createElement("div");
    item.className = `ai-msg ai-msg--${role}`;
    item.textContent = text;
    chat.appendChild(item);
    chat.scrollTop = chat.scrollHeight;
    return item;
  }

  typeMsg(node, text) {
    let i = 0;
    node.textContent = "";
    const timer = setInterval(() => {
      i += 1;
      node.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, 22);
  }

  async askSiliconFlow(history, text) {
    const response = await fetch(this.aiConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.aiConfig.apiKey}`
      },
      body: JSON.stringify(this.buildChatPayload(history, text))
    });

    if (!response.ok) {
      throw new Error(`请求错误：${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    const reply = data.choices[0].message.content.trim();

    return reply;
  }

  async submitAsk(text) {
    if (!text.trim()) return;
    const input = this.querySelector("#aiInput");
    const btn = this.querySelector("#aiForm button");
    const chat = this.querySelector("#aiChat");

    this.busy = true;
    input.disabled = true;
    btn.disabled = true;

    this.addMsg("user", text);
    this.history.push({ role: "user", content: text });

    const bot = this.addMsg("bot", "");

    try {
      let reply = "";

      if (this.aiConfig.apiKey) {
        reply = await this.askSiliconFlow(this.history.slice(0, -1), text);
      } else {
        reply = this.matchReply(text);
      }

      this.history.push({ role: "assistant", content: reply });
      this.typeMsg(bot, reply);
    } catch (error) {
      const reply = this.matchReply(text);
      this.history.push({ role: "assistant", content: reply });
      this.typeMsg(bot, reply);
    } finally {
      this.busy = false;
      if (input) {
        input.disabled = false;
        input.value = "";
        input.focus();
      }
      btn.disabled = false;
    }
  }

  bindEvents() {
    const form = this.querySelector("#aiForm");
    const asks = this.querySelectorAll("[data-ask]");

    asks.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.submitAsk(btn.getAttribute("data-ask"));
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = this.querySelector("#aiInput");
      if (input) {
        this.submitAsk(input.value);
      }
    });

    this.addMsg("bot", "你好，我是非遗小助手。你可以从脸谱、节气、剪纸、苏绣这些主题开始提问。");
  }

  render() {
    this.innerHTML = `
      <div class="panel ai-box">
        <div class="ai-head">
          <div>
            <p class="eyebrow">展馆问答</p>
            <h2 class="section-title">非遗小助手</h2>
            <p>想先了解起源、工艺或颜色寓意，可以从下面的问题直接开始。</p>
          </div>
        </div>
        <div class="ai-asks">
          ${this.asks.map((item) => `<button type="button" data-ask="${item}">${item}</button>`).join("")}
        </div>
        <div id="aiChat" class="ai-chat" aria-live="polite"></div>
        <form id="aiForm" class="ai-form">
          <input id="aiInput" type="text" placeholder="例如：京剧脸谱颜色代表什么？">
          <button type="submit" class="btn">发送</button>
        </form>
      </div>
    `;
  }
}

customElements.define("heritage-assistant", HeritageAssistant);