const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const openModal = () => document.querySelector('#modal-video').classList.add('active');
const closeModal = () => document.querySelector('#modal-video').classList.remove('active');

function Reset() {
    window.location.reload();
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

const user = {
    eixoX: 20,
    eixoY: 200,
    sizeX: 20,
    sizeY: 200,
    color: "#FF6584",
    score: 0
}

const com = {
    eixoX: width - 50,
    eixoY: 200,
    sizeX: 20,
    sizeY: 200,
    color: "#FF6584",
    score: 0
}

const rede = {
    eixoX: width / 2 - 2 / 2,
    eixoY: 0,
    sizeX: 4,
    sizeY: 15,
    color: "#FF6584",
}

// drawText(user.score, width / 4, height / 5, "#FF6584")
//     drawText(com.score, width / 4, height / 5, "#FF6584")


function drawRacket(eixoX, eixoY, sizeX, sizeY, color) {
    contexto.fillStyle = color
    contexto.fillRect(eixoX, eixoY, sizeX, sizeY);
}

// drawRacket(eixoX, eixoY, sizeX, sizeY, color)
function drawRede() {
    for (let i = 0; i <= height; i += 20) {
        drawRacket(rede.eixoX, rede.eixoY + i, rede.sizeX, rede.sizeY, rede.color)
    }
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

let testBall = new Ball(width / 2, height / 2, 5, 10, '#FF6584', 15);

testBall.x
testBall.size
testBall.color
testBall.draw()

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

function userWinner() {
    if (user.score === 3 && com.score === 0) {
        alert("Parabéns você massacrou ele")
        Reset()
    } else if (user.score === 5) {
        alert("Parabéns você venceu")
        Reset()
    }
}

function comWinner() {
    if (com.score === 3 && user.score === 0) {
        alert("Haha, Perdeu feio para o bot")
        Reset()
    } else if (com.score === 5) {
        alert("Você perdeu")
        Reset()
    }
}

// Função movimento
Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
        user.score = user.score + 1
        userWinner()
        console.log("Aqui esta o placar do usuário :", user.score)
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
        com.score = com.score + 1
        comWinner()
        console.log("Aqui esta o placar do bot :", com.score)
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

function KeyDown(evt) {
    switch (evt.keyCode) {
        case 38:  /*"Arrow up" => cima/up*/
            user.eixoX = user.sizeX;
            user.eixoY += -20;
            break;
        case 40:  /*"Arrow down" => baixo/down*/
            user.eixoX = user.sizeX;
            user.eixoY += 20;
            break;

        case 87:  /*'W' => cima/up*/
            com.eixoX = com.eixoX
            com.eixoY += -20;
            break;

        case 83:  /*'S' => baixo/down*/
            com.eixoX = com.eixoX
            com.eixoY += 20;
            break;
    }
}



function loop() {
    contexto.fillStyle = 'rgba(0, 0, 0, 0.25)';
    contexto.fillRect(0, 0, width, height);

    drawRacket(user.eixoX, user.eixoY, user.sizeX, user.sizeY, user.color)
    drawRacket(com.eixoX, com.eixoY, com.sizeX, com.sizeY, com.color)
    drawRede()

    // drawRede(rede.eixoX, rede.eixoY, rede.sizeX, rede.sizeY, rede.color)

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