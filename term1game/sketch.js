/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var game_score;
var lives;

var trees_x;
var mountains;
var clouds;
var canyons;
var collectables;
var flagpole;

var isLeft;
var isRight;
var isFalling;
var isJumping;
var yVel;

var gameCharFrames;
var cloudImgs;
var mountainImg;
var treeImg;
var busSign;
var busImg;
var lifeImg;

var collectableSnd;
var jumpSnd;
var gameOverSnd;
var oofSnd;

function preload()
{
	gameCharFrames = {
		L:{
			Idle1: loadImage('images/CharL/AgentStill.png'),
			Idle2: loadImage('images/CharL/AgentStill2.png'),
			Run1: loadImage('images/CharL/AgentRun1.png'),
			Run2: loadImage('images/CharL/AgentRun2.png'),
			Run3: loadImage('images/CharL/AgentRun3.png'),
			Run4: loadImage('images/CharL/AgentRun4.png'),
			Jump1: loadImage('images/CharL/AgentJump1.png'),
			Jump2: loadImage('images/CharL/AgentJump2.png'),
		},
		R:{
			Idle1: loadImage('images/CharR/AgentStill.png'),
			Idle2: loadImage('images/CharR/AgentStill2.png'),
			Run1: loadImage('images/CharR/AgentRun1.png'),
			Run2: loadImage('images/CharR/AgentRun2.png'),
			Run3: loadImage('images/CharR/AgentRun3.png'),
			Run4: loadImage('images/CharR/AgentRun4.png'),
			Jump1: loadImage('images/CharR/AgentJump1.png'),
			Jump2: loadImage('images/CharR/AgentJump2.png'),
		}
	};

	cloudImgs = [
		loadImage('images/cloud1.png'),
		loadImage('images/cloud2.png')
	];

	mountainImg = loadImage('images/mountain.png');
	treeImg = loadImage('images/tree.png');
	busSign = loadImage('images/busSign.png');
	busImg = loadImage('images/bus.png');
	lifeImg = loadImage('images/life.png');
	

	collectableSnd = loadSound('sound/coinPickup.wav');
	jumpSnd = loadSound('sound/jump.wav');
	gameOverSnd = loadSound('sound/gameover.wav');
	oofSnd = loadSound('sound/oof.wav');
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	startGame();
}

