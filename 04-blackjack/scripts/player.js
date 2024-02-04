import { Game } from './app.js';

class Player {
    constructor() {
        this.cards = [];
        this.amount = 0;
    }

    draw(deck) {
        const nextCard = deck.cards.shift();
        this.cards.push(nextCard);
        return nextCard;
    }

    calculateTotal() {
        let total = 0;
        let ace = 0;
        for (const card of this.cards) {
            if (card.amount === 11) {
                ace += 1;
            }
            total += card.amount;
        }
        if (total > 21 && ace > 0) {
            total -= ace * 10;
        }
        return total;
    }
}

export class Human extends Player {
    constructor(balance) {
        super();
        this.balance = balance;
        this.currentBet = 0;
    }

    bet() {
        this.resetRound();
        const amount = Number.parseInt(
            document.getElementById('bet-amount').value
        );
        if (amount > this.human.balance) {
            console.log(`Not enough funds. Balance: $${this.human.balance}`);
            return;
        }
        this.human.balance -= amount;
        this.human.currentBet = amount;
        Game.updateBalance(this.human.balance);
        this.deal();
    }

    hit() {
        this.manageButtons([0, 1, 0, 0, 1]);
        this.showCard(
            this.human.draw(this.deck),
            true,
            false,
            this.human.cards.length - 1
        );
        this.human.amount = this.human.calculateTotal();

        if (this.human.amount > 21) {
            this.lose();
        }
    }
    double() {
        if (this.human.balance < this.human.currentBet) {
            console.log('Not enough balance to double.');
            return;
        }
        this.human.balance -= this.human.currentBet;
        Game.updateBalance(this.human.balance);
        this.human.currentBet *= 2;
        this.showCard(
            this.human.draw(this.deck),
            true,
            false,
            this.human.cards.length - 1
        );
        this.human.amount = this.human.calculateTotal();
        this.manageButtons([1, 0, 0, 0, 0]);

        if (this.human.amount > 21) {
            this.lose();
            return;
        }
        this.computer.stay.call(this);
    }
}
export class Computer extends Player {
    constructor() {
        super();
    }

    stay() {
        //Remove face down card
        const faceDownCard = document.getElementById('face-down-card');
        faceDownCard.remove();

        //Show what was the face down card
        this.showCard(
            this.computer.cards[1],
            true,
            true,
            this.computer.cards.length - 1
        );

        //Logic
        this.computer.amount = this.computer.calculateTotal();

        while (this.computer.amount < 17) {
            const nextCard = this.computer.draw(this.deck);
            this.showCard(nextCard, true, true, this.computer.cards.length - 1);
            this.computer.amount = this.computer.calculateTotal();
        }

        this.checkResult();
    }
}
