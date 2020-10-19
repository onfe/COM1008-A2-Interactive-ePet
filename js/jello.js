"use strict";

class Jello {
  constructor(canvid) {
    this.canvas = document.getElementById(canvid);
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx = this.canvas.getContext('2d');
    this.totalTime = 0;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // create a jellyfish instance on the canvas, centered.
    this.jellyfish = new Jellyfish(this.width / 2, this.height / 2, this.ctx);

    // Prepare the canvas eventlistener for click events, and hand this over to
    // the click handle logic.
    this.canvas.addEventListener('click', this.clickHandle.bind(this));

    // Finally, start the animation by requesting the next draw event from the browser.
    window.requestAnimationFrame(this.onFrame.bind(this));
  }

  clickHandle(e) {
    // Differentiates between different areas on the canvas using the vector distance
    // from the click event to the jellyfish on the canvas.

    // This could have also been done with targets, probaly making the tenticles more
    // reliable, and require less vector maths.
    var vector = new Segment(
      new Point(this.jellyfish.x, this.jellyfish.y),
      new Point(e.offsetX, e.offsetY)
    )

    // Firstly, step through each tenticle and calculate the distance from
    // the end of the tenticle. as the jellyfish is rotated, the coords need to be
    // rotated around the centre of the jellyfish.
    for (var i = 0; i < this.jellyfish.tenticles.length; i++) { // click tenticle: sting
      var tenticle = this.jellyfish.tenticles[i]
      var tp = tenticle.pth.points[tenticle.pth.points.length -1];
      var realRot = (this.jellyfish.rotate + (Math.PI / 2))
      // Compensate for rotation;

      var tpr = new Point(
        (tp.pos.x * Math.cos(realRot)) - (tp.pos.y * Math.sin(realRot)),
        (tp.pos.x * Math.sin(realRot)) + (tp.pos.y * Math.cos(realRot))
      )
      var pointWithOffset = new Point(
        this.jellyfish.x + tpr.pos.x,
        this.jellyfish.y + tpr.pos.y
      )

      this.ctx.stroke();

      // use a segment to calculate the vector from the mouse to the tenticle.
      var tentitor = new Segment(
        pointWithOffset,
        new Point(e.offsetX, e.offsetY)
      )

      // if the click is close enough, set the state to sting on that tenticle.
      if (tentitor.length < 20) {
        this.jellyfish.tenticles[i].state = 'sting';
        console.log('sting')
        return;
      }
    }

    // Clicking outside the jellyfish sets the target destination and the state to swim.
    if (vector.length > this.jellyfish.radius) { // click outside jelly: swim to point
      this.jellyfish.target.x = e.offsetX;
      this.jellyfish.target.y = e.offsetY;
      this.jellyfish.state = 'swim';
      console.log('swim')
      return;
    }

    // Clicking within the jellyfish makes it 'whoosh' away from you.
    if (vector.length <= this.jellyfish.radius) { // click within jelly: whoosh
      console.log('whoosh');
      this.jellyfish.state = 'whoosh'
      return;
    }
  }

  // Each frame, trigger the jellyfish update, and request the next draw event.
  onFrame(t) {
    this.totalTime += t;
    this.jellyfish.update(t);
    window.requestAnimationFrame(this.onFrame.bind(this));
  }
}
