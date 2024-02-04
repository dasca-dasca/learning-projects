import { Human, Computer } from './player.js';
import { Deck } from './card-and-deck.js';

export class Game {
    constructor() {
        this.deck = new Deck();
        this.human = new Human(200);
        this.computer = new Computer();
        this.setupEvents();
    }

    //Buttons
    buttons = {
        betBtn: document.getElementById('bet-btn'),
        hitBtn: document.getElementById('hit-btn'),
        doubleBtn: document.getElementById('double-btn'),
        splitBtn: document.getElementById('split-btn'),
        stayBtn: document.getElementById('stay-btn'),
    };

    setupEvents() {
        this.buttons.betBtn.addEventListener(
            'click',
            this.human.bet.bind(this)
        );
        this.buttons.hitBtn.addEventListener(
            'click',
            this.human.hit.bind(this)
        );
        this.buttons.stayBtn.addEventListener(
            'click',
            this.computer.stay.bind(this)
        );
        this.buttons.doubleBtn.addEventListener(
            'click',
            this.human.double.bind(this)
        );
    }

    static updateBalance(amount) {
        document.getElementById('balance').textContent = `$${amount}`;
    }

    deal() {
        //Deal initial cards
        this.showCard(this.human.draw(this.deck), true, false, 0);
        this.showCard(this.computer.draw(this.deck), true, true, 0);
        this.showCard(this.human.draw(this.deck), true, false, 1);
        this.showCard(this.computer.draw(this.deck), false, true, 1); // Don't show the second dealer card.

        //Disable bet btn
        this.manageButtons([0, 1, 1, 1, 1])

        // this.checkForBlackjack();

        // this.dealerAmount = this.dealerLogic(true);
        // this.playerAmount = this.playerLogic();
    }
    showCard(card, show = true, dealer = false, position = 0, split = 0) {
        const newImg = document.createElement('img');
        const playerPosition = document.getElementById('player-cards-div');
        const dealerPosition = document.getElementById('dealer-cards-div');
        newImg.classList.add('card');
        if (dealer) {
            dealerPosition.appendChild(newImg);
            newImg.classList.add('dealer-card');
            newImg.style.top = `${position * 30}px`;
            newImg.style.right = `${position * 30}px`;
            this.showAmount(dealerPosition, this.computer, true);
        } else {
            newImg.classList.add('player-card');
            newImg.style.bottom = `${position * 30}px`;
            newImg.style.left = `${position * 30}px`;
            playerPosition.appendChild(newImg);
            this.showAmount(playerPosition, this.human);
        }
        if (show) {
            newImg.src = card.path;
        } else {
            newImg.src = `/images/card-back.png`;
            newImg.id = 'face-down-card';
        }
        if (show && dealer) {
            this.showAmount(dealerPosition, this.computer);
        }
    }

    showAmount(position, player, hide = false) {
        const where = position.firstElementChild;
        where.style.position = 'absolute';
        if (player === this.computer) {
            where.style.left = '70px';
        } else {
            where.style.right = '70px';
        }

        if (hide === true) {
            where.textContent = player.cards[0].amount;
            return;
        }

        player.amount = player.calculateTotal();
        where.textContent = player.amount;
    }

    checkResult() {
        if (this.human.amount === this.computer.amount) {
            console.log(
                `Push! Dealer ${this.computer.amount} - ${this.human.amount} Player`
            );
            this.human.balance += this.human.currentBet;
        } else if (
            this.human.amount < this.computer.amount &&
            this.computer.amount < 22
        ) {
            console.log(
                `Dealer Wins! Dealer ${this.computer.amount} - ${this.human.amount} Player`
            );
        } else if (
            this.human.amount > this.computer.amount ||
            this.computer.amount > 21
        ) {
            console.log(
                `Player Wins! Player ${this.human.amount} - ${this.computer.amount} Dealer`
            );
            this.human.balance += this.human.currentBet * 2;
        }
        this.manageButtons([1, 0, 0, 0, 0])
        Game.updateBalance(this.human.balance);
    }

    win() {}

    lose() {
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
        });
    }

    resetRound() {
        this.deck = new Deck();

        for (const value of [this.human, this.computer]) {
            value.cards = [];
            value.amount = 0;
        }
        this.human.currentBet = 0;

        document.querySelectorAll('.card').forEach((card) => card.remove());
        document.querySelectorAll('.has').forEach((value) => {
            value.textContent = '';
        });
    }
}

const game = new Game();
