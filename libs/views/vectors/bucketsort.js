function VectorView(_model){
    this.model = _model;
    
    this.scale = 1;
    this.colors = ["#000000", "#000000", "#0000FF", "#008000", "#000000"];
    
    this.RECT_SIZE = 20;
    this.STROKE_WIDTH = 2;
    this.FONT_SIZE = 15;
    this.FONT = "Calibri";
}
VectorView.prototype.initStage = function(cont){
    this.stage = new Kinetic.Stage({
        container: cont,
        draggable: true,
        width: 0,
        height: 0
    });
}
VectorView.prototype.draw = function(){
    var start = new Date().getMilliseconds();
    
    var rect_size = this.RECT_SIZE * this.scale;
    var stroke_width = this.STROKE_WIDTH * this.scale;
    var font_size = this.FONT_SIZE * this.scale;
    
    var w = (6 + this.model.elements.length) * rect_size + stroke_width * 2;
    var h = (1 + this.model.elements.length) * rect_size + stroke_width * 2;
    
    this.stage.setHeight(h);
    this.stage.setWidth(w);
    this.stage.removeChildren();
    
    var layer = new Kinetic.Layer();
    
    var a_text = new Kinetic.Text({
        x: rect_size,
        y: 0,
        text: "A",
        fontSize: font_size,
        fontFamily: this.FONT,
        align: "center",
        fill: this.colors[1],
        width: rect_size
    });
    var b_text = new Kinetic.Text({
        x: rect_size * 4,
        y: 0,
        text: "B",
        fontSize: font_size,
        fontFamily: this.FONT,
        align: "center",
        fill: this.colors[1],
        width: rect_size
    });
    layer.add(a_text);
    layer.add(b_text);
    
    for(var i = 0; i < this.model.elements.length; i++){
        var a_rect = new Kinetic.Rect({
            x: a_text.getX(),
            y: (i + 1) * rect_size,
            width: rect_size,
            height: rect_size,
            stroke: this.colors[0],
            strokeWidth: stroke_width
        });
        var value_text = new Kinetic.Text({
            x: a_rect.getX(),
            y: a_rect.getY(),
            text: this.model.elements[i],
            fontSize: font_size,
            fontFamily: this.FONT,
            align: "center",
            fill: this.colors[1],
            width: a_rect.getWidth()
        });
        var b_rect = new Kinetic.Rect({
            x: b_text.getX(),
            y: a_rect.getY(),
            width: rect_size,
            height: rect_size,
            stroke: this.colors[0],
            strokeWidth: stroke_width
        });
        var bucket_text = new Kinetic.Text({
            x: b_rect.getX(),
            y: b_rect.getY(),
            text: i,
            fontSize: font_size,
            fontFamily: this.FONT,
            align: "center",
            fill: this.colors[1],
            width: b_rect.getWidth()
        });
        layer.add(a_rect);
        layer.add(value_text);
        layer.add(b_rect);
        layer.add(bucket_text);
    }
    if((this.model.i + this.model.j) < this.model.size()) {
        var token = new Kinetic.Circle({
            x: a_text.getX() - rect_size / 2,
            y: (this.model.i + 1) * rect_size + rect_size / 2,
            radius: rect_size / 4,
            stroke: this.colors[0],
            strokeWidth: stroke_width,
            fill: this.colors[2]
        });
        if(this.model.i == this.model.elements.length) {
            token.setX(b_text.getX() - rect_size / 2);
            token.setY((this.model.j + 1) * rect_size + rect_size / 2);
        }
        layer.add(token);
    } else {
        var vector_highlight = new Kinetic.Rect({
            x: a_text.getX(),
            y: a_text.getY() + rect_size,
            width: rect_size,
            height: this.model.elements.length * rect_size,
            fill: this.colors[3],
            opacity: 0.5
        });
        layer.add(vector_highlight);
    }
    for(var i = 0; i < this.model.buckets.length; i++){
        var bucket = this.model.buckets[i];
        
        if(bucket.length > 0) {
            var line = new Kinetic.Line({
                points: [b_text.getX() + rect_size, b_text.getY() + (i + 1) * rect_size + rect_size / 2, b_text.getX() + rect_size * 2, b_text.getY() + (i + 1) * rect_size + rect_size / 2],
                stroke: this.colors[0],
                strokeWidth: stroke_width
            });
            layer.add(line);
            
            for(var j = 0; j < bucket.length; j++){
                var element_rect = new Kinetic.Rect({
                    x: b_text.getX() + (rect_size * 2) + (j * rect_size),
                    y: b_text.getY() + (i + 1) * rect_size,
                    width: rect_size,
                    height: rect_size,
                    stroke: this.colors[0],
                    strokeWidth: stroke_width
                });
                var element_text = new Kinetic.Text({
                    x: element_rect.getX(),
                    y: element_rect.getY(),
                    text: bucket[j],
                    fontSize: font_size,
                    fontFamily: this.FONT,
                    align: "center",
                    fill: this.colors[1],
                    width: element_rect.getWidth()
                });
                layer.add(element_rect);
                layer.add(element_text);
            }
            if(i <= this.model.j && this.model.i == this.model.elements.length) {
                var bucket_highlight = new Kinetic.Rect({
                    x: b_text.getX(),
                    y: b_text.getY() + (i + 1) * rect_size,
                    width: rect_size,
                    height: rect_size,
                    fill: this.colors[3],
                    opacity: 0.5
                });
                var value_highlight = new Kinetic.Rect({
                    x: b_text.getX() + (rect_size * 2),
                    y: b_text.getY() + (i + 1) * rect_size,
                    width: bucket.length * rect_size,
                    height: rect_size,
                    fill: this.colors[3],
                    opacity: 0.5
                });
                layer.add(bucket_highlight);
                layer.add(value_highlight);
            }
        }
    }
    this.stage.add(layer);
    var end = new Date().getMilliseconds();
    
    console.log((end - start) + "ms");
}
//----------
//----- Tape Recorder Functions
//----------
VectorView.prototype.zoomIn = function(){
    if(this.scale < 3){
        this.scale += 0.1;
        this.draw();
    }
}
VectorView.prototype.zoomOut = function(){
    if(this.scale > 0.2){
        this.scale -= 0.1;
        this.draw();
    }
}