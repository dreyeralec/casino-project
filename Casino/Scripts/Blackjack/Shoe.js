class Shoe {
    constructor() {
        this.shoe = [];

        const suites = ["Spades", "Hearts", "Clubs", "Diamonds"];
        const values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

        for (let suite of suites) {
            for (let numValue of values) {
                let card = new Card(numValue, suite, `../Images/Blackjack/${numValue}Of${suite}.png`);
                this.shoe.push(card);
            }
        }
    }

    drawCard() {
        const drawIndex = Math.floor(Math.random() * this.shoe.length);
        const card = this.shoe[drawIndex];

        return card;
    }
}