function startGame() {
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	//sets the yVelocity of the character and the player's score to 0
	yVel = 0;
	game_score = 0;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isJumping = false;

	// Initialise arrays of scenery objects.
	clouds = [25, 490, 860, 1105, 1500, 1753, 2100, 2600, 3100, 3600, 4000, 4500, 4900, 5400, 5900, 6500, 6800];
	mountains = [50,150, 1100, 2203, 3100, 4000];
	trees_x = [0, 48, 98, 120, 200, 280, 380, 420, 560, 690];
	canyons = [{x_pos: -330, width: 300},
		{x_pos: 1560, width: 100},
		{x_pos: 750, width: 100},
		{x_pos: 2550, width: 100}
	];
	collectables = [{x_pos: 250, y_pos: 350, size: 0.8, width: 1, coinAnimator: 0.05, isFound: false},
		{x_pos: 940, y_pos: 350, size: 0.8, width: 1, coinAnimator: 0.05, isFound: false},
		{x_pos: 1250, y_pos: 350, size: 0.8, width: 1, coinAnimator: 0.05, isFound: false}
	];
	flagpole = {x_pos: 3000, isReached: false,busPos: 0.1};
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	// Draw mountains.
	drawMountains();

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

	// Draw clouds.
	drawClouds();
	// Draw trees.
	drawTrees();
	// Draw canyons.
	for (i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
	}
	// Draw collectable items.
	for (i = 0; i < collectables.length; i++) {
		drawCollectable(collectables[i]);
	}
	//check for items being collected
	for (i = 0; i < collectables.length; i++) {
		checkCollectable(collectables[i]);
	}

	// Draw flagpole
	renderFlagpole(flagpole);
	if(!flagpole.isReached){
		checkFlagpole(flagpole);
	}
	
	// Draw game character.
	drawGameChar();

	//draw score on the screen
	textSize(48);
	strokeWeight(5);
	stroke(0,0,0);
	fill("#036635");
	text("Score: " + game_score, 10, 40);

	//draw lives on the screen
	stroke(0,0,0);
	strokeWeight(5);
	textSize(48);
	fill("#036635");
	text("Lives: ",700,60);
	noFill();
	rect(width - 3 * lifeImg.width,10,3 * lifeImg.width - 5,lifeImg.height);
	for(i = 1; i <= lives; i++){
		image(lifeImg,width - i * lifeImg.width, 10);
	}

	//game end states code

	if(flagpole.isReached && flagpole.busPos > flagpole.x_pos + 500){ //game won
		stroke(0,0,0);
		strokeWeight(5);
		textSize(48);
		fill(255,255,100);
		text("Level complete. Press space to continue.",110,height/2);

		nextLevel();
    	return
	}

	function nextLevel() {
		window.location.href = "/index.html";
	}
	
	if(lives < 1){ //game over
		gameOverSnd.play();
		stroke(0,0,0);
		strokeWeight(5);
		textSize(48);
		fill(200,0,0);
		text("Game over. Press space to continue.",130,height/2);

		returnToStart();
		return
	}
	//restart when character dies
	if(gameChar_y >= height && lives != 0){
		lives-- ;
		if(lives != 0){
			startGame();
			oofSnd.play();
		}
	}

	// Logic to make the game character move or the background scroll.
	if(isLeft && (checkCanyon && gameChar_y <= floorPos_y))
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight && (checkCanyon && gameChar_y <= floorPos_y))
	{
		if(gameChar_x < width * 0.4)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	if(gameChar_y >= floorPos_y & !checkCanyon()){
		if(isJumping){
			yVel = 15;
			gameChar_y = gameChar_y - yVel;
			randomSeed();
			r = random(1.1,1.5);
			console.log(r);
			jumpSnd.play(0,r,0.8);
		}else{
			yVel = 0;
			GameChar_Y = floorPos_y;
		}
	}else{
		yVel = yVel - 1;
		gameChar_y = gameChar_y - yVel;
	}

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	if(keyCode == 68){
		isRight = true;
	}
	if(keyCode == 65){
		isLeft = true;
	}
	if(keyCode == 32){
		isJumping = true;
	}
	console.log("press" + keyCode);
	console.log("press" + key);

}

