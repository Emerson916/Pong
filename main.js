const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;

    Ball.prototype.draw = function () {
        contexto.beginPath();
        contexto.fillStyle = this.color;
        contexto.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        contexto.fill();
    }
}




let testBall = new Ball(width / 2, height / 2, 5, 10, 'blue', 15);

testBall.x
testBall.size
testBall.color
testBall.draw()

// let testBall2 = new Ball(width/2, height/2, 15, 10, 'red', 20);

// testBall.x
// testBall.size
// testBall.color
// testBall.draw()

let balls = [testBall];

while (balls.length < 1) {
    let size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
}

// Função movimento
Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

//Controle do player 1
let eixoXP1 = 20
let eixoYP1 = 200
let sizeXP1 = 20
let sizeYP1 = 200

//Controle do player 2
let eixoXP2 = width / 1.03
let eixoYP2 = height / 4
let sizeXP2 = 20
let sizeYP2 = 200

function KeyDown(evt) {
    switch (evt.keyCode) {
        case 38:  /*"Arrow up" => cima/up*/
            eixoXP1 = sizeXP1;
            eixoYP1 += -20;
            break;
        case 40:  /*"Arrow down" => baixo/down*/
            eixoXP1 = sizeXP1;
            eixoYP1 += 20;
            break;

        case 87:  /*'W' => cima/up*/
            eixoXP2 = eixoXP2
            eixoYP2 += -20;
            break;

        case 83:  /*'S' => baixo/down*/
            eixoXP2 = eixoXP2;
            eixoYP2 += 20;
            break;
    }
}

function loop() {
    contexto.fillStyle = 'rgba(0, 0, 0, 0.25)';
    contexto.fillRect(0, 0, width, height);

    contexto.fillStyle = "green"
    contexto.fillRect(eixoXP1, eixoYP1, sizeXP1, sizeYP1);

    contexto.fillStyle = "blue"
    contexto.fillRect(eixoXP2, eixoYP2, sizeXP2, sizeYP2);



    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();

        Ball.prototype.collisionDetect = function () {
            for (let j = 0; j < balls.length; j++) {
                if (!(this === balls[j])) {
                    const dx = this.x - balls[j].x;
                    const dy = this.y - balls[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.size + balls[j].size) {
                        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                    }
                }
            }
        }


        balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);
}
window.addEventListener("keydown", KeyDown, true)


function start() {
    loop();
}


