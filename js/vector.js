// Vector JS
// Super simple vector graphic tools.
// Edward Hails, 2018


class Point {
  constructor(x, y, stroke, color, linecap) {
    this.pos = { x: x, y: y };
    // points don't typically need these, but this is here just in case it did.
    this.stroke = stroke || 1.0;
    this.linecap = linecap || 'round';
    this.color = color || '#000000'
  }
}

class Path {
  constructor(points, stroke, color, linecap, closed, filled, fillCol) {
    this.points = points || [];
    this.stroke = stroke || 1.0;
    this.linecap = linecap || 'round';
    this.color = color || '#000000';
    this.closed = closed || false;
    this.filled = filled || false;
    this.fillCol = fillCol || '#333333';
  }

  get length() {
    // calculate the length of a path by summing up the lengths of the segments.
    var total = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      let seg = new Segment(this.points[i], this.points[i+1]);
      total += seg.length;
    }
    return total;
  }

  get segments() {
    // segments are connections between each point, create them 'on-the-fly' if required.
    var segs = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      segs.push(new Segment(this.points[i], this.points[i+1]));
    }
    return segs;
  }

  draw(ctx) {
    // draw a path with multiple points, applying the correct styling.
    ctx.lineWidth = this.stroke;
    ctx.lineCap = this.linecap;
    ctx.strokeStyle = this.color;
    if (this.filled) { ctx.fillStyle = this.fillCol };

    ctx.beginPath();

    ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].pos.x, this.points[i].pos.y);
    }
    // if the path is closed or filled, set these attributes and fill the shape.
    this.closed ? ctx.closePath() : false;
    this.filled ? ctx.fill() : false;
    ctx.stroke();
  }

  clear(ctx) {
    // calculate the smallest rectangle that encloses the path and clear it.
    // better performance than clearing the entire canvas.
    var minx, maxx, miny, maxy;
    minx = maxx = this.points[0].pos.x;
    miny = maxy = this.points[0].pos.y;

    for (var i = 1; i < this.points.length; i++) {
      minx = this.points[i].pos.x < minx ? this.points[i].pos.x : minx;
      miny = this.points[i].pos.y < miny ? this.points[i].pos.y : miny;
      maxx = this.points[i].pos.x > maxx ? this.points[i].pos.x : maxx;
      maxy = this.points[i].pos.y > maxy ? this.points[i].pos.y : maxy;
    }
    minx -= this.stroke;
    miny -= this.stroke;
    maxx += this.stroke;
    maxy += this.stroke;
    ctx.clearRect(minx, miny, maxx - minx, maxy - miny);
  }
}


class Segment {
  constructor(point1, point2) {
    // constructs a segment between 2 points.
    this.from = point1;
    this.to = point2;
  }

  get length() {
    // use pythagoras to calculate the of a segment.
    var dx = Math.pow((this.to.pos.x - this.from.pos.x), 2);
    var dy = Math.pow((this.to.pos.y - this.from.pos.y), 2);
    return Math.sqrt(dy + dx);
  }
}
