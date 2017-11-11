/**
 * Created by Habetinek Robert
 */

function VectorView(_model)
{
    this.model = _model;
    this.scale = 1;

    this.RECT_SIZE = 30;
    this.STROKE_WIDTH = 2.2;
    this.FONT_SIZE = 24;
    this.FONT = "Verdana";
}

VectorView.prototype.initStage = function(cont)
{
    this.stage = new Kinetic.Stage
    ({
        container : cont,
        draggable : true,
        width : 0,
        height : 0
    });
}

VectorView.prototype.zoomIn = function()
{
    if(this.scale < 1.8)this.scale += 0.1;
    this.draw();
}

VectorView.prototype.zoomOut = function()
{
    if(this.scale > 0.5)this.scale -= 0.1;
    this.draw();
}

VectorView.prototype.draw = function()
{
    var rect_size = this.RECT_SIZE * this.scale;
    var stroke_width = this.STROKE_WIDTH * this.scale;
    var font_size = this.FONT_SIZE * this.scale;

    var w = ((2 + this.model.column) * rect_size + stroke_width * 2) * 2;
    var h = (this.model.rows * rect_size + stroke_width * 2) + 2 * rect_size;

    this.stage.setHeight(h);
    this.stage.setWidth(w);
    this.stage.removeChildren();

    var layer = new Kinetic.Layer();

    for (var c = 0; c < this.model.column; c++)
    {
        for (var r = 0; r < this.model.rows; ++r)
        {
            if (c > this.model.colorColumn)
            {
                var a_rect = new Kinetic.Rect
                ({
                    x: (c + 1) * rect_size,
                    y: (r + 1) * rect_size,
                    width: rect_size,
                    height: rect_size,
                    stroke: this.model.colors[0],
                    fill: this.model.colors[3],
                    strokeWidth: stroke_width
                });
            }
            else
            {
                var a_rect = new Kinetic.Rect
                ({
                    x: (c + 1) * rect_size,
                    y: (r + 1) * rect_size,
                    width: rect_size,
                    height: rect_size,
                    stroke: this.model.colors[0],
                    strokeWidth: stroke_width
                });
            }

            if (isNaN(this.model.radix))  // for smoother View characters
            {
                var a_text = new Kinetic.Text
                ({
                    x: a_rect.getX(),
                    y: a_rect.getY() + 2,
                    text: this.model.elements[c][r],
                    fontSize: font_size,
                    fontFamily: this.FONT,
                    align: "center",
                    fill: this.model.colors[1],
                    width: a_rect.getWidth()
                });
            }
            else                        // for numbers
            {
                var a_text = new Kinetic.Text
                ({
                    x: a_rect.getX(),
                    y: a_rect.getY() + 3,
                    text: this.model.elements[c][r],
                    fontSize: font_size,
                    fontFamily: this.FONT,
                    align: "center",
                    fill: this.model.colors[1],
                    width: a_rect.getWidth()
                });
            }


            if (!this.model.finished)
            {
                if (c == this.model.colorColumn)
                {
                    var circle = new Kinetic.Circle
                    ({
                        x: a_rect.getX() + ((this.model.column + 2) * rect_size + 0.5 *rect_size),
                        y: 0.5 * rect_size,
                        radius: rect_size / 3,
                        stroke: this.model.colors[0],
                        fill: this.model.colors[2],
                        strokeWidth: stroke_width

                    });
                    layer.add(circle);
                    var b_rect = new Kinetic.Rect
                    ({
                        x: a_rect.getX() + ((this.model.column + 2) * rect_size),
                        y: a_rect.getY(),
                        width: rect_size,
                        height: rect_size,
                        stroke: this.model.colors[0],
                        //fill: this.model.colors[2],
                        strokeWidth: stroke_width
                    });
                }
                else
                {
                    var b_rect = new Kinetic.Rect
                    ({
                        x: a_rect.getX() + ((this.model.column + 2) * rect_size),
                        y: a_rect.getY(),
                        width: rect_size,
                        height: rect_size,
                        stroke: this.model.colors[0],
                        strokeWidth: stroke_width
                    });
                }
                layer.add(b_rect);
            }
            layer.add(a_rect);
            if (this.model.coloredElement[1] !== undefined)
            {
                if (this.model.elements[this.model.coloredElement[1]][r] == this.model.coloredElement[0]) // [1]=column [0]=element
                {
                    var actual_rect = new Kinetic.Rect
                    ({
                        x: (c + 1) * rect_size,
                        y: (r + 1) * rect_size,
                        width: rect_size,
                        height: rect_size,
                        stroke: this.model.colors[0],
                        fill: this.model.colors[4],
                        strokeWidth: stroke_width
                    });
                    layer.add(actual_rect);
                }
            }
            layer.add(a_text);
        }
    }

    if (this.model.sortedElements[0] !== undefined) //for empty field
    {
        //colored = this.model.sortedElements[0].length-1;
        for (var c = 0; c < this.model.column; c++)
        {
            for (var r = 0; r < this.model.sortedElements[0].length; ++r)
            {
                if (this.model.coloredElement[1] !== undefined)
                {
                    if (this.model.sortedElements[this.model.coloredElement[1]][r] == this.model.coloredElement[0]) // [1]=column [0]=element
                    {
                        var b_rect = new Kinetic.Rect
                        ({
                            x: ((c + 1) * rect_size) + ((this.model.column + 2) * rect_size),
                            y: ((r + 1) * rect_size) + 1,
                            width: rect_size,
                            height: rect_size,
                            stroke: this.model.colors[0],
                            fill: this.model.colors[4],
                            strokeWidth: stroke_width
                        });
                        layer.add(b_rect);
                    }
                }
                if (isNaN(this.model.radix))  // for smoother View characters
                {
                    var b_text = new Kinetic.Text
                    ({
                        x: ((c + 1) * rect_size) + ((this.model.column + 2) * rect_size),
                        y: ((r + 1) * rect_size) + 2,
                        text: this.model.sortedElements[c][r],
                        fontSize: font_size,
                        fontFamily: this.FONT,
                        align: "center",
                        fill: this.model.colors[1],
                        width: rect_size
                    });
                }
                else                        // for numbers
                {
                    var b_text = new Kinetic.Text
                    ({
                        x: ((c + 1) * rect_size) + ((this.model.column + 2) * rect_size),
                        y: ((r + 1) * rect_size) + 3,
                        text: this.model.sortedElements[c][r],
                        fontSize: font_size,
                        fontFamily: this.FONT,
                        align: "center",
                        fill: this.model.colors[1],
                        width: rect_size
                    });
                }
                layer.add(b_text);
            }
        }
    }
    this.stage.add(layer);
}