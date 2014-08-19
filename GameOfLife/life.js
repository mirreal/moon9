function Game() {
  this.stones = [];
  this.pause = false;

  this.canvas = new Canvas();

  this.init();
}

Game.prototype.init = function() {
  var self = this;

  this.createRandomStones();
  this.draw();

  this.getAroundStones();

  this.eventHandler();
  
  setInterval(function() {
    if (self.pause === true) return;
    self.update();
    self.draw();
  }, 800);
};

Game.prototype.eventHandler = function() {
  var self = this;

  var pauseButton = document.getElementById('pause-button');
  pauseButton.onclick = function() {
    self.pause = !self.pause;
    if (pauseButton.value == 'pause') pauseButton.value = 'continue';
    else pauseButton.value = 'pause';
  }
}

Game.prototype.createRandomStones = function() {
  for (var i = 0; i < 32; i++) {
    for (var j = 0; j < 32; j++) {
      var status = Math.random() < 0.2 ? true : false;
      this.stones.push(new Stone({x: i, y: j}, status))
    }
  }
};

Game.prototype.draw = function() {
  var self = this;

  this.canvas.drawGrid("lightgrey", 20, 20);
  this.stones.forEach(function(stone) {
    if (stone.status === true) {
      self.canvas.drawStone(stone);
    }
  });
};

Game.prototype.getAroundStones = function() {
  var self = this;

  this.stones.forEach(function(stone) {
    stone.around.forEach(function(position) {
      stone.aroundStones.push(self.stones[32*position.x + position.y]);
    });
  });
};

Game.prototype.update = function() {
  var self = this;

  this.stones.forEach(function(stone) {
    stone.aroundStones.forEach(function(s) {
      if (s.status === true) stone.aliveCount += 1;
    });

    if (stone.status === true) {
      if (stone.aliveCount === 2 || stone.aliveCount === 3) {
        stone.nextStatus = true;
      } else {
        stone.nextStatus = false;
      }
    } else {
      if (stone.aliveCount === 3) stone.nextStatus = true;
      else stone.nextStatus = false;
    }
  });

  this.stones.forEach(function(stone) {
    stone.status = stone.nextStatus;
    stone.aliveCount = 0;
  });
}




function Stone(position, status) {
  this.x = position.x;
  this.y = position.y;

  this.status = status;
  this.nextStatus = false;

  this.aroundStones = [];
  this.aliveCount = 0;

  this.around = [];
  this.getAround();
}

Stone.prototype.getAround = function() {
  for (var i = this.x-1; i <= this.x+1; i++) {
    for (var j = this.y-1; j <= this.y+1; j++) {
      if (i == this.x && j == this.y) continue;
      if (i < 0 || i >= 32) continue;
      if (j < 0 || j >= 32) continue;
      this.around.push({x: i, y: j});
    }
  }
};


function Canvas() {
  this.canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
}

Canvas.prototype.drawGrid = function(color, stepx, stepy) {
  var ctx = this.context;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;

  for (var i = stepx + 0.5; i < ctx.canvas.width; i += stepx) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
    ctx.closePath();
  }
  
  for (var i = stepy + 0.5; i < ctx.canvas.height; i += stepy) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
    ctx.closePath();
  }
  ctx.restore();
};

Canvas.prototype.drawStone = function(stone) {
  var ctx = this.context;

  var x = 20 * stone.x + 10;
  var y = 20 * stone.y + 10;

  ctx.fillStyle = 'orange';
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
};


new Game();