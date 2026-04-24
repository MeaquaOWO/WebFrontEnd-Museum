class HeritageCanvas extends HTMLElement {
  constructor() {
    super();
    this.colors = [
      { name: "朱砂红", value: "#b44b3f" },
      { name: "竹青绿", value: "#1f4d4f" },
      { name: "描金黄", value: "#d8b25a" },
      { name: "黛蓝", value: "#2f3f63" },
      { name: "墨黑", value: "#101010" },
      { name: "瓷白", value: "#f5f5f0" }
    ];
    this.color = this.colors[0].value;
    this.size = 8;
    this.drawing = false;
    this.tool = "brush";
    this.blankColor = "#fbf7f0";
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 20;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  drawBase(canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = this.blankColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#27384a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, 138, 176, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, height * 0.15);
    ctx.lineTo(width / 2, height * 0.85);
    ctx.stroke();

    [
      {
        left: { x: width * 0.39, y: height * 0.26 },
        right: { x: width * 0.61, y: height * 0.26 }
      },
      {
        left: { x: width * 0.35, y: height * 0.48 },
        right: { x: width * 0.65, y: height * 0.48 }
      },
      {
        left: { x: width * 0.40, y: height * 0.76 },
        right: { x: width * 0.60, y: height * 0.76 }
      }
    ].forEach((item) => {
      ctx.beginPath();
      ctx.moveTo(item.left.x, item.left.y);
      ctx.quadraticCurveTo(width / 2, item.left.y + 16, item.right.x, item.right.y);
      ctx.stroke();
    });

    ctx.font = "26px STSong, Songti SC, serif";
    ctx.fillStyle = "#b44b3f";
    ctx.fillText("戏曲脸谱工坊", width / 2 - 74, 44);
  }

  saveState() {
    const canvas = this.querySelector("#heritageCanvas");

    if (this.undoStack.length >= this.maxHistory) {
      this.undoStack.shift();
    }
    this.undoStack.push(canvas.toDataURL());
    this.redoStack.length = 0;
    this.updateUndoRedoButtons();
  }

  undo() {
    const canvas = this.querySelector("#heritageCanvas");
    const ctx = canvas.getContext("2d");
    if (this.undoStack.length <= 1) return;
    const state = this.undoStack.pop();
    this.redoStack.push(state);
    const prevState = this.undoStack[this.undoStack.length - 1];
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      this.updateUndoRedoButtons();
    };
    img.src = prevState;
  }

  redo() {
    const canvas = this.querySelector("#heritageCanvas");
    const ctx = canvas.getContext("2d");
    if (this.redoStack.length === 0) return;
    const state = this.redoStack.pop();
    this.undoStack.push(state);
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      this.updateUndoRedoButtons();
    };
    img.src = state;
  }

  updateUndoRedoButtons() {
    this.querySelector("#undoBtn").disabled = this.undoStack.length <= 1;
    this.querySelector("#redoBtn").disabled = this.redoStack.length === 0;
  }

  getCanvasPoint(event) {
    const canvas = this.querySelector("#heritageCanvas");
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  start(event) {
    this.drawing = true;
    const canvas = this.querySelector("#heritageCanvas");
    const ctx = canvas.getContext("2d");

    const pos = this.getCanvasPoint(event);
    canvas.setPointerCapture(event.pointerId);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  move(event) {
    if (!this.drawing) return;

    const canvas = this.querySelector("#heritageCanvas");
    const ctx = canvas.getContext("2d");

    const pos = this.getCanvasPoint(event);
    ctx.strokeStyle = this.tool === "eraser" ? this.blankColor : this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  end(event) {
    this.drawing = false;
    const canvas = this.querySelector("#heritageCanvas");
    canvas.releasePointerCapture(event.pointerId);
  }

  bindEvents() {
    const canvas = this.querySelector("#heritageCanvas");
    const range = this.querySelector("#brushRange");
    const value = this.querySelector("#brushValue");

    this.drawBase(canvas);
    this.saveState();

    canvas.addEventListener("pointerdown", (e) => this.start(e));
    canvas.addEventListener("pointermove", (e) => this.move(e));
    canvas.addEventListener("pointerup", (e) => {
      this.saveState();
      this.end(e);
    });
    canvas.addEventListener("pointerleave", (e) => this.end(e));

    this.querySelectorAll("[data-color]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.color = btn.getAttribute("data-color");
        this.querySelectorAll("[data-color]").forEach((item) => item.classList.remove("is-on"));
        btn.classList.add("is-on");
      });
    });

    if (range && value) {
      range.addEventListener("input", () => {
        this.size = range.value;
        value.textContent = `${this.size} px`;
      });
    }

    const clearBtn = this.querySelector("#clearCanvas");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.drawBase(canvas);
        this.saveState();
      });
    }

    const undoBtn = this.querySelector("#undoBtn");
    const redoBtn = this.querySelector("#redoBtn");
    if (undoBtn) undoBtn.addEventListener("click", () => this.undo());
    if (redoBtn) redoBtn.addEventListener("click", () => this.redo());

    const toolBrush = this.querySelector("#toolBrush");
    const toolEraser = this.querySelector("#toolEraser");
    if (toolBrush) {
      toolBrush.addEventListener("click", () => {
        this.tool = "brush";
        toolBrush.classList.add("is-on");
        if (toolEraser) toolEraser.classList.remove("is-on");
      });
    }
    if (toolEraser) {
      toolEraser.addEventListener("click", () => {
        this.tool = "eraser";
        toolEraser.classList.add("is-on");
        if (toolBrush) toolBrush.classList.remove("is-on");
      });
    }

    const saveBtn = this.querySelector("#saveBtn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const canvas = this.querySelector("#heritageCanvas");
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "脸谱作品.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  }

  render() {
    this.innerHTML = `
      <div class="panel studio">
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
                ${this.colors.map((item, idx) => `
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
              <button type="button" class="action-btn" id="saveBtn" title="保存">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </div>
            <button type="button" class="btn btn--secondary" id="clearCanvas">重置脸谱</button>
          </div>
          <div class="studio-board">
            <canvas id="heritageCanvas" width="920" height="500"></canvas>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("heritage-canvas", HeritageCanvas);