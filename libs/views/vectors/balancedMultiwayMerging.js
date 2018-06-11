/*
 Software License Agreement (BSD License)
 Copyright (c), Raphael Raditsch
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function BalancedMultiwayMergingView(_model){
    this.model=_model;
    this.scale=1;
    this.colors = ["#FFFFFF", "#000000", "#ff8b00", "#000fff"];

    this.pre_square_size = 30;
    this.pre_line = 2;
    this.pre_font_size = 15;
    this.pre_font = "Helvetica";
}

BalancedMultiwayMergingView.prototype.initStage=function(containerMain){
    this.stage = new Kinetic.Stage({
        container: containerMain,
        draggable: true,
        width: 0,
        height: 0
    });
}

BalancedMultiwayMergingView.prototype.zoomIn=function(){
    if(this.scale < 2){
        this.scale = this.scale+0.1;
    }
    this.draw();
}

BalancedMultiwayMergingView.prototype.zoomOut=function(){
    if(this.scale>0.5){
        this.scale=this.scale-0.1;
    }
    this.draw();
}

BalancedMultiwayMergingView.prototype.draw=function(){

    //setting the width of the drawn lines
    var square_size = this.pre_square_size * this.scale;
    var stroke_width = this.pre_line * this.scale;
    var font_size = this.pre_font_size * this.scale;

    this.stage.removeChildren();

    //setting the canvas
    var container_width = (80*this.scale) + this.model.elements.length * square_size;
    var container_height = (200*this.scale) + this.model.tapes * 2*square_size;

    this.stage.setHeight(container_height);
    this.stage.setWidth(container_width);
    this.stage.removeChildren();

    var layer = new Kinetic.Layer();
    var advance = 70;

    var legend_label = new Kinetic.Text({
        x: 10,
        y: 0,
        text: "Number N of elements to be sorted: "+this.model.elements.length+"\nNumber 2*P of tapes used for sorting: "+this.model.tapes/2+"\nSize M of the main memory: "+this.model.main_memory,
        fontSize: font_size,
        fontFamily: this.pre_font,
        align: "left",
        fill: this.colors[2],
        width: container_width
    });
    layer.add(legend_label);

    //iterate over all given tapes
    for(var index = 0; index < this.model.tapes; index++){
        var drive_label = new Kinetic.Text({
            x: 0,
            y: advance+(index*1.5*square_size*this.scale)+square_size/4,
            text: "Tape "+index+": ",
            fontSize: font_size,
            fontFamily: this.pre_font,
            align: "center",
            fill: this.colors[1],
            width: 70
        });
        layer.add(drive_label);

        //draw the squares+values for the elements
        for(var i = 0; i < this.model.elements.length; i++) {
            var data_square = new Kinetic.Rect({
                x: drive_label.getX() + drive_label.getWidth()/2 + (i + 1) * square_size,
                y: advance+index*1.5*square_size*this.scale,
                width: square_size,
                height: square_size,
                fill: this.colors[this.model.tape_array[index].elements_colour[i]],
                stroke: this.colors[1],
                strokeWidth: stroke_width
            });
            layer.add(data_square);
            var text = this.model.tape_array[index].elements[i];
            if(typeof this.model.tape_array[index].elements[i] === "undefined"){
                continue;
            }
            var data_value = new Kinetic.Text({
                x: data_square.getX(),
                y: data_square.getY() + data_square.getHeight() / 4,
                text: text,
                fontSize: font_size,
                fontFamily: this.pre_font,
                align: "center",
                fill: this.colors[1],
                width: data_square.getWidth()
            });
            layer.add(data_value);
        }

        //if the iteration is halway across all devices, draw a line where the labels of the output/input will be displayed
        //output/input will also be switched dynamically
        if(index === this.model.tapes/2-1){
            var upper_text = "OUTPUT TAPES";
            var lower_text = "INPUT TAPES";
            if(this.model.alternating){
                upper_text = "INPUT TAPES";
                lower_text = "OUTPUT TAPES";
            }
            var upper_label = new Kinetic.Text({
                x: 0,
                y: 70+((index+1)*1.5*square_size*this.scale)+square_size/4,
                text: upper_text,
                fontSize: font_size,
                fontFamily: this.pre_font,
                align: "center",
                fill: this.colors[2],
                width: (80*this.scale) + this.model.elements.length * square_size
            });
            var io_division = new Kinetic.Line({
                x: 0,
                y: 70+((index+1)*1.5*square_size*this.scale)+square_size,
                points: [0, 0,(80*this.scale) + this.model.elements.length * square_size, 0],
                stroke: this.colors[2],
                strokeWidth: stroke_width,
                tension: 0,
                lineCap: 'round',
                lineJoin: 'round'
            });
            var lower_label = new Kinetic.Text({
                x: 0,
                y: 70+((index+1)*1.5*square_size*this.scale)+square_size*1.5,
                text: lower_text,
                fontSize: font_size,
                fontFamily: this.pre_font,
                align: "center",
                fill: this.colors[2],
                width: (80*this.scale) + this.model.elements.length * square_size
            });
            layer.add(upper_label);
            layer.add(io_division);
            layer.add(lower_label);

            advance = 70 + (1.5*square_size*this.scale)+square_size;
        }
    }

    //draw a textbox at the bottom, where the current steps of the algorithm are narrated
    var narrating_label = new Kinetic.Text({
        x: 0,
        y: 70+((index+1)*1.5*square_size*this.scale)+square_size,
        text: this.model.text,
        fontSize: font_size,
        fontFamily: this.pre_font,
        align: "center",
        fill: this.colors[3],
        width: (80*this.scale) + this.model.elements.length * square_size
    });
    layer.add(narrating_label);

    this.stage.add(layer);
}