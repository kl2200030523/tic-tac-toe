// TicTacToe.js
const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        alert(`Player ${currentPlayer} wins!`);
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        alert("Game ended in a draw!");
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    checkWin();
}

function handleRestartGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('resetButton').addEventListener('click', handleRestartGame);
document.getElementById('playerVsComputer').addEventListener('click', function() {
    startGame('PvC');
});

document.getElementById('playerVsPlayer').addEventListener('click', function() {
    startGame('PvP');
});

function startGame(mode) {
    document.getElementById('modeSelection').style.display = 'none'; // Hide the mode selection
    document.getElementById('gameContainer').style.display = 'block';  // Show the game board
    resetGame();  // Reset game state
    gameActive = true; // Set game as active
    currentPlayer = 'X'; // Set initial player as X
    addEventListeners(mode); // Add appropriate event listeners based on mode
}

function addEventListeners(mode) {
    cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick); // Remove any old listeners
        cell.addEventListener('click', (event) => handleCellClick(event, mode)); // Add new listener with mode
    });
}

function handleCellClick(event, mode) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    if (checkWin()) {
        endGame(`Player ${currentPlayer} wins!`);
        return;
    }
    if (checkDraw()) {
        endGame("Game ended in a draw!");
        return;
    }

    handlePlayerChange();
    
    if (mode === 'PvC' && currentPlayer === 'O') {
        computerMove();
    }
}

function computerMove() {
    // Basic AI to pick the first available cell
    const emptyCells = gameState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
        const move = emptyCells[0]; // Choose the first empty cell
        gameState[move] = 'O';
        document.querySelector(`[data-cell-index="${move}"]`).textContent = 'O';
        
        if (checkWin()) {
            endGame("Computer wins!");
            return;
        }
        if (checkDraw()) {
            endGame("Game ended in a draw!");
            return;
        }
        handlePlayerChange();
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winConditions.some(condition => {
        const [a, b, c] = condition;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function checkDraw() {
    return !gameState.includes('');
}

function endGame(message) {
    alert(message);
    gameActive = false;

    if (!message.includes("draw")) { // Check if the game didn't end in a draw
        triggerConfetti();
    }
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}


function resetGame() {
    gameState.fill('');
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
}

document.getElementById('resetButton').addEventListener('click', resetGame);
