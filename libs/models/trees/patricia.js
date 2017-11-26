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

function PatriciaNode(value, parent, isWord, children) {

  this.value = value || '';
  this.parent = parent;
  this.children = children || [];
  this.isWord = isWord || false;
  this.color = undefined;
  this.xPosition = 0;
  this.yPosition = 0;
}

PatriciaNode.prototype.insert = function(word) {
  word = word.toLowerCase();

  //Check where the strings match (pos = maximum matching index)
  var pos = Patricia._checkMatchingPrefix(this, word);
  word = word.substring(pos);

  //Case 1 - Complete match: the word matches the currents nodes string completely and is yet not recognized as word
  //Example: "test" <- "test"
  if (pos == this.value.length && !word.length && !this.isWord) {
    this.isWord = true;
    return this;
  }

  //Case 2 - Prefix match: the word matches a prefix of the currents nodes string completely
  //Example: "testcase" <- "test"
  else if (this.value.length > pos && !word.length) {

    var node = new PatriciaNode(this.value.substring(0, pos), this.parent, true, [this]);

    for (var x = 0, len = this.parent.children.length; x < len; ++x) {
      if (this.parent.children[x] === this) {
        this.parent.children[x] = node;
        break;
      }
    }
    this.value = this.value.substring(pos);
    this.parent = node;
    return node;
  }

  //Case 3 - Full match: the word matches the currents nodes string completely but is longer
  //Example: "test" <- "testcase"
  else if (this.value.length == pos && word.length) {

    var childIndex = Patricia._getMatchingChildsWordIndex(this, word);
    if (childIndex !== undefined) {
      return this.children[childIndex].insert(word);
    } else {
      //No child match was found. Create, push and return new node
      return this.children[this.children.push(new PatriciaNode(word, this, true)) - 1];
    }
  }

  //Case 4 - Common Prefix: the words share a common prefix
  //Example: "testcase" <- "testing"
  else if (this.value.length > pos && word.length) {
    var node = new PatriciaNode(this.value.substring(0, pos), this.parent, false, [this]);

    var childIndex = Patricia._getChildInParentIndex(this);
    if (childIndex !== undefined) {
      this.parent.children[childIndex] = node;
    }

    this.value = this.value.substring(pos);
    this.parent = node;

    //Create, push and return node from remaining word
    return node.children[node.children.push(new PatriciaNode(word, node, true)) - 1];
  }

  //Case 5 - Word already exists
  return null;
};


PatriciaNode.prototype.removeWord = function(word) {

  var node = this.searchWord(word);
  if (node) {

    //Case 1 - Node to remove has no children
    if (!node.children.length) {
      var childIndex = Patricia._getChildInParentIndex(node);
      var parent = node.parent;
      //Remove node from parent
      parent.children.splice(childIndex, 1);
      //Parent is not word and has only one child left: Merge parent and child
      if (!parent.isWord && parent.children.length == 1) {
        Patricia._mergeNodes(parent, parent.children[0]);
      }
    }
    //Case 2 - Node to remove has only 1 child: Merge node and child
    else if (node.children.length == 1) {
      Patricia._mergeNodes(node, node.children[0]);
    }
    //Case 3 - Node to remove has more than 1 child: Delete by simply setting isWord flag to false
    else if (node.children.length > 1) {
      node.isWord = false;
    }
  } else {
    console.log(word, "not found.");
  }
};


PatriciaNode.prototype.searchWord = function(word) { /* word search */

  word = word.toLowerCase();

  var pos = Patricia._checkMatchingPrefix(this, word);
  word = word.substring(pos);

  //Case 1 - Word found
  if (pos == actNode.value.length && !word.length && actNode.isWord) {
    return this;
  }

  //Case 2 - Full match: the word matches the currents nodes string completely but is longer
  //Example: "test" <- "testcase"
  else {
    var childIndex = Patricia._getMatchingChildsWordIndex(this, word);
    if (childIndex !== undefined) {
      return this.children[childIndex].searchWord(word);
    }
  }

  //Case 3 - No word found
  return null;
};

PatriciaNode.prototype.searchPrefix = function(word) { /* prefix search */

  word = word.toLowerCase();
  var pos = Patricia._checkMatchingPrefix(this, word);
  word = word.substring(pos);

  //Case 1 - Prefix found
  if (!word.length) {
    return this;
  }

  //Case 2 - Full match: the word matches the currents nodes string completely but is longer
  //Example: "test" <- "testcase"
  else {
    var childIndex = Patricia._getMatchingChildsWordIndex(this, word);
    if (childIndex !== undefined) {
      return this.children[childIndex].searchPrefix(word);
    }
  }

  //Case 3 - No prefix found
  return null;
};

