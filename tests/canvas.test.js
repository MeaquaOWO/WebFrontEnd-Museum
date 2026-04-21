const test = require("node:test");
const assert = require("node:assert/strict");
const canvasApi = require("../assets/js/canvas.js");

test("getBrushSize returns wider strokes for pattern mode", () => {
  assert.equal(canvasApi.getBrushSize("pattern"), 6);
  assert.equal(canvasApi.getBrushSize("mask"), 3);
});

test("createMaskSegments returns symmetrical segments", () => {
  const segments = canvasApi.createMaskSegments(400, 400);
  assert.equal(segments.length > 0, true);
  assert.equal(segments[0].left.x + segments[0].right.x, 400);
});
