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
function VectorView(_model) {
    this.model = _model;
    this.scale = 1;
    this.RECT_SIZE = 30;
    this.STROKE_WIDTH = 2.2;
    this.FONT_SIZE = 24;
    this.FONT = "Verdana";
}
VectorView.prototype.initStage = function (cont) {
    this.stage = new Kinetic.Stage({
        container: cont
        , draggable: true
        , width: 0
        , height: 0
    });
}
VectorView.prototype.zoomIn = function () {
    if (this.scale < 1.8) this.scale += 0.1;
    this.draw();
}
VectorView.prototype.zoomOut = function () {
    if (this.scale > 0.5) this.scale -= 0.1;
    this.draw();
}
VectorView.prototype.draw = function () {
    var rect_size = this.RECT_SIZE * this.scale;
    var stroke_width = this.STROKE_WIDTH * this.scale;
    var font_size = this.FONT_SIZE * this.scale;
    var opacity = 1;
    var w = ((2 + this.model.column) * rect_size + stroke_width * 2) * 5;
    var h = (this.model.rows * rect_size + stroke_width * 5) + 2 * rect_size;
    this.stage.setHeight(h * 2);
    this.stage.setWidth(w * 2);
    this.stage.removeChildren();
    var layer = new Kinetic.Layer();

    var help1 = 0;

    for (var columns = 0; columns < this.model.allElementsPerColumn.length; columns++) {
        var help = 1;
        for (var block = 0; block < this.model.allElementsPerColumn[columns].length; block++) {
            var elements = this.model.allElementsPerColumn[columns][block];
            var color = this.model.allColoredElementsPerColumn[columns][block];

            if (elements != null && elements[0].length != 0) {
                for (var c = 0; c < elements.length; c++) {
                    for (var r = 0; r < elements[0].length; ++r) {

                        if (c == columns) {
                            opacity = 1;
                        } else {
                            opacity = 0.5;
                        }
                        var a_rect = new Kinetic.Rect({
                            x: (c + 1 + help1) * rect_size
                            , y: (r + help) * rect_size
                            , width: rect_size
                            , height: rect_size
                            , stroke: this.model.colors[1]
                            , fill: this.model.colors[color[c][r]]
                            , strokeWidth: stroke_width
                            , opacity: opacity
                        });
                        var a_text = new Kinetic.Text({
                            x: a_rect.getX()
                            , y: a_rect.getY() + 3
                            , text: elements[c][r]
                            , fontSize: font_size
                            , fontFamily: this.FONT
                            , align: "center"
                            , fill: this.model.colors[1]
                            , width: a_rect.getWidth()
                            , opacity: opacity
                        });
                        if (c == columns) {
                            var circle = new Kinetic.Circle({
                                x: a_rect.getX() + rect_size * 0.5
                                , y: 0.5 * rect_size
                                , radius: rect_size / 3.5
                                , stroke: this.model.colors[1]
                                , fill: this.model.colors[3]
                                , strokeWidth: stroke_width
                            });
                            layer.add(circle);
                        }

                        layer.add(a_rect);
                        layer.add(a_text);
                    }


                }

                help += elements[0].length + 1;

            } else {

            }
        }
        help1 += this.model.column + 2;


    }

    if (this.model.finished) {
        help1 -= this.model.column + 1;
        var last = this.model.allElementsPerColumn.length - 2;
        var help2 = 1;
        for (var block = 0; block < this.model.allElementsPerColumn[last].length; block++) {
            var elements = this.model.allElementsPerColumn[last][block];
            if (elements != null) {

                for (var c = 0; c < elements.length; c++) {
                    for (var r = 0; r < elements[0].length; ++r) {

                        var a_rect = new Kinetic.Rect({
                            x: (c + help1) * rect_size
                            , y: (r + help2) * rect_size
                            , width: rect_size
                            , height: rect_size
                            , stroke: this.model.colors[1]
                            , fill: this.model.colors[2]

                        });
                        var a_text = new Kinetic.Text({
                            x: a_rect.getX()
                            , y: a_rect.getY() + 3
                            , text: elements[c][r]
                            , fontSize: font_size
                            , fontFamily: this.FONT
                            , align: "center"
                            , width: a_rect.getWidth()
                            , fill: this.model.colors[1]

                        });
                        layer.add(a_rect);
                        layer.add(a_text);
                    }

                }
                help2 += elements[0].length;
            }
        }
    }
    this.stage.add(layer);
}