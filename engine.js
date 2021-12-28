/*
ACKNOWLEDGEMENT
__________________________________
Author: Victor Evogor
Instagram: [victor_evogor](http://www.instagram.com/victor_evogor/)
Twitter: [@VEvogor](http://twitter.com/VEvogor)
___________________________________



TERMS OF USE
____________________________________

This code is free to use however you want on one condition, 
leave this comment
_____________________________________
*/
class Move{
 constructor (x1,y1,x2,y2,captured=[],lastDir={},firstDir={}){
  /* Only King captures can have lastDir and firstDir*/
  this.x1=x1;
  this.y1=y1;
  this.x2=x2;
  this.y2=y2;
  this.captured=captured;
  this.lastDir=lastDir;
  this.firstDir=firstDir;
 }
}

const blue=1;
const red=-1;
const kingRed=1.1;
const kingBlue=-1.1;
const popUpTimer=4.5;
let cells=document.getElementById("board");
let positions;
let selectedMove;
let turn;
let twoPlayer=false;
let selected=false;
let popUp=document.createElement("div");
let DEPTH=4;
let menu=document.createElement("div");
let homeBtn=document.createElement("div");
let docs=document.createElement("div");
let credits=document.createElement("div");

docs.setAttribute("id","info");
credits.setAttribute("id","credits");
homeBtn.setAttribute("id","home");
homeBtn.setAttribute("class","btn");
homeBtn.innerHTML=`<i class="fa fa-home"></i>`;
homeBtn.addEventListener("click",()=>renderMenu());
document.body.appendChild(homeBtn);
menu.setAttribute("id","menu");
menu.innerHTML=`
  
  <div id="menu-div">
  <h1>CHECKERS 1.0 </h1>
  <div onclick="startNewGame(false)" id="start-btn-single" class="btn"><i class="fa fa-user"></i> Single Player</div>
  <div onclick="startNewGame(true)" id="start-btn-double" class="btn"><i class="fa fa-users"></i> Multiplayer</div>
  <div onclick="info()" id="info" class="btn"><i class="fa fa-info-circle"></i> Info</div>
  <div onclick="showCredits()" id="credits" class="btn">Credits</div>
  </div>
  `;
docs.innerHTML=`
<div id="docs">
<h2>GamePlay</h2>
<p>&bull; Tap a checker to select it and tap an empty square to execute the move, if the move is valid your move will be played and the player turn switches</p>
<p>&bull; For multiple jumps, tap the final square where the checker will land. No intermediary moves. Multiple jumps are executed in one move</p>
<p>&bull; To perform a capture, if normal checker capture, tap the checker you want to use for capture and tap the final position of capture.
<br>For king capture tap the king and tap the final position of the move, bare in mind that kings fly, so kings can fly and capture multiple</p>
<h2>Rules</h2>
<p>&bull; A normal checker moves one step diagonally forward</p>
<p>&bull; A king checker can fly several steps diagonally forward or backwards</p>
<p>&bull; A normal checker can capture forward and backwards one step</p>
<p>&bull; A king checker can capture forward and backwards several step</p>
<p>&bull; There is no mandatory capture, but failure to capture or capture multiple in a given direction will result in the suppose capturing checker being ceased.</p>
<P>&bull;The player who is unable to move losses, if there remain two or less peices on both sides and all are kings, the game is a draw</p>
<h2>More to come</h2>
<p>This is the first ever version, more updates are coming in near future. More functionalities like:</p>
<ul>
<li>Replay move</li>
<li>Save game for later</li>
<li>Share saved game</li>
<li>Watch past game </li>
<li>Options to tweak the rules by which you play checkers</li>
<li>Select Difficulty</li>
<li>Recieve evaluation on how good you are</li>
<li>Multiplayer over the internet, play with anyone in the world, and more to come!</li>
</ul>
<p>will all be added, so stay tuned</p>
<h2>Developers</h2>
<p>This code is available on <a href="#">GitHub</a>, if you want to be part of this project you can fork the code and make changes that will be added to the game.<br> Your opinions are much welcomed</p>
</div>
`;
credits.innerHTML=`
<div id="acknowledge"><h2 id="author">Victor Evogor</h2>
<h4>Game designer and developer</h4>
<h3>About</h3>
<p>I love coding because of the challenges I encounter and
the joy that comes after solving a difficult coding project is indescribable.</p>
<p>I love it when people are pleased with my work.</p>
<p>I am working on a chess game, follow me to stay tune</p>
<ul style="margin-top: 10px">
<li><a href="http://www.instagram.com/victor_evogor/">Follow on instagram</a></li>
<li><a href="http://twitter.com/VEvogor">Follow on twitter @VEvogor</a></li>
</ul>
</div>
`;
popUp.setAttribute("class","pop-ups");
document.body.appendChild(popUp);
document.body.appendChild(menu);
document.body.appendChild(docs);
document.body.appendChild(credits);
renderMenu();

