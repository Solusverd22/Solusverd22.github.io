// document.getElementById("die1").innerText = "D4";
//how to interact with basic html ^

var diceRollSound = new Audio("sound/diceRoll.mp3");
var nat20Sound = new Audio("sound/zeldaItem.mp3");
var nat1Sound = new Audio("sound/bruhMoment.mp3");

function Die(diesize) {
    this.size = diesize;
    this.lastRoll = null;

    this.roll = function () {
        diceRollSound.currentTime = 0;
        diceRollSound.play(); 
        //generates dice roll
        rollNumber = Math.ceil(Math.random() * this.size);
        //plays specific sounds for nat1 and nat20
        checkForBruhMoment(this.size,rollNumber);
        //generates text for dice box
        this.lastRoll = rollNumber + "/" + this.size;
        return this.lastRoll;
    }
}

function DieContainer(die) {
    this.die = die;

    this.roll = function (number) {
        if (this.die != null){
            document.getElementById("die" + number).innerText = this.die.roll();
            // this rolls the die object inside the container, and puts the value inside the correct html container
        }else{
            document.getElementById("die" + number).innerText = "-";
        }
    }
}

var diecontainer1 = new DieContainer(null);
var diecontainer2 = new DieContainer(null);
var diecontainer3 = new DieContainer(null);
var diecontainer4 = new DieContainer(null);
var diecontainer5 = new DieContainer(null);
var diecontainer6 = new DieContainer(null);

var diecontainers = [diecontainer1, 
    diecontainer2, 
    diecontainer3, 
    diecontainer4,
    diecontainer5,
    diecontainer6];

function RollDie(){
    // loops through the die containers to roll each one
    for (var i = 0; i < diecontainers.length; i++) {
        diecontainers[i].roll(i+1);
        // the i+1 gives the function which html container it should fill
    }
}

function AddDie(size) {
    containerindex = null;

    diecontainers.forEach( 
        function (value, index, array) {
            //this if finds the first container that is empty, making sure the 
            // containerIndex variable is null ensures later empty containers don't overwrite it
            if (value.die == null && containerindex == null){
                containerindex = index;
            }
        }
    );
    //above finds the first null container

    //below adds a new die (of the right size) in the null container
    diecontainers[containerindex].die = new Die(size);
    //below changes the html container's text to the size of the die
    document.getElementById("die" + (containerindex + 1)).innerText = "D"+size;
}

function RemoveDie(size) {
    containerindex = null;

    diecontainers.forEach( 
        function (value, index, array) {
            //this if finds the first container that is empty, since it loops through
            // every value(thing) in the array it will naturally give the last correct container
            if (value.die != null && value.die.size == size){
                containerindex = index;
            }
        }
    );

    diecontainers[containerindex].die = null;
    document.getElementById("die" + (containerindex + 1)).innerText = "-";
}

function ClearDie(){
    diecontainers.forEach( 
        function (value, index, array) {
            value.die = null;
            document.getElementById("die" + (index + 1)).innerText = "-";
        }
    );
}

function checkForBruhMoment(size,dRoll){
    if(dRoll == 20){
        nat20Sound.play();
    }
    if(size == 20 && dRoll == 1){
        nat1Sound.play();
    }
}

function animate() {
    requestAnimationFrame(animate);

}
animate();