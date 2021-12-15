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

window.onload = function() {
    config_modal.style.display = "block";
}


/*var tds = document.querySelector(".classification td");

for(let i = 0; i < tds.length(); i++){
    tds[i].classList.add(tds[i].innerText);
}*/

/* Game Logic */

// ENUM
const PVP = 0;
const RAND_AI = 1;
const BEST_MOVE_AI = 2;

function getRandomInt(max) {
    let temp = Math.floor(Math.random() * max);
    //console.log("Generated " + temp.toString());
    return temp;
}

class House {
    constructor(seedNumber, row) {
        this.seedNumber = seedNumber;
        this.row = row;
        this.next = null;
        this.container = null;
        this.added = 0;
    }

    startSeed() {
        if (this.seedNumber === 0) {
            console.log("No seeds in that house!");
            return true;
        }
        console.log("Starting seed with: " + this.seedNumber.toString());
        this.added -= this.seedNumber;
        let temp = this.seedNumber;
        this.seedNumber = 0;
        return this.next.seed(temp, this.row)
    }

    seed(seeds, ogRow) {
        console.log("Seeded one, " + (seeds - 1).toString() + " remaining, now have: " + (this.seedNumber + 1) + ".");
        this.seedNumber++;
        this.changed(1);
        if (seeds === 1) {
            if (this.row === ogRow && this.seedNumber === 1) {
                console.log("Entered special rule taking from oposite house.")
                this.row.storehouse.addSeeds(this.row.getOppositeHouse(this).removeSeeds() + 1);
                this.seedNumber = 0;
                this.changed(-1);
            }
            return false;
        }
        else {
            return this.next.seed(--seeds, ogRow);
        }
    }

    addSeeds(seeds) {
        this.seedNumber += seeds;
        this.changed(seeds);
    }

    removeSeeds() {
        console.log("Taking " + this.seedNumber.toString() + " from this house.")
        let temp = this.seedNumber;
        this.seedNumber = 0;
        this.changed(-temp);
        return temp;
    }

    setContainer(container) {
        this.container = container;
    }

    changed(seeds) {
        if(this.added == 0) this.added = seeds;
        else this.added += seeds;
    }

    resetAdded() {
        this.added = 0;
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
            console.log("Seeded one, " + (seeds - 1).toString() + " remaining, now have: " + (this.seedNumber + 1).toString() + ".");
            this.seedNumber++;
            this.changed(1);
            if (seeds === 1) {
                return true;
            }
            else {
                return this.next.seed(--seeds, ogRow);
            }
        }
        else {
            return this.next.seed(seeds, ogRow);
        }
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

        //console.log("Row length " + this.houses.length.toString());

        this.houses[(this.houses.length - 1)].next = this.storehouse;
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
            total += this.houses[i].seedNumber;
        }
        return total;
    }

    copy() {
        let res = new Row(this.houseNumber, this.seedNumber);

        for(let i = 0; i < res.houseNumber; i++) {
            res.houses[i].seedNumber = this.houses[i].seedNumber;
            res.houses[i].added = this.houses[i].added;
        }

        res.storehouse.seedNumber = this.storehouse.seedNumber;
        res.storehouse.added = this.storehouse.added;

        for(let i = 0; i < res.houseNumber - 1; i++) {
            res.houses[i].next = res.houses[i + 1];
        }

        res.houses[res.houseNumber - 1].next = res.storehouse;

        return res;
    }
}

class Game {
    constructor(houseNumber, seedNumber, mode) {
        this.houseNumber = houseNumber;
        this.seedNumber = seedNumber;
        this.mode = mode;

        this.adversaryRow = new Row(this.houseNumber, this.seedNumber);
        this.playerRow = new Row(this.houseNumber, this.seedNumber);

        this.adversaryRow.setNextRow(this.playerRow);
        this.playerRow.setNextRow(this.adversaryRow);
    }