function startNewGame(twoPlayerMode){
  twoPlayer=twoPlayerMode;
  cells.style.display="grid";
  menu.style.display="none";
  homeBtn.style.display="block";
  
  turn=-1;
  selectedMove={};
 positions=[
 [0,1,0,1,0,1,0,1],
 [1,0,1,0,1,0,1,0],
 [0,1,0,1,0,1,0,1],
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0],
 [-1,0,-1,0,-1,0,-1,0],
 [0,-1,0,-1,0,-1,0,-1],
 [-1,0,-1,0,-1,0,-1,0]
 ];
 drawCells();
 clearPopUp();
 clearAllHighlightes();
 syncCells();
}

//Cells functions

function drawCells () {
 let id=0;
	for(let i=0,color=1; i<8; i++,color=1-color){
		for(let j=0; j<8; j++,color=1-color){
		 
			cells.innerHTML+=`<div class="slots ${(color===1)?'secondary-color':'primary-color'}" onclick="play(this)" data-null-slot="${(color===1)?'yes':'no'}" id='${id}'></div>`;
			id++;
		}
	}
}

function cellsCoordinate(x,y){
 return document.getElementById(`${y*8+x}`);
}

function syncCells(){
 for(let i=0; i<8; i++){
		for(let j=0; j<8; j++){
		if(positions[j][i]!==0)
			cellsCoordinate(i,j).innerHTML=`<div class="checker ${signOf(positions[j][i])===1?'red':'blue'}-checker" onclick="select(this)" data-color="${signOf(positions[j][i])===1?'red':'blue'}">
				<div class="inner">
				<i class="fa fa-crown ${Math.abs(positions[j][i])==1.1?true:false}-king"></i>
				</div>
			</div>`;else cellsCoordinate(i,j).innerHTML="";
		}
	}
}

function highlightPlayableMoves(x,y,player){
 let moves=generateMoves(positions,player);
 cellsCoordinate(x,y).style.border="2px solid goldenrod"
 moves.forEach((e)=>{
  if(e.x1==x && e.y1==y){
   cellsCoordinate(e.x2,e.y2).style.border="2px solid #fff";
  }
 }) 
}

function movable(x,y,player){
 let moves=generateMoves(positions,player);
 let r=false;
 moves.forEach((e)=>{
  if(e.x1==x && e.y1==y){
   r=true;
  }
 });
 return r;
}

function clearAllHighlightes(){
 for(let i=0;i<8;i++){
  for(let j=0; j<8; j++){
   cellsCoordinate(j,i).style.removeProperty("border");
  }
 }
}

function highlightChecker(x,y){
 cellsCoordinate(x,y).style.border="2px solid #999";
}

function select(checker){
 let id=checker.parentNode.id;
 let x=id%8;
 let y=Math.floor(id/8);
 let player=signOf(positions[y][x]);
 clearAllHighlightes();
 if(turn===player&&!selected){
 if(movable(x,y,player)){
  highlightPlayableMoves(x,y,player);
  selectedMove.x1=x;
  selectedMove.y1=y;
  selected=true;
 }else{
  highlightChecker(x,y);
 }
 }else{
  selected=false;
  selectedMove={};
 }
}

