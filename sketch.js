// Dungeon explorer?
// Doan Khanh Vinh
// Date
//
// Extra for Experts:
// - create a special function for moving between areas.
// - battle scene,JSON and map construct with brushes
// credit to https://www.youtube.com/watch?v=yP5DKzriqXA for battle activation at 3:53:45

// error checking
// console.log(grid);
// console.log(character.y);
// console.log(character.x);

class Button {
  constructor(x,y,img,tempW,tempH,newState) {
    this.x = x;
    this.y = y;
    this.image = img;
    this.width = tempW;
    this.height = tempH;
    this.hoverColor = color(0,0,0,10);
    this.change = newState;
  }
  display() {
    if (this.isInside(mouseX,mouseY)) {
      fill(this.hoverColor);
      rect(this.x,this.y,this.width+2,this.height+2);
    }
    image(this.image,this.x,this.y,this.width,this.height);
  }
  changeState() {
    state = this.change;
  }
  isInside(x,y) {
    return x>=this.x && x<=this.x+this.width && y >= this.y && y <=this.y +this.height;
  }
}
// grid variables
const ROWS = 20;
const COLS = 20;
let grid;
let state = "menuScreen";
let cellWidth;
let cellHeight;
let character = {
  x:3,
  y:3,
  size:0,
  direction:"R",
  level: 1,
  maxHealthPoint: 100,
  healthPoint: 100,
};
// map variables
let start, room1A;
let room2A;
let room3A;
let room4A;
let room5A;
let room6A;
let north;
let west;
let south;
let east;
let door;
let grassTextures;
let rock;
let player;
let yellow_dirt;
let lair_stone;
let goblin;
// Battle state variables
let areaState = "start";
let walkable = [0,3];
let playerWalk = ["player","player2"];
let enemies = ["goblin"];
let foes;
//music
let overWorldMusic;
//background image
let batteBackgroundGrass;
let startingScreenImg;
//dialogue
let dialogue = "";
// Button
let newGame;
let startButton;

