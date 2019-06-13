let canvas ;
let ctx ;
let startX = 5;
let startY = 0; 
let winOrLoss ;
var stop = "not";
var w = document.getElementById('wr').getBoundingClientRect().width;
var h = document.getElementById('wr').getBoundingClientRect().height;
var leftButton = document.getElementById('left');
var rightButton = document.getElementById('right');
var downButton = document.getElementById('down');
var pause = document.getElementById('pause');
var newGame = document.getElementById('newGame');
var rotateButton = document.getElementById('rotate');
var cw = w;
var ch = h;
const gbHeight = Math.floor(ch/24) ;
const gbWidth = Math.floor(cw/24) ;
let coordinateArray;
coordinateArray = [...Array(gbHeight+1)].map(e => Array(gbWidth+1).fill(0));
// Initialize the array with 0 
let currentTetrominoColor ;
let currentTetromino =  [[1,0], [0,1], [1,1], [2,1]];
var tetrominoColors = ['#1abc9c','#2ecc71','#3498db','#9b59b6','#f1c40f','#e74c3c','#ecf0f1','skyblue'] ;

let tetromino = [] ;
var gameBoard = [...Array(gbHeight+1)].map(e => Array(gbWidth+1).fill(0));;
var endArray = [...Array(gbHeight+1)].map(e=> Array(gbWidth+1).fill(0));

let DIRECTION = {
  IDLE : 0,
  DOWN : 1,
  LEFT : 2,
  RIGHT : 3
};

let direction ;

class coordinate {
  constructor(x,y){
    this.x = x ;
    this.y = y ;
  }
}

document.addEventListener("DOMContentLoaded",startCanvas);

function createCoordinateArray(){
  let i=0 ,j=0;
  for(var y = 0 ; y<=canvas.height ; y+=25){
    for(var x= 0 ; x<=canvas.width ; x+=25){
      coordinateArray[i][j] = new coordinate(x,y) ;
      i++;
    }
    i=0;
    j++;
  } 
}

createTetrominos();

function startCanvas() {
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = cw ;
  canvas.height = ch ;
  console.log(canvas.height);
  ctx.scale(1,1);
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width , canvas.height);
  createCoordinateArray();
  createTet();
  drawTertromino();
}

leftButton.addEventListener('click',e=>{
  if(winOrLoss!="Game Over"){
    direction = DIRECTION.LEFT ;
      if(hittingWall() && !horizontalCollision()){
        clearScreen();
        startX--;
        drawTertromino();
      }
  }
})

rightButton.addEventListener('click',e=>{
  if(winOrLoss!="Game over"){
    direction = DIRECTION.RIGHT ;
    if(hittingWall()&& !horizontalCollision()){
      clearScreen();
      startX++;
      drawTertromino();
    }
  }
})

downButton.addEventListener('click',e=>{
  blockFall();
})

pause.addEventListener('click',e=>{
  if(stop === "not")
  stop = "yes";
  else
  stop = "not" ;
})

newGame.addEventListener('click',e=>{
  startX = 5 ;
  startY = 0 ;
  stop = "not" ;
  winOrLoss = "newGame";
  coordinateArray = [...Array(gbHeight+1)].map(e=> Array(gbWidth+1).fill(0)); 
  gameBoard = [...Array(gbHeight+1)].map(e=> Array(gbWidth+1).fill(0));
  endArray = [...Array(gbHeight+1)].map(e=> Array(gbWidth+1).fill(0));
  startCanvas();
})

rotateButton.addEventListener('click',e=>{
  rotateTetro();
})

document.addEventListener('keypress',key=>{
  if(winOrLoss!="Game Over"){  
    if(key.keyCode === 97){
      direction = DIRECTION.LEFT ;
      if(hittingWall() && !horizontalCollision()){
        clearScreen();
        startX--;
        drawTertromino();
      }
    } else if(key.keyCode===100){
      direction = DIRECTION.RIGHT ;
      if(hittingWall() && !horizontalCollision()){
        clearScreen();
        startX++;
        drawTertromino();
      }
    } else if(key.keyCode===115){
      blockFall();
    }else if(key.keyCode === 114){
      rotateTetro();
    }else if(key.keyCode === 32 ){
      if(stop === "not")
      stop = "yes";
      else
      stop = "not" ;
    }
  }
})

function createTetrominos(){
  tetromino.push([[1,0], [0,1], [1,1], [2,1]]);
  tetromino.push([[0,0], [1,0], [2,0], [3,0]]);
  tetromino.push([[0,0], [0,1], [1,1], [2,1]]);
  tetromino.push([[0,0], [1,0], [0,1], [1,1]]);
  tetromino.push([[2,0], [0,1], [1,1], [2,1]]);
  tetromino.push([[1,0], [2,0], [0,1], [1,1]]);
  tetromino.push([[0,0], [1,0], [1,1], [2,1]]);
}


