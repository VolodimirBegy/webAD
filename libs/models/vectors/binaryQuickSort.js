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
function Vector() {
    this.view = new VectorView(this);
    this.db = [];
    this.actStateID = -1;
    this.elements = [];
    this.coloredElement = [];
    this.column = 4;
    this.actualColumn = 0;
    this.rows = 10;
    this.colors = ["#ffffff", "#000000", "#228b22", "#32CD32", "#e60000"]; //0=white, 1=Black, 2=Darkgreen, 3=Green,4= Red, 

}
Vector.prototype.getMatrix = function (columns) {
    var array = [];
    for (var i = 0; i < columns; ++i) {
        array[i] = [];
    }
    return array;
};
Vector.prototype.init = function () {

    this.allElementsPerColumn = [];
    this.allColoredElementsPerColumn = [];
    this.elements = this.getMatrix(this.column);
    this.coloredElement = this.getMatrix(this.column);
    this.speed = 10;
    this.paused = true;
    this.finished = false;
    this.finishCounter = 0;


};
Vector.prototype.saveInDB = function (w) {

    var count = this.db.length - 1;
    var nextID = this.db.length;
    var new_state = this.copy(w);
    var last_state = this.db[this.db.length - 1];
    this.db.push(new_state);
    this.actStateID = nextID;
};
//##########################copy-methods########################################
Vector.prototype.copy = function (w) {
    var newVector = new Vector();

    newVector.copyAllElementsPerColumn = [];
    newVector.copyAllColoredElementsPerColumn = [];

    for (var columns = 0; columns < this.allElementsPerColumn.length; columns++) {
        newVector.copyAllElementsPerColumn[columns] = [];
        newVector.copyAllColoredElementsPerColumn[columns] = [];
        for (var block = 0; block < this.allElementsPerColumn[columns].length; block++) {
            var elements = this.allElementsPerColumn[columns][block];
            var copyElements = this.getMatrix(this.column);
            var color = this.allColoredElementsPerColumn[columns][block];
            var copyColor = this.getMatrix(this.column);

            if (elements != null) {
                for (var c = 0; c < elements.length; c++) {
                    for (var r = 0; r < elements[0].length; ++r) {
                        copyElements[c][r] = elements[c][r];
                        copyColor[c][r] = color[c][r];
                    }
                }
            }
            newVector.copyAllElementsPerColumn[columns][block] = copyElements;
            newVector.copyAllColoredElementsPerColumn[columns][block] = copyColor;

        }
    }
    newVector.column = this.column;
    newVector.rows = this.rows;
    newVector.actualColumn = w;
    newVector.paused = true;
    newVector.finished = this.finished;
    newVector.finishCounter = this.finishCounter;
    newVector.speed = this.speed;
    return newVector;
};
Vector.prototype.replaceThis = function (toCopy) {

    this.allElementsPerColumn = [];
    this.allColoredElementsPerColumn = [];

    for (var columns = 0; columns < toCopy.copyAllElementsPerColumn.length; columns++) {
        this.allElementsPerColumn[columns] = [];
        this.allColoredElementsPerColumn[columns] = [];
        for (var block = 0; block < toCopy.copyAllElementsPerColumn[columns].length; block++) {
            var elements = toCopy.copyAllElementsPerColumn[columns][block];
            var copyElements = this.getMatrix(this.column);

            var color = toCopy.copyAllColoredElementsPerColumn[columns][block];
            var copyColor = this.getMatrix(this.column);

            if (elements != null) {
                for (var c = 0; c < elements.length; c++) {
                    for (var r = 0; r < elements[0].length; ++r) {
                        copyElements[c][r] = elements[c][r];
                        copyColor[c][r] = color[c][r];
                    }
                }
            }
            this.allElementsPerColumn[columns][block] = copyElements;
            this.allColoredElementsPerColumn[columns][block] = copyColor;
        }
    }


    this.paused = toCopy.paused;
    this.finished = toCopy.finished;
    this.speed = toCopy.speed;
    this.actualColumn = toCopy.actualColumn;
    this.finishCounter = toCopy.finishCounter;
    this.column = toCopy.column;
    this.rows = toCopy.rows;


};
Vector.prototype.draw = function () {
    this.view.draw();
};

