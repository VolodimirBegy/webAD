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
  this.rectLength = 30 * this.scale;
}

BriandaisView.prototype.setDimensions = function(){
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
  this.rectLength = 30 * this.scale;
  this.draw();
};

BriandaisView.prototype.zoomOut = function() {
  if (this.scale > 0.5) this.scale = this.scale - 0.1;
  this.rectLength = 30 * this.scale;
  this.draw();
};

BriandaisView.prototype._getKinectRect = function(node, key, charIndex) {

  var color;

  if(node.chars[key].color == tree.color3){
    color = tree.color3;
  }
  else if(node.chars[key].isWord){
    color = tree.color1;
  }
  else{
    color = tree.color2;
  }

  return new Kinetic.Rect({
    x: charIndex * this.rectLength,
    y: 0,
    height: this.rectLength,
    width: this.rectLength,
    fill: color,
    strokeWidth: 2 * this.scale,
    stroke: 'blue'
  });

}

BriandaisView.prototype._getKinectText = function(rect, char) {
  return new Kinetic.Text({
    x: rect.getX() - 35 * this.scale,
    y: rect.getY() + 8 * this.scale,
    text: char,
    fontSize: 15 * this.scale,
    fontFamily: 'Calibri',
    fill: 'black',
    width: 100 * this.scale,
    align: 'center'
  });
}

BriandaisView.prototype.draw = function() {

  // fill tmpNodes, calculate maxlevel and nodes per level (npl)
  var tmpNodes = [];
  var npl = [];
  var fontWidth = 8 * this.scale;
  var maxlevel = 0;
  var ends = 0;

  function recursiveTraversalLevel(node, level) {

    tmpNodes.push(node);

    if (npl[level]) {
      ++npl[level];
    } else {
      npl[level] = 1;
    }

    ++level;

    if (!Object.keys(node.chars).length) {
      if (level > maxlevel) {
        maxlevel = level;
      }
      ++ends;
      return;
    }

    for (var key in node.chars) {
      recursiveTraversalLevel(node.chars[key], level);
    }
  }

  // calculate x and y position of every node
  function recursiveTraversalPosition(node, childShift, rectLength) {

    tmpNodes.push(node); //Remove this after discussd with professor if exact width and height calculation is necessary

    //Only root node is supposed to have no parent
    if (!node.parent) {
      node.xPosition = rectLength;
      node.yPosition = rectLength * 1.5;
    } else {
      node.xPosition = node.parent.xPosition;
      node.yPosition = node.parent.yPosition + rectLength * 2;
    }

    node.xPosition += childShift;

    var shift = 0;
    var firstChar = true;

    for (var key in node.chars) {
      if (!firstChar) {
        shift += rectLength * Object.keys(node.chars).length / 2;
      }

      firstChar = false;

      shift += recursiveTraversalPosition(node.chars[key], shift * 2, rectLength);
    }

    node.xPosition += shift;

    return shift;
  }

  /*if (this.model.root)
    recursiveTraversalLevel(this.model.root, 0);

  // calculate width
  var maxNpl = 0;
  for (var x = 0, len = npl.length; x < len; x++) {
    if (npl[x] > maxNpl) {
      maxNpl = npl[x];
    }
  }

  // define vals for drawing
  var w = (this.rectLength * 3 + this.rectLength * 4 * ends) * this.scale;
  var h = 500;
  if (maxlevel > 7) {
    h = 300 + (maxlevel - 4) * 3 * this.rectLength;
  }
  if (this.scale > 1.1) {
    h *= this.scale;
  }
  if (w < 1000) {
    w = 1000;
  }

  this.stage.setHeight();
  this.stage.setWidth($('#container1').prop("scrollWidth"));*/
  this.stage.removeChildren();

  var layer = new Kinetic.Layer();

  if (this.model.root)
    recursiveTraversalPosition(this.model.root, 0, this.rectLength);

  // draw nodes from tmpNodes
  for (var i = 0, len = tmpNodes.length; i < len; ++i) {

      var group = new Kinetic.Group({
        x: tmpNodes[i].xPosition,
        y: tmpNodes[i].yPosition
      });

      layer.add(group);

      var charIndex = 1;
      for (var key in tmpNodes[i].chars) {
        var rect = this._getKinectRect(tmpNodes[i], key, charIndex);
        group.add(rect);
        group.add(this._getKinectText(rect, key));
        ++charIndex;
      }

      // draw line (if node not root)
      if (tmpNodes[i].parent && Object.keys(tmpNodes[i].chars).length) {

        var parentIndex = 1;
        for (var key in tmpNodes[i].parent.chars) {
          if (tmpNodes[i].parent.chars[key] === tmpNodes[i]) {
            break;
          }
          ++parentIndex;
        }

        var line = new Kinetic.Line({
          points: [group.getX() + (this.rectLength * Object.keys(tmpNodes[i].chars).length / 2) + this.rectLength, group.getY(), tmpNodes[i].parent.xPosition + (this.rectLength * parentIndex) + (this.rectLength / 2), tmpNodes[i].parent.yPosition + this.rectLength],
          stroke: "blue",
          strokeWidth: 2 * this.scale,
          lineJoin: 'round',
        });
        layer.add(line);
      }
  }

  this.stage.add(layer);
};
