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

function Node() {
  this.value = 0;
  this.children = undefined;
  this.parent = undefined;
  trieUtils.setCommonTrieMembers(this);
}

function Trie() {
  this.view = new TrieView(this);

  var node = new Node();
  node.value = "0";
  this.root = node;

  trieUtils.setCommonTrieMembers(this);
}

Trie.prototype.findWords = function(tree) {

  tree = tree || this;
  var words = [];
  var word = "";

  function recursiveTraversal(actNode, word) {
    if (actNode.value === "$") {

      words.push(word);
      return;
    }

    if (actNode.value != "0") word += actNode.value;
    var actChildren = actNode.children;
    for (var j = 0; j < actChildren.length; j++) {

      recursiveTraversal(actNode.children[j], word);
    }

  }

  if (tree.root.children != undefined)
    recursiveTraversal(tree.root, word);

  return words;
};

Trie.prototype.copy = function() {
  return trieUtils.copy(new Trie());
};

Trie.prototype.saveInDB = function() {
  trieUtils.saveInDB();
};

Trie.prototype.replaceThis = function(toCopy) {

  var words = this.findWords(toCopy);

  this.root = undefined;
  var node = new Node();
  node.value = "0";
  this.root = node;

  for (var j = 0; j < words.length; j++) {

    this.addFixed(words[j]);
  }
};

Trie.prototype.random = function() {
  var node = new Node();
  node.value = "0";
  trieUtils.random(node);
};

Trie.prototype.addFixed = function(word) {
  /* word is a character array (e.g. "cat") */
  word += "$";

  var actNode = this.root;

  for (var i = 0; i < word.length; i++) {
    /* if no letters exist on this level */
    if (actNode.children === undefined) {
      var node = new Node();
      node.value = word.charAt(i);
      node.parent = actNode;
      actNode.children = [node];
      actNode = actNode.children[0];
    } else {
      /* search for current letter */
      var actChildren = actNode.children;
      var found = false;
      for (var j = 0; j < actChildren.length; j++) {
        var actChild = actChildren[j];
        if (actChild.value === word.charAt(i)) {
          actNode = actNode.children[j];
          found = true;
          break;
        }
      }

      /* if current letter doesnt exist */
      if (!found) {
        var node = new Node();
        node.value = word.charAt(i);
        node.parent = actNode;

        /* insert letter at correct position (alphabetical) */
        var letterAsciiCode = word.charAt(i).charCodeAt(0);
        var pos = actChildren.length;
        for (var j = 0; j < actChildren.length; j++) {
          var actChild = actChildren[j];
          var childAsciiCode = actChild.value.charCodeAt(0);
          if (childAsciiCode > letterAsciiCode) {
            pos = j;
            break;
          }
        }
        actNode.children.splice(pos, 0, node);
        actNode = actNode.children[pos];
      }
    }
  }
};

Trie.prototype.newTree = function() {
  var node = new Node();
  node.value = "0";
  trieUtils.newTree(node)
};

Trie.prototype.create = function(words) {
  var node = new Node();
  node.value = "0";
  trieUtils.create(node, words);
};

Trie.prototype.add = function(word) {

  tree.running = true;
  word += "$";

  var actNode = this.root;
  actNode.color = tree.color3;
  this.draw();
  actNode.color = tree.color2;

  var end = word.length;
  var level = 0;

  if (level < end) doAddLoop(actNode);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~

  function doAddLoop(actNode) {
    setTimeout(function() {

      if (actNode.children === undefined) {

        var node = new Node();
        node.value = word.charAt(level);
        node.parent = actNode;
        actNode.children = [node];
        actNode = actNode.children[0];
      }
      /* letters exist, search for current letter */
      else {
        var actChildren = actNode.children;
        var found = false;
        for (var j = 0; j < actChildren.length; j++) {
          var actChild = actChildren[j];
          if (actChild.value === word.charAt(level)) {
            actNode = actNode.children[j];
            found = true;
            break;
          }
        }

        /* if current letter doesnt exist */
        if (!found) {
          var node = new Node();
          node.value = word.charAt(level);
          node.parent = actNode;

          /* insert letter at correct position (alphabetical) */
          var letterAsciiCode = word.charAt(level).charCodeAt(0);
          var pos = actChildren.length;
          for (var j = 0; j < actChildren.length; j++) {
            var actChild = actChildren[j];
            var childAsciiCode = actChild.value.charCodeAt(0);
            if (childAsciiCode > letterAsciiCode) {
              pos = j;
              break;
            }
          }
          actNode.children.splice(pos, 0, node);
          actNode = actNode.children[pos];
        }
      }

      actNode.color = tree.color3;

      level++;

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doAddLoop(actNode);
          if (level === end) doEndLoop();
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doAddLoop(actNode);
          if (level === end) doEndLoop();
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doEndLoop() {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.saveInDB();
          tree.draw();
          tree.running = false;
          tree.stopped = false;
        } else doEndLoop(actNode);
      } else {
        if (tree.stopped === true) doEndLoop(actNode);
        else {
          tree.saveInDB();
          tree.draw();
          tree.running = false;
          tree.stopped = false;
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doStopLoop(level, end, actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doAddLoop(actNode);
          if (level === end) doEndLoop();
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doAddLoop(actNode);
          if (level === end) doEndLoop();
        }
      }

    }, 1000 / tree.speed * 5)
  }
};

