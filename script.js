
const boardElement = document.getElementById('board');
const statusText = document.getElementById('status');
const modeSelect = document.getElementById('mode');

let board = ["", "", "", "", "", "", "", "", ""];
let player = "X";
let ai = "O";
let gameOver = false;

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement('div');
    div.className = "cell" + (cell ? " taken" : "");
    div.textContent = cell;
    div.addEventListener('click', () => makeMove(i));
    boardElement.appendChild(div);
  });
}

function makeMove(index) {
  if (board[index] !== "" || gameOver) return;

  board[index] = player;
  renderBoard();
  if (checkWinner(player)) {
    statusText.textContent = "You Win!";
    gameOver = true;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "Draw!";
    gameOver = true;
    return;
  }

  setTimeout(aiMove, 300); // small delay
}

function aiMove() {
  if (gameOver) return;

  let index;
  const mode = modeSelect.value;

  if (mode === "easy") {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    index = empty[Math.floor(Math.random() * empty.length)];
  } else {
    index = bestMove();
  }

  board[index] = ai;
  renderBoard();

  if (checkWinner(ai)) {
    statusText.textContent = "AI Wins!";
    gameOver = true;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "Draw!";
    gameOver = true;
  }
}

function checkWinner(p) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return wins.some(combo => combo.every(i => board[i] === p));
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(newBoard, depth, isMax) {
  if (checkWinner(ai)) return 10 - depth;
  if (checkWinner(player)) return depth - 10;
  if (newBoard.every(cell => cell !== "")) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = ai;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        best = Math.max(best, score);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = player;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        best = Math.min(best, score);
      }
    }
    return best;
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  statusText.textContent = "";
  renderBoard();
}

renderBoard();
