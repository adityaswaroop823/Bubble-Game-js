var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var initialCircles = [
    { x: 80, y: 100, radius: 45, color: "#ffd965", hit: false },
    { x: 80, y: 210, radius: 45, color: "#2b78e4", hit: false },
    { x: 80, y: 320, radius: 45, color: "#cc0000", hit: false },
    { x: 80, y: 430, radius: 45, color: "#6ba84f", hit: false }
];
var initialArrows = [
    { x: 550, y: 100, hit: false, moving: false },
    { x: 550, y: 210, hit: false, moving: false },
    { x: 550, y: 320, hit: false, moving: false },
    { x: 550, y: 430, hit: false, moving: false }
];
var circles = [];
var arrows = [];

var animationId;

reset();

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

circles.forEach(function (circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = circle.color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(circle.x + 4, circle.y - 4, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();
});

arrows.forEach(function (arrow, index) {
    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + 40, arrow.y - 15);
    ctx.lineTo(arrow.x + 40, arrow.y - 5);
    ctx.lineTo(arrow.x + 80, arrow.y - 5);
    ctx.lineTo(arrow.x + 80, arrow.y + 5);
    ctx.lineTo(arrow.x + 40, arrow.y + 5);
    ctx.lineTo(arrow.x + 40, arrow.y + 15);
    ctx.lineTo(arrow.x, arrow.y);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(arrow.x + 4, arrow.y);
    ctx.lineTo(arrow.x + 44, arrow.y - 11);
    ctx.lineTo(arrow.x + 44, arrow.y - 1);
    ctx.lineTo(arrow.x + 84, arrow.y - 1);
    ctx.lineTo(arrow.x + 84, arrow.y + 9);
    ctx.lineTo(arrow.x + 44, arrow.y + 9);
    ctx.lineTo(arrow.x + 44, arrow.y + 19);
    ctx.lineTo(arrow.x + 4, arrow.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();

    if (arrow.moving) {
        var circle = circles[index];
        var speed = 5;
        var directionX = circle.x - arrow.x;
        var directionY = circle.y - arrow.y;
        var distance = Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2));
        var unitDirectionX = directionX / distance;
        var unitDirectionY = directionY / distance;
        arrow.x += unitDirectionX * speed;
        arrow.y += unitDirectionY * speed;

        if (distance < circle.radius) {
            arrow.moving = false;
            arrow.hit = true;
            circles[index].hit = true;
            circles[index].color = "grey";

            if (index < circles.length - 1 && circles[index + 1].color === "grey") {
                arrows[index + 1].hit = true;
                circles[index + 1].color = "grey";
            }
        }
    }
});

animationId = requestAnimationFrame(draw);
}

function handleClick(event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    circles.forEach(function (circle, index) {
        if (!circle.hit) {
            var distance = Math.sqrt(Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2));
            if (distance < circle.radius) {
                var arrow = arrows[index];

                if (!arrow.moving) {
                    arrow.moving = true;
                }
            }
        }
    });
}

canvas.addEventListener("click", handleClick);

var resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", reset);

animationId = requestAnimationFrame(draw);

function reset() {
    cancelAnimationFrame(animationId);

    circles = JSON.parse(JSON.stringify(initialCircles));
    arrows = JSON.parse(JSON.stringify(initialArrows));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    animationId = requestAnimationFrame(draw);
}

function allCirclesHit() {
    return circles.every(function (circle) {
        return circle.hit;
    });
}

if (allCirclesHit()) {
    reset();
}
