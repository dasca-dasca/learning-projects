const chip10 = document.getElementById('chip-10');
const chip25 = document.getElementById('chip-25');
const chip100 = document.getElementById('chip-100');

const balanceDiv = document.getElementById('balance-div');

const balanceDisplay = document.getElementById('balance');
const betAmountDisplay = document.getElementById('bet-amount');

let zIndexCounter = 1;
let balance = 300;
let bet = 0;

chip10.addEventListener('click', moveChip);
chip25.addEventListener('click', moveChip);
chip100.addEventListener('click', moveChip);

function moveChip() {
    const color = this.src.match(/\/\w+\-/)[0].replace(/\W/g, '');
    const value = this.dataset.value;

    this.removeEventListener('click', moveChip);
    this.classList.toggle('clicked');
    this.addEventListener('click', moveChipBack);
    updateBet('incrementBet', value);

    removeChipsFromBalance();
    if (balance < Number.parseInt(value)) {
        return;
    }

    this.style.zIndex = zIndexCounter++;
    createChips(`${color}`, `${value}`);
}

function moveChipBack() {
    this.removeEventListener('click', moveChipBack);
    this.classList.toggle('clicked');
    this.addEventListener('click', moveChip);

    const value = this.dataset.value;
    updateBet('decrementBet', value);
    addChipsToBalance();
}

const createChips = (color, value) => {
    const element = document.createElement('img');
    element.src = `/images/${color}-chip.png`;
    element.alt = `$${value} chip`;
    element.className = 'chip';
    element.id = `chip-${value}`;
    element.dataset.value = `${value}`;
    element.addEventListener('click', moveChip);
    balanceDiv.appendChild(element);
};

function updateBet(adjust, value) {
    if (adjust === 'incrementBet') {
        bet += Number.parseInt(value);
        balance -= Number.parseInt(value);
    } else if (adjust === 'decrementBet') {
        bet -= Number.parseInt(value);
        balance += Number.parseInt(value);
    }
    betAmountDisplay.textContent = `$${bet}`;
    balanceDisplay.textContent = `$${balance}`;
}

function removeChipsFromBalance() {
    document.querySelectorAll('.chip').forEach((chip) => {
        if (chip.className === 'chip') {
            if (balance < Number.parseInt(chip.dataset.value)) {
                chip.remove();
            }
        }
    });
}

function addChipsToBalance() {
    const chips = {
        'red': '100',
        'blue': '25',
        'white': '10',
    }

    for(const chip in chips){
        const chipElement = document.getElementById(`chip-${chips[chip]}`);

        if (!chipElement && balance >= parseInt(chips[chip])) {
            createChips(`${chip}`, `${chips[chip]}`);
        }
    }
}


