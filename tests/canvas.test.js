const test = require("node:test");
const assert = require("node:assert/strict");
const canvasApi = require("../assets/js/canvas.js");

test("getBrushSize clamps brush values to a practical range", () => {
  assert.equal(canvasApi.getBrushSize("1"), 2);
  assert.equal(canvasApi.getBrushSize("12"), 12);
  assert.equal(canvasApi.getBrushSize("42"), 24);
});

test("getMaskColors exposes the opera palette", () => {
  assert.deepEqual(
    canvasApi.getMaskColors().map((item) => item.value),
    ["#b44b3f", "#1f4d4f", "#d8b25a", "#2f3f63", "#101010"]
  );
});

test("getCanvasPoint scales pointer coordinates to canvas pixels", () => {
  const point = canvasApi.getCanvasPoint(
    { clientX: 230, clientY: 125 },
    { left: 0, top: 0, width: 460, height: 250 },
    { width: 920, height: 500 }
  );

  assert.deepEqual(point, { x: 460, y: 250 });
});

test("createMaskSegments returns symmetrical segments", () => {
  const segments = canvasApi.createMaskSegments(400, 400);
  assert.equal(segments.length > 0, true);
  assert.equal(segments[0].left.x + segments[0].right.x, 400);
});
