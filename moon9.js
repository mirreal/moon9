window.onload = function() {
	var play = document.getElementById("play");
	play.onclick = startGame;
}

function startGame() {
	var canvas = document.getElementById("moon9");
	var ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "pink";
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	
	drawCanvas(canvas,ctx);
}

function drawCanvas(canvas,ctx) {
	var m = Math.floor(Math.random() * 7 + 6);
	var n = Math.floor(Math.random() * 7 + 6);
	
	drawCircles(canvas,ctx,m,0);
	drawCircles(canvas,ctx,n,220);
}

function drawCircles(canvas,ctx,num,n) {
	var positionArray = createPositionArray(num,n);
	
	upLength = document.getElementById("upLength");
	upLength.innerHTML = " Circles:" + positionArray.length;	
	
	for(var i = 0; i < positionArray.length; i++) {
		ctx.beginPath();
		ctx.arc(positionArray[i].xcoord, positionArray[i].ycoord, 20, 0, 2 * Math.PI, true);
	
		ctx.fillStyle = "white"
		ctx.fill();
	}
}

function createPositionArray(num,n) {
	function Position(xcoord,ycoord) {
		this.xcoord = xcoord;
		this.ycoord = ycoord;
	}
				
	var positionArray = new Array();
				
	while (positionArray.length < num) {
		var x = Math.floor(Math.random() * 6 + 1) * 44
		var y = Math.floor(Math.random() * 3 + 1) * 44 + n;
		t = new Position(x,y);
		if (!check(positionArray, t)) {
			positionArray.push(t);
		}
	}
				
	function check(positionArray, t) {
		for (var i = 0; i < positionArray.length; i++) {
			if (positionArray[i].xcoord == t.xcoord && positionArray[i].ycoord == t.ycoord) {
				return true;
			}
		}
		return false;
	}
	return positionArray;
}

