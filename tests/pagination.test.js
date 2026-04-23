const test = require("node:test");
const assert = require("node:assert/strict");
const pagerApi = require("../assets/js/pagination.js");
const dataApi = require("../assets/js/data.js");

test("paginate returns the correct slice for page two", () => {
  const items = [1, 2, 3];
  assert.deepEqual(pagerApi.paginate(items, 2, 2), [3]);
});

test("getTotalPages rounds up for odd item counts", () => {
  assert.equal(pagerApi.getTotalPages(3, 2), 2);
});

test("getCategoryMeta exposes the current exhibition heading", () => {
  assert.equal(pagerApi.getCategoryMeta("opera").title, "戏曲馆");
});

test("buildPreviewHtml renders quick preview actions", () => {
  const html = pagerApi.buildPreviewHtml(dataApi.getProjectById("jingju"));
  assert.match(html, /打开演示视频/);
  assert.match(html, /查看完整详情/);
});