//#######################Methods for tape recorder#####################################
Vector.prototype.prev = function () {
    if (this.paused) {
        if (this.actStateID > 0) {
            var prev_id = this.actStateID - 1;
            this.actStateID = prev_id;
            this.replaceThis(this.db[prev_id]);
            this.draw();
        }
    } else window.alert("Pause the sorting first!");
};
Vector.prototype.next = function () {
    if (this.paused) {
        if (this.actStateID < this.db.length - 1) {
            var next_id = this.actStateID + 1;
            this.actStateID = next_id;
            this.replaceThis(this.db[next_id]);
            this.draw();
        }
    } else window.alert("Pause the sorting first!");
};
Vector.prototype.firstState = function () {
    if (this.paused) {
        this.actStateID = 0;
        this.replaceThis(this.db[0]);
        this.draw();
    } else window.alert("Pause the sorting first!");
};
Vector.prototype.lastState = function () {
    if (this.paused) {
        var last_id = this.db.length - 1;
        this.actStateID = last_id;
        this.replaceThis(this.db[last_id]);
        this.draw();
    } else window.alert("Pause the sorting first!");
};
//########################Binary QuickSort Methods####################################################
Vector.prototype.setRandomElements = function () {
    this.init();
    var posElements = "01";
    for (var col = 0; col < this.column; ++col) {
        for (var row = 0; row < this.rows; ++row) {
            this.elements[col].push(posElements.charAt(Math.floor(Math.random() * posElements.length)));
        }
    }
    for (var col = 0; col < this.column; ++col) {
        for (var row = 0; row < this.rows; ++row) {
            this.coloredElement[col].push(0);
        }
    }

    var set = [];
    set.push(this.elements);
    var colorSet = [];
    colorSet.push(this.coloredElement);
    this.allElementsPerColumn[0] = set;
    this.allColoredElementsPerColumn[0] = colorSet;
    this.finishCounter = 0;
    this.finished = false;
    this.db = []; //clean db
    this.saveInDB(0);
    this.draw();
};
Vector.prototype.getElementsByPrompt = function () {

    var newValueInString = prompt("Add new values (separated by space).\nValues with more than " + this.column + " digits or values containing other numbers than 0/1 are ignored!");
    if ((/\S/.test(newValueInString)) && newValueInString) //testing if only blanks & canceled
    {
        this.init();
        var tempStrArr = newValueInString.split(" ");
        for (var i = 0; i < tempStrArr.length; ++i) {
            var allowed = true;
            if (!(isNaN(tempStrArr[i]))) {
                var valueLength = tempStrArr[i].length;
                var tempStrValue = tempStrArr[i];
                if (tempStrValue.length != 0) // for blanks
                {
                    for (var k = 0; k < tempStrArr[i].length; ++k) {
                        if (!(tempStrArr[i].charAt(k) < 2)) {
                            allowed = false;
                        }
                    }
                    if (allowed) {
                        if (!(valueLength > this.column)) {
                            for (var j = this.column - 1; j > -1; --j, --valueLength) {
                                if (valueLength > 0) {
                                    this.elements[j].push(parseInt(tempStrValue[valueLength - 1]));
                                } else {
                                    this.elements[j].push(0);
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        this.canceled = true;
    }

    if (this.elements[0][0] !== undefined) {
        this.rows = this.elements[0].length;
        this.actualRowBottom = this.rows - 1;
        var set = [];
        set.push(this.elements);
        this.allElementsPerColumn.push(set);
        var colorSet = [];
        colorSet.push(this.coloredElement);
        this.allColoredElementsPerColumn.push(colorSet);
        this.finishCounter = 0;
        this.finished = false;
        this.db = []; //clean db
        this.saveInDB(0);
        this.draw();
    }
};
Vector.prototype.editElements = function () {
    var valueInString = "";

    for (var j = 0; j < this.elements[0].length; ++j) {
        if (j != 0) valueInString += " ";
        for (var i = 0; i < this.elements.length; ++i) {
            valueInString += this.elements[i][j];
        }
    }
    var newValueInString = prompt("Add new values or delete/edit existing ones.\nValues with more than " + this.column + " digits or values containing other numbers than 0/1 are ignored!", valueInString);
    if (newValueInString && (/\S/.test(newValueInString)) && !(newValueInString == valueInString)) {
        this.init();
        var tempStrArr = newValueInString.split(" ");
        for (var i = 0; i < tempStrArr.length; ++i) {
            var valueLength = tempStrArr[i].length;
            var tempStrValue = tempStrArr[i];
            var allowed = true;
            if (!(isNaN(tempStrValue))) {
                for (var k = 0; k < valueLength; ++k) {
                    if (!(tempStrValue.charAt(k) < 2)) {
                        allowed = false;
                    }
                }
                if (allowed) {
                    if ((!(valueLength > this.column)) && valueLength != 0) {
                        for (var j = this.column - 1; j > -1; --j, --valueLength) {
                            if (valueLength > 0) {
                                this.elements[j].push(parseInt(tempStrValue[valueLength - 1]));
                            } else {
                                this.elements[j].push(0);
                            }
                        }
                    }
                }
            }
        }
    }
    if (this.elements[0][0] !== undefined) {
        this.rows = this.elements[0].length;
        this.actualRowBottom = this.rows - 1;
        var set = [];
        set.push(this.elements);
        this.allElementsPerColumn.push(set);
        var colorSet = [];
        colorSet.push(this.coloredElement);
        this.allColoredElementsPerColumn.push(colorSet);
        this.finishCounter = 0;
        this.finished = false;
        this.db = []; //clean db
        this.draw();
        this.saveInDB(0);
    }
};
//example after loading the page
Vector.prototype.example = function () {
    this.init();
    this.setRandomElements();

};

Vector.prototype.setKeylength = function () {
    var help;
    do {
        help = false;
        var newKeylength = prompt("Set the keylength between 1 and 5", this.column);
        if ((newKeylength < 1 || newKeylength > 5 || isNaN(newKeylength)) && newKeylength) //&& Keylength for cancel
        {
            alert("This is not between 1 and 5");
            help = true;
        } else if (newKeylength && !(newKeylength == this.column)) {
            this.column = parseInt(newKeylength);
            this.init();
            this.setRandomElements();
        }
    }
    while (help)
};

Vector.prototype.setRows = function () {
    var help;
    do {
        help = false;
        var newRows = prompt("Set the Rows between 1 and 10", this.rows);
        if ((newRows < 1 || newRows > 10 || isNaN(newRows)) && newRows) //&& Keylength for cancel
        {
            alert("This is not between 1 and 10");
            help = true;
        } else if (newRows && !(newRows == this.rows)) {
            this.rows = parseInt(newRows);
            this.init();
            this.setRandomElements();
        }
    }
    while (help)
};


Vector.prototype.binaryQuicksort = function (currentElements, coloredElements, l, r, w, pos) {
    var matrix = this;
    var i = l;
    var j = r;
    var poshelp = pos;

    if (matrix.allElementsPerColumn[w + 1] == null) {
        matrix.allElementsPerColumn[w + 1] = [];
        matrix.allColoredElementsPerColumn[w + 1] = [];
    }

    if (r <= l && w < matrix.column) {
        if (currentElements != null) {
            for (var column = 0; column < matrix.column; column++) {
                coloredElements[column][0] = 2;
            }
        }


        for (var col = w; col < matrix.column - 1; col++) {
            poshelp = poshelp * 2;
            if (matrix.allElementsPerColumn[col + 1] == null) {
                matrix.allElementsPerColumn[col + 1] = [];
                matrix.allColoredElementsPerColumn[col + 1] = [];
            }

            matrix.allElementsPerColumn[col + 1][(poshelp)] = currentElements;
            matrix.allElementsPerColumn[col + 1][(poshelp + 1)] = null;
            matrix.allColoredElementsPerColumn[col + 1][(poshelp)] = coloredElements;
            matrix.allColoredElementsPerColumn[col + 1][(poshelp + 1)] = null;
            matrix.binaryQuicksort(null, null, 0, -1, col + 1, (poshelp + 1));
        }
        matrix.finishCounter++;
        matrix.draw();
    }

    if (r <= l || w > matrix.column) {


        if (matrix.finishCounter == Math.pow(2, (matrix.column - 1))) {
            clearTimes();
            matrix.finished = true;
            matrix.saveInDB(w);
            matrix.draw();
        }
        return;
    }

    function step() {

        while (currentElements[w][i] == 0 && (i < j)) {
            coloredElements[w][i] = 3;
            i++;
        }
        while (currentElements[w][j] == 1 && (j > i)) {
            coloredElements[w][j] = 3;
            j--;
        }

        for (var col = 0; col < matrix.column; col++) {
            coloredElements[col][i] = 4;
            coloredElements[col][j] = 4;
        }
        matrix.saveInDB(w);
        matrix.draw();


        setTimeout(function () {
            //        SWAP
            var copyarray = [];
            for (var col = 0; col < matrix.column; col++) {
                copyarray[col] = currentElements[col][i];
            }

            for (var col2 = 0; col2 < matrix.column; col2++) {

                currentElements[col2][i] = currentElements[col2][j];
                currentElements[col2][j] = copyarray[col2];

                if (col2 > w) {
                    coloredElements[col2][i] = 0;
                    coloredElements[col2][j] = 0;
                } else {
                    coloredElements[col2][i] = 2;
                    coloredElements[col2][j] = 2;
                }
            }

            matrix.draw();

            if (j != i) {
                step();

            } else {

                var nullArray = matrix.getMatrix(matrix.column);
                var oneArray = matrix.getMatrix(matrix.column);
                var colorNullArray = matrix.getMatrix(matrix.column);
                var colorOneArray = matrix.getMatrix(matrix.column);

                if (currentElements[w][j] == 0) {
                    j++;
                }

                for (var col = 0; col < matrix.column; col++) {
                    for (var row = 0; row < j; row++) {
                        nullArray[col][row] = currentElements[col][row];
                        colorNullArray[col][row] = 0;
                    }
                }

                for (var col = 0; col < matrix.column; col++) {
                    help = 0;
                    for (var row = j; row < currentElements[0].length; row++) {
                        oneArray[col][help] = currentElements[col][row];
                        colorOneArray[col][help] = 0;
                        help++;
                    }
                }

                for (var col = 0; col <= w; col++) {
                    for (var row = 0; row < matrix.rows; row++) {
                        coloredElements[col][row] = 2;
                        colorNullArray[col][row] = 2;
                        colorOneArray[col][row] = 2;
                    }

                }
                matrix.saveInDB(w);
                matrix.draw();


                if (w + 1 < matrix.column) {
                    matrix.allElementsPerColumn[w + 1][(pos * 2)] = nullArray;
                    matrix.allElementsPerColumn[w + 1][(pos * 2) + 1] = oneArray;
                    matrix.allColoredElementsPerColumn[w + 1][(pos * 2)] = colorNullArray;
                    matrix.allColoredElementsPerColumn[w + 1][(pos * 2) + 1] = colorOneArray;
                    matrix.binaryQuicksort(nullArray, colorNullArray, 0, nullArray[0].length - 1, w + 1, (pos * 2));
                    matrix.binaryQuicksort(oneArray, colorOneArray, 0, oneArray[0].length - 1, w + 1, ((pos * 2) + 1));
                } else {

                    matrix.finishCounter++;
                    if (matrix.finishCounter == Math.pow(2, (matrix.column - 1))) {
                        clearTimes();
                        matrix.finished = true;
                        matrix.saveInDB(w);
                        matrix.draw();
                    }

                }

            }
        }, 100 * matrix.speed);
    }

    step();


};

Vector.prototype.size = function () {
    return this.elements[0].length;
}