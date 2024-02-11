import { Human, Computer } from './player.js';
import { Deck } from './card-and-deck.js';

export class Game {
    constructor() {
        this.deck = new Deck();
        this.human = new Human(200);
        this.humans = [this.human];
        this.computer = new Computer();
        this.setupEvents(this.human);
    }

    static updateBalance(amount) {
        document.getElementById('balance').textContent = `$${amount}`;
    }

    ////////////////////////////////////////////////////////////////////
    //EVENTS
    ////////////////////////////////////////////////////////////////////
    currentEventHandlers = {};
    newEventHandlers = {
        betBtn: this.betBtnHandler,
        hitBtn: this.hitBtnHandler,
        doubleBtn: this.doubleBtnHandler,
        splitBtn: this.splitBtnHandler,
        stayBtn: this.stayBtnHandler,
    };

    setupEvents(human) {
        // Remove existing event handlers if necessary
        this.removeExistingEventHandlers();
        // Set up new event handlers
        const buttonNames = Object.keys(this.buttons);
        buttonNames.forEach((buttonName) => {
            const clickHandler = this.newEventHandlers[buttonName].bind(
                this,
                human
            );
            this.currentEventHandlers[buttonName] = clickHandler;
            this.buttons[buttonName].addEventListener('click', clickHandler);
        });
    }

    removeExistingEventHandlers() {
        const buttonNames = Object.keys(this.buttons);
        buttonNames.forEach((buttonName) => {
            const existingHandler = this.currentEventHandlers[buttonName];
            if (existingHandler) {
                this.buttons[buttonName].removeEventListener(
                    'click',
                    existingHandler
                );
                delete this.currentEventHandlers[buttonName];
            }
        });
    }

    betBtnHandler(human) {
        human.bet.call(this);
    }
    hitBtnHandler(human) {
        this.showHumanCard(human.draw(this.deck), human);
        human.hit.call(this);
    }
    doubleBtnHandler(human) {
        if (this.checkAvailableBalance() === false) {
            return;
        }
        this.showHumanCard(human.draw(this.deck), human);
        human.double.call(this);
    }
    splitBtnHandler() {
        this.human.split.call(this);
    }
    stayBtnHandler() {
        this.computer.stay.call(this);
    }
    ////////////////////////////////////////////////////////////////////
    //BUTTONS
    ////////////////////////////////////////////////////////////////////
    buttons = {
        betBtn: document.getElementById('bet-btn'),
        doubleBtn: document.getElementById('double-btn'),
        hitBtn: document.getElementById('hit-btn'),
        stayBtn: document.getElementById('stay-btn'),
        splitBtn: document.getElementById('split-btn'),
    };

    deal() {
        //Deal initial cards
        this.showHumanCard(this.human.draw(this.deck), this.human);
        this.showComputerCard(this.computer.draw(this.deck));
        this.showHumanCard(this.human.draw(this.deck), this.human);
        this.showComputerCard(this.computer.draw(this.deck), false); // Don't show the second dealer card.
    }
    showComputerCard(card, show = true) {
        const newImg = document.createElement('img');
        newImg.id = card.id;
        const position = document.getElementById('computer-cards-div');
        newImg.classList.add('card', 'computer-card');
        position.appendChild(newImg);
        newImg.style.top = `${(this.computer.cards.length - 1) * 30}px`;
        newImg.style.right = `${(this.computer.cards.length - 1) * 30}px`;

        if (show) {
            // // LATER SHOW ALL THE AMOUNT
            newImg.src = card.path;
            this.showAmount(position, this.computer);
        } else if (!show) {
            // AT START, ONLY SHOW THE AMOUNT FOR THE FIRST CARD
            newImg.src = `/images/card-back.png`;
            newImg.classList.add('face-down-card');
            this.showAmount(position, this.computer, true);
        }
    }
    showHumanCard(card, human) {
        const newImg = document.createElement('img');
        newImg.id = card.id;
        const position = document.getElementById(`human-${human.splitCount}`);
        newImg.classList.add('card', 'human-card');
        position.appendChild(newImg);
        newImg.src = card.path;
        newImg.style.bottom = `${(human.cards.length - 1) * 30}px`;
        newImg.style.left = `${(human.cards.length - 1) * 30}px`;
        this.showAmount(position, this.human);
    }

