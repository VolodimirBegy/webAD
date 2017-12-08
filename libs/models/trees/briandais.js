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


function BriandaisNode(parent, isWord) {
  this.chars = {};
  this.parent = parent;
  this.isWord = isWord || false;
  this.color = undefined;
  this.xPosition = 0;
  this.yPosition = 0;
}

Briandais._getMatchingValue = function(node, word) {

  //this way this function can be used for strings and chars
  var char = (word.length == 1) ? word : word.charAt(0);
  return node.chars[char];
};

BriandaisNode.prototype.insert = function(word) {

  word = word.toLowerCase();
  var char = word.charAt(0);

  var nextNode = Briandais._getMatchingValue(this, char);

  //Case 1 - We checked the last letter of "word" and the next node is NOT a word yet
  if (word.length == 1 && nextNode && !nextNode.isWord) {
    nextNode.isWord = true;
    return nextNode;
  }
  //Case 2 - There is a node with that char so we go that way
  else if (nextNode) {
    return nextNode.insert(word.substring(1));
  }
  //Case 3 - here is NO node with that char so we insert char as node and repeat
  else if (word.length > 0) {
    this.chars[char] = new BriandaisNode(this, (word.length == 1));
    return this.chars[char].insert(word.substring(1));
  }
  //Case 4 - We reached the end of "word"
  return this;
};

BriandaisNode.prototype.removeWord = function(word) {

  var node = this.searchWord(word);
  if (node) {

    node.isWord = false;
    var parent;

    for (var x = word.length - 1; x > -1; --x) {

      parent = node.parent;

      //Delete this node from parent if it has no chars
      if (!Object.keys(node.chars).length) {
        delete parent.chars[word.charAt(x)];
      }

      //If parents has more chars or is a word stop here
      if (Object.keys(parent.chars).length || parent.isWord) {
        break;
      }

      node = parent;
    }
    return node;
  } else {
    console.log(word, "not found.");
  }
};


BriandaisNode.prototype.searchWord = function(word) { /* word search */

  word = word.toLowerCase();

  var nextNode = Briandais._getMatchingValue(this, word);

  //Case 1 - We checked the last letter and the next node is a word
  if (word.length == 1 && nextNode && nextNode.isWord) {
    return nextNode;
  }
  //Case 2 - There is a node with that char so we go that way
  else if (nextNode) {
    return nextNode.searchWord(word.substring(1));
  }

  //Case 3 - No word found
  return null;
};

BriandaisNode.prototype.searchPrefix = function(word) { /* prefix search */

  word = word.toLowerCase();

  var nextNode = Briandais._getMatchingValue(this, word);

  //Case 1 - We checked the last letter and there is a next node
  if (word.length == 1 && nextNode) {
    return nextNode;
  }
  //Case 2 - There is a node with that char so we go that way
  else if (nextNode) {
    return nextNode.searchPrefix(word.substring(1));
  }

  //Case 3 - No word found
  return null;
};

BriandaisNode.prototype.findWords = function() {

  var words = [];

  //Get full prefix
  var actNode = this,
    actParent = actNode.parent;
  var fullPrefix = '';
  while (actParent) {

    for (var key in actParent.chars) {
      if (actParent.chars[key] === actNode) {
        fullPrefix = key + fullPrefix;
        break;
      }
    }
    actNode = actParent;
    actParent = actNode.parent;
  }

  function recursiveTraversal(node, word) {

    if (node.isWord) {
      words.push(word);
    }

    for (var key in node.chars) {
      recursiveTraversal(node.chars[key], word + key);
    }
  }

  recursiveTraversal(this, fullPrefix);

  return words;
};

function Briandais() {

  this.view = new BriandaisView(this);
  this.db = [];
  this.actStateID = -1;
  this.root = new BriandaisNode();

  this.speed = 5;
  this.color1 = "#B0D6DD";
  this.color2 = "#75ADCC";
  this.color3 = "#FF7F50";
  this.running = false;
  this.stopped = false;
  this.continueAnimation = false;
}

Briandais.prototype.init = function(id) {
  this.view.initStage($('#' + id)[0]);
  this.saveInDB();
};

Briandais.prototype.findWords = function(tree) {

  tree = tree || this;

  return tree.root.findWords();
};

Briandais.prototype.copy = function() {
  var newTree = new Briandais();

  var words = this.root.findWords();
  for (var j = 0; j < words.length; j++) {
    newTree.addFixed(words[j]);
  }
  return newTree;
};

Briandais.prototype.saveInDB = function() {

  var count = this.db.length - 1;
  if (count != this.actStateID) {
    this.db.splice(this.actStateID + 1, count - this.actStateID);
  }

  var nextID = this.db.length;

  var new_state = this.copy();
  this.db.push(new_state);
  this.actStateID = nextID;
};

Briandais.prototype.replaceThis = function(toCopy) {

  var words = this.findWords(toCopy);

  this.root = new BriandaisNode();

  for (var j = 0, len = words.length; j < len; j++) {
    this.addFixed(words[j]);
  }
};

