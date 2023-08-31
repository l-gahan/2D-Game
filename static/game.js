// Create Variables
let canvas;
let context;
let request_id;
let fpsInterval = 1000 / 30;
let now;
let then = Date.now();
let xhttp;


let enemies=[];

// Cursor
let cursor={
    x:-1,
    y:-1
}
// 

// Player
let player = {
    x: 500,
    y: 350,
    size: 25
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
    document.addEventListener('mousemove', movePlayer, false)

    draw();
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
    context.fillStyle="darkblue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 

    // Draw player
    context.fillStyle="white";
    context.fillRect(player.x,player.y,player.size,player.size);
    // 

    // Moves Character to follow the mouse
    if (player.y - player.size >= 0) {
        if (moveUp) {
            player.y = player.y - player.size / 4;
            if (cursor.y>player.y){
                moveUp=false;
            }
        }
    }
    if (player.y +player.size+ player.size <= canvas.height) {
        if (moveDown) {
            player.y = player.y + player.size / 4;
            if (cursor.y<player.y){
                moveDown=false;
            }

        }
    }
    if (player.x - player.size >= 0) {
        if (moveLeft) {
            player.x = player.x - player.size / 4;
            if(cursor.x>player.x){
                moveLeft=false;
            }

        }
    }
    if (player.x + player.size <= canvas.width) {
        if (moveRight) {
            player.x = player.x + player.size / 4;
            if(cursor.x<player.x){
                moveRight=false;
            }

        }
    }
    // Create and spawn an enemy every time a coin is collected
    if ((enemies.length < 1)) {
        let enemyX,enemyY;
        if(player.x>500 && player.y>350){
            enemyX=50;
            enemyY=50;
        }
        else if(player.x>500 && player.y<350){
            enemyX=50;
            enemyY=600;
        }
        else if(player.x>500 && player.y>350){
            enemyX=900;
            enemyY=50;
        }
        else{
            enemyX=900;
            enemyY=600;
        }
        let enemy = {
            x: enemyX,
            y: enemyY,
            size: 25,
            speed:3
        }
        enemies.push(enemy);
    }
    // Draw enemies=
    context.fillStyle="red";
    for(let enemy of enemies){
        context.fillRect(enemy.x,enemy.y,enemy.size,enemy.size);
    }
    // 
    
    //allows enemy to track you depending where you are (above below them etc) 
    for (let e of enemies) {
        if (player.x > e.x && player.y > e.y) {
            e.x = e.x + e.speed;
            e.y = e.y + e.speed;
        }
        else if (player.x > e.x && player.y < e.y) {
            e.x = e.x + e.speed;
            e.y = e.y - e.speed;
        }
        else if (player.x < e.x && player.y > e.y) {
            e.x = e.x - e.speed;
            e.y = e.y + e.speed;
        }
        else if (player.x < e.x && player.y < e.y) {
            e.y = e.y - e.speed;
            e.x = e.x - e.speed;
        }
        else if (e.x === player.x && player.y < e.y) {
            e.y = e.y - e.speed;
        }
        else if (e.x === player.x && player.y > e.y) {
            e.y = e.y + e.speed;
        }
        else if (e.y === player.y && player.x > e.x) {
            e.x = e.x + e.speed;
        }
        else if (e.y === player.y && player.x < e.x) {
            e.x = e.x - e.speed;
        }
    }
}
// 


// Finds the current cursor position and declares which way the player should move to follow the mouse 
function movePlayer(event){
    let canvasRectangle = canvas.getBoundingClientRect();
    let clientX=event.clientX
    let clientY=event.clientY
    cursor.x=clientX-canvasRectangle.left;
    cursor.y=clientY-canvasRectangle.top;
    if(cursor.x<player.x){
        moveLeft=true;
        moveRight=false;
    };
    if(cursor.x>player.x){
        moveLeft=false;
        moveRight=true;
    };
    if(cursor.y>player.y){
        moveDown=true;
        moveUp=false;
    };
    if(cursor.y<player.y){
        moveDown=false;
        moveUp=true;
    };
};

// Stops the game when called
function stop() {
    canvas.width = 0;
    canvas.height = 0;
    window.cancelAnimationFrame(request_id);
}
// 