PatriciaNode.prototype.findWords = function() {

  var words = [];

  //Get full prefix
  var actParent = this.parent;
  var fullPrefix = '';
  while (actParent) {
    fullPrefix = actParent.value + fullPrefix;
    actParent = actParent.parent;
  }

  function recursiveTraversal(node, word) {

    word += node.value;

    if (node.isWord) {
      words.push(word);
    }

    for (var j = 0, len = node.children.length; j < len; j++) {
      recursiveTraversal(node.children[j], word);
    }
  }

  recursiveTraversal(this, fullPrefix);

  return words;
};

function Patricia() {
  this.view = new PatriciaView(this);
  this.db = [];
  this.actStateID = -1;

  this.root = new PatriciaNode();

  this.speed = 5;
  this.color1 = "#B0D6DD";
  this.color2 = "#75ADCC";
  this.color3 = "#FF7F50";
  this.running = false;
  this.stopped = false;
  this.continueAnimation = false;
}

//Check if any children's first character matches with the remaining word's first character, if yes, this is the way to go down the trie
Patricia._getMatchingChildsWordIndex = function(node, word) {

  var charToMatch = word.charAt(0);

  for (var i = 0, len = node.children.length; i < len; ++i) {
    if (node.children[i].value.charAt(0) === charToMatch) {
      return i;
    }
  }
};

//Get index position of the child in parent.children array
Patricia._getChildInParentIndex = function(node) {
  for (var x = 0, len = node.parent.children.length; x < len; ++x) {
    if (node.parent.children[x] === node) {
      return x;
    }
  }
};

Patricia._mergeNodes = function(toNode, fromNode) {
  toNode.value += fromNode.value;
  toNode.isWord = fromNode.isWord;
  toNode.children = fromNode.children;
  return toNode;
};

//Check where the strings match (pos = maximum matching index)
Patricia._checkMatchingPrefix = function(node, word) {

  var pos = 0;
  for (var len = word.length; pos < len; ++pos) {
    if (word.charAt(pos) !== node.value.charAt(pos)) {
      break;
    }
  }

  return pos;
};

Patricia.prototype.init = function(id) {
  this.view.initStage($('#' + id)[0]);
  this.saveInDB();
};

Patricia.prototype.findWords = function(tree) {

  tree = tree || this;

  return tree.root.findWords();
  /*var words = [];

  function recursiveTraversal(node, word) {

    word += node.value;

    if (node.isWord) {
      words.push(word);
    }

    for (var j = 0, len = node.children.length; j < len; j++) {
      recursiveTraversal(node.children[j], word);
    }
  }

  if (tree.root.children.length)
    recursiveTraversal(tree.root, '');

  return words;*/
};

Patricia.prototype.copy = function() {
  var newTree = new Patricia();

  //var words = this.findWords();
  var words = this.root.findWords();
  for (var j = 0; j < words.length; j++) {
    newTree.addFixed(words[j]);
  }
  return newTree;
};

Patricia.prototype.saveInDB = function() {

  var count = this.db.length - 1;
  if (count != this.actStateID) {
    this.db.splice(this.actStateID + 1, count - this.actStateID);
  }

  var nextID = this.db.length;

  var new_state = this.copy();
  this.db.push(new_state);
  this.actStateID = nextID;
};

Patricia.prototype.replaceThis = function(toCopy) {

  var words = this.findWords(toCopy);

  this.root = new PatriciaNode();

  for (var j = 0, len = words.length; j < len; j++) {
    this.addFixed(words[j]);
  }
};

Patricia.prototype.prev = function() {
  if (this.actStateID > 0) {
    var prev_id = this.actStateID - 1;
    this.actStateID = prev_id;

    //make actual node to THIS:
    this.replaceThis(this.db[prev_id]);
    this.draw();
  }
};

Patricia.prototype.next = function() {
  if (this.actStateID < this.db.length - 1) {
    var next_id = this.actStateID + 1;
    this.actStateID = next_id;
    //make actual node to THIS:
    this.replaceThis(this.db[next_id]);
    this.draw();
  }
};

Patricia.prototype.firstState = function() {
  this.actStateID = 0;
  //make actual node to THIS:
  this.replaceThis(this.db[0]);
  this.draw();
};

