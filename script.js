const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const box = 20;

let snake = [{x:8*box, y:8*box}];
let direction = "RIGHT";
let nextDirection = "RIGHT";
let score = 0;
let food = {};
let isPaused = false;

// Alma kép létrehozása **itt** legyen
const appleImg = new Image();
appleImg.src = "SANYIKAA.png"; // ide a saját képed neve


document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const box = 20;
    let snake, direction, nextDirection, score, food, game;
    let isPaused = false; // true, ha a játék halt állapotban van

    function resetSnakeAndScore() {
        // Kiinduló pozíció és pontszám
        snake = [{ x: 8 * box, y: 8 * box }];
        direction = "RIGHT";
        nextDirection = "RIGHT";
        score = 0;
        scoreElement.innerText = score;

        // Alma véletlenszerű helyre
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    }

    function initGame() {
        resetSnakeAndScore();
        isPaused = false; // játék indul
        if (game) clearInterval(game);
        game = setInterval(draw, 100);
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x === array[i].x && head.y === array[i].y) return true;
        }
        return false;
    }

    document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();

        if (isPaused) {
            if (["arrowleft","arrowup","arrowright","arrowdown","w","a","s","d"].includes(key)) {
                isPaused = false;
                resetSnakeAndScore(); // visszaállítjuk a kiinduló állapotot
                // beállítjuk a direction-t az első billentyűre
                if ((key === "arrowleft" || key === "a")) direction = nextDirection = "LEFT";
                if ((key === "arrowup" || key === "w")) direction = nextDirection = "UP";
                if ((key === "arrowright" || key === "d")) direction = nextDirection = "RIGHT";
                if ((key === "arrowdown" || key === "s")) direction = nextDirection = "DOWN";
            }
            return; // pause-ban nem változtassunk mást
        }

        // Normál irányváltás
        if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") nextDirection = "LEFT";
        if ((key === "arrowup" || key === "w") && direction !== "DOWN") nextDirection = "UP";
        if ((key === "arrowright" || key === "d") && direction !== "LEFT") nextDirection = "RIGHT";
        if ((key === "arrowdown" || key === "s") && direction !== "UP") nextDirection = "DOWN";
    });

    function draw() {
        if (isPaused) return; // pause-ban nem mozog

        direction = nextDirection;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? "lime" : "white";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#000";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === "LEFT") snakeX -= box;
        if (direction === "UP") snakeY -= box;
        if (direction === "RIGHT") snakeX += box;
        if (direction === "DOWN") snakeY += box;

        const newHead = { x: snakeX, y: snakeY };

        // Ha meghalsz, pause állapot és visszaállítás
        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            isPaused = true;
            resetSnakeAndScore(); // visszaállítjuk kiinduló pontra és pontot
            return;
        }

        if (snakeX === food.x && snakeY === food.y) {
            score++;
            scoreElement.innerText = score;
            food = {
                x: Math.floor(Math.random() * 20) * box,
                y: Math.floor(Math.random() * 20) * box
            };
        } else {
            snake.pop();
        }

        snake.unshift(newHead);
    }

    initGame();
});
