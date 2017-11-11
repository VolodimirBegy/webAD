/*
 Software License Agreement (BSD License)
 http://wwwlab.cs.univie.ac.at/~a1100570/webAD/
 Copyright (c), Volodimir Begy
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function VectorView(_model){
    this.model = _model;
    
    this.scale = 1;
    this.colors = ["#33E5E5", "#FF9900", "#33CC00", "#000000", "#FFFFFF","#FF0000"];
    
    this.pre_rect_size = 20;
    this.pre_stroke_width = 2;
    this.pre_font_size = 15;
    this.pre_font = "Calibri";
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
    var rect_size = this.pre_rect_size * this.scale;
    var stroke_width = this.pre_stroke_width * this.scale;
    var font_size = this.pre_font_size * this.scale;
    
  var maxValue = 0;
  for(var i=0;i<this.model.elements.length;i++){
    	if(this.model.elements[i].value>maxValue){
			maxValue=this.model.elements[i].value;
    }
	} 
    var w1 = this.model.elements.length;
    if(maxValue > this.model.elements.length){
      w1 = maxValue;
    }
    
    var w = (6 + w1) * rect_size + stroke_width * 2;
    var h = (160*this.scale) + 6 * rect_size + stroke_width * 2;
    
    this.stage.setHeight(h);
    this.stage.setWidth(w);
    this.stage.removeChildren();
    
    var layer = new Kinetic.Layer();
    
    var a_text = new Kinetic.Text({
        x: 0*this.scale,
        y: 0*this.scale,
        text: "Unsorted-Array",
        fontSize: font_size,
        fontFamily: this.pre_font,
        align: "center",
        fill: this.colors[3],
        width: 200
    });
    var b_text = new Kinetic.Text({
        x: 0*this.scale,
        y: 80*this.scale,
        text: "Counting-Array",
        fontSize: font_size,
        fontFamily: this.pre_font,
        align: "center",
        fill: this.colors[3],
        width: 200
    });
    var c_text = new Kinetic.Text({
        x: 0*this.scale,
        y: 160*this.scale,
        text: "Sorted-Array",
        fontSize: font_size,
        fontFamily: this.pre_font,
        align: "center",
        fill: this.colors[3],
        width: 200
    });
    layer.add(a_text);
    layer.add(b_text);
    layer.add(c_text);
    //---------
    //---- Unsorted Array
    //---------
    for(var i = 0; i < this.model.elements.length; i++){
        var a_rect = new Kinetic.Rect({
            x: (i + 1) * rect_size,
            y: a_text.getY()+rect_size,
            width: rect_size,
            height: rect_size,
            fill: this.colors[this.model.elements[i].color-1],
            stroke: this.colors[3],
            strokeWidth: stroke_width
        });
        var a_value = new Kinetic.Text({
            x: a_rect.getX(),
            y: a_rect.getY(),
            text: this.model.elements[i].value,
            fontSize: font_size,
            fontFamily: this.pre_font,
            align: "center",
            fill: this.colors[3],
            width: a_rect.getWidth()
        });
        layer.add(a_rect);
        layer.add(a_value);
        }
    //---------
    //---- Counting Array
    //---------
    for(var k = 0; k < this.model.count.length; k++){
        var b_index_rect = new Kinetic.Rect({
            x: (k + 1) * rect_size,
            y: b_text.getY()+rect_size,
            width: rect_size,
            height: rect_size,
            fill: this.colors[this.model.count[k].colorIndex-1],
            stroke: this.colors[3],
            strokeWidth: stroke_width
        });
        var b_index_value = new Kinetic.Text({
            x: b_index_rect.getX(),
            y: b_index_rect.getY(),
            text: k+1,
            fontSize: font_size,
            fontFamily: this.pre_font,
            align: "center",
            fill: this.colors[3],
            width: b_index_rect.getWidth()
        });
        var b_rect = new Kinetic.Rect({
            x: (k + 1) * rect_size,
            y: b_text.getY()+(2*rect_size),
            width: rect_size,
            height: rect_size,
            fill: this.colors[this.model.count[k].color-1],
            stroke: this.colors[3],
            strokeWidth: stroke_width
        });
        var b_value = new Kinetic.Text({
            x: b_rect.getX(),
            y: b_rect.getY(),
            text: this.model.count[k].value,
            fontSize: font_size,
            fontFamily: this.pre_font,
            align: "center",
            fill: this.colors[this.model.count[k].colorStroke-1],
            width: b_rect.getWidth()
        });
        layer.add(b_index_rect);
        layer.add(b_index_value);
        layer.add(b_rect);
        layer.add(b_value);
    }
    //---------
    //---- Sorted Array
    //---------
    for(var m = 0; m < this.model.sorted.length; m++){
        var c_index_rect = new Kinetic.Rect({
            x: (m + 1) * rect_size,
            y: c_text.getY()+rect_size,
            width: rect_size,
            height: rect_size,
            fill: this.colors[this.model.sorted[m].colorIndex-1],
            stroke: this.colors[3],
            strokeWidth: stroke_width
        });
        var c_index_value = new Kinetic.Text({
            x: c_index_rect.getX(),
            y: c_index_rect.getY(),
            text: m+1,
            fontSize: font_size,
            fontFamily: this.pre_font,
            align: "center",
            fill: this.colors[3],
            width: c_index_rect.getWidth()
        });
        var c_rect = new Kinetic.Rect({
            x: (m + 1) * rect_size,
            y: c_text.getY()+(2*rect_size),
            width: rect_size,
            height: rect_size,
            fill: this.colors[this.model.sorted[m].color-1],
            stroke: this.colors[3],
            strokeWidth: stroke_width
        });
        var c_value = new Kinetic.Text({
            x: c_rect.getX(),
            y: c_rect.getY(),
            text: this.model.sorted[m].value,
            fontSize: font_size,
            fontFamily: this.pre_font,
            align: "center",
            fill: this.colors[3],
            width: c_rect.getWidth()
        });
        layer.add(c_index_rect);
        layer.add(c_index_value);
        layer.add(c_rect);
        layer.add(c_value);
    }
    //---------
    //---- Arrows
    //---------
    if(this.model.arrow1[0]!= -1){
        var arrow1 = new Kinetic.Line({
        points: [a_text.getX() + (this.model.arrow1[0]*rect_size+(0.5*rect_size)), a_text.getY()+(2*rect_size), b_text.getX() + (this.model.arrow1[1]*rect_size+0.5*rect_size), b_text.getY() + (rect_size)],
        stroke: this.colors[3],
        strokeWidth: stroke_width
        });
        layer.add(arrow1);
    }       
    if(this.model.arrow2[0]!= -1){
        var arrow2 = new Kinetic.Line({
        points: [b_text.getX() + (this.model.arrow2[0]*rect_size+(0.5*rect_size)), b_text.getY()+(3*rect_size), c_text.getX() + (this.model.arrow2[1]*rect_size+0.5*rect_size), c_text.getY() + (rect_size)],
        stroke: this.colors[3],
        strokeWidth: stroke_width
        });
        layer.add(arrow2);
    }
    
    this.stage.add(layer);
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