Patricia.prototype.lastState = function() {
  var last_id = this.db.length - 1;
  this.actStateID = last_id;
  //make actual node to THIS:
  this.replaceThis(this.db[last_id]);
  this.draw();
};

Patricia.prototype.example = function() {

  var words = ["cat", "car", "cone", "core"];

  for (var i = 0; i < words.length; i++) {
    this.addFixed(words[i]);
  }
  this.saveInDB();
  this.draw();
};

Patricia.prototype.random = function() {

  var randomWords = [];

  // pick random number of words from 3 to 6
  do {
    var randomWordsToPick = Math.floor((Math.random() * 10)) % 7;
  } while (randomWordsToPick < 3)

  this.root = new PatriciaNode();

  var wordList = ["add", "age", "and", "ant", "any", "are", "art", "at", "axe",
    "bag", "back", "bat", "bare", "bee", "bell", "bear", "bird", "bit", "blur", "bold", "bone", "boy", "bowl", "box", "byte",
    "cake", "car", "card", "care", "carp", "cat", "cone", "cop", "core", "cozy", "cube",
    "dig", "dim", "dip", "dirt", "do", "dock", "doll", "done", "door", "dove", "dry", "dull",
    "ever", "egg", "envy", "end", "else",
    "fast", "find", "fire", "fish", "fit", "flip", "fly", "fond", "four", "five",
    "gift", "god", "gold", "gone", "good", "grid",
    "hair", "hand", "hang", "hat", "have", "hear", "heat", "horn", "hot", "hold",
    "life", "lit", "log", "long", "loop", "lost", "lot", "love", "low", "luck",
    "nine", "net", "near", "neat", "new", "no", "node", "nope",
    "off", "old", "on", "or", "over",
    "pad", "pair", "pan", "park", "paw", "pile", "pink", "pot",
    "roar", "rose", "rant", "red", "risk", "root", "rob",
    "sail", "shop", "ship", "silk", "sin", "sick", "sled", "slow", "snow", "sock", "soap", "song",
    "tail", "tale", "tall", "tell", "tea", "ten", "tent", "thin", "toy", "tone", "tree", "tuna", "two",
    "warm", "wear", "weed", "wild", "win", "wing", "wind", "wise", "wig", "worn",

    "angry", "bored", "cargo", "light", "thing", "three"
  ];

  var wordListsize = wordList.length;
  //alert("wordListsize: "+wordListsize);

  for (var i = 0; i < randomWordsToPick; i++) {
    // generate number from 0 to 999
    var randomNumber = Math.floor((Math.random() * 1000));
    // get word at randomNumber not bigger than wordListSize
    var word = wordList[randomNumber % wordListsize];
    // add word if not already in array
    if (randomWords.indexOf(word) === -1)
      randomWords.push(word);
    else
      i--; //choose another word
  }

  for (var i = 0; i < randomWordsToPick; i++) {
    this.addFixed(randomWords[i]);
  }

  this.saveInDB();
  this.draw();
};

Patricia.prototype.addFixed = function(word) {
  return this.root.insert(word);
};

Patricia.prototype.searchWord = function(word) {
  return this.root.searchWord(word);
};

Patricia.prototype.searchPrefix = function(word) {
  return this.root.searchPrefix(word);
};

Patricia.prototype.removeWord = function(word) {
  return this.root.removeWord(word);
};


Patricia.prototype.newTree = function() {
  this.root = new PatriciaNode();
  this.saveInDB();
  this.draw();
};

Patricia.prototype.create = function(words) {

  this.root = new PatriciaNode();

  for (var i = 0; i < words.length; i++) {
    this.addFixed(words[i]);
  }
  this.saveInDB();
  this.draw();
};

Patricia._finishAnimation = function(actNode, saveInDB){
  actNode.color = tree.color2;

  tree.continueAnimation = false;
  tree.running = false;
  tree.stopped = false;

  if(saveInDB){
    tree.saveInDB();
  }
  tree.draw();

  return actNode;
};

