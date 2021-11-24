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

// Configurations

window.onload = function() {
    
}

class Game{
    constructor(){

    }

    startGame() {
        
    }
}

class Board{
    constructor(houseNumber, seedNumber){
        this.houseNumber = houseNumber;
        this.seedNumber = seedNumber;
        this.playerRow = new Row(this.houseNumber, this.seedNumber);
        this.adversaryRow = new Row(this.houseNumber, this.seedNumber);
        this.playerRow.setNextRow(this.adversaryRow);
        this.adversaryRow.setNextRow(this.playerRow);
    }

    createBoard() {

    }
}

class Row {
    constructor(houseNumber, seedNumber) {
        this.houseNumber = houseNumber;
        this.seedNumber = seedNumber;
        this.warehouse = new Warehouse(null, this);
        this.houses = []
        for (let i = 0; i < this.houseNumber; i++) {
            this.houses.push(new House(seedNumber, null, this));
        }
        for (let i = 0; i < this.houseNumber - 1; i++) {
            this.houses[i].setNextHouse(this.houses[i + 1]);
        }
        this.houses[this.houseNumber - 1].nextHouse(this.warehouse);
    }

    setWareHouse(warehouse) {
        this.warehouse = warehouse;
        this.houses[this.houseNumber - 1].setNextHouse(warehouse);
    }

    setNextRow(row) {
        this.warehouse.setNextHouse(row.houses[0]);
    }

    startSeed(houseNumber) {
        this.houses[houseNumber].startSeed();
    }
}

class House {
    constructor(seedNumber, nextHouse, row) {
        this.seedNumber = seedNumber;
        this.nextHouse = nextHouse;
        this.row = row;
    }

    setSeedNumber(seedNumber) {
        this.seedNumber = seedNumber;
    }

    setNextHouse(nextHouse) {
        this.nextHouse = nextHouse;
    }

    setRow(row) {
        this.row = row;
    }

    startSeed() {
        let tempSeeds = this.seedNumber;
        this.seedNumber = 0;
        this.nextHouse.seed(tempSeeds, this.row);
    }

    seed(seedNumber, row) {
        if (seedNumber == 1) {
            this.seedNumber++;
        }
        else {
            this.seedNumber++;
            this.nextHouse.seed(--seedNumber, row);
        }
    }
}

class Warehouse extends House {
    constructor(nextHouse, row) {
        super(0, nextHouse, row);
    }

    startSeed() {
    }

    seed(seedNumber, row) {
        if (row == super.row) super.seed(seedNumber);
        else super.nextHouse.seed(seedNumber);
    }
}