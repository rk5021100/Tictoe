let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; // true if it's player turn (O)
let count = 0;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("win");
  }
};

const showWinner = (winner, pattern) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");

  // Highlight winning boxes
  pattern.forEach((index) => {
    boxes[index].classList.add("win");
  });

  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val, pattern);
        return true;
      }
    }
  }
  return false;
};

// User move
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (turnO && box.innerText === "") {
      box.innerText = "O";
      box.disabled = true;
      count++;

      if (checkWinner()) return;
      if (count === 9) {
        gameDraw();
        return;
      }

      turnO = false;
      setTimeout(() => aiMove(), 300);
    }
  });
});

// AI move (Minimax)
const aiMove = () => {
  let bestScore = -Infinity;
  let move;

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = "X";
      let score = minimax(boxes, 0, false);
      box.innerText = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  boxes[move].innerText = "X";
  boxes[move].disabled = true;
  count++;

  if (checkWinner()) return;
  if (count === 9) {
    gameDraw();
    return;
  }

  turnO = true;
};

// Minimax algorithm
const minimax = (boardState, depth, isMaximizing) => {
  let result = evaluate(boardState);
  if (result !== null) return result;

  if (isMaximizing) {
    let bestScore = -Infinity;
    boxes.forEach((box, i) => {
      if (boardState[i].innerText === "") {
        boardState[i].innerText = "X";
        let score = minimax(boardState, depth + 1, false);
        boardState[i].innerText = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    boxes.forEach((box, i) => {
      if (boardState[i].innerText === "") {
        boardState[i].innerText = "O";
        let score = minimax(boardState, depth + 1, true);
        boardState[i].innerText = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
};

// Evaluate board state
const evaluate = (board) => {
  for (let pattern of winPatterns) {
    let a = board[pattern[0]].innerText;
    let b = board[pattern[1]].innerText;
    let c = board[pattern[2]].innerText;

    if (a === b && b === c && a !== "") {
      if (a === "X") return 10;
      else if (a === "O") return -10;
    }
  }

  // Check draw
  let isDraw = true;
  boxes.forEach((box) => {
    if (box.innerText === "") isDraw = false;
  });

  if (isDraw) return 0;

  return null;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
