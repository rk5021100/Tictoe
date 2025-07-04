const boardElem = document.getElementById("game-board");
const messageElem = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");

let board = Array(9).fill(null); // 0-8 positions
let currentPlayer = "X"; // player always X, AI always O
let gameActive = true;
let difficulty = "easy";

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diags
];

// UI setup
function createBoard() {
  boardElem.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.idx = i;
    cell.addEventListener("click", handleCellClick);
    cell.textContent = board[i] || "";
    boardElem.appendChild(cell);
  }
}
createBoard();

function setMessage(msg) {
  messageElem.textContent = msg;
}

// Game logic
function handleCellClick(e) {
  const idx = +e.target.dataset.idx;
  if (!gameActive || board[idx]) return;
  makeMove(idx, currentPlayer);
  if (checkGameOver()) return;
  setTimeout(() => {
    aiMove();
    checkGameOver();
  }, 250);
}

function makeMove(idx, player) {
  if (board[idx] || !gameActive) return false;
  board[idx] = player;
  updateUI();
  return true;
}

function updateUI() {
  Array.from(boardElem.children).forEach((cell, i) => {
    cell.textContent = board[i] || "";
  });
}

function emptyIndices(brd = board) {
  return brd.map((v, i) => v ? null : i).filter(v => v !== null);
}

function checkWinner(brd = board) {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (brd[a] && brd[a] === brd[b] && brd[a] === brd[c]) return brd[a];
  }
  return null;
}

function checkGameOver() {
  const winner = checkWinner();
  if (winner) {
    setMessage(winner === "X" ? "You win! 🎉" : "AI wins! 🤖");
    gameActive = false;
    return true;
  }
  if (emptyIndices().length === 0) {
    setMessage("It's a draw!");
    gameActive = false;
    return true;
  }
  setMessage(currentPlayer === "X" ? "Your turn!" : "AI's turn...");
  return false;
}

// AI logic
function aiMove() {
  if (!gameActive) return;
  let idx;
  if (difficulty === "easy") {
    // Random available
    const options = emptyIndices();
    idx = options[Math.floor(Math.random() * options.length)];
  } else {
    // Hard: Minimax
    idx = minimax(board, "O").idx;
  }
  makeMove(idx, "O");
  currentPlayer = "X";
}

function minimax(newBoard, player) {
  const availSpots = emptyIndices(newBoard);
  const winner = checkWinner(newBoard);
  if (winner === "X") return {score: -10};
  if (winner === "O") return {score: 10};
  if (availSpots.length === 0) return {score: 0};

  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const idx = availSpots[i];
    let move = {};
    move.idx = idx;
    newBoard[idx] = player;
    if (player === "O") {
      move.score = minimax(newBoard, "X").score;
    } else {
      move.score = minimax(newBoard, "O").score;
    }
    newBoard[idx] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }
  return bestMove;
}

// Controls
restartBtn.onclick = () => {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  setMessage("Your turn!");
  createBoard();
};

difficultySelect.onchange = (e) => {
  difficulty = e.target.value;
  restartBtn.click();
};

// Start message
setMessage("Your turn!");
