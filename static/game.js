// Create Variables
let canvas;
let context;
let request_id;
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();
let xhttp;

// Images
let IMAGES = {
    coin: "static/coin.png",
    playerImage: "static/character.png",
    enemyImage: "static/enemy.png"
}

// 
let enemies = [];
let delay = 0; //slow coin rotation
let coinsCollected = 0;
let score = 0;
let health = 3;
let score_display = document.querySelector("#score");
let game_over_screen = document.querySelector("#game_over");
// Cursor
let cursor = {
    x: -1,
    y: -1
}
// 

// Player
let player = {
    x: 500,
    y: 350,
    size: 25,
    imgSize: 16,
    frameX: 45,
    frameY: 22
}
// 


// Counters to help update player sprites
let rightImageCounter= 0;
let leftImageCounter= 0;
let upImageCounter= 0;
let downImageCounter= 0;
// 

// Coin
let coin = {
    x: 100,
    y: 100,
    size: 25,
    imgSize: 16,
    frameX: 0,
    frameY: 0

}
// 

// Player Movement
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;
// 

// 

// Initialization

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    score_display.innerHTML = "Score: " + score;
    document.addEventListener('mousemove', movePlayer, false)
    load_images(draw);
}
// 

// Draw Canvas
function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }

    then = now - (elapsed % fpsInterval);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background
    context.fillStyle = "darkblue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 

    // Draw player
    context.fillStyle = "white";
    context.drawImage(
        IMAGES.playerImage,
        player.frameX, player.frameY, player.imgSize, player.imgSize,
        player.x, player.y, player.size, player.size);
    // 

    // Draw coin
    context.fillStyle = "yellow";
    context.drawImage(
        IMAGES.coin,
        coin.frameX, coin.frameY, coin.imgSize, coin.imgSize,
        coin.x, coin.y, coin.size, coin.size);
    // 

    // spins coin
    if (delay === 5) {
        coin.frameX = coin.frameX + 16
        if (coin.frameX === 48) {
            coin.frameY = coin.frameY + 16
            coin.frameX = 0;
        }
        if (coin.frameY === 32) {
            coin.frameY = 0;
        }
        delay = 0;
    }
    delay = delay + 1;

    // 
    // Moves Character to follow the mouse
    if (player.y - player.size >= 0) {
        if (moveUp) {
            let upImageCounter = 0;
            player.frameX=0;
            player.frameX=0;
            upImageCounter = upImageCounter + 1;
            if (upImageCounter === 2) {
                upImageCounter = 0;
            }
            if (upImageCounter === 2) {
                player.frameY=22;
            }
            if (upImageCounter === 1) {
                player.frameY=45;
            }
            if (upImageCounter === 0) {
                player.frameY=70;
            }

            player.y = player.y - player.size / 4;
            if (cursor.y > player.y) {
                moveUp = false;
            }
        }
    }

    if (player.y + player.size + player.size <= canvas.height) {
        if (moveDown) {
            player.frameX=66;
            downImageCounter = downImageCounter + 1;
            if (downImageCounter === 2) {
                downImageCounter = 0;
            }
            if (downImageCounter ===2) {
                player.frameY=22;
            }
            if (downImageCounter === 1) {
                player.frameY=45;
            }
            if (downImageCounter === 0) {
                player.frameY=70;
            }
            player.y = player.y + player.size / 4;
            if (cursor.y < player.y) {
                moveDown = false;
            }

        }
    }
    if (player.x - player.size >= 0) {
        if (moveLeft) {
            player.frameX=98;
            leftImageCounter = leftImageCounter + 1;
            if (leftImageCounter === 2) {
                leftImageCounter = 0;
            }
            if (leftImageCounter === 2) {
                player.frameY=70;
            }
            if (leftImageCounter === 1) {
                player.frameY=45;
            }
            if (leftImageCounter === 0) {
                player.frameY=23 ;
            }
            player.x = player.x - player.size / 4;
            if (cursor.x > player.x) {
                moveLeft = false;
            }

        }
    }
    if (player.x + player.size <= canvas.width) {
        if (moveRight) {
            player.frameX=34;
            if (rightImageCounter === 2) {
                rightImageCounter=0;
            }
            
            if (rightImageCounter === 2) {
                player.frameY=70;
            }
            if (rightImageCounter === 1) {
                player.frameY=45;
            }
            if (rightImageCounter === 0) {
                player.frameY=23;
            }
            player.x = player.x + player.size / 4;
            rightImageCounter = rightImageCounter +1;
            if (cursor.x < player.x) {
                moveRight = false;
            }

        }
    }
    

    // Draw enemies
    context.fillStyle = "red";
    for (let enemy of enemies) {
        context.drawImage(
            IMAGES.enemyImage,
            enemy.frameX, enemy.frameY, enemy.imgSize, enemy.imgSize,
            enemy.x, enemy.y, enemy.size, enemy.size);
    }
    // 

    //allows enemy to track you depending where you are (above below them etc) 
    for (let e of enemies) {
        if (player.x > e.x && player.y > e.y) {
            e.x = e.x + e.speed;
            e.y = e.y + e.speed;
            e.frameY=321;
            eRightAnimation(e);
        }
        else if (player.x > e.x && player.y < e.y) {
            e.x = e.x + e.speed;
            e.y = e.y - e.speed;
            e.frameY=321;
            eRightAnimation(e);
        }
        else if (player.x < e.x && player.y > e.y) {
            e.x = e.x - e.speed;
            e.y = e.y + e.speed;
            e.frameY=273;
            eLeftAnimation(e);
        }
        else if (player.x < e.x && player.y < e.y) {
            e.y = e.y - e.speed;
            e.x = e.x - e.speed;
            e.frameY=273;
            eLeftAnimation(e);
        }
        else if (e.x === player.x && player.y < e.y) {
            e.y = e.y - e.speed;
            e.frameY=225;
            eDownAnimation(e);

        }
        else if (e.x === player.x && player.y > e.y) {
            e.y = e.y + e.speed;
            e.frameY=225;
            eUpAnimation(e);
        }
        else if (e.y === player.y && player.x > e.x) {
            e.x = e.x + e.speed;
            e.frameY=321;
            eRightAnimation(e);
        }
        else if (e.y === player.y && player.x < e.x) {
            e.x = e.x - e.speed;
            e.frameY=273;
            eLeftAnimation(e);
        }
    }
    // 

    // If the player hits the coin
    if (hit(coin)) {
        coinsCollected = coinsCollected + 1;
        // move coin to new location
        coin.x = Math.random() * 900;
        coin.y = Math.random() * 500;
        // spawn a new enemy
        spawnEnemy();
        score = score + 1;
        score_display.innerHTML = "Score: " + score;
    }
    // 

    // If player hits an enemy clear screen of enemies and update background color to indicate health
    for (let enemy of enemies) {
        if (hit(enemy)) {
            // decrease health
            health = health - 1;
            enemies = [];
            player.x = 500;
            player.y = 350;
            if (health === 2) {
                document.body.style.background = "orange";
            }
            if (health === 1) {
                document.body.style.background = "red";
            }

            // If player has no remaining health end the game
            if (health === 0) {
                document.body.style.background = "green";
                game_over_screen.innerHTML = "Game over";
                stop();
            }
            // 
        }
    }
    // 
}
// 


