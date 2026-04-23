(function () {
  const colors = [
    { name: "朱砂红", value: "#b44b3f" },
    { name: "竹青绿", value: "#1f4d4f" },
    { name: "描金黄", value: "#d8b25a" },
    { name: "黛蓝", value: "#2f3f63" },
    { name: "墨黑", value: "#101010" },
    { name: "瓷白", value: "#f5f5f0" }
  ];

  function getMaskColors() {
    return colors.slice();
  }

  function getBrushSize(value) {
    const size = Number(value) || 8;
    return Math.max(2, Math.min(24, size));
  }

  function getCanvasPoint(event, rect, size) {
    const scaleX = size.width / rect.width;
    const scaleY = size.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function createMaskSegments(width, height) {
    return [
      {
        left: { x: width * 0.35, y: height * 0.26 },
        right: { x: width * 0.65, y: height * 0.26 }
      },
      {
        left: { x: width * 0.28, y: height * 0.48 },
        right: { x: width * 0.72, y: height * 0.48 }
      },
      {
        left: { x: width * 0.39, y: height * 0.76 },
        right: { x: width * 0.61, y: height * 0.76 }
      }
    ];
  }

  function drawBase(ctx, canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const segments = createMaskSegments(width, height);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fbf7f0";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#27384a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, 138, 176, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, height * 0.21);
    ctx.lineTo(width / 2, height * 0.79);
    ctx.stroke();

    segments.forEach((item) => {
      ctx.beginPath();
      ctx.moveTo(item.left.x, item.left.y);
      ctx.quadraticCurveTo(width / 2, item.left.y + 16, item.right.x, item.right.y);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(width * 0.41, height * 0.6);
    ctx.lineTo(width * 0.5, height * 0.68);
    ctx.lineTo(width * 0.59, height * 0.6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width * 0.41, height * 0.83);
    ctx.quadraticCurveTo(width / 2, height * 0.88, width * 0.59, height * 0.83);
    ctx.stroke();

    ctx.font = "26px STSong, Songti SC, serif";
    ctx.fillStyle = "#b44b3f";
    ctx.fillText("戏曲脸谱工坊", width / 2 - 74, 44);
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
      <div class="studio-top">
        <div>
          <p class="eyebrow">戏台彩绘</p>
          <h2 class="section-title">脸谱绘制</h2>
          <p>选择颜色和画笔粗细，在底稿上完成属于你的脸谱配色。</p>
        </div>
        <div class="studio-note">
          <strong>小提示</strong>
          <p>先选颜色，再拖动画笔沿底稿描边或填色。</p>
        </div>
      </div>
      <div class="studio-main">
        <div class="studio-side">
          <div class="studio-group">
            <span class="studio-label">配色</span>
            <div class="studio-colors">
              ${getMaskColors().map((item, idx) => `
                <button type="button" class="color-btn${idx === 0 ? " is-on" : ""}" data-color="${item.value}">
                  <span style="background:${item.value}"></span>${item.name}
                </button>
              `).join("")}
            </div>
          </div>
          <div class="studio-group">
            <label class="studio-label" for="brushRange">画笔粗细</label>
            <input id="brushRange" type="range" min="2" max="24" value="8">
            <strong id="brushValue">8 px</strong>
          </div>
          <div class="studio-group studio-tools">
            <button type="button" class="tool-btn is-on" id="toolBrush" title="画笔">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </button>
            <button type="button" class="tool-btn" id="toolEraser" title="橡皮擦">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 20H7L3 16c-.6-.6-.6-1.5 0-2.1L13.1 3.8c.6-.6 1.5-.6 2.1 0l5.7 5.7c.6.6.6 1.5 0 2.1L12 20"></path>
                <path d="M6 11l6 6"></path>
              </svg>
            </button>
            <button type="button" class="action-btn" id="undoBtn" title="撤销" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 7v6h6"></path>
                <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
              </svg>
            </button>
            <button type="button" class="action-btn" id="redoBtn" title="重做" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 7v6h-6"></path>
                <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
              </svg>
            </button>
          </div>
          <button type="button" class="btn btn--secondary" id="clearCanvas">重置脸谱</button>
        </div>
        <div class="studio-board">
          <canvas id="heritageCanvas" width="920" height="500"></canvas>
        </div>
      </div>
    `;

    const canvas = document.getElementById("heritageCanvas");
    const ctx = canvas.getContext("2d");
    const range = document.getElementById("brushRange");
    const value = document.getElementById("brushValue");
    let color = getMaskColors()[0].value;
    let size = 8;
    let drawing = false;
    let tool = "brush";
    const eraserColor = "#fbf7f0";

    const undoStack = [];
    const redoStack = [];
    const maxHistory = 20;

    function saveState() {
      if (undoStack.length >= maxHistory) {
        undoStack.shift();
      }
      undoStack.push(canvas.toDataURL());
      redoStack.length = 0;
      updateUndoRedoButtons();
    }

    function undo() {
      if (undoStack.length <= 1) {
        return;
      }
      const state = undoStack.pop();
      redoStack.push(state);
      const prevState = undoStack[undoStack.length - 1];
      const img = new Image();
      img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        updateUndoRedoButtons();
      };
      img.src = prevState;
    }

    function redo() {
      if (redoStack.length === 0) {
        return;
      }
      const state = redoStack.pop();
      undoStack.push(state);
      const img = new Image();
      img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        updateUndoRedoButtons();
      };
      img.src = state;
    }

    function updateUndoRedoButtons() {
      const undoBtn = document.getElementById("undoBtn");
      const redoBtn = document.getElementById("redoBtn");
      if (undoBtn) {
        undoBtn.disabled = undoStack.length <= 1;
      }
      if (redoBtn) {
        redoBtn.disabled = redoStack.length === 0;
      }
    }

    function point(event) {
      const rect = canvas.getBoundingClientRect();
      return getCanvasPoint(event, rect, canvas);
    }

    function start(event) {
      drawing = true;
      const pos = point(event);
      if (typeof canvas.setPointerCapture === "function") {
        canvas.setPointerCapture(event.pointerId);
      }
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function move(event) {
      if (!drawing) {
        return;
      }

      const pos = point(event);
      ctx.strokeStyle = tool === "eraser" ? eraserColor : color;
      ctx.lineWidth = tool === "eraser" ? size * 3 : size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function end(event) {
      drawing = false;
      if (event && typeof canvas.releasePointerCapture === "function") {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (error) {
          return;
        }
      }
    }

    drawBase(ctx, canvas);
    saveState();

    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", function (e) {
      saveState();
      end(e);
    });
    canvas.addEventListener("pointerleave", end);

    root.querySelectorAll("[data-color]").forEach((btn) => {
      btn.addEventListener("click", function () {
        color = btn.getAttribute("data-color");
        root.querySelectorAll("[data-color]").forEach((item) => item.classList.remove("is-on"));
        btn.classList.add("is-on");
      });
    });

    range.addEventListener("input", function () {
      size = getBrushSize(range.value);
      value.textContent = `${size} px`;
    });

    document.getElementById("clearCanvas").addEventListener("click", function () {
      drawBase(ctx, canvas);
      saveState();
    });

    document.getElementById("undoBtn").addEventListener("click", undo);
    document.getElementById("redoBtn").addEventListener("click", redo);

    document.getElementById("toolBrush").addEventListener("click", function () {
      tool = "brush";
      document.getElementById("toolBrush").classList.add("is-on");
      document.getElementById("toolEraser").classList.remove("is-on");
    });

    document.getElementById("toolEraser").addEventListener("click", function () {
      tool = "eraser";
      document.getElementById("toolEraser").classList.add("is-on");
      document.getElementById("toolBrush").classList.remove("is-on");
    });
  }

  const api = {
    getMaskColors,
    getBrushSize,
    getCanvasPoint,
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