(function () {
  class HeritagePuzzle extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.gridSize = 3;
      this.pieces = [];
      this.selectedPiece = null;
      this.isComplete = false;
    }

    connectedCallback() {
      this.render();
      this.initGame();
    }

    getProjects() {
      return window.heritageData?.projects || [];
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
          .eyebrow {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            border-radius: 999px;
            color: #5D897A;
            background: rgba(255, 255, 255, 0.76);
            border: 1px solid rgba(93, 137, 114, 0.14);
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          .section-title {
            margin: 4px 0 8px;
            font-family: "STKaiti", "KaiTi", "Songti SC", serif;
            font-size: 28px;
            font-weight: 700;
            color: #31485E;
          }
          .studio-top p {
            margin: 0;
            color: #5D697A;
          }
          .studio-note {
            flex-shrink: 0;
            width: 200px;
            padding: 14px 18px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(49, 72, 94, 0.08);
          }
          .studio-note strong {
            display: block;
            margin-bottom: 4px;
            font-size: 13px;
            color: #31485E;
          }
          .studio-note p {
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
            color: #5D697A;
          }
          .studio-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 20px;
          }
          .studio-top > div:first-child {
            flex: 1;
          }
          .game-container {
            display: flex;
            align-items: flex-start;
            gap: 40px;
            width: 100%;
          }
          .game-left-spacer {
            flex: 1;
            min-width: 0;
          }
          .game-center {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .game-right {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            min-width: 140px;
          }
          .puzzle-board {
            position: relative;
            width: 306px;
            height: 306px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            background: rgba(49, 72, 94, 0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          .puzzle-piece {
            width: 100px;
            height: 100px;
            background-size: 300px 300px;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .puzzle-piece:hover:not(.empty):not(.completed) {
            transform: scale(1.03);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1;
          }
          .puzzle-piece.selected {
            outline: 3px solid #d8b25a;
            outline-offset: -3px;
          }
          .puzzle-piece.empty {
            background: rgba(49, 72, 94, 0.08) !important;
            cursor: default;
          }
          .puzzle-piece.empty:hover {
            transform: none;
            box-shadow: none;
          }
          .puzzle-piece.completed {
            cursor: default;
          }
          .puzzle-piece.completed:hover {
            transform: none;
            box-shadow: none;
          }
          .preview-label {
            font-size: 13px;
            color: #5D697A;
            font-weight: 500;
          }
          .preview-image {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            object-fit: cover;
            border: 2px solid rgba(49, 72, 94, 0.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .puzzle-controls {
            display: flex;
            gap: 12px;
            margin-top: 16px;
          }
          .puzzle-btn {
            padding: 10px 20px;
            border: 1px solid rgba(49, 72, 94, 0.15);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.8);
            color: #31485E;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .puzzle-btn:hover {
            border-color: #31485E;
            background: rgba(49, 72, 94, 0.05);
          }
          .puzzle-btn.hidden {
            display: none;
          }
          .puzzle-message {
            margin-top: 16px;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            min-height: 20px;
          }
          .puzzle-message.success {
            background: rgba(76, 175, 80, 0.1);
            color: #2e7d32;
          }
          .puzzle-info {
            color: #5D697A;
            font-size: 13px;
            text-align: center;
          }
        </style>
        <div class="studio-top">
          <div>
            <span class="eyebrow">拼图游戏</span>
            <h2 class="section-title">非遗修复</h2>
            <p>点击空白块旁边的碎片进行交换，还原非遗影像。</p>
          </div>
          <div class="studio-note">
            <strong>游戏规则</strong>
            <p>点击空白块旁边的碎片进行交换，全部还原即可获胜。</p>
          </div>
        </div>
        <div class="game-container">
          <div class="game-left-spacer"></div>
          <div class="game-center">
            <div class="puzzle-board" id="puzzleBoard"></div>
            <div class="puzzle-controls">
              <button class="puzzle-btn" id="resetBtn">换一个</button>
              <button class="puzzle-btn" id="shuffleBtn">重新打乱</button>
            </div>
            <div class="puzzle-message" id="puzzleMessage"></div>
            <p class="puzzle-info" id="puzzleInfo"></p>
          </div>
          <div class="game-right">
            <span class="preview-label">完成效果</span>
            <img class="preview-image" id="previewImage" src="" alt="预览图">
          </div>
          <div class="game-right-spacer"></div>
        </div>
      `;
    }

    selectRandomProject() {
      const projects = this.getProjects();
      if (projects.length === 0) {
        return null;
      }
      this.selectedProject = projects[Math.floor(Math.random() * projects.length)];
      const info = this.shadowRoot.getElementById('puzzleInfo');
      info.textContent = `当前图片：${this.selectedProject.title}`;

      const previewImage = this.shadowRoot.getElementById('previewImage');
      previewImage.src = this.selectedProject.image;
      previewImage.alt = this.selectedProject.title;

      return this.selectedProject;
    }

    initGame() {
      if (!this.selectRandomProject()) {
        this.showMessage('暂无数据', false);
        return;
      }

      this.createPuzzle();
      this.bindEvents();
    }

    createPuzzle() {
      const board = this.shadowRoot.getElementById('puzzleBoard');
      board.innerHTML = '';

      this.pieces = [];
      this.selectedPiece = null;
      this.isComplete = false;

      const size = 300 / this.gridSize;

      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          const index = row * this.gridSize + col;
          const isLast = row === this.gridSize - 1 && col === this.gridSize - 1;

          const piece = document.createElement('div');
          piece.className = 'puzzle-piece';
          piece.dataset.index = index;
          
          if (!isLast) {
            piece.style.backgroundImage = `url(${this.selectedProject.image})`;
            piece.style.backgroundPosition = `-${col * size}px -${row * size}px`;
          } else {
            piece.classList.add('empty');
          }

          this.pieces.push({
            element: piece,
            correctIndex: index,
            currentRow: row,
            currentCol: col,
            isEmpty: isLast
          });

          board.appendChild(piece);
        }
      }

      this.updatePositions();
      this.shuffle();
    }

    updatePositions() {
      const sortedPieces = [...this.pieces].sort((a, b) => {
        return a.currentRow - b.currentRow || a.currentCol - b.currentCol;
      });
      
      const board = this.shadowRoot.getElementById('puzzleBoard');
      board.innerHTML = '';
      
      sortedPieces.forEach(piece => {
        board.appendChild(piece.element);
      });
    }

    shuffle() {
      for (let i = this.pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        const tempRow = this.pieces[i].currentRow;
        const tempCol = this.pieces[i].currentCol;
        this.pieces[i].currentRow = this.pieces[j].currentRow;
        this.pieces[i].currentCol = this.pieces[j].currentCol;
        this.pieces[j].currentRow = tempRow;
        this.pieces[j].currentCol = tempCol;
      }

      const emptyPiece = this.pieces.find(p => p.isEmpty);
      if (emptyPiece && emptyPiece.currentRow === this.gridSize - 1 && emptyPiece.currentCol === this.gridSize - 1) {
        const firstNonEmpty = this.pieces.find(p => !p.isEmpty);
        if (firstNonEmpty) {
          const tempRow = emptyPiece.currentRow;
          const tempCol = emptyPiece.currentCol;
          emptyPiece.currentRow = firstNonEmpty.currentRow;
          emptyPiece.currentCol = firstNonEmpty.currentCol;
          firstNonEmpty.currentRow = tempRow;
          firstNonEmpty.currentCol = tempCol;
        }
      }

      this.updatePositions();
      this.checkComplete();
    }

    bindEvents() {
      const board = this.shadowRoot.getElementById('puzzleBoard');
      
      board.addEventListener('click', (e) => {
        if (this.isComplete) return;

        const piece = e.target.closest('.puzzle-piece');
        if (!piece) return;

        const pieceData = this.pieces.find(p => p.element === piece);
        if (!pieceData) return;

        const emptyPiece = this.pieces.find(p => p.isEmpty);
        if (!emptyPiece) return;

        const rowDiff = Math.abs(pieceData.currentRow - emptyPiece.currentRow);
        const colDiff = Math.abs(pieceData.currentCol - emptyPiece.currentCol);
        const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

        if (isAdjacent) {
          const tempRow = pieceData.currentRow;
          const tempCol = pieceData.currentCol;
          pieceData.currentRow = emptyPiece.currentRow;
          pieceData.currentCol = emptyPiece.currentCol;
          emptyPiece.currentRow = tempRow;
          emptyPiece.currentCol = tempCol;

          this.updatePositions();
          this.checkComplete();
        }
      });

      this.shadowRoot.getElementById('resetBtn').addEventListener('click', () => {
        this.selectRandomProject();
        this.createPuzzle();
        this.showMessage('', false);
        this.updateShuffleButton(true);
      });

      this.shadowRoot.getElementById('shuffleBtn').addEventListener('click', () => {
        this.shuffle();
        this.showMessage('', false);
      });
    }

    updateShuffleButton(show) {
      const shuffleBtn = this.shadowRoot.getElementById('shuffleBtn');
      if (show) {
        shuffleBtn.classList.remove('hidden');
      } else {
        shuffleBtn.classList.add('hidden');
      }
    }

    checkComplete() {
      const isComplete = this.pieces.every(piece => 
        piece.currentRow * this.gridSize + piece.currentCol === piece.correctIndex
      );

      if (isComplete && !this.isComplete) {
        this.isComplete = true;
        this.showMessage('🎉 恭喜！拼图已完成！', true);
        this.updateShuffleButton(false);
        this.fillEmptyPiece();
      }
    }

    fillEmptyPiece() {
      const emptyPiece = this.pieces.find(p => p.isEmpty);
      if (emptyPiece) {
        emptyPiece.element.classList.remove('empty');
        emptyPiece.element.classList.add('completed');
        emptyPiece.element.style.backgroundImage = `url(${this.selectedProject.image})`;
        const size = 300 / this.gridSize;
        emptyPiece.element.style.backgroundPosition = `-${(this.gridSize - 1) * size}px -${(this.gridSize - 1) * size}px`;
      }

      this.pieces.forEach(piece => {
        piece.element.classList.add('completed');
      });
    }

    showMessage(text, isSuccess) {
      const message = this.shadowRoot.getElementById('puzzleMessage');
      message.textContent = text;
      message.className = 'puzzle-message' + (isSuccess ? ' success' : '');
    }
  }

  if (!customElements.get('heritage-puzzle')) {
    customElements.define('heritage-puzzle', HeritagePuzzle);
  }
})();