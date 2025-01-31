document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const gameModeSelector = document.getElementById('gameModeSelector');
    const cpuModeSelector = document.getElementById('cpuModeSelector');
    const board = document.getElementById('board');
    const winnerPopup = document.getElementById('winnerPopup');
    const winnerText = document.getElementById('winnerText');
    const newGameButtonWinner = document.getElementById('newGameButtonWinner');
    const drawPopup = document.getElementById('drawPopup');
    const drawText = document.getElementById('drawText');
    const newGameButtonDraw = document.getElementById('newGameButtonDraw');
    const currentPlayerText = document.getElementById('currentPlayer');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    const scoreboard = document.getElementById('scoreboard');

    let gameMode = 'twoPlayer';
    let currentPlayer = 'X';
    let filledButtons = 0;
    let xScore = 0;
    let oScore = 0;
    let isCpuTurn = false;
    let cpuDifficulty = 'easy';
    let gameEnded = false;

    overlay.classList.add('active');
    popup.classList.add('active');

    setTimeout(function() {
        popup.classList.add('fade-out');
        overlay.classList.remove('active');
    }, 2500);

    popup.addEventListener('transitionend', function() {
        popup.style.display = 'none';
    });

    setTimeout(function() {
        gameModeSelector.style.display = 'block';
        gameModeSelector.classList.add('fade-in');
    }, 3500);

    const players = [
        { name: 'X', score: 0 },
        { name: 'O', score: 0 }
    ];

    let boardState = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    document.getElementById('twoPlayerMode').addEventListener('click', () => {
        gameMode = 'twoPlayer';
        gameModeSelector.style.display = 'none';
        startGame();
    });

    document.getElementById('cpuMode').addEventListener('click', () => {
        if (cpuModeSelector.style.display === 'none' || cpuModeSelector.style.display === '') {
            cpuModeSelector.style.display = 'block';
        } else {
            cpuModeSelector.style.display = 'none';
        }
    });

    document.getElementById('startGameCpuMode').addEventListener('click', () => {
        gameMode = 'cpu';

        cpuDifficulty = document.getElementById('cpuDifficulty').value;

        popup.style.display = 'none';
        overlay.classList.remove('active');
        gameModeSelector.style.display = 'none';
        cpuModeSelector.style.display = 'none';

        startGame();
    });

    function startGame() {
        board.style.display = 'grid';
        resetBoard();
        updateCurrentPlayerText();
        assignButtonClickListeners();

        if (gameMode === 'cpu' && currentPlayer === 'O') {
            isCpuTurn = true;
            setTimeout(cpuMove, 500);
        }
    }

    function checkWinner() {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const [x1, y1] = a;
            const [x2, y2] = b;
            const [x3, y3] = c;
    
            if (boardState[x1][y1] && boardState[x1][y1] === boardState[x2][y2] && boardState[x2][y2] === boardState[x3][y3]) {
                showWinner(boardState[x1][y1]);
                return true;
            }
        }
        return null;
    }
    
    function checkDraw() {
        if (filledButtons === 9 && !checkWinner()) {
            showDraw();
        }
    }

    function showWinner(winner) {
        if (gameEnded) return;
        gameEnded = true;

        winnerText.textContent = `Player ${winner} won, play again?`;
        winnerPopup.style.display = 'block';
        board.style.display = 'none';
        overlay.classList.add('active');

        if (winner === 'X') {
            xScore++;
            scoreX.textContent = xScore;
        } else if (winner === 'O') {
            oScore++;
            scoreO.textContent = oScore;
        }
        updateScoreboard();
    }

    function showDraw() {
        if (gameEnded) return;
        gameEnded = true;

        drawText.textContent = 'Draw :(';
        drawPopup.style.display = 'block';
        board.style.display = 'none';
        overlay.classList.add('active');
    }

    function hideOverlay() {
        overlay.classList.remove('active');
    }

    function resetGameState() {
        if (overlay.classList.contains('active')) {
            overlay.classList.remove('active');
        }
        winnerPopup.style.display = 'none';
        drawPopup.style.display = 'none';
        resetBoard();
        board.style.display = 'grid';
        assignButtonClickListeners();
        updateCurrentPlayerText();
        filledButtons = 0;
        gameEnded = false;
    }

    newGameButtonWinner.addEventListener('click', function() {
        resetGameState();
    });

    newGameButtonDraw.addEventListener('click', function() {
        resetGameState();
    });

    function updateScoreboard() {
        const players = [
            { name: 'X', score: xScore},
            { name: 'O', score: oScore}
        ];

        players.sort((a, b) => b.score - a.score);
        
        scoreboard.innerHTML = '';

        players.forEach(player => {
            const playerScore = document.createElement('p');
            playerScore.textContent = `Player ${player.name}: ${player.score}`;

            if (Math.abs(xScore - oScore) >= 10 && player.score === players[0].score) {
                playerScore.classList.add('flames');
            } else if (Math.abs(xScore - oScore) >= 5 && player.score === players[0].score) {
                playerScore.classList.add('glow');
            }

            scoreboard.appendChild(playerScore);
        });
    }

    function resetBoard() {
        boardState = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        filledButtons = 0;
        currentPlayer = 'X';
        updateCurrentPlayerText();

        const buttons = document.querySelectorAll('.board button');
        buttons.forEach((button) => {
            button.innerHTML = '';
            button.classList.remove('X', 'O');
            button.disabled = false;
        });
    }

    function updateCurrentPlayerText() {
        currentPlayerText.textContent = `${currentPlayer} to play`;
    }

    function assignButtonClickListeners() {
        const buttons = document.querySelectorAll('.board button');
        buttons.forEach(button => {
            button.removeEventListener('click', handleButtonClick);
            button.addEventListener('click', handleButtonClick);
        });
    }

    function handleButtonClick(event) {
        const button = event.target;
        if (button.innerHTML.trim() === '') {
            filledButtons++;

            const row = parseInt(button.getAttribute('data-row'));
            const col = parseInt(button.getAttribute('data-col'));

            if (row >= 0 && col >= 0 && row < 3 && col < 3) {
                boardState[row][col] = currentPlayer;
                button.innerHTML = currentPlayer;
                button.classList.add(currentPlayer);

                if (checkWinner()) {
                    return;
                }
                    checkDraw();

                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateCurrentPlayerText();

                button.disabled = true;

                if (gameMode === 'cpu' && currentPlayer === 'O') {
                    isCpuTurn = true;
                    setTimeout(cpuMove, 500);
                }
            }
        }
    }

    function cpuMove() {
        if (gameEnded) return;

        if (cpuDifficulty === 'easy') {
            easyCpuMove();
        } else if (cpuDifficulty === 'medium') {
            mediumCpuMove();
        } else if (cpuDifficulty === 'hard') {
            hardCpuMove();
        }
    }

    function easyCpuMove() {
        const emptyCells = getEmptyCells();
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [row, col] = emptyCells[randomIndex];
        makeMove(row, col);
        currentPlayer = 'X';
        updateCurrentPlayerText();
    }

    function mediumCpuMove() {
        const emptyCells = getEmptyCells();
        const blockingMove = findBlockingMove('X');
        if (blockingMove) {
            makeMove(blockingMove[0], blockingMove[1]);
            currentPlayer = 'X';
        } else {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const [row, col] = emptyCells[randomIndex];
            makeMove(row, col);
            currentPlayer = 'X';
        }
    }

    function hardCpuMove() {
        const [row, col] = bestMove();
        makeMove(row, col);
        currentPlayer = 'X';
        updateCurrentPlayerText();
    }

    function getEmptyCells() {
        const emptyCells = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (boardState[row][col] == '') {
                    emptyCells.push([row, col]);
                }
            }
        }
        return emptyCells;
    }

    function findBlockingMove(player) {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const [x1, y1] = a;
            const [x2, y2] = b;
            const [x3, y3] = c;

            if (boardState[x1][y1] === player && boardState[x2][y2] === player && boardState[x3][y3] === '') {
              return [x3, y3];  
            } else if (boardState[x2][y2] === player && boardState[x3][y3] === player && boardState[x1][y1] === '') {
                return [x1, y1];
            } else if (boardState[x1][y1] === player && boardState[x3][y3] === player && boardState[x2][y2] === '') {
                return [x2, y2];
            }
        }
        return null;
    }

    function minimax(boardState, depth, isMaximizing) {
        const emptyCells = getEmptyCells();
        if (emptyCells.length === 0) {
            return 0;
        }

        const winner = checkWinner();
        if (winner) {
            return winner === 'O' ? 10 - depth : depth -10;
        }

        let bestScore = isMaximizing ? -Infinity : Infinity;
        for (let i = 0; i < emptyCells.length; i++) {
            const [row, col] = emptyCells[i];
            boardState[row][col] = isMaximizing ? 'O' : 'X';
            const score = minimax(boardState, depth + 1, !isMaximizing);
            boardState[row][col] = '';
        
            bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
        }
        return bestScore;
    }
        
    function bestMove() {
        let bestScore = -Infinity;
        let move;
        
        const emptyCells = getEmptyCells();
        for (let i = 0; i < emptyCells.length; i++) {
            const [row, col] = emptyCells[i];
            boardState[row][col] = 'O';
            const score = minimax(boardState, 0, false);
            boardState[row][col] = '';
        
            if (score > bestScore) {
                bestScore = score;
                move = [row, col];
            }
        }
        
        return move;
    

    function makeMove(row, col) {
        const button = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (button && button.innerHTML.trim() === '') {
            filledButtons++;
            boardState[row][col] = 'O';
            button.innerHTML = 'O';
            button.classList.add('O');
            button.disabled = true;
    
            checkWinner();
            checkDraw();
            }
        }
    }
});