    bestPossibleMove() {
        let bestMoves = [];
        let res = 1;

        for (let i = 1; i <= this.houseNumber; i++) {
            let gameClone = this.copy();

            gameClone.adversaryRow.startSeedAt(i);

            bestMoves.push(gameClone.adversaryRow.storehouse.seedNumber);

            console.log("Possible move: " + i.toString());
        }

        for (let i = 2; i <= this.houseNumber; i++) {
            if (bestMoves[res - 1] < bestMoves[i - 1]) res = i;
        }

        console.log("Best move at: " + res.toString());
        return res;
    }

    copy() {
        let res = new Game(this.houseNumber, this.seedNumber, this.mode);

        res.adversaryRow = this.adversaryRow.copy();
        res.playerRow = this.playerRow.copy();

        res.adversaryRow.setNextRow(res.playerRow);
        res.playerRow.setNextRow(res.adversaryRow);

        return res;
    }
}

let houseNumberChooser = document.getElementById("houses_number");

let seedNumberChooser = document.getElementById("seeds_number");

let startGameButton = document.getElementById("start_game_button");

let game = undefined;

let player = true;

let house = 0;

let playNext = null;

function setPlay() {
    showTurnMessage();
    for(let i = 0; i < game.houseNumber; i++) {
        if (game.mode === PVP) {
            game.adversaryRow.houses[i].container.onclick = function(){
                if (!player) {
                    playNext = game.adversaryRow.startSeedAt(i + 1);
                    if (!playNext) {
                        player = true;
                    }
                    updateBoard();
                    showTurnMessage();
                    if(game.adversaryRow.empty() || game.playerRow.empty()) checkWinner();
                }
            };
        }
        game.playerRow.houses[i].container.onclick = function(){
            if (player) {
                playNext = game.playerRow.startSeedAt(i + 1);
                if (!playNext) {
                    player = false;
                }
                updateBoard();
                showTurnMessage();
                if(game.adversaryRow.empty() || game.playerRow.empty()) checkWinner();
            }
        };
    }
    if (game.mode !== PVP) {
        let gameSection = document.getElementById("game");
        let playAIButton = document.createElement("playAIButton");
        gameSection.appendChild(playAIButton);
        playAIButton.id = "playAIButton";
        playAIButton.innerHTML = "Play AI";
        playAIButton.onclick = function() {
            if (!player) {
                if (game.mode === RAND_AI) {
                    house = getRandomInt(game.houseNumber) + 1;
                    console.log("Random move AI playing: " + house.toString());
                } else if (game.mode === BEST_MOVE_AI) {
                    house = game.bestPossibleMove();
                    console.log("Best move AI playing: " + house.toString());
                }
                playNext = game.adversaryRow.startSeedAt(house);
                if (!playNext) {
                    player = true;
                }
                updateBoard();
                showTurnMessage();
                if(game.adversaryRow.empty() || game.playerRow.empty()) checkWinner();
            }
        }
    }
}

function checkWinner() {
    for(let i = 0; i < game.houseNumber; i++) {
        game.playerRow.houses[i].container.onclick = function(){};
        game.adversaryRow.houses[i].container.onclick = function(){};
    }

    if (game.playerRow.getTotal() > game.adversaryRow.getTotal()) {
        // Player ganha - do smth
        console.log("Player wins!");
        updateLeaderboard("Player", game.playerRow.getTotal());
    }
    else if (game.playerRow.getTotal() < game.adversaryRow.getTotal()) {
        // Adversary ganha - do smth
        console.log("Adversary wins!");
        updateLeaderboard("Adversary", game.adversaryRow.getTotal());
    }
    else {
        // Tie
        console.log("Tie!");
    }
}

function showTurnMessage() {
    let gameSection = document.getElementById("game");
    let prevMessage;
    if ((prevMessage = document.getElementById("tm")) !== null) {
        prevMessage.remove();
    }
    let turnMessage = document.createElement("turnMessage");
    turnMessage.innerHTML = player ? "Player!" : "Adversary!";
    turnMessage.id = "tm"
    gameSection.appendChild(turnMessage);
}

