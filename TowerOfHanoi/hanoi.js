function Game(startDisk) {
  this.startDisk = startDisk;
  this.towers = [];
  this.solution = [];
  this.checkedTower = null;
  this.isWatched = false;

  this.canvas = new Canvas();
  this.eventHandler = new EventHandler();

  this.eventHandler.addHandler('move', this.move.bind(this));
  this.eventHandler.addHandler('up', this.cursorUp.bind(this));
  this.eventHandler.addHandler('down', this.cursorDown.bind(this));
  this.eventHandler.addHandler('play', this.play.bind(this));
  this.eventHandler.addHandler('watch', this.watch.bind(this));

  this.init();
}

Game.prototype.init = function() {
  var towers = this.towers;

  towers[0] = new Tower(100, this.startDisk);
  towers[1] = new Tower(300);
  towers[2] = new Tower(500);
  // 确定三个塔的位置关系
  towers.forEach(function(tower, index) {
    tower.left = towers[(index+2) % 3];
    tower.right = towers[(index+1) % 3]
  });
  this.checkedTower = towers[0];
  this.canvas.cursor = towers[0];
  this.canvas.cursorShow = false;

  this.draw();
};

Game.prototype.play = function(level) {
  this.startDisk = level;
  this.isWatched = false;

  this.init();
};


Game.prototype.watch = function(level) {
  this.startDisk = level;
  this.solution = [];
  this.isWatched = true;

  this.init();
  this.solutionShow();
};

Game.prototype.succuss = function() {
  if (this.towers[2].disks.length == this.startDisk) {
    this.isWatched = true;
    alert('You won!');
  }
};

Game.prototype.draw = function() {
  var self = this;

  this.canvas.drawGrid("lightgrey", 20, 20);
  this.towers.forEach(function(tower) {
    self.canvas.drawDisk(tower);
  });

  if (!this.isWatched) this.succuss();
};

Game.prototype.move = function(data) {
  // data: left - move left, right - move right
  if (this.isWatched) return;
  if (this.checkedTower) {
    var disks = this.checkedTower.disks;
    var disk = disks[disks.length-1];
    if (!disk) return;
    var moveToDisks = this.checkedTower[data].disks;
    if (moveToDisks.length !== 0) {
      if (moveToDisks[moveToDisks.length-1].value < disk.value){
        return;
      }
    }
    disk = this.checkedTower.disks.pop();
    this.checkedTower[data].disks.push(disk);
    this.canvas.cursor = this.checkedTower;
    this.checkedTower = this.checkedTower[data];
  }
  this.canvas.cursor = this.canvas.cursor[data];
  this.draw();
}

Game.prototype.cursorUp = function() {
  if (this.isWatched) return;
  this.checkedTower = null;
  this.canvas.cursorShow = true;
  this.draw();
}

Game.prototype.cursorDown = function() {
  if (this.isWatched) return;
  if (this.canvas.cursor.disks.length !== 0) {
    this.checkedTower = this.canvas.cursor;
    this.canvas.cursorShow = false;
    this.draw();
  }
}

Game.prototype.solutionShow = function() {
  var self = this;

  var towers = this.towers;
  this.solve(this.startDisk, towers[0], towers[1], towers[2]);

  var solution = this.solution;
  var n = solution.length;
  // 使用递归函数实现异步API(setTimeout)的顺序执行
  function tryNext(i) {
    if (i >= n) return;
    console.log(i);
    setTimeout(function() {
      self.moveAuto(solution[i].from, solution[i].to);
      self.draw();
      tryNext(i+1);
    }, 600);
  }
  tryNext(0);
};

Game.prototype.solve = function(n, a, b, c) {
  if (n == 1) return this.solution.push({from: a, to: c});
  this.solve(n-1, a, c, b);
  this.solution.push({from: a, to: c});
  this.solve(n-1, b, a, c);
};

Game.prototype.moveAuto = function(from, to) {
  var disk = from.disks.pop();
  to.disks.push(disk);
};


function Canvas() {
  this.canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
  this.colors = ['#C03', 'yellow', 'green', 'orange', 'brown',
      'Magenta','DeepSkyBlue', 'pink', 'DarkKhaki'];

  this.cursorShow = false;
  this.cursor = null;
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
}

Canvas.prototype.drawDisk = function(tower) {
  var self = this;

  var m, n, o = 300;
  var ctx = this.context;
  ctx.save();
  tower.disks.forEach(function(disk) {
    m = tower.position - 10 * disk.value;
    n = tower.position + 10 * disk.value;
    ctx.strokeStyle = self.colors[disk.color];
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(m, o);
    ctx.lineTo(n, o);
    ctx.closePath();
    ctx.stroke();
    o = o - 15;
  });

  if (this.cursorShow && this.cursor == tower) {
    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 6;
    ctx.moveTo(tower.position-5, o);
    ctx.lineTo(tower.position+5, o);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}


function EventHandler() {
  this.events = {};

  this.listen();
}

EventHandler.prototype.addHandler = function(event, callback) {
  this.events[event] = callback;
}

EventHandler.prototype.handle = function(event, data) {
  var callback = this.events[event];
  if (callback) callback(data);
}

EventHandler.prototype.listen = function() {
  var self = this;

  document.addEventListener("keydown", function (event) {
    event.preventDefault();
    switch (event.keyCode) {
      case 37:
      case 65:
        self.handle('move', 'left');
        break;
      case 38:
      case 87:
        self.handle('up');
        break;
      case 39:
      case 68:
        self.handle('move', 'right');
        break;
      case 40:
      case 83:
        self.handle('down');
        break;
    }
  });

  var play = document.getElementById('play-button');
  play.addEventListener('click', function(event) {
    event.preventDefault();
    var level = document.getElementById('level').value;
    self.handle('play', level);
  }, false);

  var watch = document.getElementById('watch-button');
  watch.addEventListener('click', function(event) {
    event.preventDefault();
    var level = document.getElementById('level').value;
    self.handle('watch', level);
  }, false);
};


function Disk(value, color) {
  this.value = value;
  this.color = color;
}


function Tower(position, diskNumber) {
  this.position = position;
  this.diskNumber = diskNumber;

  this.disks = [];
  this.addDisks();
}

Tower.prototype.addDisks = function() {
  var i = this.diskNumber;
  if (i == undefined) return;
  while(i > 0) {
    var disk = new Disk(i, i-1);
    this.disks.push(disk);
    i--;
  }
};


new Game(4);