function keyReleased()
{
	if(keyCode == 68){
		isRight = false;
	}
	if(keyCode == 65){
		isLeft = false;
	}
	if(keyCode == 32){
		isJumping = false;
	}
	console.log("release" + keyCode);
	console.log("release" + key);

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	var y = gameChar_y-gameCharFrames.R.Idle1.height;
	var x = gameChar_x;
	var width = gameCharFrames.R.Idle1.width;
	// draw game character
	if(isLeft){
		if(yVel > 0){ //jumping
			image(gameCharFrames.L.Jump1,x,y);
		}
		else if (yVel < 0){ //falling
			image(gameCharFrames.L.Jump2,x,y);
		}
		else{
			if(Date.now()%600 <= 150){
				image(gameCharFrames.L.Run1,x,y);
			}
			else if(Date.now()%600 <= 300){
				image(gameCharFrames.L.Run2,x,y);
			}
			else if(Date.now()%600 <= 450){
				image(gameCharFrames.L.Run3,x,y);
			}
			else if(Date.now()%600 <= 600){
				image(gameCharFrames.L.Run4,x,y);
			}
		}

	}
	else if(isRight){
		if(yVel > 0){ //jumping
			image(gameCharFrames.R.Jump1,x,y);
		}
		else if (yVel < 0){//falling
			image(gameCharFrames.R.Jump2,x,y);
		}
		else{
			if(Date.now()%600 <= 150){
				image(gameCharFrames.R.Run1,x,y);
			}
			else if(Date.now()%600 <= 300){
				image(gameCharFrames.R.Run2,x,y);
			}
			else if(Date.now()%600 <= 450){
				image(gameCharFrames.R.Run3,x,y);
			}
			else if(Date.now()%600 <= 600){
				image(gameCharFrames.R.Run4,x,y);
			}
		}
	}
	else{
		if(yVel > 0){ //jumping
			image(gameCharFrames.R.Jump1,x,y);
		}
		else if (yVel < 0){//falling
			image(gameCharFrames.R.Jump2,x,y);
		}
		else{
			if(Date.now()%500 >= 250){	  
				image(gameCharFrames.R.Idle1,x,y);
			}
			else{
				image(gameCharFrames.R.Idle2,x,y);
			}
		}
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(){
	randomSeed(98);
	for (i = 0; i < clouds.length; i++) {
		image(cloudImgs[i%2], (clouds[i]) + scrollPos * 0.6 * random(),75+ random(-60,60));
	}
}
// Function to draw mountains objects.
function drawMountains(){
	for (i = 0; i < mountains.length; i++) {
		image(mountainImg,mountains[i] + scrollPos*0.3,floorPos_y-280,400,400);
	}
}
// Function to draw trees objects.
function drawTrees(){
	for (i = 0; i < trees_x.length; i++) {
		image(treeImg,trees_x[i]*10 + scrollPos,floorPos_y-treeImg.height);
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	fill(100, 155, 255);
    noStroke();
    rect(scrollPos + t_canyon.x_pos,floorPos_y,t_canyon.width,144);
    fill(150,93,43);
    rect(scrollPos + t_canyon.x_pos,floorPos_y,10,144);
    rect(scrollPos + t_canyon.x_pos+t_canyon.width,floorPos_y,10,144);
    rect(scrollPos + t_canyon.x_pos-10,floorPos_y,10,10);
	rect(scrollPos + t_canyon.x_pos+t_canyon.width+10,floorPos_y,10,10);
	fill(0,0,0);
}

// Function to check character is over a canyon.

function checkCanyon()
{
	for (i = 0; i < canyons.length; i++) {
		if(canyons[i].x_pos < gameChar_world_x && canyons[i].x_pos+canyons[i].width-30 > gameChar_world_x){
			return true;
		}
	}
	return false;
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
	if(!t_collectable.isFound){
		fill(255,255,0);
		stroke(0,0,0);
		strokeWeight(3);
		ellipse(
			scrollPos + t_collectable.x_pos,t_collectable.y_pos,
			t_collectable.size*60*t_collectable.width,
			t_collectable.size*60
			);
		fill(255,215,0);
		rect(
			scrollPos + t_collectable.x_pos-t_collectable.size*10*t_collectable.width,
			t_collectable.y_pos-t_collectable.size*20,
			t_collectable.size*20*t_collectable.width,t_collectable.size*40
			);
	
		t_collectable.width -= t_collectable.coinAnimator;
		if (t_collectable.width >= 1 || t_collectable.width <= -1){
			t_collectable.coinAnimator *= -1;
		}
	}
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos) < 64){
		if(!t_collectable.isFound){
			t_collectable.isFound = true;
			game_score ++;
			collectableSnd.play();
		}
	}
}

function renderFlagpole(t_flagpole){
	if(t_flagpole.isReached){
		image(busImg, t_flagpole.x_pos +200+scrollPos+t_flagpole.busPos, floorPos_y -135, 200,135);
		t_flagpole.busPos += 0.2*t_flagpole.busPos;
	}
	else{
		image(busImg, t_flagpole.x_pos +200+scrollPos, floorPos_y -135, 200,135);
	}
	
	strokeWeight(0);
	fill(200,200,200);
	rect(t_flagpole.x_pos+scrollPos,floorPos_y-200,10,200);
	fill(255,255,255);
	rect(t_flagpole.x_pos+scrollPos,floorPos_y-200,10*0.4,200);
	image(busSign,t_flagpole.x_pos+10+scrollPos,floorPos_y-200);
	fill(50,50,50);
	rect(t_flagpole.x_pos + 50 +scrollPos,floorPos_y,1000,height-floorPos_y);
}

function checkFlagpole(t_flagpole) {
	if(gameChar_world_x >= t_flagpole.x_pos){
		console.log("flagpole reached");
		t_flagpole.isReached = true;
	}
}
