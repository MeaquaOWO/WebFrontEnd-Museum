const test = require("node:test");
const assert = require("node:assert/strict");
const aiApi = require("../assets/js/assistant.js");

test("getQuickAsks returns preset heritage questions", () => {
  assert.deepEqual(aiApi.getQuickAsks().slice(0, 3), [
    "剪纸的起源是什么？",
    "京剧脸谱颜色代表什么？",
    "苏绣为什么这么细腻？"
  ]);
});

test("getAiConfig keeps the SiliconFlow endpoint and merges custom config", () => {
  const cfg = aiApi.getAiConfig({
    apiKey: "sk-demo",
    model: "Qwen/Qwen3-8B"
  });

  assert.equal(cfg.endpoint, "https://api.siliconflow.cn/v1/chat/completions");
  assert.equal(cfg.apiKey, "sk-demo");
  assert.equal(cfg.model, "Qwen/Qwen3-8B");
});

test("buildChatPayload keeps the system prompt and trims message count", () => {
  const history = [
    { role: "user", content: "1" },
    { role: "assistant", content: "2" },
    { role: "user", content: "3" },
    { role: "assistant", content: "4" },
    { role: "user", content: "5" },
    { role: "assistant", content: "6" },
    { role: "user", content: "7" },
    { role: "assistant", content: "8" },
    { role: "user", content: "9" }
  ];
  const body = aiApi.buildChatPayload(
    aiApi.getAiConfig({ model: "Qwen/Qwen3-8B" }),
    history,
    "最后一个问题"
  );

  assert.equal(body.model, "Qwen/Qwen3-8B");
  assert.equal(body.enable_thinking, false);
  assert.match(body.messages[0].content, /非遗|展览馆|讲解/);
  assert.ok(body.messages.length <= 10);
  assert.deepEqual(body.messages.at(-1), { role: "user", content: "最后一个问题" });
});

test("pickReplyText extracts assistant content from a SiliconFlow response", () => {
  const text = aiApi.pickReplyText({
    choices: [
      {
        message: {
          role: "assistant",
          content: "这是接口返回的回答。"
        }
      }
    ]
  });

  assert.equal(text, "这是接口返回的回答。");
});

test("matchReply returns a themed answer for known opera prompts", () => {
  const reply = aiApi.matchReply("京剧脸谱颜色代表什么？");
  assert.match(reply, /忠勇|沉稳|刚直/);
});

test("matchReply falls back to a generic guide for unknown questions", () => {
  const reply = aiApi.matchReply("今天馆里有什么新的活动？");
  assert.match(reply, /可以先从|首页|分类页|详情页/);
});