Patricia.prototype.add = function(word) {

  tree.running = true;

  doAddLoop(this.root);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
  function doAddLoop(actNode) {

    tree.continueAnimation = false;
    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {

      //Check where the strings match (pos = maximum matching index)
      var pos = Patricia._checkMatchingPrefix(actNode, word);
      word = word.substring(pos);

      //Case 1 - Complete match: the word matches the currents nodes string completely and is yet not recognized as word
      //Example: "test" <- "test"
      if (pos == actNode.value.length && !word.length && !actNode.isWord) {
        actNode.isWord = true;
        return doEndLoop(actNode);
      }

      //Case 2 - Prefix match: the word matches a prefix of the currents nodes string completely
      //Example: "testcase" <- "test"
      else if (actNode.value.length > pos && !word.length) {
        var node = new PatriciaNode(actNode.value.substring(0, pos), actNode.parent, true, [actNode]);

        for (var x = 0, len = actNode.parent.children.length; x < len; ++x) {
          if (actNode.parent.children[x] === actNode) {
            actNode.parent.children[x] = node;
            break;
          }
        }
        actNode.value = actNode.value.substring(pos);
        actNode.parent = node;
        actNode.color = tree.color2;
        return doEndLoop(actNode);
      }

      //Case 3 - Full match: the word matches the currents nodes string completely but is longer
      //Example: "test" <- "testcase"
      else if (actNode.value.length == pos && word.length) {
        var childIndex = Patricia._getMatchingChildsWordIndex(actNode, word);
        actNode.color = tree.color2;

        if (childIndex !== undefined) {

          var nextChild = actNode.children[childIndex];

          if (tree.speed === 0) {
            return (tree.continueAnimation === true) ? doAddLoop(nextChild) : doStopLoop(nextChild);
          } else {
            return (tree.stopped === true) ? doStopLoop(nextChild) : doAddLoop(nextChild);
          }

        } else {
          //No child match was found. Create, push and return new node
          actNode = actNode.children[actNode.children.push(new PatriciaNode(word, actNode, true)) - 1];
          return (tree.speed === 0) ? doStopLoop(actNode) : doEndLoop(actNode);
        }
      }

      //Case 4 - Common Prefix: the words share a common prefix
      //Example: "testcase" <- "testing"
      else if (actNode.value.length > pos && word.length) {
        var node = new PatriciaNode(actNode.value.substring(0, pos), actNode.parent, false, [actNode]);

        var childIndex = Patricia._getChildInParentIndex(actNode);
        if (childIndex !== undefined) {
          actNode.parent.children[childIndex] = node;
        }

        actNode.value = actNode.value.substring(pos);
        actNode.parent = node;

        //Create, push and end loop node from remaining word
        actNode.color = tree.color2;
        actNode = node.children[node.children.push(new PatriciaNode(word, node, true)) - 1];
        return doEndLoop(actNode);
      }

      //Case 5 - Word already exists
      return doEndLoop(actNode);

    }, 1000 / tree.speed * 5);
  }

  function doEndLoop(actNode) {

    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {
      if (tree.speed === 0) {
        return (tree.continueAnimation === true) ? Patricia._finishAnimation(actNode, true) : doEndLoop(actNode);
      } else {
        return (tree.stopped === true) ? doEndLoop(actNode) : Patricia._finishAnimation(actNode, true);
      }
    }, 1000 / tree.speed * 5);
  }

  function doStopLoop(actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        //tree.continueAnimation = false;
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          return doAddLoop(actNode);
        } else {
          return doStopLoop(actNode);
        }
      } else {
        return (tree.stopped === true) ? doStopLoop(actNode) : doAddLoop(actNode);
      }

    }, 1000 / tree.speed * 5);
  }
};

