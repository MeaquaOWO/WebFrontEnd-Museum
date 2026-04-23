(function () {
  const base = {
    endpoint: "https://api.siliconflow.cn/v1/chat/completions",
    model: "Qwen/Qwen3-8B",
    apiKey: "",
    temperature: 0.7,
    maxTokens: 260
  };

  if (typeof window !== "undefined") {
    window.HERITAGE_AI_CONFIG = Object.assign({}, base, window.HERITAGE_AI_CONFIG || {});

    window.heritageAiConfigReady = new Promise((resolve) => {
      if (typeof document === "undefined") {
        resolve(window.HERITAGE_AI_CONFIG);
        return;
      }

      const script = document.createElement("script");
      script.src = "assets/js/assistant-config.local.js";
      script.onload = function () {
        resolve(window.HERITAGE_AI_CONFIG);
      };
      script.onerror = function () {
        resolve(window.HERITAGE_AI_CONFIG);
      };
      document.head.appendChild(script);
    });
  }
})();
