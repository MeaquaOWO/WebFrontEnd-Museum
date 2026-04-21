const test = require("node:test");
const assert = require("node:assert/strict");
const dataApi = require("../assets/js/data.js");

test("dataset contains twelve projects across four categories", () => {
  assert.equal(dataApi.projects.length, 12);
  assert.deepEqual(
    [...new Set(dataApi.projects.map((item) => item.category))].sort(),
    ["folk", "handcraft", "opera", "tradition"]
  );
});

test("getProjectsByCategory returns three records for opera", () => {
  assert.equal(dataApi.getProjectsByCategory("opera").length, 3);
});

test("related projects never contain the current project", () => {
  const related = dataApi.getRelatedProjects("jingju");
  assert.equal(related.some((item) => item.id === "jingju"), false);
  assert.equal(related.length, 2);
});
