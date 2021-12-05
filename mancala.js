// Get the modal
let inst_modal = document.getElementById("instructions");
        
// Get the button that opens the modal
let inst_btn = document.getElementById("instructions_button");

// Get the <span> element that closes the modal
let inst_span = document.getElementsByClassName("instructions_close")[0];

// When the user clicks the button, open the modal 
inst_btn.onclick = function() {
    inst_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
inst_span.onclick = function() {
    inst_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == inst_modal) {
        inst_modal.style.display = "none";
    }
}

/* Configurations */

//Modal
let config_modal = document.getElementById("configurations");
let config_span = document.getElementsByClassName("config_close")[0];
config_span.onclick = function() {
    config_modal.style.display = "none";
}
window.onload = function() {
    config_modal.style.display = "block";
}

// ENUM
const PVP = 0;
const RAND_AI = 1;
const BEST_MOVE_AI = 2;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class House {
    constructor(seedNumber, row) {
        this.seedNumber = seedNumber;
        this.row = row;
        this.next = null;
    }

    startSeed() {
        if (this.seedNumber === 0) {
            console.log("No seeds in that house!");
            return true;
        }
        let temp = this.seedNumber;
        this.seedNumber = 0;
        return this.next.seed(temp, row)
    }

    seed(seeds, ogRow) {
        this.seedNumber++;
        if (this.seedNumber === 1) {
            if (this.row === ogRow && this.seedNumber === 1) {
                this.row.storehouse.addSeeds(this.row.getOppositeHouse(this).removeSeeds() + 1);
                this.seedNumber = 0;
            }
            return false;
        }
        else return this.next.seed(--seeds, ogRow);
    }

    addSeeds(seeds) {
        this.seedNumber += seeds;
    }

    removeSeeds() {
        let temp = this.seedNumber;
        this.seedNumber = 0;
        return temp;
    }
}

class Storehouse extends House {
    constructor(row) {
        super(0, row);
    }

    startSeed() {
        return false;
    }

    seed(seeds, ogRow) {
        if (this.row === ogRow) {
            this.seedNumber++;
            if (seeds === 1) {
                return true;
            }
            else return this.next.seed(seeds, ogRow);
        }
        else return this.next.seed(seeds, ogRow);
    }
}

class Row {
    constructor(houseNumber, seedNumber) {
        this.houseNumber = houseNumber;
        this.seedNumber = seedNumber;
        this.houses = [];
        this.nextRow = null;

        for (let i = 0; i < this.houseNumber; i++) {
            this.houses.push(new House(this.seedNumber, this));
        }

        this.storehouse = new Storehouse(this);

        for (let i = 0; i < this.houseNumber - 1; i++) {
            this.houses[i].next = this.houses[i + 1];
        }

        this.house[this.houseNumber - 1].next = this.storehouse;
    }

    startSeedAt(houseNumber) {
        return this.houses[houseNumber - 1].startSeed();
    }

    setNextRow(row) {
        this.nextRow = row;
        this.storehouse.next = this.nextRow.houses[0];
    }

    getOppositeHouse(house) {
        let index = 9999;

        for (let i = 0; i < this.houseNumber; i++) {
            if (this.houses[i] === house) {
                index = i;
                break;
            }
        }

        if (index === 9999) return null;

        return this.nextRow.houses[this.houseNumber - 1 - index];
    }

    empty() {
        for (let i = 0; i < this.houseNumber; i++) {
            if (this.houses[i].seedNumber !== 0) return false;
        }
        return true;
    }

    getTotal() {
        let total = this.storehouse.seedNumber;
        for (let i = 0; i < this.houseNumber; i++) {
            total += houses[i].seedNumber;
        }
        return total;
    }
}

class Game {
    constructor(houseNumber, seedNumber, mode) {
        this.houseNumber = houseNumber;
        this.seedNumber = seedNumber;
        this.mode = mode;

        this.adversaryRow = new Row(this.houseNumber, this.seedNumber);
        this.playerRow = new Row(this.house, this.seedNumber);

        this.adversaryRow.setNextRow(this.playerRow);
        this.playerRow.setNextRow(this.adversaryRow);
    }

    play() {
        let player = true;
        let house = 0;
        while(!this.adversaryRow.empty() && !this.adversaryRow.empty()) {
            // Probs update a imagem do tabuleiro
            
            if (player) {
                // Gotta play here
                // Input da house

                if (this.playerRow.startSeedAt(house)) continue;
            }

            else {
                switch(this.mode)
                {
                    case PVP:
                        // Gotta play here
                        // Input da house

                        break;
                    case RAND_AI:
                        house = getRandomInt(this.houseNumber - 1) + 1;

                        break;
                    case BEST_MOVE_AI:
                        house = this.bestPossibleMove() + 1;

                        break;
                    default:
                        console.error("No valid mode for game");
                        return;
                }
                if (this.adversaryRow.startSeedAt(house)) continue;
            }

            player = !player;
        }
        if (this.playerRow.getTotal() > this.adversaryRow.getTotal()) {
            // Player ganha - do smth
            console.log("Player wins!");
        }
        else if (this.playerRow.getTotal() < this.adversaryRow.getTotal()) {
            // Adversary ganha - do smth
            console.log("Adversary wins!");
        }
        else {
            // Tie
            console.log("Tie!");
        }
    }

    bestPossibleMove() {
        let bestMoves = [];
        let res = 0;

        for (let i = 1; i < this.houseNumber + 1; i++) {
            let gameClone = JSON.parse(JSON.stringify(this));

            gameClone.adversaryRow.startSeedAt(i);

            bestMoves.push(gameClone.adversaryRow.storehouse.seedNumber);
        }

        for (let i = 1; i < this.houseNumber; i++) {
            if (bestMoves[res] < bestMoves[i]) res = i;
        }

        return res;
    }
}