Trie.prototype.search = function(word) { /* word search */

  tree.running = true;

  word += "$";

  var actNode = this.root;

  actNode.color = tree.color3;
  this.draw();
  actNode.color = tree.color2;

  var end = word.length;
  var level = 0;

  if (level < end) doSearchLoop(actNode);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~

  function doSearchLoop(actNode) {
    setTimeout(function() {

      if (actNode.children === undefined) {
        /* no children but still letters left to search for */
        alert("The word \"" + word.slice(0, -1) + "\" could not be found!");
        tree.draw();
        tree.running = false;
        tree.stopped = false;
        return;
      }
      /* letters exist, search for current letter */
      else {
        var actChildren = actNode.children;
        var found = false;
        for (var j = 0; j < actChildren.length; j++) {
          var actChild = actChildren[j];
          if (actChild.value === word.charAt(level)) {
            actNode = actNode.children[j];
            found = true;
            break;
          }
        }

        /* if current letter doesnt exist */
        if (!found) {
          alert("The word \"" + word.slice(0, -1) + "\" could not be found!");
          tree.draw();
          tree.running = false;
          tree.stopped = false;
          return;
        }
      }

      actNode.color = tree.color3;

      level++;

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop();
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop();
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doEndLoop() {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          alert("The word \"" + word.slice(0, -1) + "\" was found!");
          tree.draw();
          tree.running = false;
          tree.stopped = false;
        } else doEndLoop();
      } else {
        if (tree.stopped === true) doEndLoop();
        else {
          alert("The word \"" + word.slice(0, -1) + "\" was found!");
          tree.draw();
          tree.running = false;
          tree.stopped = false;
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doStopLoop(level, end, actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop();
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop();
        }
      }

    }, 1000 / tree.speed * 5)
  }
};

Trie.prototype.search2 = function(prefix) { /* prefix search */

  tree.running = true;

  var actNode = this.root;

  actNode.color = tree.color3;
  this.draw();
  actNode.color = tree.color2;

  var end = prefix.length;
  var level = 0;

  if (level < end) doSearchLoop(actNode);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~

  function doSearchLoop(actNode) {
    setTimeout(function() {

      if (actNode.children === undefined) {
        /* no children but still letters left to search for */
        alert("The prefix \"" + prefix + "\" could not be found!");
        tree.draw();
        tree.running = false;
        tree.stopped = false;
        return;
      }
      /* letters exist, search for current letter */
      else {
        var actChildren = actNode.children;
        var found = false;
        for (var j = 0; j < actChildren.length; j++) {
          var actChild = actChildren[j];
          if (actChild.value === prefix.charAt(level)) {
            actNode = actNode.children[j];
            found = true;
            break;
          }
        }

        /* if current letter doesnt exist */
        if (!found) {
          alert("The prefix \"" + prefix + "\" could not be found!");
          tree.draw();
          tree.running = false;
          tree.stopped = false;
          return;
        }
      }

      actNode.color = tree.color3;

      level++;

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop(actNode);
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop(actNode);
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doEndLoop(actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          alert("The prefix \"" + prefix + "\" was found!");

          /* find all words with this prefix */
          var words = [];
          var word = prefix.slice(0, -1);

          if (actNode != undefined)
            recursiveTraversal(actNode, word);

          function recursiveTraversal(actNode, word) {
            if (actNode.value === "$") {

              words.push(word);
              return;
            }

            if (actNode.value != "0") word += actNode.value;
            var actChildren = actNode.children;

            for (var j = 0; j < actChildren.length; j++) {

              recursiveTraversal(actNode.children[j], word);
            }
          }

          var allWords = "";

          for (var i = 0; i < words.length; i++) {
            if (i != 0) allWords += ", ";
            allWords += words[i];
          }

          alert("The following words share the prefix \"" + prefix + "\":\n" + allWords);

          tree.draw();
          tree.running = false;
          tree.stopped = false;
        } else doEndLoop(actNode);
      } else {
        if (tree.stopped === true) doEndLoop(actNode);
        else {
          alert("The prefix \"" + prefix + "\" was found!");

          /* find all words with this prefix */
          var words = [];
          var word = prefix.slice(0, -1);

          if (actNode != undefined)
            recursiveTraversal(actNode, word);

          function recursiveTraversal(actNode, word) {
            if (actNode.value === "$") {

              words.push(word);
              return;
            }

            if (actNode.value != "0") word += actNode.value;
            var actChildren = actNode.children;

            for (var j = 0; j < actChildren.length; j++) {

              recursiveTraversal(actNode.children[j], word);
            }
          }

          var allWords = "";

          for (var i = 0; i < words.length; i++) {
            if (i != 0) allWords += ", ";
            allWords += words[i];
          }

          alert("The following words share the prefix \"" + prefix + "\":\n" + allWords);

          tree.draw();
          tree.running = false;
          tree.stopped = false;
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doStopLoop(level, end, actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop(actNode);
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          if (level < end) doSearchLoop(actNode);
          if (level === end) doEndLoop(actNode);
        }
      }

    }, 1000 / tree.speed * 5)
  }
};