// Finds the current cursor position and declares which way the player should move to follow the mouse 
function movePlayer(event) {
    let canvasRectangle = canvas.getBoundingClientRect();
    let clientX = event.clientX
    let clientY = event.clientY
    cursor.x = clientX - canvasRectangle.left;
    cursor.y = clientY - canvasRectangle.top;
    if (cursor.x < player.x) {
        moveLeft = true;
        moveRight = false;
    };
    if (cursor.x > player.x) {
        moveLeft = false;
        moveRight = true;
    };
    if (cursor.y > player.y) {
        moveDown = true;
        moveUp = false;
    };
    if (cursor.y < player.y) {
        moveDown = false;
        moveUp = true;
    };
};

function hit(object) {
    if (player.x > object.x && player.x < object.x + object.size && player.y > object.y && player.y < object.y + object.size) {
        return true;
    } else {
        return false;
    }
}

function spawnEnemy() {
    let enemyX, enemyY;
    if (player.x > 500 && player.y > 350) {
        enemyX = 50;
        enemyY = 50;
    }
    else if (player.x > 500 && player.y < 350) {
        enemyX = 50;
        enemyY = 600;
    }
    else if (player.x > 500 && player.y > 350) {
        enemyX = 900;
        enemyY = 50;
    }
    else {
        enemyX = 900;
        enemyY = 600;
    }
    let enemy = {
        x: enemyX,
        y: enemyY,
        size: 25,
        speed: 3,
        frameX: 16,
        frameY: 225,
        imgSize:16,
        // Counter to help update enemy sprites
        eRightImageCounter:0,
        eLeftImageCounter:0,
        eUpImageCounter:0,
        eDownImageCounter:0
        //
    }
    enemies.push(enemy);


}

