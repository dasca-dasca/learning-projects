import { bet } from './betting.js';
import { balance as currentBalance } from './betting.js';


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
        this.splitCount = 1;
    }

    bet() {
        this.resetRound();
        this.human.currentBet = bet;
        if (this.checkAvailableBalance() === false) {
            return;
        }
        this.showCurrentHand();
        this.deal();

        //Check blackjack
        if (this.human.cards[0].amount === this.human.cards[1].amount) {
            this.manageButtons([0, 1, 1, 1, 1]);
        } else {
            this.manageButtons([0, 1, 1, 1, 0]);
        }
        this.checkForBlackjack(this.human, this.computer);
    }

    hit() {
        this.manageButtons([0, 0, 1, 1, 0]);
        this.human.amount = this.human.calculateTotal();
        if (this.human.amount > 21) {
            this.lose();
        }
    }
    double() {
        this.human.currentBet *= 2;

        this.human.amount = this.human.calculateTotal();
        this.manageButtons([0, 1, 1, 1, 1]);

        if (this.human.amount > 21) {
            this.lose();
            return;
        }
        this.computer.stay.call(this);
    }

    split() {
        if (this.checkAvailableBalance() === false) {
            return;
        }

        this.manageButtons([0, 1, 1, 1, 0]);

        //Setup previous and next human
        const newHuman = this.human.clone();

        //Enable div
        document
            .getElementById(`human-${newHuman.splitCount}`)
            .classList.remove('disabled');

        //Remove old card
        const poppedCard = this.human.cards.pop();
        document.getElementById(`${poppedCard.id}`).remove();
        newHuman.cards.shift();

        //Add new card on the right side
        this.showHumanCard(newHuman.cards[0], newHuman);
        this.humans.push(newHuman);

        //Give the second card for the initial hand
        this.showHumanCard(this.human.draw(this.deck), this.human);
    }

    clone() {
        // Creates a full clone of the current this.human
        const clone = new Human(this.balance);
        clone.currentBet = this.currentBet;
        clone.splitCount = this.splitCount + 1;
        clone.cards = [...this.cards];
        clone.amount = 0;
        return clone;
    }
}

export class Computer extends Player {
    constructor() {
        super();
    }

    stay() {
        document.querySelectorAll('.current-hand').forEach((value) => {
            value.remove();
        });

        if (this.humans.length === this.human.splitCount + 1) {
            this.human = this.humans[this.human.splitCount];
            this.setupEvents(this.human);

            //Show the current hand
            this.showCurrentHand();

            this.showHumanCard(this.human.draw(this.deck), this.human);

            if (this.human.cards[0].amount === this.human.cards[1].amount) {
                this.manageButtons([0, 1, 1, 1, 1]);
            } else {
                this.manageButtons([0, 1, 1, 1, 0]);
            }
            return;
        }
        //Remove face down card
        const faceDownCard = document.querySelector('.face-down-card');
        faceDownCard.remove();

        //Show what was the face down card
        this.showComputerCard(this.computer.cards[1]);

        //Logic
        this.computer.amount = this.computer.calculateTotal();

        while (this.computer.amount < 17) {
            const nextCard = this.computer.draw(this.deck);
            this.showComputerCard(nextCard);
            this.computer.amount = this.computer.calculateTotal();
        }
        this.checkResult();
    }
}
