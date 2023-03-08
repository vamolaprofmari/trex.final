var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var score;

var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;
function preload() {
  trex_running = loadAnimation(
    "assets/trex1.png",
    "assets/trex3.png",
    "assets/trex4.png"
  );
  trex_collided = loadImage("assets/trex_collided.png");

  groundImage = loadImage("assets/ground2.png");

  cloudImage = loadImage("assets/cloud.png");

  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  obstacle5 = loadImage("assets/obstacle5.png");
  obstacle6 = loadImage("assets/obstacle6.png");

  restartImg = loadImage("assets/restart.png");
  gameOverImg = loadImage("assets/gameOver.png");

  jumpSound = loadSound("music/jump.mp3");
  dieSound = loadSound("music/die.mp3");
  checkPointSound = loadSound("music/checkpoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(600, 200);

  //trex = createSprite(50, 180, 20, 50);
  trex = createSprite(50, height - 70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  // ground = createSprite(200, 180, 400, 20);
  ground = createSprite(width / 2, height - 70, width, 2);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  // gameOver = createSprite(300, 100);
  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);

  //restart = createSprite(300, 140);
  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  //invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround = createSprite(width / 2, height, width, 125);
  invisibleGround.visible = false;

  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Hello" + 5);

  trex.setCollider("circle", 0, 0, 40);
  trex.debug = true;

  score = 0;
}

function draw() {
  background(180);
  //exibindo pontuação
  text("Pontuação: " + score, 500, 50);

  //console.log("this is ", gameState);

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //mover o solo
    ground.velocityX = -(4 + 3 * (score / 100));
    //pontuação
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //pular quando a tecla espaço for pressionada
    if (touches.length > 0 || (keyDown("space") && trex.y >= 100)) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
    }

    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8;

    //gerar as nuvens
    spawnClouds();

    //gerar obstáculos no chão
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    //console.log("hey");
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0;

    //mudar a animação do trex
    trex.changeAnimation("collided", trex_collided);

    //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    if (mousePressedOver(restart)) {
      reset();
    }
  }

  //impedir que o trex caia
  trex.collide(invisibleGround);
  if (touches.length > 0 || keyDown("SPACE") || mousePressedOver(restart)) {
      reset();
      touches = [];
    }

  drawSprites();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    //var obstacle = createSprite(400, 165, 10, 40);
    var obstacle = createSprite(width, height - 95, 20, 30);
    obstacle.setCollider("circle", 0, 0, 45);
    obstacle.velocityX = -(6 + score / 100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //atribua dimensão e tempo de vida aos obstáculos
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    //cloud = createSprite(600, 100, 40, 10);
    cloud = createSprite(width + 20, height - 300, 40, 10);
    cloud.y = Math.round(random(100, 200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //atribua tempo de vida à variável
    cloud.lifetime = 600;

    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adicionando nuvens ao grupo
    cloudsGroup.add(cloud);
  }
}
