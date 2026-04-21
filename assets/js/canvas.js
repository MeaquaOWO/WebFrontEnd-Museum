(function () {
  function getBrushSize(mode) {
    return mode === "pattern" ? 6 : 3;
  }

  function createMaskSegments(width, height) {
    return [
      {
        left: { x: width * 0.34, y: height * 0.22 },
        right: { x: width * 0.66, y: height * 0.22 }
      },
      {
        left: { x: width * 0.28, y: height * 0.5 },
        right: { x: width * 0.72, y: height * 0.5 }
      },
      {
        left: { x: width * 0.38, y: height * 0.78 },
        right: { x: width * 0.62, y: height * 0.78 }
      }
    ];
  }

  function bindCanvasStudio() {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.getElementById("heritageStudio");
    if (!root) {
      return;
    }

    root.innerHTML = `
      <p class="eyebrow">Canvas 创作区</p>
      <h2 class="section-title">绘制非遗纹样 / 戏曲脸谱</h2>
      <div class="studio__toolbar">
        <button type="button" data-mode="pattern">非遗纹样</button>
        <button type="button" data-mode="mask">戏曲脸谱</button>
        <button type="button" id="clearCanvas">清空画布</button>
      </div>
      <canvas id="heritageCanvas" width="920" height="460"></canvas>
    `;

    const canvas = document.getElementById("heritageCanvas");
    const context = canvas.getContext("2d");
    let mode = "pattern";
    let drawing = false;

    function drawMaskBase() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#fffaf1";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#1f4d4f";
      context.lineWidth = 3;
      const segments = createMaskSegments(canvas.width, canvas.height);
      segments.forEach((segment) => {
        context.beginPath();
        context.moveTo(segment.left.x, segment.left.y);
        context.lineTo(segment.right.x, segment.right.y);
        context.stroke();
      });
      context.beginPath();
      context.ellipse(canvas.width / 2, canvas.height / 2, 120, 160, 0, 0, Math.PI * 2);
      context.stroke();
      context.font = "28px Songti SC";
      context.fillStyle = "#b44b3f";
      context.fillText("脸谱底稿", canvas.width / 2 - 54, 56);
    }

    function paintBackground() {
      context.fillStyle = "#fffaf1";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function pointerPosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    function start(event) {
      drawing = true;
      const point = pointerPosition(event);
      context.beginPath();
      context.moveTo(point.x, point.y);
    }

    function move(event) {
      if (!drawing) {
        return;
      }
      const point = pointerPosition(event);
      context.strokeStyle = mode === "pattern" ? "#1f4d4f" : "#b44b3f";
      context.lineWidth = getBrushSize(mode);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineTo(point.x, point.y);
      context.stroke();
    }

    function end() {
      drawing = false;
    }

    paintBackground();

    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointerleave", end);

    root.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", function () {
        mode = button.getAttribute("data-mode");
        if (mode === "mask") {
          drawMaskBase();
        } else {
          paintBackground();
        }
      });
    });

    root.querySelector("#clearCanvas").addEventListener("click", function () {
      if (mode === "mask") {
        drawMaskBase();
      } else {
        paintBackground();
      }
    });
  }

  const api = {
    getBrushSize,
    createMaskSegments,
    bindCanvasStudio
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageCanvas = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindCanvasStudio);
      } else {
        bindCanvasStudio();
      }
    }
  }
})();
