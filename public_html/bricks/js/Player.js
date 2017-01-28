// ==========
// PLAYER STUFF
// ==========

// A generic constructor which accepts an arbitrary descriptor object
function Player(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Default proporties
Player.prototype.lives = 3;
Player.prototype.score = 0;
