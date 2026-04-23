(function () {
  const sys = "你是锦绣非遗数字展览馆里的讲解助手。请用简洁自然的中文回答，优先围绕传统技艺、民俗、戏曲、手工四类非遗介绍起源、工艺、寓意、观看路线，不要编造不存在的馆内活动。";
  const asks = [
    "剪纸的起源是什么？",
    "京剧脸谱颜色代表什么？",
    "苏绣为什么这么细腻？",
    "二十四节气和生活有什么关系？"
  ];

  const lib = [
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

  function getQuickAsks() {
    return asks.slice();
  }

  function getAiConfig(extra) {
    const base = {
      endpoint: "https://api.siliconflow.cn/v1/chat/completions",
      model: "Qwen/Qwen3-8B",
      apiKey: "",
      temperature: 0.7,
      maxTokens: 260
    };
    const winCfg = typeof window !== "undefined" && window.HERITAGE_AI_CONFIG
      ? window.HERITAGE_AI_CONFIG
      : {};
    const storeKey = typeof localStorage !== "undefined"
      ? localStorage.getItem("heritage_siliconflow_key") || ""
      : "";

    return Object.assign({}, base, winCfg, extra, {
      apiKey: (extra && extra.apiKey) || winCfg.apiKey || storeKey || ""
    });
  }

  function buildChatPayload(cfg, history, question) {
    const list = Array.isArray(history)
      ? history.filter((item) => item && /^(user|assistant)$/.test(item.role) && item.content).slice(-8)
      : [];

    return {
      model: cfg.model,
      stream: false,
      enable_thinking: false,
      temperature: cfg.temperature,
      max_tokens: cfg.maxTokens,
      messages: [
        { role: "system", content: sys }
      ].concat(list, [{ role: "user", content: String(question || "").trim() }])
    };
  }

  function pickReplyText(data) {
    const text = data
      && data.choices
      && data.choices[0]
      && data.choices[0].message
      && data.choices[0].message.content;

    if (typeof text === "string") {
      return text.trim();
    }

    if (Array.isArray(text)) {
      return text.map((item) => item && item.text ? item.text : "").join("").trim();
    }

    return "";
  }

  function matchReply(text) {
    const q = String(text || "").trim();
    if (!q) {
      return "可以先点上方猜你想问，也可以直接问某个非遗项目的起源、工艺或脸谱含义。";
    }

    const hit = lib.find((item) => item.keys.every((key) => q.includes(key)) || item.keys.some((key) => q.includes(key)));
    if (hit) {
      return hit.text;
    }

    return "这个问题我暂时没有更细的馆藏答案。可以先从首页推荐区进入分类页，再打开对应详情页和视频演示继续看。";
  }

  function updateMode(node, text) {
    if (node) {
      node.textContent = text;
    }
  }

  function addMsg(root, role, text) {
    const item = document.createElement("div");
    item.className = `ai-msg ai-msg--${role}`;
    item.textContent = text;
    root.appendChild(item);
    root.scrollTop = root.scrollHeight;
    return item;
  }

  function typeMsg(node, text) {
    let idx = 0;
    node.textContent = "";
    const timer = setInterval(function () {
      idx += 1;
      node.textContent = text.slice(0, idx);
      if (idx >= text.length) {
        clearInterval(timer);
      }
    }, 22);
  }

  function trimHistory(history) {
    if (history.length > 8) {
      history.splice(0, history.length - 8);
    }
  }

  async function askSiliconFlow(fetchImpl, cfg, history, text) {
    const response = await fetchImpl(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify(buildChatPayload(cfg, history, text))
    });

    if (!response.ok) {
      throw new Error(`siliconflow_${response.status}`);
    }

    const data = await response.json();
    const reply = pickReplyText(data);
    if (!reply) {
      throw new Error("siliconflow_empty");
    }

    return reply;
  }

  function bindAssistant() {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.getElementById("aiBox");
    if (!root) {
      return;
    }

    root.innerHTML = `
      <div class="ai-head">
        <div>
          <p class="eyebrow">展馆问答</p>
          <h2 class="section-title">非遗小助手</h2>
          <p>想先了解起源、工艺或颜色寓意，可以从下面的问题直接开始。</p>
        </div>
        <div class="ai-tips">
          <strong>对话模式</strong>
          <p id="aiMode" class="ai-mode">正在检查接口配置…</p>
        </div>
      </div>
      <div class="ai-asks">
        ${getQuickAsks().map((item) => `<button type="button" data-ask="${item}">${item}</button>`).join("")}
      </div>
      <div id="aiChat" class="ai-chat" aria-live="polite"></div>
      <form id="aiForm" class="ai-form">
        <input id="aiInput" type="text" placeholder="例如：京剧脸谱颜色代表什么？">
        <button type="submit" class="btn">发送</button>
      </form>
    `;

    const chat = document.getElementById("aiChat");
    const form = document.getElementById("aiForm");
    const input = document.getElementById("aiInput");
    const mode = document.getElementById("aiMode");
    const btn = form.querySelector("button");
    const history = [];
    let busy = false;

    addMsg(chat, "bot", "你好，我是非遗小助手。你可以从脸谱、节气、剪纸、苏绣这些主题开始提问。");
    updateMode(mode, getAiConfig().apiKey ? "已接入硅基流动实时问答" : "当前使用馆内问答库");

    async function submitAsk(text) {
      const q = String(text || "").trim();
      if (!q || busy) {
        return;
      }

      busy = true;
      input.disabled = true;
      btn.disabled = true;
      addMsg(chat, "user", q);
      history.push({ role: "user", content: q });
      trimHistory(history);
      const bot = addMsg(chat, "bot", "");

      try {
        if (typeof window !== "undefined" && window.heritageAiConfigReady) {
          await window.heritageAiConfigReady;
        }

        const cfg = getAiConfig();
        let reply = "";

        if (cfg.apiKey && typeof fetch === "function") {
          updateMode(mode, "已接入硅基流动实时问答");
          reply = await askSiliconFlow(fetch, cfg, history.slice(0, -1), q);
        } else {
          updateMode(mode, "当前使用馆内问答库");
          reply = matchReply(q);
        }

        history.push({ role: "assistant", content: reply });
        trimHistory(history);
        typeMsg(bot, reply);
      } catch (error) {
        const reply = `远程问答暂时不可用，先为你切换到馆内讲解：${matchReply(q)}`;
        history.push({ role: "assistant", content: reply });
        trimHistory(history);
        updateMode(mode, "远程问答暂不可用，已切换馆内问答");
        typeMsg(bot, reply);
      } finally {
        busy = false;
        input.disabled = false;
        btn.disabled = false;
        input.value = "";
        input.focus();
      }
    }

    root.querySelectorAll("[data-ask]").forEach((btn) => {
      btn.addEventListener("click", function () {
        submitAsk(btn.getAttribute("data-ask"));
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitAsk(input.value);
    });
  }

  const api = {
    getQuickAsks,
    getAiConfig,
    buildChatPayload,
    pickReplyText,
    matchReply,
    askSiliconFlow,
    bindAssistant
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageAi = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindAssistant);
      } else {
        bindAssistant();
      }
    }
  }
})();
