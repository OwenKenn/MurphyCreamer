const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {
	const threshold = window.innerHeight * 0.20;
	topButton.style.display = window.scrollY > threshold ? "block" : "none";
});

topButton.addEventListener("click", () => {
	window.scrollTo({ top: 0, behavior: "smooth" });
});

/** 
	3-player connect 4 javascript 
	A three player game of connect 4, with a reset button. Diagonal wins counted as well. Displays winner/tie in jTextFields. 
		Used Claude to port to JavaScript to run it in browser. Original design and architecutre designed my myself without AI tools.
		If intrested, feel free to visit the Github repo with the orginal java code.
**/
const GRID_SIZE = 8;
const WIN_TOTAL = 4;

// Same colors as the combo boxes in the Java version
const COLORS = {
	Red: "red",
	Green: "lime",
	Blue: "blue"
};

// board[row][col] holds 0 (empty), or 1, 2, 3 (the player who owns the tile)
// buttons[row][col] is the matching button on the page
let board = [];
let buttons = [];

let currentTurn = 1;     // 1, 2 or 3. 4 means the game is over
let tilesPlaced = 0;     // Java: checkTie
let gameRunning = false;

// Page elements. Index 0 is unused so player numbers match the index.
const statusBoxes = [
	null,
	document.getElementById("status1"),
	document.getElementById("status2"),
	document.getElementById("status3")
];
const colorBoxes = [
	null,
	document.getElementById("color1"),
	document.getElementById("color2"),
	document.getElementById("color3")
];
const playerColors = [null, "white", "white", "white"];

const startButton = document.getElementById("startButton");
const boardDiv = document.getElementById("board");

// Build the grid (Java: runGame)
function buildGrid() {
	for (let row = 0; row < GRID_SIZE; row++) {
		board[row] = [];
		buttons[row] = [];
		for (let col = 0; col < GRID_SIZE; col++) {
			board[row][col] = 0;
			const tile = document.createElement("button");
				tile.className = "tile";
				tile.addEventListener("click", function () {
					placeTile(row, col);
				});

			boardDiv.appendChild(tile);
			buttons[row][col] = tile;
		}
	}
}

// Place a tile for whoever's turn it is (Java: Player.placeTile)
function placeTile(row, col) {
	if (!gameRunning || currentTurn === 4) return;  // not started, or game over
	if (board[row][col] !== 0) return;              // tile already taken
		board[row][col] = currentTurn;
		buttons[row][col].style.backgroundColor = playerColors[currentTurn];
		tilesPlaced++;
		
	if (checkWin(currentTurn)) {
		statusBoxes[currentTurn].textContent = "WINNER";
		currentTurn = 4;
	} else {
		// pass the turn: 1 -> 2 -> 3 -> 1
		statusBoxes[currentTurn].textContent = "Player " + currentTurn;
		currentTurn = (currentTurn % 3) + 1;
		statusBoxes[currentTurn].textContent = "PLAYING";
	}
	
		// Board is full and nobody won
	if (tilesPlaced >= GRID_SIZE * GRID_SIZE && currentTurn !== 4) {
		statusBoxes[1].textContent = "TIE";
		statusBoxes[2].textContent = "TIE";
		statusBoxes[3].textContent = "TIE";
		currentTurn = 4;
	}
}

// Does this player have 4 in a row? (Java: Player.checkWin)
// From every tile the player owns, look right, down, and both diagonals.
function checkWin(player) {
	const directions = [
		[0, 1],   // right
		[1, 0],   // down
		[1, 1],   // diagonal down-right
		[1, -1]   // diagonal down-left
	];

	for (let row = 0; row < GRID_SIZE; row++) {
		for (let col = 0; col < GRID_SIZE; col++) {
			if (board[row][col] !== player) continue;

			for (const [rowStep, colStep] of directions) {
				let count = 0;
				let r = row;
				let c = col;
				while (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && board[r][c] === player) {
					count++;
					r += rowStep;
					c += colStep;
				}
				if (count >= WIN_TOTAL) return true;
			}
		}
	}
	return false;
}

// Start / Cancel button (Java: jButton1ActionPerformed)
function startOrCancel() {
	if (startButton.textContent === "Start Game") {
		const p1 = colorBoxes[1].value;
		const p2 = colorBoxes[2].value;
		const p3 = colorBoxes[3].value;

		// every player needs a different color
		if (p1 !== p2 && p2 !== p3 && p1 !== p3) {
			playerColors[1] = COLORS[p1];
			playerColors[2] = COLORS[p2];
			playerColors[3] = COLORS[p3];
			startButton.textContent = "Cancel Game";
			statusBoxes[1].textContent = "PLAYING";
			gameRunning = true;
		}
	} else {
		resetGame();
	}
}

function resetGame() {
	for (let row = 0; row < GRID_SIZE; row++) {
		for (let col = 0; col < GRID_SIZE; col++) {
			board[row][col] = 0;
			buttons[row][col].style.backgroundColor = "white";
		}
	}
		  
	for (let player = 1; player <= 3; player++) {
		playerColors[player] = "white";
		statusBoxes[player].textContent = "Player " + player;
	}
	startButton.textContent = "Start Game";
	tilesPlaced = 0;
	currentTurn = 1;
	gameRunning = false;
}

startButton.addEventListener("click", startOrCancel);
buildGrid();