const test = require("node:test");
const assert = require("node:assert/strict");
const dragApi = require("../assets/js/drag.js");

test("addUniqueItem appends only unseen exhibits", () => {
  assert.deepEqual(
    dragApi.addUniqueItem([{ id: "kunqu" }], { id: "kunqu" }).map((item) => item.id),
    ["kunqu"]
  );
  assert.deepEqual(
    dragApi.addUniqueItem([{ id: "kunqu" }], { id: "jingju" }).map((item) => item.id),
    ["kunqu", "jingju"]
  );
});

test("getGuideLinks exposes the three home navigation anchors", () => {
  assert.deepEqual(
    dragApi.getGuideLinks().map((item) => item.href),
    ["#hero", "#featuredExhibits", "#heritageStudio"]
  );
});
