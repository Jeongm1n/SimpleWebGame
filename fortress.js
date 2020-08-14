const canvas = document.getElementById("fortress");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const tankWidth = 80;
const tankHeight = 50;
let tankX = 0;
const tankDx = 3;
let tankLeftPressed = false;
let tankRightPressed = false;
let tankCenterX;
let tankCenterY;
let cannonAngle = Math.PI / 4;
const cannonAngleDIF = Math.PI / 60;
const cannonLength = tankWidth * Math.sqrt(2);


const targetWidth = Math.floor(Math.random() * 10 + 30);
const targetHeight = Math.floor(Math.random() * 70 + 10);
const targetX = Math.floor(Math.random() * (200 - targetWidth) + 500);
const targetY = height - targetHeight;


let missileRadius = 5;
let missileX;
let missileY;
let isCharging = false;
let isFired = false;
let isHitted = false;
let gauge = Math.PI;
const gaugeDIF = Math.PI / 60;
const gaugeBarRadius = 30;
let missilePower;
let missileDx;
let missileDy;
const GRAVITY_ACCELERATION = 0.098;
////////////////////////////////////////////////////////////////
/* Draw */
function draw(){
	ctx.clearRect(0, 0, width, height);
	tankCenterX = tankX + 0.5 * tankWidth;
	tankCenterY = height - 0.5 * tankHeight;
	if(tankLeftPressed && tankX > 0){
		tankX -= tankDx;
	}
	if(tankRightPressed && tankX + tankWidth < width/3){
		tankX += tankDx;
	}
	if (isCharging && !isFired){
		if(gauge < Math.PI * 2){
			gauge += gaugeDIF;
		}
		drawGausing();
	}
	if(!isFired){
		missileX = tankCenterX + cannonLength * Math.cos(cannonAngle);
		missileY = tankCenterY - cannonLength * Math.sin(cannonAngle);
	}
	else{
		missileDy -= GRAVITY_ACCELERATION;
		missileX = missileX + missileDx;
		missileY = missileY - missileDy;
	}
	drawTank();
	drawTarget();
	drawMissile();
	checkMissile();
	if(!isHitted){
		drawTarget();
		drawMissile();
	}
}
function drawTank(){
	ctx.lineWidth = 5;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(tankX, height - tankHeight);
	ctx.lineTo(tankX + tankWidth, height - tankHeight);
	ctx.lineTo(tankX + tankWidth, height);
	ctx.lineTo(tankX, height);
	ctx.lineTo(tankX, height - tankHeight);
	ctx.moveTo(tankCenterX, tankCenterY);
	ctx.lineTo(
		tankCenterX + cannonLength * Math.cos(cannonAngle),
		tankCenterY - cannonLength * Math.sin(cannonAngle)
		)
	ctx.stroke();
	ctx.closePath();
}
function drawTarget(){
	ctx.fillRect(targetX, targetY, targetWidth, targetHeight);
	ctx.fillStyle="red";
}
function drawMissile(){
	ctx.beginPath();
	ctx.arc(missileX, missileY, missileRadius, 0, Math.PI * 2);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}
function drawGausing(){
	ctx.beginPath();
	ctx.arc(tankCenterX, tankCenterY - cannonLength, gaugeBarRadius, Math.PI, gauge, false);
	ctx.stroke();
}
function checkMissile(){
	// 미사일이 맞지 않았을 경우(오른벽, 아래벽)
	if(missileX >= width || missileY >= height){
		isFired = false; 
	}
	// 미사일 명중
	if(missileX >= targetX &&
		missileX <= targetX + targetWidth &&
		missileY >= targetY){
		isHitted = true;
		clearInterval(start);
		if(confirm("명중입니다! 다시 하시겠습니까?")){
		location.reload();
		}
	}
}
draw();
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
/* Key Control */
function keydownHandler(event){
	if(event.keyCode === 37){
		tankLeftPressed = true;
	}
	else if(event.keyCode === 39){
		tankRightPressed = true;
	}
	else if(event.keyCode === 38 && cannonAngle <= Math.PI/2){
		cannonAngle += cannonAngleDIF;
	}
	else if(event.keyCode === 40 && cannonAngle >= Math.PI/7){
		cannonAngle -= cannonAngleDIF;
	}
	else if(event.keyCode === 32 && !isFired){
		isCharging = true;
	}
}

function keyupHandler(event){
	if(event.keyCode === 37){
		tankLeftPressed = false;
	}
	else if(event.keyCode === 39){
		tankRightPressed = false;
	}
	else if(event.keyCode === 32 && !isFired){
		isCharging = false;
		isFired = true;
		missilePower = gauge * 1.6;
		missileDx = missilePower * Math.cos(cannonAngle);
		missileDy = missilePower * Math.sin(cannonAngle);
		gauge = Math.PI;
	}
}

const start = setInterval(draw, 10);
document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyupHandler, false);
/////////////////////////////////////////////////////////////////