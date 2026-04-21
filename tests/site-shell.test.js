const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const requiredPaths = [
  "index.html",
  "login.html",
  "contact.html",
  "category-tradition.html",
  "category-folk.html",
  "category-opera.html",
  "category-handcraft.html",
  "detail-celadon.html",
  "detail-xuanzhi.html",
  "detail-blueprint.html",
  "detail-spring-festival.html",
  "detail-dragon-boat.html",
  "detail-solar-terms.html",
  "detail-kunqu.html",
  "detail-jingju.html",
  "detail-yueju.html",
  "detail-paper-cut.html",
  "detail-suxiu.html",
  "detail-bamboo-weaving.html",
  "assets/css/global.css",
  "assets/css/home.css",
  "assets/css/subpage.css",
  "assets/js/data.js",
  "assets/js/common.js",
  "assets/js/login.js",
  "assets/js/slider.js",
  "assets/js/drag.js",
  "assets/js/canvas.js",
  "assets/js/pagination.js",
  "assets/js/contact.js",
  "tests/data.test.js",
  "tests/common.test.js",
  "tests/login.test.js",
  "tests/slider.test.js",
  "tests/drag.test.js",
  "tests/canvas.test.js",
  "tests/pagination.test.js",
  "tests/contact.test.js"
];

test("project scaffold contains every required file", () => {
  requiredPaths.forEach((relativePath) => {
    const fullPath = path.join(root, relativePath);
    assert.ok(fs.existsSync(fullPath), `${relativePath} should exist`);
  });
});

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("home page wires global and home assets", () => {
  const html = read("index.html");
  assert.match(html, /assets\/css\/global\.css/);
  assert.match(html, /assets\/css\/home\.css/);
  assert.match(html, /assets\/js\/common\.js/);
  assert.match(html, /data-page="home"/);
  assert.match(html, /id="floatingGuide"/);
  assert.match(html, /id="collectionDropzone"/);
});

test("login and contact pages expose forms for validation", () => {
  assert.match(read("login.html"), /id="loginForm"/);
  assert.match(read("contact.html"), /id="contactForm"/);
});

test("category pages expose category metadata", () => {
  assert.match(read("category-opera.html"), /data-category="opera"/);
  assert.match(read("category-tradition.html"), /data-category="tradition"/);
});

test("detail pages expose project metadata", () => {
  assert.match(read("detail-jingju.html"), /data-detail-id="jingju"/);
  assert.match(read("detail-paper-cut.html"), /data-detail-id="paper-cut"/);
});

test("banner and project svg assets exist", () => {
  [
    "assets/images/banners/banner-1.svg",
    "assets/images/banners/banner-2.svg",
    "assets/images/banners/banner-3.svg",
    "assets/images/categories/opera.svg",
    "assets/images/projects/celadon.svg",
    "assets/images/projects/jingju.svg",
    "assets/images/projects/paper-cut.svg"
  ].forEach((relativePath) => {
    const fullPath = path.join(root, relativePath);
    assert.ok(fs.existsSync(fullPath), `${relativePath} should exist`);
  });
});
