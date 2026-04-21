const test = require("node:test");
const assert = require("node:assert/strict");
const commonApi = require("../assets/js/common.js");

function createStorage() {
  const state = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(state, key) ? state[key] : null;
    },
    setItem(key, value) {
      state[key] = String(value);
    },
    removeItem(key) {
      delete state[key];
    }
  };
}

test("username helpers round-trip the saved name", () => {
  const storage = createStorage();
  commonApi.setUsername(storage, "许同学");
  assert.equal(commonApi.getUsername(storage), "许同学");
  commonApi.clearUsername(storage);
  assert.equal(commonApi.getUsername(storage), "");
});

test("collection helpers deduplicate by id", () => {
  const storage = createStorage();
  commonApi.saveCollection(storage, [{ id: "jingju" }]);
  commonApi.addCollectionItem(storage, { id: "jingju", title: "京剧" });
  commonApi.addCollectionItem(storage, { id: "kunqu", title: "昆曲" });
  assert.deepEqual(
    commonApi.readCollection(storage).map((item) => item.id),
    ["jingju", "kunqu"]
  );
});