// Enemy animation/updates enemies sprite
function eLeftAnimation(enemy){
    enemy.eLeftImageCounter=enemy.eLeftImageCounter+1;
    if (enemy.eLeftImageCounter===6){
        enemy.eLeftImageCounter=0;
    }
    if(enemy.eLeftImageCounter===0){
        enemy.frameX=16;}
    if(enemy.eLeftImageCounter===2){
        enemy.frameX=63;}
    if(enemy.eLeftImageCounter===4){
        enemy.frameX=110}
    
}

function eRightAnimation(enemy){
    enemy.eRightImageCounter=enemy.eRightImageCounter+1;
    if (enemy.eRightImageCounter===6){
        enemy.eRightImageCounter=0;
    }
    if(enemy.eRightImageCounter===0){
        enemy.frameX=16;
    }
    if(enemy.eRightImageCounter===2){
        enemy.frameX=63;}
    if(enemy.eRightImageCounter===4){
        enemy.frameX=110;}
}

function eDownAnimation(enemy){
    enemy.eDownImageCounter=enemy.eDownImageCounter+1;
    if (enemy.eDownImageCounter===3){
        enemy.eDownImageCounter=0;
    }
    if(enemy.eDownImageCounter===0){
        enemy.frameX=16;}
    if(enemy.eDownImageCounter===1){
        enemy.frameX=63;}
    if(enemy.eDownImageCounter===2){
        enemy.frameX=110;}

}

function eUpAnimation(enemy){
    enemy.eUpImageCounter=enemy.eUpImageCounter+1;
    if (enemy.eUpImageCounter===3){
        enemy.eUpImageCounter=0;
    }
    if(enemy.eUpImageCounter===0){
        enemy.frameX=16;}
    if(enemy.eUpImageCounter===1){
        enemy.frameX=63;}
    if(enemy.eUpImageCounter===2){
        enemy.frameX=110;}

}
// 


// Stops the game when called
function stop() {
    // hide the canvas
    canvas.width = 0;
    canvas.height = 0;
    // 

    window.cancelAnimationFrame(request_id);
}
// 

// load images
function load_images(callback) {
    let num_images = Object.keys(IMAGES).length;
    let loaded = function () {
        num_images = num_images - 1;
        if (num_images === 0) {
            callback();
        }
    };
    for (let name of Object.keys(IMAGES)) {
        let img = new Image();
        img.addEventListener("load", loaded, false);
        img.src = IMAGES[name];
        IMAGES[name] = img;
    }
}
// 
