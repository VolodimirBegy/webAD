function SepChainView(_model) {
	this.scale = 1;
	this.model = _model;
}

SepChainView.prototype.initStage = function(cont) {
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	});
}

SepChainView.prototype.zoomIn = function() {
	if(this.scale < 3) {
		this.scale = this.scale + 0.1;
	}
	this.draw();
}

SepChainView.prototype.zoomOut = function() {
	if(this.scale > 0.2) {
		this.scale = this.scale - 0.1;
	}
	this.draw();
}

SepChainView.prototype.draw = function() {
	var layer = new Kinetic.Layer();

	var hash = new Kinetic.Text({
		x: 50 * this.scale, 
		y: 0, 
		text: 'HASH: ' + this.model.calc, 
		fontSize: 18 * this.scale,
		fontFamily: 'Calibri',
		fill: '#000066'
	});

	layer.add(hash);

	var max = 0;
	for(var i = 0; i < this.model.rows.length; ++i) {
		var rect1 = new Kinetic.Rect({
			x: 50 * this.scale,
			y: (50 + i * 50) * this.scale,
			width: 50 * this.scale,
			height: 50 * this.scale,
			fill: this.model.color,
			stroke: 'black',
			strokeWidth: 4 * this.scale
		});
		var index = new Kinetic.Text({
			x: rect1.getX() + 10 * this.scale,
			y: rect1.getY(),
			text: i,
			fontSize: 18 * this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		var rect2 = new Kinetic.Rect({
			x: 100 * this.scale,
			y: (50 + i * 50) * this.scale,
			width: 20 * this.scale,
			height: 50 * this.scale,
			fill: this.model.color,
			stroke: 'black',
			strokeWidth: 4 * this.scale
		});

		layer.add(rect1);
		layer.add(index);
		layer.add(rect2);
	}

	for(var i = 0; i < this.model.rows.length; ++i) {
		for(var j = 0; j < this.model.rows[i].values.length; ++j) {
			if(this.model.rows[i].values.length > max) {
				max = this.model.rows[i].values.length;
			}
			var rect1 = new Kinetic.Rect({
				x: (j + 1) * 140 * this.scale,
				y: (50 + i * 50) * this.scale,
				width: 100 * this.scale,
				height: 40 * this.scale,
				fill: this.model.color,
				stroke: 'black',
				strokeWidth: 4 * this.scale
			});
			var rect2 = new Kinetic.Rect({
				x: rect1.getX() + 100 * this.scale,
				y: (50 + i * 50) * this.scale,
				width: 20 * this.scale,
				height: 40 * this.scale,
				fill: this.model.color,
				stroke: 'black',
				strokeWidth: 4 * this.scale
			});
			var text = new Kinetic.Text({
				x: rect1.getX() + 10 * this.scale,
				y: rect1.getY(),
				text: this.model.rows[i].values[j],
				fontSize: 18 * this.scale,
				fontFamily: 'Calibri',
				fill: 'black'
			});
			var line = new Kinetic.Text({
				x: rect1.getX() - 30 * this.scale,
				y: rect1.getY() + 15 * this.scale,
				text: '------',
				fontSize: 18 * this.scale,
				fontStyle: 'bold',
				fontFamily: 'Calibri',
				fill: 'black'
			});
			layer.add(rect1);
			layer.add(rect2);
			layer.add(text);
			layer.add(line);
		}
	}
	this.stage.setWidth((140 + max * 140) * this.scale + 100 * this.scale);
	this.stage.setHeight(100 * this.scale + this.model.rows.length * 100 * this.scale);
	this.stage.removeChildren();
	this.stage.add(layer);
}