function updateHouseSeeds(house, seeds, setHover) {
    if(setHover) {
        house.classList.add('playable_house');
    } else {
        house.classList.remove('playable_house');
    }
    if(seeds < 0){
        while(seeds < 0){
            house.removeChild(house.firstChild);
            seeds++;
        }
    }
    else{
        for(let i = 0; i < seeds; i++) {
            let seed = document.createElement("seed");
    
            seed.style.top = (getRandomInt(50) + 10).toString() + "%";
            seed.style.left = (getRandomInt(50) + 10).toString() + "%";
    
            house.appendChild(seed);
        }
    }
    
}

function updateBoard() {
    for(let i = 0; i < game.houseNumber; i++) {
        updateHouseSeeds(game.adversaryRow.houses[i].container, game.adversaryRow.houses[i].added, !player && game.mode === PVP);
        game.adversaryRow.houses[i].resetAdded();

        updateHouseSeeds(game.playerRow.houses[i].container, game.playerRow.houses[i].added, player);
        game.playerRow.houses[i].resetAdded();
    }
    updateHouseSeeds(game.adversaryRow.storehouse.container, game.adversaryRow.storehouse.added);
    game.adversaryRow.storehouse.resetAdded();

    updateHouseSeeds(game.playerRow.storehouse.container, game.playerRow.storehouse.added);
    game.playerRow.storehouse.resetAdded();

    if(player && game.mode !== PVP) {
        document.getElementById("playAIButton").classList.remove("playable_house");
    } else if (!player && game.mode !== PVP) {
        document.getElementById("playAIButton").classList.add("playable_house");
    }
}

function setBoard(houses, seeds) {
    game = new Game(houses, seeds, RAND_AI);

    let topRow = document.getElementById("topRow");

    let bottomRow = document.getElementById("bottomRow");

    while(topRow.firstChild) {
        topRow.removeChild(topRow.firstChild);
    }

    while(bottomRow.firstChild) {
        bottomRow.removeChild(bottomRow.firstChild);
    }

    topRow.style.gridTemplateColumns = "1fr ".repeat(houses);
    bottomRow.style.gridTemplateColumns = "1fr ".repeat(houses);

    game.adversaryRow.storehouse.container = document.getElementById("leftStorehouse");
    game.playerRow.storehouse.container = document.getElementById("rightStorehouse");

    for(let i = 0; i < houses; i++) {
        let topHouse = document.createElement("house");
        let bottomHouse = document.createElement("house");

        updateHouseSeeds(topHouse, seeds);
        updateHouseSeeds(bottomHouse, seeds);

        topRow.appendChild(topHouse);
        bottomRow.appendChild(bottomHouse);

        game.adversaryRow.houses[houses - 1 - i].container = topHouse;
        game.playerRow.houses[i].container = bottomHouse;
    }
}

houseNumberChooser.onchange = function() {
    setBoard(houseNumberChooser.value, seedNumberChooser.value);
};

seedNumberChooser.onchange = function() {
    setBoard(houseNumberChooser.value, seedNumberChooser.value);
};

startGameButton.onclick = function () {
    setPlay();
    config_modal.style.display = "none";
}

setBoard(houseNumberChooser.value, seedNumberChooser.value);

/* Leaderboard */

let class_table = document.getElementById("classification");

function updateLeaderboard(winner, score) {
    let class_row = class_table.insertRow();
    class_row.classList.add("class_row");

    let class_row_user = class_row.insertCell(0);
    class_row_user.classList.add("class_cell");
    
    let class_row_time = class_row.insertCell(1);
    class_row_time.classList.add("class_cell");

    let class_row_score = class_row.insertCell(2);
    class_row_score.classList.add("class_cell");

    class_row_user.innerHTML = winner;

    let today = new Date();
    class_row_time.innerHTML = today.getHours() + ":" + today.getMinutes();

    class_row_score.innerHTML = score;
}