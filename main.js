var canvas = document.getElementById("main");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext("2d");

var width = 640;
var height = 480;
var tileSize = 32;

var engine = {
  world: [], //0 - dead 1 - wire 2 - head 3 - tail
  running: false,
  init: function() {
    for (var x = 0; x < width/tileSize; x++) {
      this.world[x] = [];
      for (var y = 0; y < height/tileSize; y++) {
        this.world[x][y] = 0;
      }
    }
  },
  update: function() {
    if (this.running) {      
      var nextWorld = [];
      for (var cellX = 0; cellX < this.world.length; cellX++) {
        nextWorld[cellX] = [];
        for (var cellY = 0; cellY < this.world[cellX].length; cellY++) {
          nextWorld[cellX][cellY] = this.world[cellX][cellY]
          if (this.world[cellX][cellY] === 0) continue;
          
          //The head turns all blocks around it into heads 
          if (this.world[cellX][cellY] === 1) {
            var count = 0;
            for (nX = cellX - 1; nX <= cellX + 1; nX++) {            
              if (nX < 0 || nX >= this.world.length) continue;              
              for (nY = cellY - 1; nY <= cellY + 1; nY++) {
                if (nY < 0 || nY >= this.world[nX].length) continue;
                
                //Convert to head
                if (this.world[nX][nY] === 2) {
                  count++;
                } 
              }
            }
            if (count <= 2 && count > 0) {
              nextWorld[cellX][cellY] = 2
            }
          }
          
          if (this.world[cellX][cellY] === 2) {
            nextWorld[cellX][cellY] = 3;
            continue;
          }
          
          if (this.world[cellX][cellY] === 3) {
            nextWorld[cellX][cellY] = 1;
          }
        }
      }
      
      this.world = nextWorld;
    }    
  },
  draw: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < this.world.length; x++) {
      for (var y = 0; y < this.world[x].length; y++) {
        if (this.world[x][y] === 0) {
          ctx.fillStyle = 'black';
          ctx.fillRect(x * tileSize,y * tileSize,tileSize,tileSize);
        }
        else if (this.world[x][y] === 1) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(x * tileSize,y * tileSize,tileSize,tileSize);
        }
        else if (this.world[x][y] === 2) {
          ctx.fillStyle = 'red';
          ctx.fillRect(x * tileSize,y * tileSize,tileSize,tileSize);
        }
        else if (this.world[x][y] === 3) {
          ctx.fillStyle = 'yellow';
          ctx.fillRect(x * tileSize,y * tileSize,tileSize,tileSize);
        } 
        else {
          console.log(this.world[x][y])
        }
      }
    }
    
  }
}

function onClick(event) {
  var x = event.offsetX;
  var y = event.offsetY;
  
  var cellX = Math.floor(x / tileSize);
  var cellY = Math.floor(y / tileSize);
  
  if (engine.world[cellX][cellY] === 0) {
    engine.world[cellX][cellY]  = 1
    return;
  }
  
  if (engine.world[cellX][cellY] === 1) {
    engine.world[cellX][cellY]  = 2
    return;
  } 
  
  if (engine.world[cellX][cellY] === 2) {
    engine.world[cellX][cellY]  = 3
    return;
  }
  
  if (engine.world[cellX][cellY] === 3) {
    engine.world[cellX][cellY]  = 0
    return;
  }
}

function update() {
  engine.update();
  setTimeout(update, 300);
}

function draw() {
  engine.draw();
  window.requestAnimationFrame(draw);
}

engine.init()
draw()
update()
