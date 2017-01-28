"use strict";

var lvls = [
    
    // Chess
    [1,0,1,0,1,0,1,0,1,0,
     0,1,0,1,0,1,0,1,0,1,
     1,0,1,0,1,0,1,0,1,0,
     0,1,0,1,0,1,0,1,0,1,
     1,0,1,0,1,0,1,0,1,0,
     0,1,0,1,0,1,0,1,0,1,
     1,0,1,0,1,0,1,0,1,0,
     0,1,0,1,0,1,0,1,0,1],
    
    // Stripes
    [0,0,0,0,0,0,0,0,0,0,
     4,4,4,4,4,4,4,4,4,4,
     3,3,3,3,3,3,3,3,3,3,
     2,2,2,2,2,2,2,2,2,2,
     1,1,1,1,1,1,1,1,1,1],
    
    // Space invader
    [0,0,4,0,0,0,0,4,0,0,
     0,0,0,4,0,0,4,0,0,0,
     0,0,4,4,4,4,4,4,0,0,
     0,4,4,9,4,4,9,4,4,0,
     4,4,4,4,4,4,4,4,4,4,
     4,0,4,4,4,4,4,4,0,4,
     4,0,4,0,0,0,0,4,0,4,
     0,0,0,4,0,0,4,0,0,0],
    
    // Hard 2 Break
    [1,1,1,1,1,1,1,1,1,1,
     1,1,1,1,1,1,1,1,1,1,
     1,1,1,1,1,1,1,1,1,1,
     1,1,1,1,1,1,1,1,1,1,
     1,1,1,1,1,1,1,1,1,1,
     1,1,1,1,1,1,1,1,1,1,
     1,1,1,1,1,1,1,1,1,1,
     9,9,1,9,9,9,9,1,9,9],
    
    // Diamond
    [0,0,0,0,1,1,0,0,0,0,
     0,0,0,1,2,2,1,0,0,0,
     0,0,1,2,3,3,2,1,0,0,
     0,1,2,3,4,4,3,2,1,0,
     1,2,3,4,9,9,4,3,2,1,
     0,1,2,3,4,4,3,2,1,0,
     0,0,1,2,3,3,2,1,0,0,
     0,0,0,1,2,2,1,0,0,0,
     0,0,0,0,1,1,0,0,0,0],
];
     
var g_numberOfLevels = lvls.length;

function getBricks(lvl) {
    var lvlMatrix = lvls[lvl],
        bricks = [],
        n = 0, // number of indestructable bricks;
        gridX = g_canvas.width/10,
        gridY = g_canvas.height/15,
        padding = 2;
    for (var i=0; i<lvlMatrix.length; i++) {
        var lives = lvlMatrix[i]!==9 ? lvlMatrix[i] : Infinity;
        if (lives>0) {
            if (lives === Infinity) n++;
            var halfWidth = gridX*0.5-padding;
            var halfHeight = gridY*0.5-padding;
            var descr = {
                cx: i%10*gridX+halfWidth+padding,
                cy: Math.floor(i/10)*gridY+halfHeight+padding,
                halfHeight: halfHeight,
                halfWidth: halfWidth,
                lives: lives,
            }
            bricks.push(new Brick(descr));
        }
    }
    g_bricksToRestart = n;
    return bricks;
}
        
        
