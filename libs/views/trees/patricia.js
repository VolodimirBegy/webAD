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

function PatriciaView(_model) {
  this.model = _model;
  this.scale = 1;
}

PatriciaView.prototype.initStage = function(cont) {
  this.stage = new Kinetic.Stage({
    container: cont,
    draggable: true,
    width: 0,
    height: 0
  });
}

PatriciaView.prototype.zoomIn = function() {
  if (this.scale < 2.5) this.scale = this.scale + 0.1;
  this.draw();
}

PatriciaView.prototype.zoomOut = function() {
  if (this.scale > 0.5) this.scale = this.scale - 0.1;
  this.draw();
}

PatriciaView.prototype.draw = function() {

  // fill tmpNodes, calculate maxlevel and nodes per level (npl)
  var tmpNodes = [];
  var npl = [];
  var yRadius = 20 * this.scale;
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

    if (!node.children.length) {
      if (level > maxlevel) {
        maxlevel = level;
      }
      ++ends;
      return;
    }

    for (var j = 0, len = node.children.length; j < len; ++j) {
      recursiveTraversalLevel(node.children[j], level);
    }
  }

  // calculate x and y position of every node
  function recursiveTraversalPosition(node, childShift) {

    //Only root node is supposed to have no parent
    if (!node.parent) {
      node.xPosition = yRadius * 3;
      node.yPosition = yRadius * 3;
    } else {
      node.xPosition = node.parent.xPosition;
      node.yPosition = node.parent.yPosition + yRadius * 3;
    }

    node.xPosition += childShift;

    if (!node.children.length){
      return 0;
    }

    var shift = 0;
    for (var i = 0, len = node.children.length; i < len; ++i) {
      if (i > 0) {
        //Shift according to text width and presceding child text width
        var tempShift = fontWidth * node.children[i].value.length;
        tempShift += fontWidth * node.children[i - 1].value.length;
        tempShift = (tempShift < yRadius) ? yRadius : tempShift;
        shift += tempShift;
      }
      shift += recursiveTraversalPosition(node.children[i], shift * 2);
    }
    node.xPosition += shift;

    return shift;
  }

  if (this.model.root)
    recursiveTraversalLevel(this.model.root, 0);

  // calculate width
  var maxNpl = 0;
  for (var x = 0, len = npl.length; x < len; x++) {
    if (npl[x] > maxNpl) {
      maxNpl = npl[x];
    }
  }

  // define vals for drawing
  var w = (yRadius * 3 + yRadius * 4 * ends) * this.scale;
  var h = 500;
  if (maxlevel > 7){
    h = 300 + (maxlevel - 4) * 3 * yRadius;
  }
  if (this.scale > 1.1){
    h *= this.scale;
  }
  if (w < 1000){
    w = 1000;
  }

  this.stage.setHeight(h);
  this.stage.setWidth(w);
  this.stage.removeChildren();

  var layer = new Kinetic.Layer();

  if (this.model.root)
    recursiveTraversalPosition(this.model.root, 0);


  // draw nodes from tmpNodes
  for (var i = 0, len = tmpNodes.length; i < len; ++i) {

    // draw (if node exists)
    if (tmpNodes[i]) {

      // make start node a different color
      if (!tmpNodes[i].parent && tmpNodes[i].color != tree.color3){
        tmpNodes[i].color = tree.color1;
      }

      // make words a different color
      else if (tmpNodes[i].isWord && tmpNodes[i].color != tree.color3){
        tmpNodes[i].color = tree.color1;
      }
      else if (tmpNodes[i].color != tree.color3){
        tmpNodes[i].color = tree.color2;
      }

      // draw node
      var circle = new Kinetic.Ellipse({
        x: tmpNodes[i].xPosition,
        y: tmpNodes[i].yPosition,
        radius: {
          x:(tmpNodes[i].value.length * fontWidth < yRadius) ? yRadius : (fontWidth * tmpNodes[i].value.length),
          y:yRadius
        },
        fill: tmpNodes[i].color,
        strokeWidth: 4 * this.scale,
      });

      layer.add(circle);

      // draw value on node (if not root)
      if (tmpNodes[i].parent) {
        var val = new Kinetic.Text({
          x: circle.getX() - 50 * this.scale,
          y: circle.getY() - 7 * this.scale,
          text: tmpNodes[i].value,
          fontSize: 15 * this.scale,
          fontFamily: 'Calibri',
          fill: 'black',
          width: 100 * this.scale,
          align: 'center',
          wrap: 'none'
        });
        layer.add(val);
      }

      // draw line (if node not root)
      if (tmpNodes[i].parent) {
        var line = new Kinetic.Line({
          points: [circle.getX(), circle.getY() - yRadius, tmpNodes[i].parent.xPosition, tmpNodes[i].parent.yPosition + yRadius],
          stroke: "blue",
          strokeWidth: (0.1 * yRadius),
          lineJoin: 'round',
        });
        layer.add(line);
      }
    }
  }

  this.stage.add(layer);
}
