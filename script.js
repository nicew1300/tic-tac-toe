const gameBoard = (function() {
    let board =     ["", "", "",
                    "", "", "",
                    "", "", ""]

    const getBoard = () => board 

    function placeMarker(index, marker) {
        if (board[index] == "") {
            board[index] = marker
            return true
        }
        else {
            console.log("There is already a marker placed there!")
            return false
        }
    }

    function resetBoard() {
        board = ["", "", "",
                "", "", "",
                "", "", ""]
    }
    return {getBoard, placeMarker, resetBoard}
}()) // this is an IIFE that makes the gameboard object

function playerFactory(name, marker) {
    return {name, marker}
}

const gameController = (function() {
    let player1;
    let player2;
    let activePlayer;

    // called by screenController when names have been entered
    function setPlayers(p1, p2) {
        player1 = p1;
        player2 = p2;
        activePlayer = player1;      // start with player1
    }

    const getActivePlayer = () => activePlayer

    function switchPlayer() {
        // "is activePlayer currently player1? if yes make it player2 if no make it player1"
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function playRound(index) {
        const legalMove = gameBoard.placeMarker(index, getActivePlayer().marker)

        if (legalMove == true) {
            console.log(gameBoard.getBoard())
            const isGameOver = checkWin(activePlayer) // this captures the return value (winnerFound)
    
            if (isGameOver == false) {
                switchPlayer(player1, player2, activePlayer);
            }
        }
    }

    function checkWin(activePlayer) {
        // reference list, better than writing 8 if statements i guess
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        let winnerFound = false

        // loop through the winning combinations and then check the real gameBoard array
        // [array[0]] basically takes the index of the array in winConditions above
        // and compares it to the index of the real gameBoard
        
        winConditions.forEach(array => {
            if (gameBoard.getBoard()[array[0]] === activePlayer.marker &&
                gameBoard.getBoard()[array[1]] === activePlayer.marker &&
                gameBoard.getBoard()[array[2]] === activePlayer.marker) {
                    winnerFound = true
            }
        })

        const isTie = !gameBoard.getBoard().includes("")

        if (winnerFound == true) {
            console.log(`${activePlayer.name} is the winner! Resetting board...`)
            gameBoard.resetBoard()
            return true
        }
        else if (isTie == true) {
            console.log("It's a tie! Resetting board...")
            gameBoard.resetBoard()
            return true // because the game is over
        }
        else {
            return false // the game continues because its not a tie and there is no winner
        }
    }

    return {setPlayers, getActivePlayer, switchPlayer, playRound, checkWin}
}()) // this is an IIFE that makes the gameController object

const screenController = (function() {

    const startGameButton = document.querySelector(".start-game")
    startGameButton.addEventListener("click", () => {
        getPlayerInput()
        createBoard()
    })
    
    function getPlayerInput() {
        let player1Name = document.querySelector("#player1").value
        let player2Name = document.querySelector("#player2").value

        if (!player1Name || !player2Name) {
            alert("Insert a name bro!")
        }
        else {
            let player1 = playerFactory(player1Name, "X")
            let player2 = playerFactory(player2Name, "O")
            gameController.setPlayers(player1, player2)
            createBoard()
        }
    }

    function createBoard() {
        const boardDiv = document.querySelector(".board");
        boardDiv.textContent = "" // clears the board first

        const currentBoard = gameBoard.getBoard()

        for (let i = 0; i < currentBoard.length; i++) {
            const boardButton = document.createElement("button")
            boardButton.classList.add("cell")
            
            boardButton.textContent = currentBoard[i]

            // link the click directly to the current index "i"
            boardButton.addEventListener("click", () => {
                gameController.playRound(i) // "i" is 0, 1, 2... 
                createBoard() // refresh the board to show the new marker
            });

            boardDiv.appendChild(boardButton);
        }
    }

    return {getPlayerInput, createBoard}
}()) // this is an IIFE that makes the screenController object