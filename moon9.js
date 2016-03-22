window.onload = function() {
  var canvas = document.getElementById("moon9");
  var ctx = canvas.getContext("2d");
  var timeLine = document.getElementById("timeLine");
  var context = timeLine.getContext("2d");

  // game Settings
  var score;
  var timeWidth;
  var comp;
  var a;
  var b;

  // geme UI
  var headerStats = document.getElementById("headerStats");
  var headerScore = document.getElementById("headerScore");
  var selectLevel = document.getElementById("selectLevel");
  var introduction = document.getElementById("introduction");

  var uiIntro = document.getElementById("gameIntro");
  var uiStats = document.getElementById("gameStats");
  var uiComplete = document.getElementById("gameComplete");
  var uiPlay = document.getElementById("gamePlay");
  var uiReset = document.getElementById("gameReset");
  var uiScore = document.getElementById("gameScore");

  var up = document.getElementById("up");
  var down = document.getElementById("down");

  function playGame() {
    headerScore.innerHTML = 0;
    show(uiStats);
    show(headerStats);
    show(timeLine);
    score = 0;
    timeWidth = 600;

    window.addEventListener('keydown',getKey,false);

    var selectObj = document.getElementById("level");
    var index = selectObj.selectedIndex;
    var level = selectObj[index].value;
    selectLevel.innerHTML = level;
    if (level == "1") {
      a = 5;
      b = 1;
    } else if(level == "2") {
      a = 5;
      b = 5;
    } else if(level == "3") {
      a = 4;
      b = 12;
    } else if(level =="4") {
      a = 3;
      b = 9;
    }

    startGame();
    setTimeout(displayScore,60000);
    animate();

    function animate() {
      timeWidth--;

      context.clearRect(0, 0, timeLine.width, timeLine.height);

      context.fillStyle = "grey";
      context.fillRect(0, 27, timeWidth, 6);

      if (timeWidth > 0) {
        setTimeout(animate, 100);
      }
    }

    function startGame() {
      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save();
      ctx.lineWidth = 60;
      ctx.beginPath();
      ctx.moveTo(0,200);
      ctx.lineTo(600,200);
      ctx.stroke();
      ctx.restore();

      comp = 0;
      drawCanvas(a,b);

      up.onclick = upArrow;
      down.onclick = downArrow;
    }
    function upArrow() {
        drawArrowUp(ctx);
        if (comp == up) {
          score++;
          drawRight(ctx);
        }
        else if(comp == down) {
          if (score > 0) {
            score--;
            drawWrong(ctx);
          }
        }
        headerScore.innerHTML = score;
        setTimeout(startGame,120);
      }
    function downArrow() {
        drawArrowDown(ctx);
        if (comp == down) {
          score++
          drawRight(ctx);
        }
        else if(comp == up) {
          if (score > 0) {
            score--;
            drawWrong(ctx);
          }
        }
        headerScore.innerHTML = score;
        setTimeout(startGame,120);
      }

    function drawCanvas(a,b) {
      var m = Math.floor(Math.random() * a + b);
      var n = Math.floor(Math.random() * a + b);

      if (m != n) {
        drawCircles(ctx,m,0);
        drawCircles(ctx,n,220);
        if (m > n) {
          comp = up;
        }
        else {
          comp = down;
        }
      }
      else {
        drawCanvas(a,b);
      }
    }

    function getKey(event) {
      var keyCode;
      if (event == null) {
        keyCode = window.event.keyCode;
        window.event.preventDefault();
      } else {
        keyCode = event.keyCode;
        event.preventDefault();
      }

      switch (keyCode) {
        case 38:
          upArrow();
          break;
        case 40:
          downArrow();
          break;
      }
    }

    // game end display
    function displayScore() {
      hide(uiStats);
      hide(timeLine);
      show(uiComplete);
      uiScore.innerHTML = score;

      window.removeEventListener('keydown',getKey,false);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#C03";
      ctx.fillRect(30, 20, canvas.width - 60, canvas.height - 80)

      ctx.fillStyle = "white";
      ctx.font = "36px AR CHRISTY";
      ctx.textAlign = "left";
      ctx.fillText("Time is up!",230,60);
      ctx.font = "8em AR BONNIE";
      ctx.fillText(score, 250,320);
    }
  }

  // Inititialise the game environment
  function init() {
    hide(headerStats);
    hide(uiStats);
    hide(uiComplete);
    hide(timeLine);

    uiPlay.onclick = function(e) {
      e.preventDefault();
      hide(uiIntro);
      hide(introduction);
      playGame();
    }

    uiReset.onclick = function(e) {
      e.preventDefault();
      hide(uiComplete);
      playGame();
    }
  }
  init();
}

function drawArrowUp(ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(420,110,60,40);
  ctx.beginPath();
  ctx.moveTo(400,110);
  ctx.lineTo(500,110);
  ctx.lineTo(450,60);
  ctx.closePath();
  ctx.fill();
}

function drawArrowDown(ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(420,250,60,40);
  ctx.beginPath();
  ctx.moveTo(400,290);
  ctx.lineTo(500,290);
  ctx.lineTo(450,340);
  ctx.closePath();
  ctx.fill();
}

function drawWrong(ctx) {
  ctx.beginPath();
  ctx.arc(240,190,150,0,2 * Math.PI,true);
  ctx.closePath();
  ctx.fillStyle = "rgb(236, 29, 120)";
  ctx.fill();

  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.beginPath();
  ctx.moveTo(340.4, 218.9);
  ctx.lineTo(297.0, 273.3);
  ctx.lineTo(135.4, 144.6);
  ctx.lineTo(178.8, 90.1);
  ctx.lineTo(340.4, 218.9);
  ctx.closePath();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(202.7, 277.4);
  ctx.lineTo(174.8, 256.0);
  ctx.lineTo(294.9, 99.3);
  ctx.lineTo(322.8, 120.7);
  ctx.lineTo(202.7, 277.4);
  ctx.closePath();
  ctx.fill();
}

function drawRight(ctx) {
  ctx.beginPath();
  ctx.arc(240,190,150,0,2 * Math.PI,true);
  ctx.closePath();
  ctx.fillStyle = "rgb(0, 145, 68)";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(253.5, 203.7);
  ctx.lineTo(214.0, 253.3);
  ctx.lineTo(119.2, 177.8);
  ctx.lineTo(158.8, 128.2);
  ctx.lineTo(253.5, 203.7);
  ctx.closePath();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(239.4, 272.3);
  ctx.lineTo(211.5, 250.9);
  ctx.lineTo(331.6, 94.2);
  ctx.lineTo(359.5, 115.6);
  ctx.lineTo(239.4, 272.3);
  ctx.closePath();
  ctx.fill();
}

function drawCircles(ctx,num,n) {
  var positionArray = createPositionArray(num,n);

  for(var i = 0; i < positionArray.length; i++) {
    ctx.beginPath();
    ctx.arc(positionArray[i].xcoord, positionArray[i].ycoord, 19, 0, 2 * Math.PI, true);

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

function hide(elem) {
  elem.style.display = "none";
}
function show(elem) {
  elem.style.display = "";
}
  