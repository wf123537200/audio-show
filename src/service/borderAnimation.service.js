function Blob(attr) {
    this.drawStyle = attr.drawStyle;
    this.points = attr.points;
    this.color = attr.color;
}

Blob.prototype.render = function(ctx) {
    var firstPoint, ctrlPoint, nextPoint,
        that = this;
    firstPoint = this.points[0];
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function(p, i) {
        nextPoint = that.points[i + 1];
        if (nextPoint) {
            ctrlPoint = {
                x: (p.x + nextPoint.x) / 2,
                y: (p.y + nextPoint.y) / 2
            };
            ctx.quadraticCurveTo(p.x, p.y, ctrlPoint.x, ctrlPoint.y);
        } else {
            ctrlPoint = {
                x: (that.points[that.points.length - 1].x + firstPoint.x) / 2,
                y: (that.points[that.points.length - 1].y + firstPoint.y) / 2
            };
            ctx.quadraticCurveTo(
                that.points[that.points.length - 1].x,
                that.points[that.points.length - 1].y,
                ctrlPoint.x, ctrlPoint.y
            );
        }
    });
    ctx.closePath();
    if (this.drawStyle === 'stroke') {
        ctx.stroke();
    } else if (this.drawStyle === 'fill') {
        ctx.lineWidth = 0.1;
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
};

var BorderAnimation = function() {};

BorderAnimation.prototype.init = function(size, cnvs, num, fillColor, isFillStyle, fillSize) {
    this.width = size.width;
    this.height = size.height;
    this.canvas = cnvs;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.blobs = this.generateBlobs(num, fillColor, fillSize);
    this.ctx.fillStyle = isFillStyle ? (getComputedStyle(document.body).backgroundColor || '#fff') : 'transparent';
};

BorderAnimation.prototype.generateBlobs = function(num, fillColor, size) {
    var i, blob, blobs,
        point, x, y,
        angle, radius,
        drawStyle, color,
        offset,
        divider;
    blobs = [];
    divider = 7;
    for (i = 1; i < num; i += 1) {
        blob = [];
        for (angle = 0; angle <= Math.PI * 2; angle += 0.2) {
            offset = -20 + Math.random() * 20;

            if (i === 1) {
                radius = this.height / divider * (i * 2.5 * size);
                drawStyle = 'fill';
                color = fillColor || '#fff';
            } else if (i === 2) {
                radius = this.height / divider * (i * 1.2);
                drawStyle = 'stroke';
                color ='#ccc';
            }
            x = this.width / 2 + Math.sin(angle) * radius;
            y = this.height / 2 + Math.cos(angle) * radius;
            point = {
                x: x,
                y: y,
                targetX: x + offset,
                targetY: y + offset,
                angle: Math.random() * (Math.PI * 2),
                speed: 0.05 + Math.random() * 0.05
            };
            blob.push(point);
        }
        blobs.push(new Blob({
            drawStyle: drawStyle,
            points: blob,
            color: color
        }));
    }

    return blobs;
};

BorderAnimation.prototype.render = function (isFill) {
    var _this = this;
    if(!isFill) this.ctx.fillRect(0, 0, this.width, this.height);
    for(var i = 0; i < this.blobs.length; i++) {
        _this.renderBlob(this.blobs[i]);
    };
};

BorderAnimation.prototype.renderBlob = function(blob) {
    var _this = this;
    blob.points.forEach(_this.updatePoint);
    blob.render(this.ctx);
};

BorderAnimation.prototype.updatePoint = function updatePoint(p, i) {
    var radius;
    radius = 0.5;
    p.x = p.x + Math.sin(p.angle) * radius;
    p.y = p.y + Math.cos(p.angle) * radius;
    i % 2 === 0 ? p.angle += p.speed : p.angle -= p.speed;
};

BorderAnimation.prototype.resetStrokeStyle = function(color) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.beginPath();
    ctx.strokeStyle = color || this.color;
    var circle = {
        x : this.width / 2,
        y : this.height / 2,
        r : 100
    };
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
    ctx.stroke();
};

BorderAnimation.prototype.resetFillStyle = function(color) {
    var ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.beginPath();
    ctx.fillStyle = color || this.fillColor;
    var circle = {
        x : this.width / 2,
        y : this.height / 2,
        r : 100
    };

    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};

exports.BorderAnimation = BorderAnimation;



