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

function trieUtils() {}

trieUtils.init = function(id, trie) {

  trie = trie || tree;

  trie.view.initStage($('#' + id)[0]);
  trie.saveInDB();
};

//Set default colors based on color inputs data-default attribute
trieUtils.setDefaultColors = function(trie) {

  trie = trie || tree;

  $('input.color[type=color]').each(function() {
    trie[$(this).attr('data-ref')] = $(this).attr('data-default');
  });
};

trieUtils.prev = function(trie) {

  trie = trie || tree;

  if (trie.actStateID > 0) {
    var prev_id = trie.actStateID - 1;
    trie.actStateID = prev_id;

    //make actual node to THIS:
    trie.replaceThis(trie.db[prev_id]);
    trie.draw();
  }
};

trieUtils.next = function(trie) {

  trie = trie || tree;


  if (trie.actStateID < trie.db.length - 1) {
    var next_id = trie.actStateID + 1;
    trie.actStateID = next_id;

    //make actual node to THIS:
    trie.replaceThis(trie.db[next_id]);
    trie.draw();
  }

};

trieUtils.firstState = function(trie) {

  trie = trie || tree;

  trie.actStateID = 0;

  //make actual node to THIS:
  trie.replaceThis(trie.db[0]);
  trie.draw();
};

trieUtils.lastState = function(trie) {

  trie = trie || tree;

  var last_id = trie.db.length - 1;
  trie.actStateID = last_id;

  //make actual node to THIS:
  trie.replaceThis(trie.db[last_id]);
  trie.draw();
}

trieUtils.example = function(trie) {

  trie = trie || tree;

  var words = ["cat", "car", "cone", "core"];

  for (var i = 0, len = words.length; i < len; i++) {
    trie.addFixed(words[i]);
  }

  trie.saveInDB();
  trie.draw();
}

trieUtils.random = function(rootNode, trie) {

  trie = trie || tree;

  var randomWords = [];

  // pick random number of words from 3 to 6
  do {
    var randomWordsToPick = Math.floor((Math.random() * 10)) % 7;
  } while (randomWordsToPick < 3)

  trie.root = rootNode;

  var wordList = ["add", "age", "and", "angry", "ant", "any", "are", "art", "at", "axe",
    "bag", "back", "bat", "bare", "bee", "bell", "bear", "bird", "bit", "blur", "bold", "bone", "bored", "boy", "bowl", "box", "byte",
    "cake", "car", "card", "care", "cargo", "carp", "cat", "cone", "cop", "core", "cozy", "cube",
    "dig", "dim", "dip", "dirt", "do", "dock", "doll", "done", "door", "dove", "dry", "dull",
    "ever", "egg", "envy", "end", "else",
    "fast", "find", "fire", "fish", "fit", "flip", "fly", "fond", "four", "five",
    "gift", "god", "gold", "gone", "good", "grid",
    "hair", "hand", "hang", "hat", "have", "hear", "heat", "horn", "hot", "hold",
    "life", "light", "lit", "log", "long", "loop", "lost", "lot", "love", "low", "luck",
    "nine", "net", "near", "neat", "new", "no", "node", "nope",
    "off", "old", "on", "or", "over",
    "pad", "pair", "pan", "park", "paw", "pile", "pink", "pot",
    "roar", "rose", "rant", "red", "risk", "root", "rob",
    "sail", "shop", "ship", "silk", "sin", "sick", "sled", "slow", "snow", "sock", "soap", "song",
    "tail", "tale", "tall", "tell", "tea", "ten", "tent", "thin", "thing", "three", "toy", "tone", "tree", "tuna", "two",
    "warm", "wear", "weed", "wild", "win", "wing", "wind", "wise", "wig", "worn"
  ];

  var wordListsize = wordList.length;

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

  //randomWords = ["off","bag","bat","cat"];

  for (var i = 0; i < randomWordsToPick;) {
    trie.addFixed(randomWords[i++]);
  }

  trie.saveInDB();
  trie.draw();
};

trieUtils.saveInDB = function(trie) {

  trie = trie || tree;

  var count = trie.db.length - 1;
  if (count != trie.actStateID) {
    trie.db.splice(trie.actStateID + 1, count - trie.actStateID);
  }

  var nextID = trie.db.length;
  trie.db.push(trie.copy());
  trie.actStateID = nextID;
};

trieUtils.copy = function(newTrie, trie) {

  trie = trie || tree;

  var words = trie.findWords(trie);

  for (var j = 0, len = words.length; j < len; j++) {
    newTrie.addFixed(words[j]);
  }

  return newTrie;
};


trieUtils.create = function(rootNode, words, trie) {

  trie = trie || tree;
  trie.root = rootNode;

  for (var i = 0, len = words.length; i < len; i++) {
    trie.addFixed(words[i]);
  }
  trie.saveInDB();
  trie.draw();
};

trieUtils.newTree = function(rootNode, trie) {

  trie = trie || tree;
  trie.root = rootNode;

	trie.saveInDB();
	trie.draw();
};
