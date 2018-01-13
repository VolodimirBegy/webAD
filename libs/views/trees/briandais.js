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

function BriandaisView(_model) {
  this.model = _model;
  this.scale = 1;
}

BriandaisView.prototype.setDimensions = function() {
  var container = $(this.stage.attrs.container);
  this.stage.setWidth(container.prop("scrollWidth") - 10);
  this.stage.setHeight(container.prop("scrollHeight") - 50);
};

BriandaisView.prototype.initStage = function(cont) {
  this.stage = new Kinetic.Stage({
    container: cont,
    draggable: true
  });

  this.setDimensions();

  var _this = this;
  $(window).resize(function() {
    _this.setDimensions();
  });
};

BriandaisView.prototype.zoomIn = function() {
  if (this.scale < 2.5) this.scale = this.scale + 0.1;
  this.draw();
};

BriandaisView.prototype.zoomOut = function() {
  if (this.scale > 0.5) this.scale = this.scale - 0.1;
  this.draw();
};

BriandaisView.prototype.draw = function() {

  var tmpNodes = [];
  var circum = 30 * this.scale;
  var arrowLength = 18 * this.scale;
  var roofHeight = -5 * this.scale;
  var rectPadding = 5 * this.scale;

  // calculate x and y position of every node
  function recursiveTraversalPosition(node, childShift) {

    tmpNodes.push(node); //Remove this after discussd with professor if exact width and height calculation is necessary

    //Only root node is supposed to have no parent
    if (!node.parent) {
      node.xPosition = circum;
      node.yPosition = circum * 1.5;
    } else {
      node.xPosition = node.parent.xPosition;
      node.yPosition = node.parent.yPosition + circum * 2;
    }

    node.xPosition += childShift;

    var shift = 0;
    var firstChar = true;

    for (var key in node.children) {
      if (!firstChar) {
        shift += circum * Object.keys(node.children).length / 2 + arrowLength;
      }

      firstChar = false;

      if (Object.keys(node.children[key].children).length) {
        shift += recursiveTraversalPosition(node.children[key], shift * 2);
      }
    }

    node.xPosition += shift;
    return shift;
  }

  this.stage.removeChildren();

  var layer = new Kinetic.Layer();

  if (this.model.root)
    recursiveTraversalPosition(this.model.root, 0);

  // draw nodes from tmpNodes
  for (var i = 0, len = tmpNodes.length; i < len; ++i) {

    var group = new Kinetic.Group({
      x: tmpNodes[i].xPosition,
      y: tmpNodes[i].yPosition,
      fill: 'red'
    });

    layer.add(group);

    var charIndex = 0;
    for (var key in tmpNodes[i].children) {

      //var rect = this._getKinectRect(tmpNodes[i], key, charIndex);

      var color = tree.color2;

      if (tmpNodes[i].children[key].color == tree.color3) {
        color = tree.color3;
      } else if (tmpNodes[i].children[key].isWord) {
        color = tree.color1;
      }

      var circle = new Kinetic.Circle({
        x: charIndex * (circum + (charIndex > 0 ? arrowLength : 0)) + circum / 2,
        y: circum / 2,
        radius: circum / 2,
        fill: color,
        strokeWidth: 2 * this.scale,
        stroke: 'blue'
      });

      group.add(circle);

      group.add(new Kinetic.Text({
        x: circle.getX() - circle.getRadius(),
        y: circle.getY() - 8,
        text: key,
        fontSize: 15 * this.scale,
        fontFamily: 'Calibri',
        fill: 'black',
        width: circum,
        align: 'center'
      }));

      //Arrow
      if (charIndex > 0) {

        var fromX = circle.getX() - circum / 2 - arrowLength + 2;
        var fromY = circle.getY();
        var toX = circle.getX() - circum / 2 - 2;
        var toY = circle.getY();
        var headlen = 8 * this.scale;
        var angle = Math.atan2(toY - fromY, toX - fromX);

        group.add(new Kinetic.Line({
          stroke: 'blue',
          points: [fromX, fromY, toX, toY, toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6), toX, toY, toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6)],
          strokeWidth: 1 * this.scale,
          lineJoin: 'bevel',
        }));
      }

      ++charIndex;
    }

    var roof = new Kinetic.Line({
      stroke: 'blue',
      points: [0, roofHeight, charIndex * circum + (charIndex - 1) * arrowLength, roofHeight],
      strokeWidth: 1.5 * this.scale,
      lineJoin: 'bevel',
    })

/*
    var roof = new Kinetic.Rect({
      stroke: 'blue',
      x: -rectPadding,
      y:roofHeight,
      height:circum + rectPadding * 2,
      width:charIndex * circum + (charIndex - 1) * arrowLength + rectPadding * 2,
      //points: [0, roofHeight, charIndex * circum + (charIndex - 1) * arrowLength, roofHeight],
      strokeWidth: 1 * this.scale,
      lineJoin: 'round',
    })
    */

    group.add(roof);

    // draw line (if node not root)
    if (tmpNodes[i].parent && Object.keys(tmpNodes[i].children).length) {

      var parentIndex = 0;
      for (var key in tmpNodes[i].parent.children) {
        if (tmpNodes[i].parent.children[key] === tmpNodes[i]) {
          break;
        }
        ++parentIndex;
      }

      layer.add(new Kinetic.Line({
        points: [tmpNodes[i].xPosition + roof.getPoints()[2] / 2, tmpNodes[i].yPosition + roof.getPoints()[3], tmpNodes[i].parent.xPosition + parentIndex * (circum + (parentIndex > 0 ? arrowLength : 0)) + circum / 2, tmpNodes[i].parent.yPosition + circum],
        //points: [tmpNodes[i].xPosition + roof.getWidth() / 2, tmpNodes[i].yPosition + roofHeight, tmpNodes[i].parent.xPosition + parentIndex * (circum + (parentIndex > 0 ? arrowLength : 0)) + circum / 2, tmpNodes[i].parent.yPosition + circum],
        stroke: "blue",
        strokeWidth: 1.5 * this.scale,
        lineJoin: 'round',
      }));
    }
  }

  this.stage.add(layer);
};
