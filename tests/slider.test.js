const test = require("node:test");
const assert = require("node:assert/strict");
const sliderApi = require("../assets/js/slider.js");

test("nextIndex wraps to zero after the last slide", () => {
  assert.equal(sliderApi.nextIndex(2, 3), 0);
});

test("previousIndex wraps to the last slide before zero", () => {
  assert.equal(sliderApi.previousIndex(0, 3), 2);
});

test("each hero slide points to its own exhibition page", () => {
  assert.deepEqual(
    sliderApi.slides.map((slide) => slide.page),
    [
      "category-tradition.html",
      "category-opera.html",
      "category-handcraft.html"
    ]
  );
});

test("each hero slide uses a category-specific call-to-action label", () => {
  assert.deepEqual(
    sliderApi.slides.map((slide) => slide.buttonLabel),
    [
      "进入传统技艺馆",
      "进入戏曲馆",
      "进入手工馆"
    ]
  );
});

test("hero markup keeps dots but removes previous next buttons", () => {
  const html = sliderApi.buildHeroMarkup();
  assert.doesNotMatch(html, /heroPrev/);
  assert.doesNotMatch(html, /heroNext/);
  assert.match(html, /hero-dots/);
});
