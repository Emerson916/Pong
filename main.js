const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const openModal = () => document.querySelector('#modal-video').classList.add('active');
const closeModal = () => document.querySelector('#modal-video').classList.remove('active');

function Reset() {
    window.location.reload();
}

const ball = {
    eixoX: width / 2,
    eixoY: height / 2,
    radius: 15,
    speed: 2,
    velX: 10,
    velY: 10,
    color: "#FF6584"
}

const user = {
    name: "player",
    eixoX: 20,
    eixoY: 200,
    sizeX: 20,
    sizeY: 200,
    color: "#FF6584",
    score: 0
}

const com = {
    name: "com",
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

function drawBall(eixoX, eixoY, radius, color) {
    contexto.fillStyle = color
    contexto.beginPath()
    contexto.arc(eixoX, eixoY, radius, 0, 2 * Math.PI, false)
    contexto.closePath()
    contexto.fill()
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

window.addEventListener("keydown", KeyControls, true);

//função para jogar com o mouse
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect()

    user.eixoY = evt.clientY - rect.top - user.sizeY / 2
}

canvas.addEventListener("mousemove", movePaddle, true)

function update() {
    ball.eixoX += ball.velX;
    ball.eixoY += ball.velY;

    //IA - Bot
    let computerLevel = 0.1;
    com.eixoY += (ball.eixoY - (com.eixoY + com.sizeY / 2)) * computerLevel;

    if (ball.eixoY + ball.radius > height || ball.eixoY - ball.radius < 0) {
        ball.velY = -ball.velY;
    }

    if ((ball.eixoX + ball.radius) >= width) {
        ball.velX = -ball.velX;
        user.score = user.score + 1
        userWinner()
    }

    if ((ball.eixoX - ball.radius) <= 0) {
        ball.velX = -ball.velX;
        com.score = com.score + 1
        comWinner()
    }

    let player = ball.eixoX < width / 2 ? user : com;
    const distComp = (player.eixoX - player.sizeX) - ball.eixoX;
    const distPlay = ball.eixoX - (player.eixoX + player.sizeX + ball.radius);

    if (distPlay <= 1 && player.name === "player" && ball.eixoY <= (player.eixoY + 200)) {
        console.log("Bateu na raquete do player")        
        ball.velX = -ball.velX;
    }

    if (distComp <= 1 && player.name === "com" && ball.eixoY <= player.eixoY ) {
        console.log("Bateu na raquete do bot")
        ball.velX = -ball.velX;
    }
    if (distPlay <= 1 && player.name === "player" && ball.eixoY <= player.eixoY ) {
        ball.velX = -ball.velX;
    }

    if (distComp <= 1 && player.name === "com" && ball.eixoY >= player.eixoY) {
        ball.velX = -ball.velX;
    }
}

function render() {
    contexto.fillStyle = 'rgba(0, 0, 0, 0.50)';
    contexto.fillRect(0, 0, width, height);

    drawRect(user.eixoX, user.eixoY, user.sizeX, user.sizeY, user.color);
    drawRect(com.eixoX, com.eixoY, com.sizeX, com.sizeY, com.color);
    drawBall(ball.eixoX, ball.eixoY, ball.radius, ball.color);
    drawRede();
    drawText(user.score, width / 4, 100, "#FF6584");
    drawText(com.score, width / 1.35, 100, "#FF6584");
}

function game() {
    update()
    render()
}

const framePerSecond = 50;

function start() {
    setInterval(game, 1000 / framePerSecond)
    game();
}