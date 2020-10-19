"use strict";

// Edward Hails
// ehails1@sheffield.ac.uk
// Vector.js written specifically for this assignment, by me.
// therefore, no external libraries are used.


window.onload = function () {
  // When all the assets are ready, load Jello. (jello.js)
  // this creates a new instance of Jello, bound the the canvas.
  window.jello = new Jello('canv');
}

var colourPairs = [['#FF7F8D', '#CC6670'], ['#E881AA', '#BA6888'], ['#FF9BE0', '#CC7CB3'], ['#E881E6', '#BA68B9'], ['#EE8EFF', '#BE72CC']];

// Button Functions
// Each function modifies some attribute of the jellyfish

// Switch the colours for a random pair from the set above.
window.colorChange = function () {
  var col = colourPairs[Math.floor(Math.random() * colourPairs.length)];
  jello.jellyfish.colourStroke = col[1];
  jello.jellyfish.colourFill = col[0];
}

// Increase the radius of the jellyfish, not animated.
window.growJelly = function () {
  jello.ctx.clearRect(0, 0, jello.width, jello.height);
  jello.jellyfish.radius += 20;
}

// Decrease the radius of the jellyfish, not animated.
window.shrinkJelly = function () {
  jello.ctx.clearRect(0, 0, jello.width, jello.height);
  jello.jellyfish.radius -= 20;
}

// Reset the jellyfish to the centre of the canvas,
// and nullify any speed or acceleration.
window.resetJelly = function () {
  jello.ctx.clearRect(0, 0, jello.width, jello.height);
  jello.jellyfish.x = jello.width / 2;
  jello.jellyfish.y = jello.height / 2;
  jello.jellyfish.radius = 100;
  jello.jellyfish.rotate = 0;
  jello.jellyfish.state = 'idle';
  jello.jellyfish.velocity = 0;
  jello.jellyfish.accel = 0;
}
