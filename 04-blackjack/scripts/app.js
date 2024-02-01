import { Human, Computer } from './player.js';
import { Deck } from './card-and-deck.js';

export class Game {
    constructor() {
        this.deck = new Deck();
        this.human = new Human(1000);
        this.computer = new Computer();
        this.setupEvents();
    }

    setupEvents() {
        document
            .getElementById('bet-btn')
            .addEventListener('click', this.human.bet.bind(this, this.human));
        document
            .getElementById('hit-btn')
            .addEventListener(
                'click',
                this.human.hit.bind(this, this.human, this.deck)
            );
        // document
        //     .getElementById('stay-btn')
        //     .addEventListener('click', this.stay.bind(this));
    }

    static updateBalance(amount) {
        document.getElementById('balance').textContent = `$${amount}`;
    }

    deal() {
        this.showCard(this.human.draw(this.deck), true, false, 0);
        this.showCard(this.computer.draw(this.deck), true, true, 0);
        this.showCard(this.human.draw(this.deck), true, false, 1);
        this.showCard(this.computer.draw(this.deck), false, true, 1); // Don't show the second dealer card.
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
        } else {
            newImg.classList.add('player-card');
            newImg.style.bottom = `${position * 30}px`;
            newImg.style.left = `${position * 30}px`;
            playerPosition.appendChild(newImg);
        }
        if (show) {
            newImg.src = card.path;
        } else {
            newImg.src = `/images/card-back.png`;
        }
    }
}

const game = new Game();