function validateMove(x1,y1,x2,y2,player){
 let moves=generateMoves(positions,player);
 for(let i of moves){
  if(i.x1==x1&&i.y1==y1&&i.x2==x2&&i.y2==y2){
   return clone(i);
  }
 }
 return false;
}

function play(slot){
 if(slot.getAttribute("data-null-slot")==="no"&&slot.innerHTML===""&&selected){
  let id=slot.id;
 let x=id%8;
 let y=Math.floor(id/8);
 selectedMove.x2=x;
 selectedMove.y2=y;
 let player=signOf(positions[selectedMove.y1][selectedMove.x1]);
 let formatedMove=validateMove(selectedMove.x1,selectedMove.y1,selectedMove.x2,selectedMove.y2,player);
  if(formatedMove){
    let end;
   executeMove(formatedMove,positions,player,true);
   if(end=checkEndState(positions)){ 
     gameOver(end)
    return;
    }
   
   syncCells();
   if(twoPlayer) turn=-turn;
   else{
    turn=-turn;
    showPopUp("Computer Thinking...");
     setTimeout(()=>{
       if(turn==1){
        computerPlay();
        turn=-turn;
        syncCells();
        if(end=checkEndState(positions)){ 
          gameOver(end)
         return;
         }else{
          clearPopUp();
         }
     }},50);
   }
   
   if(end=checkEndState(positions)) gameOver(end);
   syncCells();
  }
  selectedMove={};
  selected=false;
  clearAllHighlightes();
 }
}

function gameOver(status){
  if(status=="draw")
  showPopUp("draw");
  else if(status=="AI win")
   showPopUp("Red Wins!");
  else showPopUp("Blue Wins!");
  
  turn=1000;
}

function showPopUp(text) {
  popUp.innerHTML=text;
  popUp.style.display="block";
}

function clearPopUp() {
  popUp.style.display="none";
}

//Board functions
function makeKing(x,y,board){
 if(board[y][x]!==0) board[y][x]=signOf(board[y][x])*1.1;
 else throw new Error("Can't king an empty space");
}

function countAllPeices(board) {
  let r=0;
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(board[j][i]!==0) r++;
    }
  }
  return r;
}

function translate(x1,y1,x2,y2,board){
 board[y2][x2]=board[y1][x1];
 board[y1][x1]=0;
}

function del(x,y,board){
 if(board[y][x]!==0){
 board[y][x]=0;
 }else{
  throw new Error("Can't delete empty position.");
 }
}

function playerPeiceLeft(board,player) {
  let r=0;
  let type=[];
  for(let row of board){
    row.forEach((e)=>{
      if(signOf(e)==player){
        type.push(e);
        r++;}
    })
  }
  return {length:r,list:type};
}

