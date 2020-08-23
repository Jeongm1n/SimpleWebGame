var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var ballRadius = 10;

var paddleHeight = 13;
var paddleWidth = 90;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 5;
var brickColumnCount = 7;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var lives = 3; // 남은 생명 수

var bricks = [];
for(var c=0; c<brickColumnCount; c++){
	bricks[c] = [];
	for(var r=0; r<brickRowCount; r++){
		bricks[c][r] = { x: 0, y:0, status: 1 };
	}
}

function drawLives(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 8, 20);
}

function collisionDetection(){
	for(var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			var b = bricks[c][r];
			if(b.status == 1){
				if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
					dy = -dy;
					b.status = 0;
					score++;
					if(score == brickRowCount*brickColumnCount){
						clearInterval(start);
						if(confirm("You Win, Congratulations!")){
							location.reload();
						}
					}
				}
			}
		}	
	}
}

function drawBricks(){
	for(var c=0; c<brickColumnCount; c++){
		for(var r=0; r<brickRowCount; r++){
			if(bricks[c][r].status == 1){
				var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "gray";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();
	collisionDetection();
	drawScore();
	drawLives();

	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
		dx = -dx;
	}
	if(y + dy < ballRadius){
		dy = -dy;
	}
	else if(y + dy > canvas.height-ballRadius){
		if(x > paddleX && x < paddleX + paddleWidth){
			dy = -dy;
		}
		else{
			lives--;
			if(!lives){
				clearInterval(start);
				if(confirm("Game Over")){
					location.reload();
				}
			}
			else{
				x = canvas.width/2;
				y = canvas.height-30;
				dx = 3;
				dy = -3;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
	}
	if(rightPressed && paddleX < canvas.width-paddleWidth){
		paddleX += 7;
	}
	else if(leftPressed && paddleX > 0){
		paddleX -= 7;
	}
	x += dx;
	y += dy;
}

function keyDownHandler(event){
	if(event.keyCode == 39){
		rightPressed = true;
	}
	else if(event.keyCode = 37){
		leftPressed = true;
	}
}

function keyUpHandler(event){
	if(event.keyCode == 39){
		rightPressed = false;
	}
	else if(event.keyCode == 37){
		leftPressed = false;
	}
}

function mouseMoveHandler(event){
	var relativeX = event.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width){
		paddleX = relativeX - paddleWidth/2;
	}
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
const start = setInterval(draw, 10);