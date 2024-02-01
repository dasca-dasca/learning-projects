class Card {
    constructor(value, type, amount, path) {
        this.value = value;
        this.type = type;
        this.amount = amount;
        this.path = path;
    }
}

export class Deck {
    constructor() {
        this.cards = [];
        this.buildDeck();
        this.shuffleDeck();
    }

    buildDeck() {
        const values = [
            'A',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            'J',
            'Q',
            'K',
        ];
        const types = ['clubs', 'diamonds', 'hearts', 'spades'];

        let picture = 1;

        for (const type of types) {
            for (const value of values) {
                let path = `/images/cards/${picture}.png`;

                let amount = 0;
                if (value === 'A') {
                    amount = 11;
                } else if (value === 'J' || value === 'Q' || value === 'K') {
                    amount = 10;
                } else {
                    amount = Number.parseInt(value);
                }

                this.cards.push(new Card(value, type, amount, path));

                picture += 1;
            }
        }
    }

    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}




