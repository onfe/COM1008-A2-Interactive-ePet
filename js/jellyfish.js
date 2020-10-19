class Jellyfish {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.resolution = 24;
    this.radius = 100;
    this.strokeWidth = 10;
    this.tenticles = [];
    this.state = 'idle';
    this.squish = 0;
    this.squishFactor = 0.075;

    this.target = {x: 0, y: 0};
    this.velocity = 0;
    this.maxVelocity = 2;
    this.accel = 0;
    this.steerX = 0;
    this.steerY = 0;
    this.rotate = 0;

    // Create the body path and setup some values to draw the jellyfish body and tenticles.
    var drawTenticle = false;
    this.body = new Path([], this.strokeWidth, '#CC6670', 'round', true, true, '#FF7F8D');
    this.sectAng = (Math.PI * 2) / this.resolution;

    for (var i = 0; i < this.resolution; i++) {
      let ang = this.sectAng * i;
      let x = Math.cos(ang) * this.radius * (1 - this.squish);
      let y = Math.sin(ang) * this.radius * (1 + this.squish);

      // The bottom of the jellyfish is flatter, so we subtract some of the distance
      if (ang > 0 && ang < Math.PI) {
        if (!(i % 2)) {
          // to create the ripples, alternate the distances % 2
          y -= Math.sin(ang) * this.radius * 0.8;
        } else {
          y -= Math.sin(ang) * this.radius * 0.7;
          drawTenticle = true;
        }
      }

      var point = new Point(x, y)
      this.body.points.push(point);
      // if the tenticle is being drawn, create a new instance and anchor it to the point.
      if (drawTenticle) {
        var tenticleLen = this.radius + (Math.sin(ang) * this.radius * 0.4)
        this.tenticles.push( new Tenticle(point, this.ctx, this.resolution / 2, tenticleLen, this.strokeWidth))
      }
      drawTenticle = false;
    }
  }

  update(t) {
    // Depending on the state, vary the actions of the jellyfish.
    if (this.state == 'idle') {
      this.squish -= (this.squish - (Math.sin(t / 1000) * this.squishFactor)) * 0.03;
      // varying this.squish makes the jellyfish move slightly when idle, making
      // it more lifelike.
      this.slower(t);


    } else if (this.state == 'swim') {
      if (this.squish < this.squishFactor) {
        this.squish -= (this.squish - this.squishFactor) * 0.1;
      }
      // when swimming, calculate the angle to the target to turn to it.
      var vect = new Segment(new Point(this.x, this.y), new Point(this.target.x, this.target.y));
      var len = vect.length;
      // However if the distance to the destination is short, return to idle and glide
      // the rest of the way.
      if (len < 50) {
        this.state = 'idle';
      }
      var dy = this.target.y - this.y;
      var dx = this.target.x - this.x;

      this.steerY = dy / len;
      this.steerX = dx / len;

      // sets the rotation of the canvas on draw, little by little each frame (approx 100 frames)
      this.rotate -= (this.rotate - Math.atan2(dy, dx)) * 0.01;

      // accelerate and steer the jellyfish.
      this.drag = 0;
      this.accel = this.accel < 5? this.accel += 0.001 : 5;
      this.velocity += this.accel;
      this.velocity = this.velocity < this.maxVelocity? this.velocity : this.maxVelocity;
      this.y += this.velocity * this.steerY;
      this.x += this.velocity * this.steerX;


    } else if (this.state == 'whoosh') {
      // whoosh is split in two parts, the prep and the movement.
      if (this.squish > -this.squishFactor - 0.1) {
        this.squish -= (this.squish - (-this.squishFactor - 0.15)) * 0.05;
      } else {
        this.state = 'postwhoosh';
      }
      this.slower();
    } else if (this.state == 'postwhoosh') {
      // once prepped, increase the acceleration and velocity of the jello.
      if (this.squish < this.squishFactor) {
        this.accel = 2;
        this.drag = 0;
        this.squish -= (this.squish - this.squishFactor - 0.1) * 0.025;
      } else {
        this.state = 'idle';
      }

      // set a target approx 100 units in from to ensure the steering works.
      this.target.x = this.x + Math.cos(this.rotate) * 100;
      this.target.y = this.y + Math.sin(this.rotate) * 100;
      var dy = this.target.y - this.y;
      var dx = this.target.x - this.x;

      this.steerY = dy / 100;
      this.steerX = dx / 100;
      console.log(this.velocity)
      // immediately slow the jelly as it's only a 'one push' swim
      this.slower();
    }

    for (var i = 0; i < this.body.points.length; i++) {
      let ang = this.sectAng * i;
      let x = Math.cos(ang) * this.radius * (1 - this.squish);
      let y = Math.sin(ang) * this.radius * (1 + this.squish);

      // Jellyfish need a flat bottom so for half the circle, we subtract some of the radius.
      if (ang > 0 && ang < Math.PI) {
        // Add the ripples to the jellyfish's bottom
        if (!(i % 2)) {
          y -= Math.sin(ang) * this.radius * 0.8;
        } else {
          y -= Math.sin(ang) * this.radius * 0.7;
        }
      }

      this.body.points[i].pos.x = x;
      this.body.points[i].pos.y = y;
    }

    // Finally, transform the canvas, rotate it etc.
    this.ctx.save();
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(this.rotate + Math.PI / 2);

    // clear the body and the tenticles.
    this.body.clear(this.ctx)
    for (var tent in this.tenticles) {
      if (this.tenticles[tent].state != 'sting') {
        this.tenticles[tent].state = this.state;
      }
      this.tenticles[tent].update(t);
    }
    // then draw the new tenticles.
    this.body.draw(this.ctx)
    this.ctx.restore();
  }

  // Handles the slowing of the jellyfish, using drag.
  slower(t) {
    this.accel = this.accel > 0? this.accel -= 0.01 : 0;
    this.drag = this.drag < 5? this.drag += 0.001 : 5;
    this.velocity += this.accel
    this.velocity -= this.drag;
    this.velocity = this.velocity > 0? this.velocity : 0;
    this.velocity = this.velocity < this.maxVelocity? this.velocity : this.maxVelocity;
    this.y += this.velocity * this.steerY;
    this.x += this.velocity * this.steerX;
  }

  // Setter methods for colour ensure that the tenticles also get coloured.
  set colourStroke(col) {
    this.body.color  = col;
    for (var tenti of this.tenticles) {
      tenti.pth.color = col;
    }
  }

  set colourFill(col) {
    this.body.fillCol = col;
  }
}
