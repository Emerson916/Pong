const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

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

function drawRect(eixoX, eixoY, sizeX, sizeY, color) {
    contexto.fillStyle = color
    contexto.fillRect(eixoX, eixoY, sizeX, sizeY);
}

function drawRede() {
    for (let i = 0; i <= height; i += 20) {
        drawRect(rede.eixoX, rede.eixoY + i, rede.sizeX, rede.sizeY, rede.color)
    }
}

function drawText(text, eixoX, eixoY, color) {
    contexto.fillStyle = color;
    contexto.font = "50px fantasy";
    contexto.fillText(text, eixoX, eixoY)
}

function collision(b, p) {
    p.top = p.eixoY;
    p.bottom = p.eixoY + p.height;
    p.left = p.eixoX;
    p.right = p.eixoX + p.width;

    b.top = b.y - b.size;
    b.bottom = b.y + b.size;
    b.left = b.x - b.size;
    b.right = b.x + b.size;

    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
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
        // posição da bola sempre desenhada com pelo menos uma largura de bola
        // longe da borda da tela, para evitar erros de desenho
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size
    );

    balls.push(ball);
}

// Função movimento e colisão da bola

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
        user.score = user.score + 1
        userWinner()
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
        com.score = com.score + 1
        comWinner()
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;

    //IA - Bot
    let computerLevel = 0.2;
    com.eixoY += (this.y - (com.eixoY + com.sizeY/2)) * computerLevel;

    let player = (this.x < width / 2) ? user : com;

    if (collision(balls, player)) {
        let collidePoint = (this.y - (player.eixoY + player.sizeY / 2));
        collidePoint = collidePoint / (player.sizeY / 2);

        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (this.x < width / 2) ? 1 : -1;
    }

}


//função para usar o teclado como controle
function KeyControls(evt) {
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

function render() {
    contexto.fillStyle = 'rgba(0, 0, 0, 0.50)';
    contexto.fillRect(0, 0, width, height);

    drawRect(user.eixoX, user.eixoY, user.sizeX, user.sizeY, user.color)
    drawRect(com.eixoX, com.eixoY, com.sizeX, com.sizeY, com.color)
    drawRede()
    drawText(user.score, width / 4, 100, "#FF6584")
    drawText(com.score, width / 1.3, 100, "#FF6584")
}

function loop() {
   
    render()

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

window.addEventListener("keydown", KeyControls, true)

function start() {
    loop();
}