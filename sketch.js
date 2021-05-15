//declaring global variables
var bgImg;
var score=0;
var lives=2;
var ball, ballImg,paddle;
var edges;
var gameState="serve";
var brick;
var colors=["crimson","lime","orange","cyan"];
var brickWidth=110, brickHeight=40;
var brickMargin=5;
var brickGroup;
var lastvx,lastvy;
var sound;


// to load images
function preload(){
bgImg= loadImage("Images/background.png");
ballImg=loadImage("Images/ball.png");

sound=loadSound("ballhitbrick.mp3");
}

function setup() {
  createCanvas(1200,570);
  console.log(width,height);

  //to create edge sprites
  edges= createEdgeSprites();
  //1=left, 2= right, 3= top, 4= bottom;

  //created a brick group
  brickGroup= new Group();

  //created a ball and paddle sprite and given it color
  paddle=createSprite(width/2,height,140,20);
  paddle.shapeColor=("yellow");

  ball=createSprite(width/2,height/2,20,20);
  ball.shapeColor=("red");
  ball.addImage(ballImg);
  ball.scale=0.08;
  
  createBrick();
  
  
}

function draw() {
  background(bgImg);  

  //condition for serve state
  if(gameState==="serve"){
    fill("white");
    textSize(16);
    textFont("ALGERIAN");
    text("CLICK TO SERVE",width/2-70,height/2-25);

    //to position the ball x and y
    ball.x=width/2;
    ball.y=height/2;

    //to give ball x and y velocity
    ball.velocityY=0;
    ball.velocityX=0;
    
  }  


  //codition for play state
  else if(gameState==="play"){
   
  //to make paddle move using mouse's x position
   paddle.x=mouseX;

   //to bounce off the ball from top, left and right edges
   ball.bounceOff(edges[0]);
   ball.bounceOff(edges[1]);
   ball.bounceOff(edges[2]);

   //to bounce off the ball from brick and paddle
   ball.bounceOff(brickGroup,brickHit);
   ball.bounceOff(paddle);

   //condition for decreasing live if ball is touching the bottom edge
    if(ball.isTouching(edges[3])){
      lives-= 1;
       
      if(lives>=1){
        gameState = "serve" ;
      }

      else{
       gameState = "end";
      }
   }

   //if no brick exists or brick===0 then ball will stop 
    if(!brickGroup[0]){
      ball.velocityX=0;
      ball.velocityY=0;
      textFont("ALGERIAN");
      textSize(28);
      fill("lime");
      text("YOU WIN!!",width/2-55,height/2);
    }
  }

  //to display game over and remove ball in the end state
  else if(gameState==="end"){
    fill("yellow");
    textSize(18);
    textFont("ALGERIAN");
    text("GAME OVER",width/2-60, height/2);
    ball.visible=false;
    text("PRESS R TO RESET THE GAME",width/2-120,height/2+50);


  }

  // to display the text to resume in pause state
  else{
    console.log("this is gamestate pause");
    textFont("ALGERIAN");
    text("PRESS SPACE TO RESUME",width/2-100,height/2);

  }

  //condition for pause
  if(keyWentDown("space")){
    if(gameState==="pause"){
      gameState = "play";

    //to assign the last velocity x and velocity y to the ball 
      ball.velocityY= lastvy;
      ball.velocityX=lastvx;
    }
    else if(gameState==="play"){
      gameState = "pause";
      //to store the last velocity x and y of the ball in var lastvx and lastvy and stop the ball there
      lastvy=ball.velocityY;
      lastvx=ball.velocityX;
      ball.velocityX=0;
      ball.velocityY=0;
    }

  }
    
  if(keyWentDown("R")){
    gameState = "serve";
    score = 0;
    lives=2;
    ball.visible=true;
    ball.velocityX=7;
    ball.velocityY=7;
    brickGroup.destroyEach();
    createBrick();
  }

  //to display the created sprites
  drawSprites();

  //to display number of lives
  
  textFont("ALGERIAN");
  textSize(16);
  fill("cyan");
  text("LIVES: "+lives,width-300,50);

  //to display the score
  text("SCORE: "+score,width-400,50);
}

//created a function mouse released
function mouseReleased(){
  if(gameState==="serve"){
    gameState="play";

    //to give ball random x velocity
    ball.velocityX=8+(score/25);
    
    //given ball y velocity
    ball.velocityY=8+(score/25);
    

  }
}

//created a function brickhit
function brickHit(ball,brick){
  //to remove brick 
  brick.remove();

  //to increase the score by 5
  score=score+5;

  //to play the brickhit sound
  sound.play();
}

function createBrick(){

  //created bricks using for loop condition
  for(var r=0;r<4;r++){
    for(var c=0;c<9;c++){
      var brick= createSprite(140+c*(brickWidth+brickMargin),80+r*(brickHeight+brickMargin),brickWidth,brickHeight);
      brick.shapeColor= colors[r];
      brickGroup.add(brick);

    }

  }
}