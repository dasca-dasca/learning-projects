import { Deck } from './card-and-deck.js';
import { Game } from './app.js'

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
            if (card.amount === 11){
                ace += 1;
            }
            total += card.amount;
        }
        if (total > 21 && ace){
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

    hit(human, deck) {
        this.showCard(human.draw(deck), true, false, human.cards.length - 1);
        human.amount = human.playerLogic();
    }

    playerLogic() {
        let total = this.calculateTotal();
        if (total > 21) {
            console.log(`* Bust!`);
            //LOSE
        } else if(total < 21){

        }else{
            if (total === 21) {
                //STAY FORCED
            }
        }
        console.log(`* PLAYER has ${total}.`);
        return total;
    }

    bet(human) {
        const amount = Number.parseInt(
            document.getElementById('bet-amount').value
        );
        if (amount > human.balance) {
            console.log(`Not enough funds. Balance: $${human.balance}`);
            return;
        }
        human.balance -= amount;
        human.currentBet = amount;
        Game.updateBalance(human.balance);
        this.deal();
    }
}
export class Computer extends Player {
    constructor() {
        super();
    }
}

//TO ADD TO A SHOW METHOD
// if (show) {
//     console.log(
//         `${playerOrDealer.toUpperCase()} draws ${nextCard.value} of ${
//             nextCard.type
//         }.`
//     );
// } else {
//     console.log(`${playerOrDealer.toUpperCase()} draws ???.`);
// }

// class Game {
//     constructor(balance) {
//         this.balance = balance;
//         this.deck = new Deck();
//         this.currentBet = 0;
//         // this.playerCards = [];
//         // this.playerAmount = 0;
//         // this.dealerCards = [];
//         // this.dealerAmount = 0;
//         this.setupEvents();
//     }

//     setupEvents() {
//         document
//             .getElementById('bet-btn')
//             .addEventListener('click', this.bet.bind(this));
//         document
//             .getElementById('hit-btn')
//             .addEventListener('click', this.hit.bind(this));
//         document
//             .getElementById('stay-btn')
//             .addEventListener('click', this.stay.bind(this));
//     }

//     doubleBtn = document.getElementById('double-btn');
//     splitBtn = document.getElementById('split-btn');

//     bet() {
//         const amount = Number.parseInt(
//             document.getElementById('bet-amount').value
//         );
//         if (amount > this.balance) {
//             console.log(`Not enough funds. Balance: $${this.balance}`);
//             return;
//         }
//         this.balance -= amount;
//         this.currentBet = amount;
//         this.updateBalance(this.balance);
//         this.deal();
//     }

//     updateBalance(amount) {
//         document.getElementById('balance').textContent = `$${amount}`;
//     }

//     // draw(playerOrDealer, show = true) {
//     //     const nextCard = this.deck.cards.shift();

//     //     if (playerOrDealer === 'player') {
//     //         this.playerCards.push(nextCard);
//     //     } else if (playerOrDealer === 'dealer') {
//     //         this.dealerCards.push(nextCard);
//     //     }

//     //     if (show) {
//     //         console.log(
//     //             `${playerOrDealer.toUpperCase()} draws ${nextCard.value} of ${
//     //                 nextCard.type
//     //             }.`
//     //         );
//     //     } else {
//     //         console.log(`${playerOrDealer.toUpperCase()} draws ???.`);
//     //     }
//     //     return nextCard;
//     // }

//     deal() {
//         this.draw('player');
//         this.draw('dealer');
//         this.draw('player');
//         this.draw('dealer', false); // Don't show the second dealer card.

//         this.checkForBlackjack();

//         this.dealerAmount = this.dealerLogic(true);
//         this.playerAmount = this.playerLogic();
//     }

//     hit() {
//         this.draw('player');
//         this.playerAmount = this.playerLogic();
//     }

//     stay() {
//         console.log(
//             `~ DEALER shows ${this.dealerCards[1].value} of ${this.dealerCards[1].type}.`
//         );
//         this.dealerAmount = this.dealerLogic();
//         this.checkResult();
//     }

//     checkResult() {
//         if (this.playerAmount === this.dealerAmount) {
//             console.log(
//                 `Push! Dealer ${this.dealerAmount} - ${this.playerAmount} Player`
//             );
//             this.balance += this.currentBet;
//         } else if (this.playerAmount > this.dealerAmount) {
//             console.log(
//                 `Player Wins! Player ${this.playerAmount} - ${this.dealerAmount} Dealer`
//             );
//             this.balance += this.currentBet * 2;
//         } else {
//             console.log(
//                 `Dealer Wins! Dealer ${this.dealerAmount} - ${this.playerAmount} Player`
//             );
//         }
//         this.updateBalance(this.balance);
//     }

//     checkForBlackjack() {
//         if (this.playerCards[0].amount + this.playerCards[1].amount === 21) {
//             //win
//             console.log('User blackjack');
//         } else if (
//             this.dealerCards[0].amount + this.dealerCards[1].amount ===
//             21
//         ) {
//             //lose
//             console.log('Dealer blackjack');
//         }
//     }

//     calculateTotal(playerOrDealer) {
//         //playerOrDealer has to be either: this.playerCards or this.dealerCards
//         let total = 0;
//         let who = playerOrDealer;

//         for (const card of who) {
//             total += card.amount;
//         }
//         return total;
//     }

//     playerLogic() {
//         let total = this.calculateTotal(this.playerCards);
//         if (total > 21) {
//             console.log(`* Bust! PLAYER has ${total}.`);
//             //LOSE
//         } else {
//             console.log(`* PLAYER has ${total}.`);
//             if (total === 21) {
//                 //STAY FORCED
//             }
//         }
//         return total;
//     }

//     dealerLogic(show = false) {
//         let total = this.calculateTotal(this.dealerCards);
//         if (show === true) {
//             console.log(`~ DEALER has ${total}.`);
//             return total;
//         }
//         while (total < 17) {
//             console.log(`~ DEALER has ${total}.`);
//             const nextCard = this.draw('dealer');
//             total += nextCard.amount;
//         }
//         console.log(`~ DEALER has ${total}.`);
//         return total;
//     }
// }

// const game = new Game(1000);