Trie.prototype.remove = function(word) {

  tree.running = true;

  word += "$";

  var actNode = this.root;

  actNode.color = tree.color3;
  this.draw();
  actNode.color = tree.color2;

  var end = word.length;
  var level = 0;

  /* first, search for word */
  if (level < end) doSearchLoop(actNode);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~

  function doSearchLoop(actNode) {
    setTimeout(function() {

      /* if no letters exist at this level */
      if (actNode.children === undefined) {
        alert("The word \"" + word.slice(0, -1) + "\" could not be found!");
        tree.draw();
        tree.running = false;
        tree.stopped = false;
        return;
      } else {
        /* letters exist, search for current letter */
        var actChildren = actNode.children;
        var found = false;
        for (var j = 0; j < actChildren.length; j++) {
          var actChild = actChildren[j];
          if (actChild.value === word.charAt(level)) {
            /* letter found */
            actNode = actNode.children[j];
            found = true;
            break;
          }
        }

        /* if current letter doesnt exist */
        if (!found) {
          alert("The word \"" + word.slice(0, -1) + "\" could not be found!");
          tree.draw();
          tree.running = false;
          tree.stopped = false;
          return;
        }
      }

      actNode.color = tree.color3;

      level++;

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          /* continue search */
          if (level < end) doSearchLoop(actNode);
          /* if word found, start removing letters */
          if (level === end) doRemoveLoop(actNode);
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          /* continue search */
          if (level < end) doSearchLoop(actNode);
          /* if word found, start removing letters */
          if (level === end) doRemoveLoop(actNode);
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doRemoveLoop(actNode) {
    setTimeout(function() {

      if (actNode.value === "0") {
        doEndLoop();
      }

      var checkNode = actNode.parent;

      /* If more than one child (end of remove) */
      if (checkNode.children.length > 1) {

        var pos = checkNode.children.indexOf(actNode);
        checkNode.children.splice(pos, 1);

        actNode = checkNode;

        actNode.color = tree.color3;

        if (tree.speed === 0) {
          if (tree.continueAnimation === true) {
            tree.continueAnimation = false;
            tree.draw();
            actNode.color = tree.color2;
            doEndLoop();
          } else doStopLoop3(actNode);
        } else {
          if (tree.stopped === true) doStopLoop3(actNode);
          else {
            tree.draw();
            actNode.color = tree.color2;
            doEndLoop();
          }
        }

      } else {
        /* one child -> remove and continue */
        checkNode.children = undefined;
        actNode = checkNode;

        actNode.color = tree.color3;

        if (tree.speed === 0) {
          if (tree.continueAnimation === true) {
            tree.continueAnimation = false;
            tree.draw();
            actNode.color = tree.color2;
            doRemoveLoop(actNode);
          } else doStopLoop2(actNode);
        } else {
          if (tree.stopped === true) doStopLoop2(actNode);
          else {
            tree.draw();
            actNode.color = tree.color2;
            doRemoveLoop(actNode);
          }
        }
      }



    }, 1000 / tree.speed * 5)
  }

  function doEndLoop() {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.saveInDB();
          tree.draw();
          tree.running = false;
          tree.stopped = false;
        } else doEndLoop();
      } else {
        if (tree.stopped === true) doEndLoop();
        else {
          tree.saveInDB();
          tree.draw();
          tree.running = false;
          tree.stopped = false;
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doStopLoop(level, end, actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          tree.draw();
          actNode.color = tree.color2;
          /* continue search */
          if (level < end) doSearchLoop(actNode);
          /* if word found, start removing letters */
          if (level === end) doRemoveLoop(actNode);
        } else doStopLoop(level, end, actNode);
      } else {
        if (tree.stopped === true) doStopLoop(level, end, actNode);
        else {
          tree.draw();
          actNode.color = tree.color2;
          /* continue search */
          if (level < end) doSearchLoop(actNode);
          /* if word found, start removing letters */
          if (level === end) doRemoveLoop(actNode);
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doStopLoop2(actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          doRemoveLoop(actNode);
        } else doStopLoop2(actNode);
      } else {
        if (tree.stopped === true) doStopLoop2(actNode);
        else {
          doRemoveLoop(actNode);
        }
      }

    }, 1000 / tree.speed * 5)
  }

  function doStopLoop3(actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          doEndLoop();
        } else doStopLoop3(actNode);
      } else {
        if (tree.stopped === true) doStopLoop3(actNode);
        else {
          doEndLoop();
        }
      }

    }, 1000 / tree.speed * 5)
  }

};

Trie.prototype.draw = function() {
  this.view.draw();
};
