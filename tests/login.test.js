const test = require("node:test");
const assert = require("node:assert/strict");
const loginApi = require("../assets/js/login.js");

test("validateLogin rejects empty username", () => {
  assert.deepEqual(loginApi.validateLogin("", "123456"), {
    ok: false,
    message: "用户名长度需为 2 到 12 位。"
  });
});

test("validateLogin rejects short password", () => {
  assert.deepEqual(loginApi.validateLogin("许同学", "123"), {
    ok: false,
    message: "密码长度需为 6 到 16 位。"
  });
});

test("validateLogin accepts valid credentials", () => {
  assert.deepEqual(loginApi.validateLogin("许同学", "123456"), {
    ok: true,
    message: "登录成功，正在进入展馆。"
  });
});
