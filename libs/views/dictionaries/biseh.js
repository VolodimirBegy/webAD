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

function BisehView(_model) {
    this.scale = 0.9;
    this.model = _model;
}

BisehView.prototype.initStage = function (contMain, contSec, playBtn) {
    this.stage = new Kinetic.Stage({
        container: contMain,
        draggable: true,
        width: 0,
        height: 0
    });

    this.elementDisplay = contSec;
    this.playButton = playBtn;
}

BisehView.prototype.zoomIn = function () {
    if (this.scale < 3) this.scale = this.scale + 0.1;
    this.draw();
}

BisehView.prototype.zoomOut = function () {
    if (this.scale > 0.5) this.scale = this.scale - 0.1;
    this.draw();
}

BisehView.prototype.draw = function () {

    this.stage.removeChildren();

    var layer = new Kinetic.Layer();

    //
    // Configurable
    //
    var box_width = 60 * this.scale;
    var box_height = 25 * this.scale;

    var fonts = 'Calibri , Helvetica';


    // Display Values settings
    this.elementDisplay.style.fontFamily = fonts;
    this.elementDisplay.style.fontWeight = 'normal';

    //  End -configurable

//IMPLEMENT
    var temp_counter = 0;
    for (var i = 0; i < this.model.index_array.length; i++) {
        for (var j = 0; j < this.model.index_array[i].indexblock_array.length / 2; j++) {
            if (this.model.index_array[i].indexblock_array[j].counter !== undefined) {
                if (this.model.index_array[i].indexblock_array[j].counter > temp_counter) {
                    temp_counter = this.model.index_array[i].indexblock_array[j].counter;
                }
            }
        }
    }

    var space = 0;
    var space_two = 0;
    var allValues = [];

    // IndexDepth and EntryDepth
    var details_label = new Kinetic.Text({
        x: 40 * this.scale,
        y: 10 * this.scale,
        text: "x=" + Math.pow(2, this.model.index_depth) + "  y=" + Math.pow(2, this.model.entrie_depth),
        fontSize: 27 * this.scale,
        fontStyle: 'bold',
        fontFamily: fonts,
        fill: "black",
        align: 'left',
        width: 200,
    });
    layer.add(details_label);


    var label_witdh = 0;
    var block_width = undefined;

    var toplabel = undefined;
    var max_temp = 0;


    //search max
    for (var i = 0; i < this.model.index_array.length; i++) {
        for (var j = 0; j < this.model.index_array[i].indexblock_array.length; j++) {
            for (var k = 0; k < this.model.index_array[i].indexblock_array[j].datablock_array.length; k++) {
                for (var z = 0; z < this.model.index_array[i].indexblock_array[j].datablock_array[k].values.length; z++) {
                    if (this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z] !== undefined) {
                        if (max_temp < this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z]) {
                            max_temp = this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z];
                        }
                    }

                }
            }
        }
    }


    var group = new Kinetic.Group({draggable: false});
    for (var i = 0; i < this.model.index_array.length; i++) {
        toplabel = true;

        for (var j = 0; j < this.model.index_array[i].indexblock_array.length; j++) {


            // Index - Blocks
            var b_index = new Kinetic.Rect({
                x: 170 * this.scale + (i * 200) * this.scale,
                y: Math.pow(2, temp_counter) * box_height + (220 * this.scale + (j * 25) * this.scale),
                width: box_width - 20 * this.scale,
                height: box_height,
                fill: this.model.index_array[i].indexblock_array[j].marked === true ? 'orange' : '#ADFF2F',
                stroke: 1,
                strokeWidth: 3 * this.scale,
            });
            layer.add(b_index);

            var e_index = new Kinetic.Rect({
                x: b_index.getX() + 40 * this.scale,
                y: b_index.getY(),
                width: box_width,
                height: box_height,
                fill: this.model.index_array[i].indexblock_array[j].marked === true ? 'orange' : '#ADFF2F',
                stroke: 1,
                strokeWidth: 3 * this.scale,
            });
            layer.add(e_index);

            // Index - Row Labels
            var binary_label = new Kinetic.Text({
                x: b_index.getX() - b_index.width() - 23 * this.scale,
                y: b_index.getY(),
                text: ("0").repeat(this.model.entrie_depth - j.toString(2).length) + j.toString(2),
                fontSize: 20 * this.scale,
                fontFamily: fonts,
                fill: 'black',
                width: box_width,
                align: 'right'
            });
            layer.add(binary_label);

            var counter_label = new Kinetic.Text({
                x: b_index.getX() - b_index.width() + 3 * this.scale,
                y: b_index.getY() + 2 * this.scale,
                text: this.model.index_array[i].indexblock_array[j].datablock_array[0] === undefined ? '-' : this.model.index_array[i].indexblock_array[j].counter,
                fontSize: 20 * this.scale,
                fontFamily: fonts,
                fill: 'black',
                width: box_width,
                align: 'right'
            });
            layer.add(counter_label);

            if (toplabel) {
                var top_label = new Kinetic.Text({
                    x: b_index.getX(),
                    y: b_index.getY() - 25 * this.scale,
                    text: ("0").repeat(this.model.index_depth - i.toString(2).length) + i.toString(2),
                    fontSize: 20 * this.scale,
                    draggable: false,
                    fontFamily: fonts,
                    fill: 'black',
                    width: box_width,
                    align: 'right'
                });
                layer.add(top_label);
                toplabel = false;
            }

            var draw_datablock = true;
            var line_to_lastblock = false;
            var line_temp = false;
            var temp = undefined;
            var max = max_temp;
            var max = max.toString(2);

// variable for postition
            var block_pos = Math.pow(2, this.model.entrie_depth) / 2;

            if (j < block_pos)
                line_temp = true;
            else
                line_temp = false;


            for (var k = 0; k < this.model.index_array[i].indexblock_array[j].datablock_array.length; k++) {
                if (k === this.model.index_array[i].indexblock_array[j].datablock_array.length - 1) line_to_lastblock = true;
                if (temp != j) {
                    if (line_temp)
                        space_two = space_two + (box_width / this.scale * this.model.datablock_size) + (this.model.index_array[i].indexblock_array[j].counter * 18) + 15;
                    else
                        space = space + (box_width / this.scale * this.model.datablock_size) + (this.model.index_array[i].indexblock_array[j].counter * 18) + 15;
                }

                for (var z = 0; z < this.model.datablock_size; z++) {

                    if (this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z] !== undefined) {

                        var bin_dis = this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z].toString(2);
                        if (bin_dis.length < max.length) {
                            bin_dis = "0".repeat(max.length - bin_dis.length) + bin_dis;
                        }


                        var bina = bin_dis;
                        var datablock_dis = bina.substring(bina.length - this.model.index_depth - this.model.entrie_depth - this.model.index_array[i].indexblock_array[j].counter, bina.length - this.model.index_depth - this.model.entrie_depth);
                        var x_bin = bina.substring(bina.length - this.model.index_depth, bina.length);
                        var y_bin = bina.substring(bina.length - this.model.index_depth - this.model.entrie_depth, bina.length - this.model.index_depth);
                        var rest_bin = bina.substring(0, bina.length - this.model.index_depth - this.model.entrie_depth - this.model.index_array[i].indexblock_array[j].counter);

                        var bin_string = this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z] + ": " + rest_bin;

                        if (datablock_dis.length > 0)
                            bin_string = bin_string + " b:" + datablock_dis + " y:" + y_bin + " x:" + x_bin;
                        else
                            bin_string = bin_string + " y:" + y_bin + " x:" + x_bin;

                        allValues.push(bin_string);


                    }

                    var datablock = new Kinetic.Rect({
                        x: j < block_pos ? (52 * z) * this.scale + space_two * this.scale : (52 * z) * this.scale + space * this.scale,
                        y: j < block_pos ? this.model.index_array[i].indexblock_array[j].counter === temp_counter ? 50 * this.scale + (k * 26) * this.scale - (Math.pow(2, this.model.entrie_depth)) + 110 * this.scale : 50 * this.scale + (((Math.pow(2, temp_counter) - 1) + k - Math.pow(2,this.model.index_array[i].indexblock_array[j].counter) ) * 26) * this.scale - (Math.pow(2, this.model.entrie_depth)) + 110 * this.scale : Math.pow(2, temp_counter) * box_height + this.scale + 280 * this.scale + (k * 26) * this.scale + (Math.pow(2, this.model.entrie_depth)) * box_height,
                        width: box_width - 8 * this.scale,
                        height: box_height,
                        fill: this.model.index_array[i].indexblock_array[j].datablock_array[k].marked === true || this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z] === this.model.element || this.model.expanded && this.model.index_array[i].indexblock_array[j].marked === true ? 'orange' : '#ADFF2F',
                        stroke: 1,
                        draggable: false,
                        strokeWidth: 3 * this.scale,
                    });

                    var label_data = new Kinetic.Text({
                        x: datablock.getX() - 4 * this.scale,
                        y: datablock.getY() + 2 * this.scale,
                        text: this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z] !== undefined ? this.model.index_array[i].indexblock_array[j].datablock_array[k].values[z] : "-",
                        fontSize: 20 * this.scale,
                        fontFamily: fonts,
                        fill: "black",
                        width: box_width,
                        align: 'center'
                    });

                    if (this.model.index_array[i].indexblock_array[j].counter > 0) {
                        var datablock_label = new Kinetic.Text({
                            x: datablock.getX() - 65 * this.scale,
                            y: datablock.getY(),
                            text: ("0").repeat(this.model.index_array[i].indexblock_array[j].counter - k.toString(2).length) + k.toString(2),
                            fontSize: 20 * this.scale,
                            draggable: false,
                            fontFamily: fonts,
                            fill: 'black',
                            width: box_width,
                            align: 'right'
                        });
                        layer.add(datablock_label);

                        label_witdh = datablock_label.getWidth();
                    }

                    var counter_old = this.model.index_array[i].indexblock_array[j].counter;

                    if (draw_datablock && !line_temp) {
                        var arrow = new Kinetic.Line({
                            x: 0,
                            y: 0,
                            points: [datablock.getX() + this.model.datablock_size * box_width / 2.29, datablock.getY(),
                                e_index.getX() + box_width / 2, e_index.getY() + box_height / 2
                            ],
                            tension: 1,
                            stroke: 'black',
                            strokeWidth: 3 * this.scale,
                            draggable: false,
                        });
                        draw_datablock = false;
                    }

                    if (line_temp && line_to_lastblock) {
                        var arrow = new Kinetic.Line({
                            x: 0,
                            y: 0,
                            points: [datablock.getX() + this.model.datablock_size * box_width / 2.29, datablock.getY() + box_height,
                                e_index.getX() + box_width / 2, e_index.getY() + box_height / 2
                            ],
                            tension: 1,
                            stroke: 'black',
                            strokeWidth: 3 * this.scale,
                            draggable: false,
                        });
                    }

                    temp = j;

                    group.add(datablock);
                    group.add(label_data);
                    if (line_to_lastblock) {
                        group.add(arrow);
                        line_to_lastblock = false;

                    }


                }
            }

        }


    }
    layer.add(group);

    if (this.model.task !== undefined && this.model.actValue !== undefined) {
        var bin = this.model.actValue.toString(2);
        if (bin.length < this.model.index_depth + this.model.entrie_depth + this.model.actCounter) {
            bin = "0".repeat(this.model.index_depth + this.model.entrie_depth + this.model.actCounter - bin.length) + bin;
        }


        var binary = bin;
        var datablock_b = binary.substring(binary.length - this.model.index_depth - this.model.entrie_depth - this.model.actCounter, binary.length - this.model.index_depth - this.model.entrie_depth);
        //alert(datablock_b);

        var rest_bin = binary.substring(0, binary.length - this.model.index_depth - this.model.entrie_depth - this.model.actCounter);

        var actvalue = new Kinetic.Text({
            x: details_label.getX() + 220 * this.scale,
            y: details_label.getY(),
            text: this.model.task + ": " + this.model.actValue + " = " + rest_bin,
            fontSize: 27 * this.scale,
            fontStyle: 'bold',
            fontFamily: fonts,
            fill: "black",
            align: 'left'
        });
        layer.add(actvalue);

        var x_binary = binary.substring(binary.length - this.model.index_depth, binary.length);
        var y_binary = binary.substring(binary.length - this.model.index_depth - this.model.entrie_depth, binary.length - this.model.index_depth);
        if (datablock_b.length > 0) {
            var datab = new Kinetic.Text({
                x: actvalue.getX() + actvalue.getWidth(),
                y: actvalue.getY(),
                text: " b: " + datablock_b,
                fontSize: 27 * this.scale,
                fontStyle: 'bold',
                fontFamily: fonts,
                fill: "orange",
                align: 'left'
            });
            layer.add(datab);
        }

        var y_coord = new Kinetic.Text({
            x: datablock_b.length > 0 ? datab.getX() + datab.getWidth() : actvalue.getX() + actvalue.getWidth(),
            y: actvalue.getY(),
            text: " y: " + y_binary,
            fontSize: 27 * this.scale,
            fontStyle: 'bold',
            fontFamily: fonts,
            fill: "orange",
            align: 'left'
        });
        layer.add(y_coord);


        var x_coord = new Kinetic.Text({
            x: y_coord.getX() + 70 * this.scale,
            y: y_coord.getY(),
            text: " x: " + x_binary,
            fontSize: 27 * this.scale,
            fontStyle: 'bold',
            fontFamily: fonts,
            fill: "orange",
            align: 'left'
        });
        layer.add(x_coord);
    }

    if (this.model.expanded && !this.model.contExpand) {
        var expand = new Kinetic.Text({
            x: x_coord.getX() + 80 * this.scale,
            y: x_coord.getY(),
            text: "Datablock Full : Expand",
            fontSize: 27 * this.scale,
            fontStyle: 'bold',
            fontFamily: fonts,
            fill: "black",
            align: 'left'
        });
        layer.add(expand);

    }

    if (this.model.expanded && this.model.contExpand) {
        var contExpand = new Kinetic.Text({
            x: x_coord.getX() + 80 * this.scale,
            y: x_coord.getY(),
            text: "No Free Slot : Another Expand",
            fontSize: 27 * this.scale,
            fontStyle: 'bold',
            fontFamily: fonts,
            fill: "black",
            align: 'left'
        });
        layer.add(contExpand);
    }
    var t_counter = 0;
    for (var i = 0; i < this.model.index_array.length; i++) {
        for (var j = 0; j < this.model.index_array[i].indexblock_array.length; j++) {
            if (this.model.index_array[i].indexblock_array[j].counter !== undefined) {
                if (this.model.index_array[i].indexblock_array[j].counter > t_counter) {
                    t_counter = this.model.index_array[i].indexblock_array[j].counter;
                }
            }
        }
    }
    var hight = t_counter * 300* this.scale + this.model.entrie_depth * 300 * this.scale;

    if (hight < 720)
        this.stage.setHeight(720);
    else
        this.stage.setHeight(hight);

    var width = this.model.index_depth * 700 * this.scale + allValues.length * box_width/2;

    if (width < 1200)
        this.stage.setWidth(1200);
    else
        this.stage.setWidth(width);

    this.stage.add(layer);

    // Inserted elements in binary form
    if (allValues.length > 0) {
        allValues = allValues.sort(function (a, b) {
            return a.split(':')[0] - b.split(':')[0];
        }); // accending order

        var valuesHTML = "";
        for (var i = 0; i < allValues.length; i++) {

            valuesHTML += allValues[i] + "</br>";
        }
        this.elementDisplay.innerHTML = valuesHTML; // Pass values to the view.
    }
    else {
        this.elementDisplay.innerHTML = "Empty...";
    }

    // Play-Pause Button
    if (this.model.queueWorks && this.model.speed != 0 || this.model.working && this.model.speed != 0)
        this.playButton.addClass("p1"); // Show Pause Btn
    else
        this.playButton.removeClass("p1"); // Show Play Btn


}