function createTet(){
  let randomNo = Math.floor(Math.random() * tetromino.length);
  currentTetromino = tetromino[randomNo];
  currentTetrominoColor = tetrominoColors[randomNo];
}

function drawTertromino(){
  for(let i=0 ; i<currentTetromino.length ; i++){
    let x = currentTetromino[i][0] + startX ;
    let y = currentTetromino[i][1] + startY ;
    gameBoard[x][y] = 1;    
    let coX = coordinateArray[x][y].x ;
    let coY = coordinateArray[x][y].y ;
    ctx.fillStyle = currentTetrominoColor ;
    ctx.fillRect(coX,coY,24,24);
  }
}

function clearScreen(){
  for(let i=0 ; i<currentTetromino.length ; i++){
    let x = currentTetromino[i][0] + startX ;
    let y = currentTetromino[i][1] + startY ;
    gameBoard[x][y] = 0;    
    let coX = coordinateArray[x][y].x ;
    let coY = coordinateArray[x][y].y ;
    ctx.fillStyle = 'black' ;
    ctx.fillRect(coX,coY,24,24);
  }
}
function blockFall(){
  direction = DIRECTION.DOWN ;
  if(hittingWall() && !verticalCollision()){
    clearScreen();
    startY++;
    drawTertromino();
  }
}

function hittingWall(){
  for(var i=0 ; i<currentTetromino.length ; i++){
    var coX = currentTetromino[i][0] + startX ;
    var coY = currentTetromino[i][1] + startY ;
    if(coX<=0 && direction === DIRECTION.LEFT)
    return false ;
    if(coX>=gbWidth-1 && direction === DIRECTION.RIGHT)
    return false ;
    if(coY >=gbHeight-1 && direction ===  DIRECTION.DOWN)
    return false ;
  }
  return true ;
}


function verticalCollision(){
  if(winOrLoss!="Game Over"){
    let tetroCopy = currentTetromino ;
    let collision = false ;
    for(let i=0 ; i<tetroCopy.length ; i++){
      let square = tetroCopy[i];
      var x = square[0] + startX ;
      var y = square[1] + startY ;
    
      if(direction === DIRECTION.DOWN){
        y++ ;
      }
      if(gameBoard[x][y+1] === 1){
        var st = endArray[x][y+1] ;
        if(typeof st === 'string'){
          clearScreen();
          startY++;
          drawTertromino();
          collision = true ;
          break ;
        }
      }
      if(y>=gbHeight-1){
        collision = true ;
        break ;
      }
    }
      if(collision){
        if(startY <= 2 ){
          winOrLoss = "Game Over";
        }else{
          for(let i=0 ; i<tetroCopy.length ; i++){
            let square = tetroCopy[i] ;
            let x = square[0] + startX ;
            let y = square[1] + startY ;
            endArray[x][y] = currentTetrominoColor ; 
          }
          if(winOrLoss != "Game Over"){
          createTet();
          direction = DIRECTION.IDLE;
          startX = 5 ;
          startY = 0 ;
          drawTertromino();}
        }
      }
  }
}


function horizontalCollision(){
  let tetroCopy = currentTetromino ;
  let collision = false ;
  for(var i=0 ; i<tetroCopy.length ; i++){
    let square = tetroCopy[i] ;
    let x = tetroCopy[i][0] + startX ;
    let y = tetroCopy[i][1] + startY ;
    if(direction === DIRECTION.LEFT){
      x-- ;
      if(gameBoard[x][y] === 1){
        if(typeof endArray[x][y] === 'string'){
          collision = true ; 
          break ;
        }
      }
    }else{
      x++; 
      if(gameBoard[x][y] === 1){
        if(typeof endArray[x][y] === 'string'){
          collision = true ;
          break ;
        }
      }
    }

  }
  return collision ;
}

function rotateTetro(){
  let tetroCopy = currentTetromino ;
  let blockBackup ;
  let newRotation = new Array() ; 
  blockBackup = currentTetromino ;


  for(var i=0 ; i<tetroCopy.length ; i++){
    let x = tetroCopy[i][0] ; 
    let y = tetroCopy[i][1] ;
    let newX =( getLastX() - y );
    let newY = x ;
    newRotation.push([newX , newY]);
  }
  clearScreen();
  try{
    currentTetromino = newRotation;
    drawTertromino();
  }catch(e){
    if(e instanceof TypeError){//when you type something whoes index doesn't exists 
      currentTetromino = blockBackup ;
      clearScreen();
      drawTertromino();
    }
  }
}

function getLastX(){
  let lastX = 0 ;
  for(var i=0 ; i<currentTetromino.length ; i++){
    let square  = currentTetromino[i];
    if( square[0] > lastX )
      lastX = square[0];
  }
  return lastX ;
}

console.log(stop);

window.setInterval(function(){
  if(winOrLoss != "Game Over" && stop === "not"){
      blockFall();
  }
},800);
