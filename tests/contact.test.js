const test = require("node:test");
const assert = require("node:assert/strict");
const contactApi = require("../assets/js/contact.js");

test("validateContact rejects malformed email", () => {
  const result = contactApi.validateContact({
    name: "许同学",
    email: "wrong",
    phone: "13800000000",
    message: "我想了解昆曲的演出资料。"
  });
  assert.equal(result.ok, false);
  assert.equal(result.message, "请输入正确的邮箱地址。");
});

test("validateContact accepts valid input", () => {
  const result = contactApi.validateContact({
    name: "许同学",
    email: "xu@example.com",
    phone: "13800000000",
    message: "我想了解昆曲的演出资料。"
  });
  assert.equal(result.ok, true);
});