function preload() {
  //menu
  newGame = loadImage("assets/newgame.png");
  startingScreenImg = loadImage("assets/plainScene.png");
  //overworld
  start = loadJSON("assets/startA.json"), room1A = loadJSON("assets/room1A.json");
  room2A = loadJSON("assets/room2A.json");
  room3A = loadJSON("assets/room3A.json");
  room4A = loadJSON("assets/room4A.json");
  north = loadImage("assets/dirt_north_new.png");
  west = loadImage("assets/dirt_west_new.png");
  south = loadImage("assets/dirt_south_new.png");
  east = loadImage("assets/dirt_east_new.png");
  grassTextures = loadImage("assets/grass_1.png");
  rock = loadImage("assets/lab-rock_0.png");
  yellow_dirt = loadImage("assets/dirt_1_new.png");
  lair_stone = loadImage("assets/lair_1_old.png");
  player = loadImage("assets/human_new.png");
  door = loadImage("assets/entrance.png");
  goblin = loadImage("assets/goblin_new.png");
  //battle
  batteBackgroundGrass = loadImage("assets/battleback1.png");
  //music
  overWorldMusic = loadSound("assets/Woodland Fantasy.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellHeight = height/ROWS;
  cellWidth = width/COLS*0.7;
  startButton = new Button(width*0.4,height*0.4,newGame,300,100,"overWorld");
  // state = "overWorld";
  if (areaState === "start") {
    grid = start;
  }
  grid[character.y][character.x] = "player";
}

function draw() {
  background(220);
  if (state === "menuScreen") {
    displayMenuscreen();
    // escape menu in mousepress
  }
  if (state === "overWorld") {
    displayGrid(grid);
    displayHUD();
  }
  if (state === "battle") {
    displayBattle(foes);
  }
}

function displayMenuscreen() {
  image(startingScreenImg,0,0,width,height);
  startButton.display();
}

function create2dArray(COLS, ROWS) {
  let emptyArray = [];
  for (let y = 0;y<ROWS;y++) {
    emptyArray.push([]);
    for (let x = 0;x<COLS;x++) {
      emptyArray[y].push(0);
    }
  }
  return emptyArray;
}

function displayHUD() {
  fill(255);
  rect(width*0.7,0,width*0.3,height);
  fill(0);
  textSize(100);
  text(character.level,width*0.90,height*0.1);
  text("level",width*0.72,height*0.1);
  text(dialogue,width*0.72,height*0.7);
}

function displayGrid(grid) {
  for (let y = 0;y<ROWS;y++) {
    for (let x = 0;x<COLS;x++) {
      if (grid[y][x] === 0) {
        image(grassTextures,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x] === 1) {
        image(rock,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x] === 2) {
        image(lair_stone,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x] === 3) {
        image(yellow_dirt,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x] === "north") {
        image(north,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x] === "west") {
        image(west,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x] === "south") {
        image(south,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x] === "east") {
        image(east,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x]=== "player") {
        image(grassTextures,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
        image(player,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if (grid[y][x]=== "player2") {
        image(yellow_dirt,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
        image(player,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
      else if(grid[y][x]=== "goblin") {
        image(grassTextures,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
        image(goblin,x*cellWidth,y*cellHeight,cellWidth,cellHeight);
      }
    }
  }
}

function createRandom2dArray(COLS, ROWS) {
  let emptyArray = [];
  for (let y = 0;y<ROWS;y++) {
    emptyArray.push([]);
    for (let x = 0;x<COLS;x++) {
      if (random(100) <50) {
        emptyArray[y].push(0);
      }
      else{
        emptyArray[y].push(1);
      }
    }
  }
  return emptyArray;
}

function mousePressed() {
  // coordinate
  console.log(mouseX/width);
  console.log(mouseY/height);
  // escape menuscreen
  if (state === "menuScreen") {
    if (startButton.isInside(mouseX,mouseY)) {
      startButton.changeState();
      //play music
      overWorldMusic.play();
    }
  }
  if (state === "battle") {
    dialogue = "kill him!";
    state = "overWorld";
    character.level++;
  }
}

function mouseDragged() {
  //map editor
  let x = Math.floor(mouseX/cellWidth);
  let y = Math.floor(mouseY/cellHeight);
  //default move
  if (keyIsDown(192)) {
    grid[y][x] = 0;
  }
  //key 1 wall 1
  if (keyIsDown(49)) {
    grid[y][x] = 1;
  }
  //key 2 wall 2
  if (keyIsDown(50)) {
    grid[y][x] = 2;
  }
  //key 3 wall 3
  if (keyIsDown(51)) {
    grid[y][x] = 3;
  }
  if (keyIsDown(52)) {
    grid[y][x] = "north";
  }
  if (keyIsDown(53)) {
    grid[y][x] = "west";
  }
  if (keyIsDown(54)) {
    grid[y][x] = "south";
  }
  if (keyIsDown(55)) {
    grid[y][x] = "east";
  }
  if (keyIsDown(56)) {
    grid[y][x] = "goblin";
  }
}

function keyPressed() {
  //recreate grid
  if (key === "e") {
    grid = create2dArray(COLS, ROWS);
  }
  if (state === "overWorld") {
    moveMap();
    setDirection();
    fightEncounter();
  }
}

// I don't know if create a function and put it in will still have the same effect.
function moveMap() {
  //Move Areas
  //GO UP
  if (key === "w" && character.y===0) {
    if (areaState === "room3A") {
      // set new area
      grid[character.y][character.x] = 0; //reset old location
      grid = room1A;
      areaState = "room1A";
      // set character
      if (character.y === 0) {
        //move to other side of the map
        character.y = 19;
        //set new player new location
        grid[character.y][character.x] = "player";
      }
    }
    else if (areaState === "room4A") { // ROOM 4 TO ROOM 2
      // set new area
      grid[character.y][character.x] = 0; //reset old location
      grid = room2A;
      areaState = "room2A";
      // set character
      if (character.y === 0) {
        //move to other side of the map
        character.y = 19;
        //set new player new location
        grid[character.y][character.x] = "player";
      }
    }
  }
  //GO DOWN
  if (key === "s" && character.y===19) {
    if (areaState === "room1A") {
      // set new area
      grid[character.y][character.x] = 0; //reset old location
      grid = room3A;
      areaState = "room3A";
      // set character
      if (character.y===ROWS-1) {
        //move to other side of the map
        character.y = 1;
        //set new player new location
        grid[character.y][character.x] = "player";
      }
    }
    else if (areaState === "room2A") {// ROOM 2 TO ROOM 4
      // set new area
      grid[character.y][character.x] = 0; //reset old location
      grid = room4A;
      areaState = "room4A";
      // set character
      if (character.y===ROWS-1) {
        //move to other side of the map
        character.y = 1;
        //set new player new location
        grid[character.y][character.x] = "player";
      }
    }
  }
  //GO LEFT
  if (key === "a" && character.x===0) { 
    // set new area
    if (areaState === "room1A") { //ROOM 1 BACK TO START
      grid[character.y][character.x] = 0; //reset old location
      grid = start;
      areaState = "start";
      // set character
      if (character.x === 0) {
        //move to other side
        character.x = COLS-1;
        //set location
        grid[character.y][character.x] = "player";
      }
    }
    else if (areaState === "room2A") { //ROOM 2 BACK TO ROOM 1
      grid[character.y][character.x] = 0; //reset old location
      grid = room1A;
      areaState = "room1A";
      // set character
      if (character.x === 0) {
        //move to other side
        character.x = COLS-1;
        //set location
        grid[character.y][character.x] = "player";
      }
    }
    else if (areaState === "room4A") { //ROOM 4 BACK TO ROOM 3
      grid[character.y][character.x] = 0; //reset old location
      grid = room3A;
      areaState = "room3A";
      // set character
      if (character.x === 0) {
        //move to other side
        character.x = COLS-1;
        //set location
        grid[character.y][character.x] = "player";
      }
    }
  }
  //GO RIGHT
  if (key === "d" && character.x===19) {
    // set new area
    if (areaState === "start") {// START TO ROOM 1
      grid[character.y][character.x] = 0; //reset old location
      grid = room1A;
      areaState = "room1A";
      // set character
      if (character.x === COLS-1) {
        //move to other side
        character.x = 1;
        //set location
        grid[character.y][character.x] = "player";
      }
    }
    else if (areaState === "room1A") {//ROOM1 TO ROOM 2
      grid[character.y][character.x] = 0; //reset old location
      grid = room2A;
      areaState = "room2A";
      // set character
      if (character.x === COLS-1) {
        //move to other side
        character.x = 1;
        //set location
        grid[character.y][character.x] = "player";
      }
    }
    else if (areaState === "room3A") {//ROOM 3 TO ROOM 4
      grid[character.y][character.x] = 0; //reset old location
      grid = room4A;
      areaState = "room4A";
      // set character
      if (character.x === COLS-1) {
        //move to other side
        character.x = 1;
        //set location
        grid[character.y][character.x] = "player";
      }
    }
    else if (areaState === "room4A") {//ROOM 3 TO ROOM 4
      grid[character.y][character.x] = 0; //reset old location
      grid = create2dArray(COLS,ROWS);
      areaState = "room5A";
      dialogue = "Continued...";
      // set character
      if (character.x === COLS-1) {
        //move to other side
        character.x = 1;
        //set location
        grid[character.y][character.x] = "player";
      }
    }
  }
}

function setDirection() {
  let terrain;
  //Moving function
  if (key === "d") {
    character.direction = "R";
    let restraint = character.x +1;
    for (let i = 0; i <=1; i ++) {
      if (grid[character.y][character.x+1] === walkable[i]) {//next block is walakble
        //reset old location
        if (grid[character.y][character.x] === "player") {
          grid[character.y][character.x] = 0;
        }
        else if (grid[character.y][character.x] === "player2") {
          grid[character.y][character.x] = 3;
        }
        //move
        if (restraint > character.x) {
          character.x++;
          terrain = walkable[i];
        }
        //set new player location
        if (terrain === 0){
          grid[character.y][character.x] = "player";
        }
        else if (terrain === 3){
          grid[character.y][character.x] = "player2";
        }      
      }
    }
  }
  if (key === "a") {
    character.direction = "L";
    let restraint = character.x -1;
    for (let i = 0; i <=1; i ++) {
      if (grid[character.y][character.x-1] === walkable[i]) {
        //reset old location
        if (grid[character.y][character.x] === "player") {
          grid[character.y][character.x] = 0;
        }
        else if (grid[character.y][character.x] === "player2") {
          grid[character.y][character.x] = 3;
        }
        //move
        if (restraint < character.x) {
          character.x--;
          terrain = walkable[i];
        }
        //set new player location
        if (terrain === 0){
          grid[character.y][character.x] = "player";
        }
        else if (terrain === 3){
          grid[character.y][character.x] = "player2";
        }
      }
    }
  }
  if (key === "w" ) {
    character.direction = "U";
    let restraint = character.y -1;
    for (let i = 0; i <=1; i ++) {
      if (grid[character.y-1][character.x]=== walkable[i]) {
        //reset old location
        if (grid[character.y][character.x] === "player") {
          grid[character.y][character.x] = 0;
        }
        else if (grid[character.y][character.x] === "player2") {
          grid[character.y][character.x] = 3;
        }
        //move
        if (restraint < character.y) {
          character.y--;
          terrain = walkable[i];
        }
        //set new player location
        if (terrain === 0){
          grid[character.y][character.x] = "player";
        }
        else if (terrain === 3){
          grid[character.y][character.x] = "player2";
        }
      }
    }
  }
  if (key === "s") {
    character.direction = "D";
    let restraint = character.y +1;
    for (let i = 0; i <=1; i ++) {
      if (grid[character.y+1][character.x] === walkable[i]) {
        //reset old location
        if (grid[character.y][character.x] === "player") {
          grid[character.y][character.x] = 0;
        }
        else if (grid[character.y][character.x] === "player2") {
          grid[character.y][character.x] = 3;
        }
        //move
        if (restraint > character.y) {
          character.y++;
          terrain = walkable[i];
        }
        //set new player location
        if (terrain === 0){
          grid[character.y][character.x] = "player";
        }
        else if (terrain === 3){
          grid[character.y][character.x] = "player2";
        }
      }
    }
  }
}

function fightEncounter() {
  //set enemies and activate battle
  for (let i = 0;i<enemies.length;i++) {
    if (grid[character.y-1][character.x] === enemies[i]) {
      foes = enemies[i];
      gsap.to("#overlappingDiv", {opacity:1,repeat:3,yoyo:true,duration:0.4,onComplete() {
        "#overlappingDiv", {opacity:1,duration:0.4};
      }
      });
      setTimeout(changeToBattleScreen,1500);
      grid[character.y-1][character.x] = 0;
    }
    else if (grid[character.y+1][character.x] === enemies[i]) {
      foes = enemies[i];
      gsap.to("#overlappingDiv", {opacity:1,repeat:3,yoyo:true,duration:0.4,onComplete() {
        "#overlappingDiv", {opacity:1,duration:0.4};
      }
      });
      setTimeout(changeToBattleScreen,1500);
      grid[character.y+1][character.x] = 0;
    }
    else if (grid[character.y][character.x-1] === enemies[i]) {
      foes = enemies[i];
      gsap.to("#overlappingDiv", {opacity:1,repeat:3,yoyo:true,duration:0.4,onComplete() {
        "#overlappingDiv", {opacity:1,duration:0.4};
      }
      });
      setTimeout(changeToBattleScreen,1500);
      grid[character.y][character.x-1] = 0;
    }
    else if (grid[character.y][character.x+1] === enemies[i]) {
      foes = enemies[i];
      gsap.to("#overlappingDiv", {opacity:1,repeat:3,yoyo:true,duration:0.4,onComplete() {
        "#overlappingDiv", {opacity:1,duration:0.4};
      }
      });
      setTimeout(changeToBattleScreen,1500);
      grid[character.y][character.x+1] = 0;
    }
  }
}

function displayBattle() {
  image(batteBackgroundGrass,0,0,width,height);
  image(player,width*0.1783644558918223,height*0.5513307984790875,player.width*3,player.height*3);
  image(goblin,width*0.7160334835801674,height*0.5766793409378961,goblin.width*2,goblin.height*2 );
}

function changeToBattleScreen(enemyLocation) {
  state = "battle";
  //delete enemy
  enemyLocation = 0;
}