    showAmount(position, player, hide = false) {
        const resultCount = position.firstElementChild;
        resultCount.style.position = 'absolute';

        if (player === this.computer) {
            resultCount.style.top = '-40px';
        } else {
            resultCount.style.bottom = '-40px';
        }

        if (hide === true) {
            resultCount.textContent = player.cards[0].amount;
            return;
        }

        player.amount = player.calculateTotal();

        if (player.amount > 21) {
            resultCount.textContent = 'BUST';
            resultCount.classList.add('lose');
            return;
        }
        resultCount.textContent = player.amount;
    }

    checkResult() {
        for (const human of this.humans) {
            const resultCount = document.getElementById(
                `human-${human.splitCount}`
            ).firstElementChild;

            if (resultCount.textContent === 'BUST') {
                continue;
            }

            if (human.amount === this.computer.amount) {
                resultCount.innerHTML += ` - <span class="push">PUSH</span>`;
                this.humans[0].balance += human.currentBet;
            } else if (
                human.amount < this.computer.amount &&
                this.computer.amount < 22
            ) {
                resultCount.innerHTML += ` - <span class="lose">LOSE</span>`;
            } else if (
                human.amount > this.computer.amount ||
                this.computer.amount > 21
            ) {
                resultCount.innerHTML += ` - <span class="win">WIN</span>`;
                this.humans[0].balance += human.currentBet * 2;
            }
        }
        this.manageButtons([1, 0, 0, 0, 0]);
        Game.updateBalance(this.humans[0].balance);
    }

    checkForBlackjack(human, computer) {
        const humanAmount = human.calculateTotal();
        const computerAmount = computer.calculateTotal();

        if (humanAmount === 21 && computerAmount === 21) {
            this.showComputerCard(computer.cards[1]);
            this.checkResult();
        } else if (humanAmount === 21) {
            this.showComputerCard(computer.cards[1]);
            this.humans[0].balance += human.currentBet * 0.5;
            this.checkResult();
        } else if (computerAmount === 21) {
            this.showComputerCard(computer.cards[1]);
            this.checkResult();
        }
    }

    lose() {
        this.manageButtons([1, 0, 0, 0, 0]);
        this.computer.stay.call(this);
    }

    manageButtons(binaryArray) {
        //The array should contain 1-5 binary digits
        //Each 1 represents a button on
        //Each 0 represents a button off
        if (binaryArray.length !== 5) {
            console.error(
                'Invalid binary array. It must have exactly 5 elements.'
            );
            return;
        }

        Object.keys(this.buttons).forEach((buttonKey, index) => {
            const button = this.buttons[buttonKey];
            const isEnabled = binaryArray[index] === 1;
            button.disabled = !isEnabled;
            if (isEnabled){
                button.classList.remove('btn-disabled')
            }else if(!isEnabled){
                button.classList.add('btn-disabled')
            }            
        });
    }

    checkAvailableBalance() {
        const human = this.humans[0];
        if (human.balance < human.currentBet) {
            const modal = document.createElement('p');
            modal.classList.add('modal-balance');
            const body = document.querySelector('body');
            modal.textContent = `Not enough balance. Current balance: $${human.balance}.`;
            body.appendChild(modal);

            setTimeout(() => {
                modal.remove();
            }, 3500);

            return false;
        }
        human.balance -= human.currentBet;
        Game.updateBalance(human.balance);
    }

    showCurrentHand() {
        const resultCount = document.getElementById(
            `human-${this.human.splitCount}`
        );
        const currentHand = document.createElement('p');
        currentHand.innerHTML = '&rightarrow;';
        currentHand.classList.add('current-hand');
        resultCount.appendChild(currentHand);
    }

    resetRound() {
        this.deck = new Deck();

        if (this.humans.length > 1) {
            for (let i = 2; i < this.human.splitCount + 1; i++) {
                const resultCount = document.getElementById(`human-${i}`);
                resultCount.classList.add('disabled');
            }
            this.human = this.humans[0];
            this.human.splitCount = 1;
            this.humans = this.humans.slice(0, 1);
        }

        for (const value of [this.human, this.computer]) {
            value.cards = [];
            value.amount = 0;
        }
        this.human.currentBet = 0;

        document.querySelectorAll('.card').forEach((card) => card.remove());
        document.querySelectorAll('.has').forEach((value) => {
            value.textContent = '';
            value.className = 'has';
        });

        this.setupEvents(this.human);
    }
}

const game = new Game();