function generateMoves(cellBoard,player){
 let board=clone(cellBoard);
 let moves=[];
 //Mx moves
 function generateMxMoves(){
  function checkForMovesInDir(x,y,xDir,yDir){
   let myBoard=clone(board);
   let iniX=x;
   let iniY=y;
   let chop=[];
   iteration(iniX,iniY,xDir,yDir);
     function iteration(x,y,xDir,yDir){
   if(
   (!(x+xDir>7)&&!(y+yDir>7) &&
   !(x+xDir<0) && !(y+yDir<0) &&
   !(x+2*xDir>7) && !(y+2*yDir>7) &&
   !(x+2*xDir<0) && !(y+2*yDir<0))
   ){
    if(
    signOf(myBoard[y+yDir][x+xDir])==-player
    &&
    myBoard[y+2*yDir][x+2*xDir]==0
    ){
     chop.push({x:x+xDir,y:y+yDir});
     moves.push(new Move(iniX,iniY,x+2*xDir,y+2*yDir,clone(chop)));
     del(x+xDir,y+yDir,myBoard);
     let prevChop=clone(chop);
     iteration(x+2*xDir,y+2*yDir,1,1);
     chop=clone(prevChop);
     iteration(x+2*xDir,y+2*yDir,-1,1);
     chop=clone(prevChop);
     iteration(x+2*xDir,y+2*yDir,1,-1);
     chop=clone(prevChop);
     iteration(x+2*xDir,y+2*yDir,-1,-1);
    }
   }
   }
  }
  for(let i=0; i<8; i++){
   for(let j=0;j<8;j++){
    if(signOf(board[i][j])==player&&Math.abs(board[i][j])==1){
     checkForMovesInDir(j,i,1,1);
     checkForMovesInDir(j,i,-1,1);
     checkForMovesInDir(j,i,1,-1);
     checkForMovesInDir(j,i,-1,-1)
    }
   }
  }
 }
 //M moves
 function generateMMoves(){
  function checkForMovesInDir(x,y,xDir,yDir){
   if((!(x+xDir>7)&&!(y+yDir>7) &&
   !(x+xDir<0) && !(y+yDir<0))){
    if(board[y+yDir][x+xDir]==0){
     moves.push(new Move(x,y,x+xDir,y+yDir));
    }
   }
  }
  for(let i=0; i<8; i++){
   for(let j=0; j<8; j++){
    if(signOf(board[i][j])==player&&Math.abs(board[i][j])==1){
     checkForMovesInDir(j,i,1,player);
     checkForMovesInDir(j,i,-1,player);
    }
   }
  }
 }
 //Kx Moves
 function generateKxMoves(){
  function checkMoveInDir(x,y,xDir,yDir) {
    let myBoard=clone(board);
    let iniX=x;
    let iniY=y;
    let iniDir={x:xDir,y:yDir}
    let chop=[];
    iteration(iniX,iniY,xDir,yDir);
    
    function iteration(x,y,xDir,yDir){
      let captured=false;
      let a=false;
      for(
        ;!(x+xDir>7)&&!(y+yDir>7) &&
      !(x+xDir<0) && !(y+yDir<0);
      xDir+=signOf(xDir),
      yDir+=signOf(yDir)
      ){
        if(myBoard[y+yDir][x+xDir]==0){
          if(a){
            captured=true;
            a=false;
            chop.push({x:x+xDir-signOf(xDir),y:y+yDir-signOf(yDir)});
            del(x+xDir-signOf(xDir),y+yDir-signOf(yDir),myBoard);
          }
          if(captured){
            moves.push(new Move(iniX,iniY,x+xDir,y+yDir,chop,{x:signOf(xDir),y:signOf(yDir)},clone(iniDir)));
            let prevChop=clone(chop);
            chop=clone(prevChop);
            iteration(x+xDir,y+yDir,-signOf(xDir),signOf(yDir));
            chop=clone(prevChop);
            iteration(x+xDir,y+yDir,signOf(xDir),-signOf(yDir));
            chop=clone(prevChop);
          }
        }else{
          if(a) break;
          if(signOf(myBoard[y+yDir][x+xDir])==((player==-1)?1:-1)){
            a=true;
          }else{
            break;
          }
        }
      }
    }
  }
  for(let i=0; i<8; i++){
   for(let j=0; j<8; j++){
    if(Math.abs(board[i][j])==1.1&&signOf(board[i][j])==player){
     checkMoveInDir(j,i,1,1);
     checkMoveInDir(j,i,1,-1);
     checkMoveInDir(j,i,-1,1);
     checkMoveInDir(j,i,-1,-1);
    }
   }
  }
 }
 
 //K Moves
 function generateKMoves(){
   function checkMoveInDir(x,y,xDir,yDir) {
     for(;!(x+xDir>7)&&!(y+yDir>7) &&
     !(x+xDir<0) && !(y+yDir<0);
     xDir+=signOf(xDir),
      yDir+=signOf(yDir)){
      if(board[y+yDir][x+xDir]!==0){
        break;
      }else{
        moves.push(new Move(x,y,x+xDir,y+yDir));
      }
     }
   }
  for(let i=0; i<8; i++){
    for(let j=0; j<8; j++){
     if(Math.abs(board[i][j])==1.1&&signOf(board[i][j])==player){
      checkMoveInDir(j,i,1,1);
      checkMoveInDir(j,i,1,-1);
      checkMoveInDir(j,i,-1,1);
      checkMoveInDir(j,i,-1,-1);
     }
    }
   }
 }
 generateMMoves();
 generateMxMoves();
 generateKMoves();
 generateKxMoves();
 return moves;
}
function executeMove(move,board,player,main=false){
 function xMoveWith(move){
  if(move.captured.length==0){
  for(let i of moves){ 
   if(i.captured.length>0)
    return clone(i);
  }
  }else if(move.captured.length>0&&type==1.1){
    let myBoard=clone(board);
    delCheckersInMove(move,myBoard);
    let myMoves=generateMoves(myBoard,player);
    for(let i of myMoves){ 
    if(i.x1==move.x2&&i.y1==move.y2&&i.captured.length>0&&!((-i.firstDir.x==move.lastDir.x)&&(-i.firstDir.y==move.lastDir.y))){ 
    return clone(i);
    }
   }
  }else{
   let myBoard=clone(board);
   delCheckersInMove(move,myBoard);
   let myMoves=generateMoves(myBoard,player);
   for(let i of myMoves){ 
   if(i.x1==move.x2&&i.y1==move.y2&&i.captured.length>0)
    return clone(i);
  }
  }
  return false;
 }
 
 function delCheckersInMove(move,board){
  move.captured.forEach((point)=>{
   del(point.x,point.y,board);
  });
 }

 function cease(x,y){
  if(main){
    let index=["1st","2nd","3rd","4th","5th","6th","7th","8th"];
    popUp.innerHTML=`Checker at the ${index[y]} row, ${index[x]} column,  has been ceased`;
    popUp.style.display="block";
    let bgColor=cellsCoordinate(x,y).style.backgroundColor;
    cellsCoordinate(x,y).style.backgroundColor="rgb(206, 131, 46)";
    setTimeout((()=>{
      popUp.style.display="none";
      cellsCoordinate(x,y).style.backgroundColor=bgColor;
    }),popUpTimer*1000);
  }
  del(x,y,board);
 }
 
 let moves=generateMoves(board,player);
 let type=Math.abs(board[move.y1][move.x1]);
 translate(move.x1,move.y1,move.x2,move.y2,board);
  //CEASING
  let supposeMove=xMoveWith(move);
  if(supposeMove){
   if(board[supposeMove.y1][supposeMove.x1]==0){
    cease(move.x2,move.y2);
   }else{
    cease(supposeMove.x1,supposeMove.y1);
   }
  }
  delCheckersInMove(move,board)
 if(Math.abs(board[move.y2][move.x2])==1){
  //KINGING
  if(move.y2==(player==-1?0:7)){
   makeKing(move.x2,move.y2,board);
  }
}

//Checking Win
if(generateMoves(board,-player).length==0){
  return true;
}

//Checking Loss
if(generateMoves(board,player).length==0){
  return false;
}

//Checking Draw
let playerCheckersLeft=playerPeiceLeft(board,player);
let oppositionCheckerLeft=playerPeiceLeft(board,-player);
if(
  playerCheckersLeft.length<=2
  &&oppositionCheckerLeft.length<=2
  &&playerCheckersLeft.list.every((e)=>Math.abs(e)==1.1)
  &&oppositionCheckerLeft.list.every((e)=>Math.abs(e)==1.1)
  ){
    return "draw";
  }
}

