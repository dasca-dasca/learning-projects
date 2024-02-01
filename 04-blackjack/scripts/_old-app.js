import { Human, Computer } from './player.js'
import { Deck } from './card-and-deck.js';

class Game {
    constructor(balance) {
        this.balance = balance;
        this.deck = new Deck();
        this.human = new Human();
        this.computer = new Computer();
        this.currentBet = 0;
        this.setupEvents();
    }

    setupEvents() {
        document
            .getElementById('bet-btn')
            .addEventListener('click', this.bet.bind(this));
        document
            .getElementById('hit-btn')
            .addEventListener('click', this.human.hit.bind(this));
        document
            .getElementById('stay-btn')
            .addEventListener('click', this.stay.bind(this));
    }

    doubleBtn = document.getElementById('double-btn');
    splitBtn = document.getElementById('split-btn');

    bet() {
        const amount = Number.parseInt(
            document.getElementById('bet-amount').value
        );
        if (amount > this.balance) {
            console.log(`Not enough funds. Balance: $${this.balance}`);
            return;
        }
        this.balance -= amount;
        this.currentBet = amount;
        this.updateBalance(this.balance);
        this.deal();
    }

    updateBalance(amount) {
        document.getElementById('balance').textContent = `$${amount}`;
    }

    deal() {
        this.human.draw(this.deck);
        this.computer.draw(this.deck);
        this.human.draw(this.deck);
        this.computer.draw(this.deck);// Don't show the second dealer card.

        // this.checkForBlackjack();

        // this.dealerAmount = this.dealerLogic(true);
        // this.playerAmount = this.playerLogic();
    }

    stay() {
        console.log(
            `~ DEALER shows ${this.dealerCards[1].value} of ${this.dealerCards[1].type}.`
        );
        this.dealerAmount = this.dealerLogic();
        this.checkResult();
    }

    checkResult() {
        if (this.playerAmount === this.dealerAmount) {
            console.log(
                `Push! Dealer ${this.dealerAmount} - ${this.playerAmount} Player`
            );
            this.balance += this.currentBet;
        } else if (this.playerAmount > this.dealerAmount) {
            console.log(
                `Player Wins! Player ${this.playerAmount} - ${this.dealerAmount} Dealer`
            );
            this.balance += this.currentBet * 2;
        } else {
            console.log(
                `Dealer Wins! Dealer ${this.dealerAmount} - ${this.playerAmount} Player`
            );
        }
        this.updateBalance(this.balance);
    }

    // checkForBlackjack() {
    //     if (this.playerCards[0].amount + this.playerCards[1].amount === 21) {
    //         //win
    //         console.log('User blackjack');
    //     } else if (
    //         this.dealerCards[0].amount + this.dealerCards[1].amount ===
    //         21
    //     ) {
    //         //lose
    //         console.log('Dealer blackjack');
    //     }
    // }

    dealerLogic(show = false) {
        let total = this.calculateTotal(this.dealerCards);
        if (show === true) {
            console.log(`~ DEALER has ${total}.`);
            return total;
        }
        while (total < 17) {
            console.log(`~ DEALER has ${total}.`);
            const nextCard = this.draw('dealer');
            total += nextCard.amount;
        }
        console.log(`~ DEALER has ${total}.`);
        return total;
    }
}

const game = new Game(1000);