Briandais.prototype.prev = function() {
  if (this.actStateID > 0) {
    var prev_id = this.actStateID - 1;
    this.actStateID = prev_id;

    //make actual node to THIS:
    this.replaceThis(this.db[prev_id]);
    this.draw();
  }
};

Briandais.prototype.next = function() {
  if (this.actStateID < this.db.length - 1) {
    var next_id = this.actStateID + 1;
    this.actStateID = next_id;
    //make actual node to THIS:
    this.replaceThis(this.db[next_id]);
    this.draw();
  }
};

Briandais.prototype.firstState = function() {
  this.actStateID = 0;
  //make actual node to THIS:
  this.replaceThis(this.db[0]);
  this.draw();
};

Briandais.prototype.lastState = function() {
  var last_id = this.db.length - 1;
  this.actStateID = last_id;
  //make actual node to THIS:
  this.replaceThis(this.db[last_id]);
  this.draw();
};

Briandais.prototype.example = function() {

  var words = ["cat", "car", "cone", "core"];

  for (var i = 0; i < words.length; i++) {
    this.addFixed(words[i]);
  }
  this.saveInDB();
  this.draw();
};

Briandais.prototype.random = function() {

  var randomWords = [];

  // pick random number of words from 3 to 6
  do {
    var randomWordsToPick = Math.floor((Math.random() * 10)) % 7;
  } while (randomWordsToPick < 3)

  this.root = new BriandaisNode();

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

Briandais.prototype.addFixed = function(word) {
  return this.root.insert(word);
};

Briandais.prototype.searchWord = function(word) {
  return this.root.searchWord(word);
};

Briandais.prototype.searchPrefix = function(word) {
  return this.root.searchPrefix(word);
};

Briandais.prototype.removeWord = function(word) {
  return this.root.removeWord(word);
};


Briandais.prototype.newTree = function() {
  this.root = new BriandaisNode();
  this.saveInDB();
  this.draw();
};

Briandais.prototype.create = function(words) {

  this.root = new BriandaisNode();

  for (var i = 0; i < words.length; i++) {
    this.addFixed(words[i]);
  }
  this.saveInDB();
  this.draw();
};

Briandais._finishAnimation = function(actNode, saveInDB) {
  actNode.color = tree.color2;

  tree.continueAnimation = false;
  tree.running = false;
  tree.stopped = false;

  if (saveInDB) {
    tree.saveInDB();
  }
  tree.draw();

  return actNode;
};

Briandais.prototype.add = function(word) {

  tree.running = true;

  doAddLoop(this.root);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
  function doAddLoop(actNode) {

    var char = word.charAt(0);
    var nextNode = Briandais._getMatchingValue(actNode, char);

    actNode.color = tree.color3;
    tree.continueAnimation = false;
    tree.draw();

    setTimeout(function() {

      //Case 1 - We checked the last letter of "word" and the next node is NOT a word yet
      if (word.length == 1 && nextNode && !nextNode.isWord) {

        nextNode.isWord = true;
        actNode.color = tree.color2;

        return doEndLoop(nextNode);
      }

      //Case 2 - There is a node with that char so we go that way
      else if (nextNode) {

        word = word.substring(1);
        actNode.color = tree.color2;

        if (tree.speed === 0) {
          return (tree.continueAnimation === true) ? doAddLoop(nextNode) : doStopLoop(nextNode);
        } else {
          return (tree.stopped === true) ? doStopLoop(nextNode) : doAddLoop(nextNode);
        }
      }

      //Case 3 - here is NO node with that char so we insert char as node and repeat
      else if (word.length > 0) {

        var newNode = new BriandaisNode(actNode, (word.length == 1));
        actNode.chars[char] = newNode;

        word = word.substring(1);
        actNode.color = tree.color2;

        if (tree.speed === 0) {
          return (tree.continueAnimation === true) ? doAddLoop(newNode) : doStopLoop(newNode);
        } else {
          return (tree.stopped === true) ? doStopLoop(newNode) : doAddLoop(newNode);
        }
      }

      return doEndLoop(actNode);

    }, 1000 / tree.speed * 5);
  }

  function doEndLoop(actNode) {

    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {
      if (tree.speed === 0) {
        return (tree.continueAnimation === true) ? Briandais._finishAnimation(actNode, true) : doEndLoop(actNode);
      } else {
        return (tree.stopped === true) ? doEndLoop(actNode) : Briandais._finishAnimation(actNode, true);
      }
    }, 1000 / tree.speed * 5);
  }

  function doStopLoop(actNode) {

    actNode.color = tree.color3;
    tree.draw();

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

Briandais.prototype.search = function(word, callback) { /* word search */

  tree.running = true;
  //Make a final copy of word
  const finalWord = word;

  return doSearchLoop(this.root);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
  function doSearchLoop(actNode) {

    var char = word.charAt(0);
    var nextNode = Briandais._getMatchingValue(actNode, char);

    actNode.color = tree.color3;
    tree.continueAnimation = false;
    tree.draw();

    setTimeout(function() {

      //Case 1 - We checked the last letter and the next node is a word
      if (!word.length && actNode.isWord) {

        actNode.color = tree.color2;

        if (!callback) {
          doEndLoop(actNode);
          alert("The word \"" + finalWord + "\" was found!");
          return;
        }
        //Callback necessary for reuse of "search()" in "remove()"
        else {
          Briandais._finishAnimation(actNode);
          callback(actNode);
          return;
        }
      }

      //Case 2 - There is a node with that char so we go that way
      else if (nextNode) {

        word = word.substring(1);
        actNode.color = tree.color2;

        if (tree.speed === 0) {
          return (tree.continueAnimation === true) ? doSearchLoop(nextNode) : doStopLoop(nextNode);
        } else {
          return (tree.stopped === true) ? doStopLoop(nextNode) : doSearchLoop(nextNode);
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
        return (tree.continueAnimation === true) ? Briandais._finishAnimation(actNode, true) : doEndLoop(actNode);
      } else {
        return (tree.stopped === true) ? doEndLoop(actNode) : Briandais._finishAnimation(actNode, true);
      }
    }, 1000 / tree.speed * 5);
  }

  function doStopLoop(actNode) {

    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {

      if (tree.speed === 0) {
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

Briandais.prototype.search2 = function(word) { /* prefix search */
  tree.running = true;
  //Make a final copy of word
  const finalWord = word;

  return doSearchLoop(this.root);

  // ~~~~~~~~~~~~~~~ Loops ~~~~~~~~~~~~~~~~~~
  function doSearchLoop(actNode) {

    var char = word.charAt(0);
    var nextNode = Briandais._getMatchingValue(actNode, char);

    actNode.color = tree.color3;
    tree.continueAnimation = false;
    tree.draw();

    setTimeout(function() {

      //Case 1 - We checked the last letter and the next node is a word
      //if (word.length == 1 && nextNode) {
      if (!word.length) {
        actNode.color = tree.color2;

        doEndLoop(actNode);
        alert("The prefix \"" + finalWord + "\" was found!");
        alert("The following words share the prefix \"" + finalWord + "\":\n" + actNode.findWords());
        return;
      }

      //Case 2 - There is a node with that char so we go that way
      else if (nextNode) {

        word = word.substring(1);
        actNode.color = tree.color2;

        if (tree.speed === 0) {
          return (tree.continueAnimation === true) ? doSearchLoop(nextNode) : doStopLoop(nextNode);
        } else {
          return (tree.stopped === true) ? doStopLoop(nextNode) : doSearchLoop(nextNode);
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
        return (tree.continueAnimation === true) ? Briandais._finishAnimation(actNode, true) : doEndLoop(actNode);
      } else {
        return (tree.stopped === true) ? doEndLoop(actNode) : Briandais._finishAnimation(actNode, true);
      }
    }, 1000 / tree.speed * 5);
  }

  function doStopLoop(actNode) {

    actNode.color = tree.color3;
    tree.draw();

    setTimeout(function() {

      if (tree.speed === 0) {
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

Briandais.prototype.remove = function(word) {

  //Need Callback to reuse search function
  this.search(word, function(actNode) {
    if (actNode) {

      actNode.isWord = false;
      tree.running = true;

      doRemoveLoop(actNode);

      function doRemoveLoop(actNode) {

        var char = word.charAt(word.length - 1);
        actNode.color = tree.color3;
        tree.continueAnimation = false;
        tree.draw();

        setTimeout(function() {
          var parent = actNode.parent;
          if (parent) {

            //Delete this node from parent if it has no chars
            if (!Object.keys(actNode.chars).length) {
              delete parent.chars[char];
            }

            //If parents has more chars or is a word stop here
            if (Object.keys(parent.chars).length || parent.isWord) {
              actNode.color = tree.color2;
              return doEndLoop(parent);
            }

            word = word.slice(0, -1);

            if (tree.speed === 0) {
              return (tree.continueAnimation === true) ? doRemoveLoop(parent) : doStopLoop(parent);
            } else {
              return (tree.stopped === true) ? doStopLoop(parent) : doRemoveLoop(parent);
            }
          } else {
            return doEndLoop(actNode);
          }
        }, 1000 / tree.speed * 5);
      }

      function doEndLoop(actNode) {

        actNode.color = tree.color3;
        tree.draw();

        setTimeout(function() {
          if (tree.speed === 0) {
            return (tree.continueAnimation === true) ? Briandais._finishAnimation(actNode, true) : doEndLoop(actNode);
          } else {
            return (tree.stopped === true) ? doEndLoop(actNode) : Briandais._finishAnimation(actNode, true);
          }
        }, 1000 / tree.speed * 5);
      }

      function doStopLoop(actNode) {
        actNode.color = tree.color3;
        tree.draw();

        setTimeout(function() {

          if (tree.speed === 0) {
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
    } else {
      alert("The word \"" + word + "\" could not be found!");
    }
  });
};

Briandais.prototype.draw = function() {
  this.view.draw();
};
