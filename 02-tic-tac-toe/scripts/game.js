//SETUP 
let currentPlayer = 'X';

// 0 = no value
let board = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
]

// Win conditions
const winConditions = {
    0: [0, 1, 2],
    1: [2, 5, 8],
    2: [6, 7, 8],
    3: [0, 3, 6],
    4: [2, 4, 6],
    5: [0, 4, 8],
    6: [3, 4, 5],
    7: [1, 4, 7]
}

// Board Buttons
document.querySelectorAll('.square').forEach((element, index) => {
    
    element.addEventListener('click', () => {
        playerMove(index);
        renderGame(element, index);
        resultCheck()
        console.log(board);
    })
})

// Reset Button
document.querySelector('.reset-btn').addEventListener('click', () => {
    resetGame();
})

// Main Menu Button
document.querySelector('.main-menu-btn').addEventListener('click', () => {
    resetGame();
    divMenu.classList.remove('hide');
    divGame.classList.add('hide');
    divButtons.classList.add('hide');
});

// Functions

function renderGame(element, index, reset=0){
    //Update board with the current moves
    for (let i=0; i < board.length; i++){
        if (reset === 1){
            element.innerText = '';
        }
        if(i === index){
            if (board[i] === 0){
                continue;
            }
            element.innerText = board[i];
        }
    }
}
function playerMove(index){
    if (board[index] != 0){
        return;
    }
    if (currentPlayer === 'X'){
        board[index] = 'X';
        currentPlayer = 'O'
    }else{
        board[index] = 'O';
        currentPlayer = 'X'
    }
}
function resetGame(){
    board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ]
    document.querySelectorAll('.square').forEach((element, index) => {
        renderGame(element, index, 1);
    })
}
function resultCheck(){
    for (key in winConditions){
        if (board[winConditions[key][0]] === 'X' && 
        board[winConditions[key][1]] === 'X' &&
        board[winConditions[key][2]] === 'X'){
            // X wins
            console.log('X wins');
        }else if(board[winConditions[key][0]] === 'O' && 
        board[winConditions[key][1]] === 'O' &&
        board[winConditions[key][2]] === 'O'){
            // O wins
            console.log('O wins');
        }
    }
}

//Display current player
const player1div = document.querySelector('.player-1');
const player2div = document.querySelector('.player-2');