Patricia.prototype.search = function(word, callback) { /* word search */

  tree.running = true;
  //Make a final copy of word
  const finalWord = word;

  return doSearchLoop(this.root);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
  function doSearchLoop(actNode) {

    tree.continueAnimation = false;
    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {

      var pos = Patricia._checkMatchingPrefix(actNode, word);
      word = word.substring(pos);

      //Case 1 - Word found
      if (!word.length && pos == actNode.value.length && actNode.isWord) {
        if (!callback) {
          alert("The word \"" + finalWord + "\" was found!");
          return doEndLoop(actNode);
        }
        //Callback necessary for reuse of "search()" in "remove()"
        else {
          Patricia._finishAnimation(actNode);
          callback(actNode);
          return;
        }
      }

      //Case 2 - Full match: the word matches the currents nodes string completely but is longer
      //Example: "test" <- "testcase"
      else {
        var childIndex = Patricia._getMatchingChildsWordIndex(actNode, word);
        if (childIndex !== undefined) {

          var nextChild = actNode.children[childIndex];
          actNode.color = tree.color2;

          if (tree.speed === 0) {
            return (tree.continueAnimation === true) ? doSearchLoop(nextChild) : doStopLoop(nextChild);
          } else {
            return (tree.stopped === true) ? doStopLoop(nextChild) : doSearchLoop(nextChild);
          }
        }
      }

      //Case 3 - No word found
      alert("The word \"" + finalWord + "\" could not be found!");
      return doEndLoop(actNode);
    }, 1000 / tree.speed * 5);
  }

  function doEndLoop(actNode) {

    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {
      if (tree.speed === 0) {
        return Patricia._finishAnimation(actNode);
      } else {
        return (tree.stopped === true) ? doEndLoop(actNode) : Patricia._finishAnimation(actNode);
      }
    }, 1000 / tree.speed * 5);
  }

  function doStopLoop(actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        //tree.continueAnimation = false;
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          return doSearchLoop(actNode);
        } else {
          return doStopLoop(actNode);
        }
      } else {
        return (tree.stopped === true) ? doStopLoop(actNode) : doSearchLoop(actNode);
      }

    }, 1000 / tree.speed * 5);
  }
};

Patricia.prototype.search2 = function(word) { /* prefix search */

  tree.running = true;
  //Make a final copy of word
  const finalWord = word;

  return doSearchLoop(this.root);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
  function doSearchLoop(actNode) {

    tree.continueAnimation = false;
    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {

      var pos = Patricia._checkMatchingPrefix(actNode, word);
      word = word.substring(pos);

      //Case 1 - Word found
      if (!word.length) {
        alert("The prefix \"" + finalWord + "\" was found!");
        alert("The following words share the prefix \"" + finalWord + "\":\n" + actNode.findWords());
        return doEndLoop(actNode);
      }

      //Case 2 - Full match: the word matches the currents nodes string completely but is longer
      //Example: "test" <- "testcase"
      else {
        var childIndex = Patricia._getMatchingChildsWordIndex(actNode, word);
        if (childIndex !== undefined) {

          var nextChild = actNode.children[childIndex];
          actNode.color = tree.color2;

          if (tree.speed === 0) {
            return (tree.continueAnimation === true) ? doSearchLoop(nextChild) : doStopLoop(nextChild);
          } else {
            return (tree.stopped === true) ? doStopLoop(nextChild) : doSearchLoop(nextChild);
          }
        }
      }

      //Case 3 - No word found
      alert("The prefix \"" + finalWord + "\" could not be found!");
      return doEndLoop(actNode);
    }, 1000 / tree.speed * 5);
  }

  function doEndLoop(actNode) {

    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {
      if (tree.speed === 0) {
        return Patricia._finishAnimation(actNode);
      } else {
        return (tree.stopped === true) ? doEndLoop(actNode) : Patricia._finishAnimation(actNode);
      }
    }, 1000 / tree.speed * 5);
  }

  function doStopLoop(actNode) {
    setTimeout(function() {

      if (tree.speed === 0) {
        //tree.continueAnimation = false;
        if (tree.continueAnimation === true) {
          tree.continueAnimation = false;
          return doSearchLoop(actNode);
        } else {
          return doStopLoop(actNode);
        }
      } else {
        return (tree.stopped === true) ? doStopLoop(actNode) : doSearchLoop(actNode);
      }

    }, 1000 / tree.speed * 5);
  }
};

Patricia.prototype.remove = function(word) {

  //Need Callback to reuse search function
  this.search(word, function(actNode) {

    if (actNode) {

        //Case 1 - Node to remove has no children
        if (!actNode.children.length) {
          var childIndex = Patricia._getChildInParentIndex(actNode);
          var parent = actNode.parent;
          //Remove node from parent
          parent.children.splice(childIndex, 1);
          //Parent is not word and has only one child left: Merge parent and child
          if (!parent.isWord && parent.children.length == 1) {
            Patricia._mergeNodes(parent, parent.children[0]);
          }
        }
        //Case 2 - Node to remove has only 1 child: Merge node and child
        else if (actNode.children.length == 1) {
          Patricia._mergeNodes(actNode, actNode.children[0]);
        }
        //Case 3 - Node to remove has more than 1 child: Delete by simply setting isWord flag to false
        else if (actNode.children.length > 1) {
          actNode.isWord = false;
        }

      Patricia._finishAnimation(actNode, true);
    }
  });
};

Patricia.prototype.draw = function() {
  this.view.draw();
};
