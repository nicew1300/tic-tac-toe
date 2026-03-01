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

function createPlayer(name, marker) {
    return {name, marker}
}

const gameController = (function() {
    let player1 = createPlayer(screenController.player1Name, "X")
    let player2 = createPlayer(screenController.player2Name, "O")

    let activePlayer = player1

    const getActivePlayer = () => activePlayer

    function switchPlayer() {
        // "is activePlayer currently player1? if yes make it player2 if no make it player1"
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function playRound() {
        const legalMove = gameBoard.placeMarker(prompt("at what index do you wanna place your marker at?"), activePlayer.marker)

        if (legalMove == true) {
            console.log(gameBoard.getBoard())
            const isGameOver = checkWin(); // this captures the return value (winnerFound)
    
            if (isGameOver == false) {
                switchPlayer();
            }
        }
    }

    function checkWin() {
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

    return {getActivePlayer, switchPlayer, playRound, checkWin}
}()) // this is an IIFE that makes the gameController object

const screenController = (function() {
    const player1Name = document.querySelector("#player1").value
    const player2Name = document.querySelector("#player2").value

    const board = document.querySelector(".board")
    for (let i = 0; i++; i <= 9) {
        const boardButton = document.createElement(div)
        boardButton.classList.add("board-button")
        board.appendChild(boardButton)
    }

    return {player1Name, player2Name}
}()) // this is an IIFE that makes the screenController object