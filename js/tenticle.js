class Tenticle {
  constructor(anchor, ctx, resolution, length, stroke) {
    this.anchor = anchor || new Point(20, 20);
    this.ctx = ctx;
    this.resolution = resolution;
    this.length = length;
    this.defLength = length;
    this.stroke = stroke;
    this.pth = new Path([this.anchor], stroke, '#CC6670', 'round', false);
    this.state = 'idle';

    // initial draw of the jellyfish
    for (var i = 1; i < this.resolution; i++) {
      var lastPoint = this.pth.points[this.pth.points.length - 1];
      var y = lastPoint.pos.y + (this.length / this.resolution);
      this.pth.points.push(new Point(lastPoint.pos.x, y));
    }

  }

  update(t) {
    // On update, clear the tenticle before drawing.
    this.pth.clear(this.ctx);

    // IDLE STATE
    if (this.state == 'idle') {
      this.follow(0.1)

    // SWIMMING STATE
    } else if (this.state == 'swim') {
      var inc = this.length / this.resolution;
      for (var i = 1; i < this.pth.points.length; i++) {
        var pnt = this.pth.points[i]
        // apply a sine wave to give the illusion of swimming, increasing down the tenticle.
        var posDesired = this.anchor.pos.x - Math.sin((t / 100) + (inc / 15 * i)) * (0.3 * i);
        pnt.pos.x = posDesired;
      }

    // when the jello stings, it creases the tenticles then relaxes them
    // by going back to idle.
    } else if (this.state == 'sting') {
      for (var i = 1; i < this.pth.points.length; i++) {
        // move each other point the opposite way to crease the tenticle.
        if (i % 2 == 0) {
          this.pth.points[i].pos.x += 1;
        } else {
          this.pth.points[i].pos.x -= 1;
        }

        // once creased set the state to idle.
        if (Math.abs(this.anchor.pos.x - this.pth.points[1].pos.x) > this.stroke / 2) {
          this.state = 'idle';
        }
      }

    // shorten the tenticles during whoosh prep...
    } else if (this.state == 'whoosh') {
      this.length -= 0.4
      this.follow(0.6);
    // ...and extend them after
    } else if (this.state == 'postwhoosh') {
      this.length += 0.4
      this.follow(0.6);
    }

    // Finally, draw the tenticle at its new position.
    this.pth.draw(this.ctx);
  }

  // Each segment follows the previous with a strength given (stronger = faster following)
  follow(strength) {
    for (var i = 0; i < this.pth.points.length - 1; i++) {
      var curr = this.pth.points[i];
      var next = this.pth.points[i + 1];
      var diffX = next.pos.x - curr.pos.x
      var diffY = next.pos.y - (curr.pos.y + this.length / this.resolution);
      next.pos.x -= diffX * strength;
      next.pos.y -= diffY * strength;
    }
  }

}