function checkEndState(board){
  if(generateMoves(board,-1).length==0){
    return "AI win";
  }
  
  //Checking Loss
  if(generateMoves(board,1).length==0){
    return "Human Win";
  }
  
  //Checking Draw
  let playerCheckersLeft=playerPeiceLeft(board,-1);
  let oppositionCheckerLeft=playerPeiceLeft(board,1);
  if(
    playerCheckersLeft.length<=2
    &&oppositionCheckerLeft.length<=2
    &&playerCheckersLeft.list.every((e)=>Math.abs(e)==1.1)
    &&oppositionCheckerLeft.list.every((e)=>Math.abs(e)==1.1)
    ){
      return "draw";
    }
    return false;
}

//AI 
function computerPlay() {
  let myBoard = clone(positions);
  let computerMove=miniMax(myBoard,1,DEPTH,-Infinity,Infinity);
  executeMove(computerMove,positions,1,true);
}

function evaluateBoard(board) {
  let r=0;
  for(let y=0; y<8; y++){
    for(let x=0; x<8; x++){
      if(board[y][x]==1.1){
        r+=4;
      }else if(board[y][x]==-1.1){
        r-=5;
      }else if(board[y][x]==1){
        r+=1+(y*0.00000029);
        if(x==7||x==0){
          r+=0.0000000005;
        }
      }else if(board[y][x]==-1){
        r-=1+((7-y)*0.3);
        if(x==7||x==0){
          r-=0.0000000005;
        }
      }
    }
  }
  return r;
}

