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
    constructor(housesNumber, seedsNumber){
        this.housesNumber = housesNumber;
        this.seedsNumber = seedsNumber;
    }

    createBoard() {

    }
}