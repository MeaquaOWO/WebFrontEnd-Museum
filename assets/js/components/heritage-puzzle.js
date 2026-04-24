(function () {
  class HeritagePuzzle extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.gridSize = 3;
      this.pieces = [];
      this.isCompleted = false;
    }

    connectedCallback() {
      this.render();
      this.selectRandomProject();
      this.createPuzzle();
      this.bindEvents();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="assets/css/heritage-puzzle.css">
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
      const projects = window.heritageData.projects;
      this.selectedProject = projects[Math.floor(Math.random() * projects.length)];
      const info = this.shadowRoot.getElementById('puzzleInfo');
      info.textContent = `当前图片：${this.selectedProject.title}`;

      const previewImage = this.shadowRoot.getElementById('previewImage');
      previewImage.src = this.selectedProject.image;

      return this.selectedProject;
    }

    createPuzzle() {
      const board = this.shadowRoot.getElementById('puzzleBoard');
      board.innerHTML = '';

      this.pieces = [];
      this.isCompleted = false;

      const size = 300 / this.gridSize;

      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          const index = row * this.gridSize + col;

          const piece = document.createElement('div');
          piece.className = 'puzzle-piece';
          piece.dataset.index = index;

          const image = new Image();
          image.onload = () => {
            piece.style.backgroundImage = `url(${image.src})`;
            const size = 300 / this.gridSize;
            let scale;
            if (image.width < image.height) {
              scale = 300 / image.width;
              piece.style.backgroundPosition = `${-col * size}px ${-(image.height - image.width) * scale / 2 - row * size}px`;
            } else {
              scale = 300 / image.height;
              piece.style.backgroundPosition = `${-(image.width - image.height) * scale / 2 - col * size}px ${-row * size}px`;
            }
            piece.style.backgroundSize = `${image.width * scale}px ${image.height * scale}px`;
          };
          image.src = this.selectedProject.image;

          if (row === this.gridSize - 1 && col === this.gridSize - 1) {
            piece.classList.add('empty');
          }

          this.pieces.push({
            element: piece,
            correctIndex: index,
            currentRow: row,
            currentCol: col,
            isEmpty: piece.classList.contains('empty')
          });

          board.appendChild(piece);
        }
      }

      this.shuffle();
    }

    updatePositions() {
      const board = this.shadowRoot.getElementById('puzzleBoard');
      board.innerHTML = '';

      [...this.pieces].sort((a, b) => {
        return a.currentRow - b.currentRow || a.currentCol - b.currentCol;
      }).forEach(piece => {
        board.appendChild(piece.element);
      });
    }

    shuffle() {
      const emptyIndex = this.pieces.length - 1;

      for (let i = this.pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pieces[i].currentRow, this.pieces[j].currentRow] = [this.pieces[j].currentRow, this.pieces[i].currentRow];
        [this.pieces[i].currentCol, this.pieces[j].currentCol] = [this.pieces[j].currentCol, this.pieces[i].currentCol];
        [this.pieces[i], this.pieces[j]] = [this.pieces[j], this.pieces[i]];
      }

      let inversions = 0;
      for (let i = 0; i < this.pieces.length; i++) {
        for (let j = i + 1; j < this.pieces.length; j++) {
          if (this.pieces[i].isEmpty || this.pieces[j].isEmpty) {
            continue;
          }
          if (this.pieces[i].correctIndex > this.pieces[j].correctIndex) {
            inversions++;
          }
        }
      }

      let isSolvable;
      if (this.gridSize % 2 === 1) {
        isSolvable = inversions % 2 === 0;
      } else {
        if (Math.floor(this.pieces.findIndex(piece => piece.isEmpty) / this.gridSize) % 2 === 0) {
          isSolvable = inversions % 2 === 0;
        } else {
          isSolvable = inversions % 2 === 1;
        }
      }

      if (!isSolvable) {
        if (this.pieces[0].isEmpty || this.pieces[1].isEmpty) {
          [this.pieces[2].currentRow, this.pieces[3].currentRow] = [this.pieces[3].currentRow, this.pieces[2].currentRow];
          [this.pieces[2].currentCol, this.pieces[3].currentCol] = [this.pieces[3].currentCol, this.pieces[2].currentCol];
          [this.pieces[2], this.pieces[3]] = [this.pieces[3], this.pieces[2]];
        } else {
          [this.pieces[0].currentRow, this.pieces[1].currentRow] = [this.pieces[1].currentRow, this.pieces[0].currentRow];
          [this.pieces[0].currentCol, this.pieces[1].currentCol] = [this.pieces[1].currentCol, this.pieces[0].currentCol];
          [this.pieces[0], this.pieces[1]] = [this.pieces[1], this.pieces[0]];
        }
      }

      this.updatePositions();
      this.checkComplete();
    }

    bindEvents() {
      const board = this.shadowRoot.getElementById('puzzleBoard');

      board.addEventListener('click', (e) => {
        if (this.isCompleted) return;

        const piece = e.target.closest('.puzzle-piece');

        const pieceData = this.pieces.find(p => p.element === piece);
        if (!pieceData) return;

        const emptyPiece = this.pieces.find(p => p.isEmpty);
        if (!emptyPiece) return;

        const rowDiff = Math.abs(pieceData.currentRow - emptyPiece.currentRow);
        const colDiff = Math.abs(pieceData.currentCol - emptyPiece.currentCol);
        const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

        if (!isAdjacent) return;
        [pieceData.currentRow, emptyPiece.currentRow] = [emptyPiece.currentRow, pieceData.currentRow];
        [pieceData.currentCol, emptyPiece.currentCol] = [emptyPiece.currentCol, pieceData.currentCol];

        this.updatePositions();
        this.checkComplete();
      });

      this.shadowRoot.getElementById('resetBtn').addEventListener('click', () => {
        this.selectRandomProject();
        this.createPuzzle();
        this.showMessage('', false);
        this.shadowRoot.getElementById('shuffleBtn').classList.remove('hidden')
      });

      this.shadowRoot.getElementById('shuffleBtn').addEventListener('click', () => {
        this.shuffle();
        this.showMessage('', false);
      });
    }

    checkComplete() {
      const isComplete = this.pieces.every(piece =>
        piece.currentRow * this.gridSize + piece.currentCol === piece.correctIndex
      );

      if (isComplete && !this.isCompleted) {
        this.isCompleted = true;
        this.showMessage('🎉 恭喜！拼图已完成！', true);
        this.shadowRoot.getElementById('shuffleBtn').classList.add('hidden');
        this.pieces.find(piece => piece.isEmpty).element.classList.remove('empty');
        this.pieces.forEach(piece => {
          piece.element.classList.add('completed');
        });
      }
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