function miniMax(board,player,depth,alpha,beta){
  
  let moves=generateMoves(board,player);
  if(state=checkEndState(board)){
    if(state==="AI win"){
        return 1000000;
      }else if(state==="Human win"){
        return -1000000000;
    }else if(state==="draw"){
      return 0;
    }
  }
  if(depth==0){
    return evaluateBoard(board);
  }
  let scores=new Array();
   let bestScoreValue=((player===1)?-Infinity:Infinity);
  for(let i=0;i<moves.length;i++){
    let move=moves[i];
    let prevBoard=clone(board);
    executeMove(move,board,player);
    let score=miniMax(board,-player,depth-1,alpha,beta);  
    scores.push({index:i,score:score});
    //Pruning
    if(player===1){
      bestScoreValue=Math.max(score,bestScoreValue);
      alpha=Math.max(bestScoreValue,alpha);
    }else if(player==-1){
      bestScoreValue=Math.min(score,bestScoreValue);
      beta=Math.min(beta,bestScoreValue);
    }  
    if(beta<=alpha) {
      break;
    }

    board=clone(prevBoard);
  }
  let bestMove=[];
  if(player==1){
    
    let bestScore=-Infinity;
    for(let score of scores){
      if(score.score>bestScore){
        bestScore=score.score;
        
      }
    }
    if(bestScore!==-Infinity)
    scores.forEach((score)=>{
      if(score.score==bestScore){
        bestMove.push(moves[score.index]);
      }
    });
    if(depth==DEPTH){
      
  return bestMove[random(0,bestMove.length-1)];
    }
  else{
    if(scores.length==0){ 
      return alpha;
    } 
    return bestScore;
  }
  }else{
    let bestScore=Infinity;
    for(let score of scores){
      if(score.score<bestScore){
        bestScore=score.score;
      }
    }
    if(bestScore!==Infinity)
    scores.forEach((score)=>{
      if(score.score==bestScore){
        bestMove.push(moves[score.index]);
      }
    });
    if(depth==DEPTH){
      console.log(bestMove);
    return bestMove[random(0,bestMove.length-1)];
}
  else{ 
    if(scores.length==0){
      // console.log(beta,alpha);
      return beta;}
    return bestScore;
  }
  }
}

function random(start,end) {
  let res;
  while(true){
    res=Math.floor(Math.random()*1000);
    if(res>=start && res<=end){
      break;
    }
  }
  return res;
}

//
//UI functions
function renderMenu() {
  cells.style.display="none";
  menu.style.display="block";
  docs.style.display="none";
  homeBtn.style.display="none";
  credits.style.display="none";
}

function info() {
  menu.style.display="none";
  docs.style.display="block";
  homeBtn.style.display="block";
}

function showCredits() {
  menu.style.display="none";
  credits.style.display="block";
  homeBtn.style.display="block";
}

//Handytools
function signOf(n){
 return n/Math.abs(n);
}

function clone(obj){
 return JSON.parse(JSON.stringify(obj))
}