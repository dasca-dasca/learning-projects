// Submit names
let player1 = '';
let player2 = '';
let currentInterval = 0;


const submitBtn = document.querySelector('.submit-btn');
const inputName1 = document.querySelector('.input-name-1')
const inputName2 = document.querySelector('.input-name-2')
const errorNames = document.querySelector('.error-names');
const divMenu = document.querySelector('.player-names')
const divGame = document.querySelector('.game')
const divButtons = document.querySelector('.buttons')

submitBtn.addEventListener('click', () => {
    submitPlayerNames();
})

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        submitPlayerNames()
    }
});

function submitPlayerNames(){
    if (inputName1.value === '' || inputName2.value === ''){
        clearTimeout(currentInterval)
        
        errorNames.innerText = 'Please enter both player names.';
        intervalID = setTimeout(() => {
            errorNames.innerText = '';
        }, 3000);
        currentInterval = intervalID;
    }else{
        //Get names and hide menu
        player1 = inputName1.value;
        player2 = inputName2.value;
        inputName1.value = '';
        inputName2.value = '';

        divMenu.classList.add('hide');
        divGame.classList.remove('hide');
        divButtons.classList.remove('hide');
    }
};