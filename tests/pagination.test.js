const test = require("node:test");
const assert = require("node:assert/strict");
const pagerApi = require("../assets/js/pagination.js");

test("paginate returns the correct slice for page two", () => {
  const items = [1, 2, 3];
  assert.deepEqual(pagerApi.paginate(items, 2, 2), [3]);
});

test("getTotalPages rounds up for odd item counts", () => {
  assert.equal(pagerApi.getTotalPages(3, 2), 2);
});
