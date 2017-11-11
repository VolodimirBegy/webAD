/**
 * Created by Habetinek Robert
 */

function Vector()
{
    this.view = new VectorView(this);
    this.db = [];
    this.actStateID = -1;
    this.elements = [];
    this.radix = 10;
    this.column = 3;
    this.colors = ["#000000", "#000000", "#9acd32","#228b22", "#32CD32"]; //Black, Black, Blue, Darkgreen, Green
    this.paused = true;
    this.speed = 7;
}
Vector.prototype.getMatrix = function(columns)
{
    var array = [];
    for (var i = 0; i < columns; ++i)
    {
        array[i] = [];
    }
    return array;
};

Vector.prototype.init = function()
{
    this.coloredElement = [];
    this.colorColumn = this.column - 1;
    this.rows = 10;
    this.elements = this.getMatrix(this.column);
    this.sortedElements = this.getMatrix(this.column);
    this.elementsInSort = [];
    this.actualColumn = this.column - 1;
    this.actualRow = 9;

    this.finished = false;
    this.newRound = false;
    this.canceled = false;
};

Vector.prototype.saveInDB = function()
{
    //############if user isn't at the last state, delete the following states####
    var count = this.db.length - 1;
    if (count != this.actStateID)
    {
        this.db.splice(this.actStateID + 1, count - this.actStateID);
    }
    var nextID = this.db.length;
    var new_state = this.copy();
    var last_state = this.db[this.db.length - 1];

    //######################checking whether its the same#######################################

    var same = true;
    //###############change column, rows or speed?####################################
    if (last_state == undefined || last_state.column.length != new_state.column.length ||
        last_state.rows != new_state.rows || last_state.speed != new_state.speed ||
        last_state.actualColumn != new_state.actualColumn || last_state.actualRow != new_state.actualRow ||
        last_state.sortedElements[0].length != new_state.sortedElements[0].length ||
        last_state.radix != new_state.radix)
    {
        same = false;
    }


    //###if it isn't the same, save it!######################################
    if (!same)
    {
        this.db.push(new_state);
        this.actStateID = nextID;
    }

};

//##########################copy-methods########################################
Vector.prototype.copy = function()
{
    var newVector = new Vector();
    newVector.radix = this.radix;
    newVector.column = this.column;
    newVector.rows = this.rows;
    newVector.actualColumn = this.actualColumn;
    newVector.actualRow = this.actualRow;
    newVector.sortedElements = newVector.getMatrix(this.column);
    for (var i = 0; i < this.sortedElements.length; ++i)
    {
        for (var j = 0; j < this.sortedElements[i].length; ++j)
        {
            newVector.sortedElements[i][j] = this.sortedElements[i][j];
        }
    }
    newVector.elementsInSort = newVector.getMatrix(this.column);
    for (var i = 0; i < this.elementsInSort.length; ++i)
    {
        for (var j = 0; j < this.elementsInSort[i].length; ++j)
        {
            newVector.elementsInSort[i][j] = this.elementsInSort[i][j];
        }
    }
    newVector.elements = newVector.getMatrix(this.column);
    for (var i = 0; i < this.elements.length; ++i)
    {
        for (var j = 0; j < this.elements[i].length; ++j)
        {
            newVector.elements[i][j] = this.elements[i][j];
        }
    }
    newVector.colors = this.colors.slice();
    newVector.paused = true;
    newVector.finished = this.finished;
    newVector.speed = this.speed;
    newVector.colorColumn = this.colorColumn;
    newVector.newRound = this.newRound;
    newVector.coloredElement = this.coloredElement.slice();
    return newVector;
};

Vector.prototype.replaceThis = function (toCopy)
{
    this.actualColumn = toCopy.actualColumn;
    this.actualRow = toCopy.actualRow;

    this.sortedElements = this.getMatrix(toCopy.column);
    for (var i = 0; i < toCopy.sortedElements.length; ++i)
    {
        for (var j = 0; j < toCopy.sortedElements[i].length; ++j)
        {
            this.sortedElements[i][j] = toCopy.sortedElements[i][j];
        }
    }

    this.elementsInSort = this.getMatrix(toCopy.column);
    for (var i = 0; i < toCopy.elementsInSort.length; ++i)
    {
        for (var j = 0; j < toCopy.elementsInSort[i].length; ++j)
        {
            this.elementsInSort[i][j] = toCopy.elementsInSort[i][j];
        }
    }
    this.elements = this.getMatrix(toCopy.column);
    for (var i = 0; i < toCopy.elements.length; ++i)
    {
        for (var j = 0; j < toCopy.elements[i].length; ++j)
        {
            this.elements[i][j] = toCopy.elements[i][j];
        }
    }
    this.radix = toCopy.radix;
    this.column = toCopy.column;
    this.rows = toCopy.rows;
    this.colors = toCopy.colors.slice();
    this.paused = true;
    this.finished = toCopy.finished;
    this.speed = toCopy.speed;
    this.colorColumn = toCopy.colorColumn;
    this.newRound = toCopy.newRound;
    this.coloredElement = toCopy.coloredElement.slice();
};

Vector.prototype.draw = function()
{
    this.view.draw();
};

//#######################Methods for tape recorder#####################################
Vector.prototype.prev = function()
{
    if(this.paused)
    {
        if(this.actStateID > 0)
        {
            var prev_id = this.actStateID-1;
            this.actStateID = prev_id;
            var rs = this.db[prev_id];
            //make actual node to THIS:
            this.replaceThis(rs);
            this.draw();
        }
    }
    else
        window.alert("Pause the sorting first!");
};

Vector.prototype.next = function()
{
    if(this.paused)
    {
        if(this.actStateID < this.db.length - 1)
        {
            var next_id = this.actStateID + 1;
            this.actStateID = next_id;
            var rs = this.db[next_id];
            //make actual node to THIS:
            this.replaceThis(rs);
            this.draw();
        }
        else
        {
            this.lsdRadixsortOneStep();
        }
    }
    else
        window.alert("Pause the sorting first!");
};

Vector.prototype.firstState=function()
{
    if(this.paused)
    {
        this.actStateID = 0;
        var rs = this.db[0];
        //make actual node to THIS:
        this.replaceThis(rs);
        this.draw();
    }
    else
        window.alert("Pause the sorting first!");
};

Vector.prototype.lastState = function()
{
    if(this.paused)
    {
        this.lsdRadixsortLastState();
    }
    else
        window.alert("Pause the sorting first!");
};

//########################LSD-Radixsort Methods####################################################

Vector.prototype.setRandomElements = function()
{
    this.init();
    if (isNaN(this.radix))
    {
        var posElements = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var col = 0; col < this.column; ++col)
        {
            for (var row = 0; row < 10; ++row)
            {
                this.elements[col].push(posElements.charAt(Math.floor(Math.random() * posElements.length)));
            }
        }
        //this.lsdRadixsort();
        this.db = []; //clean db
        this.saveInDB();
        this.draw();
    }
    else
    {
        for (var col = 0; col < this.column; ++col)
        {
            for (var row = 0; row < 10; ++row)
            {
                this.elements[col].push(Math.floor((Math.random() * this.radix)));
            }
        }
        //this.lsdRadixsort();
        this.db = []; //clean db
        this.saveInDB();
        this.draw();
    }
};

Vector.prototype.getElementsByPrompt = function()
{
    if(isNaN(this.radix)) //for chars
    {
        var newValueInString = prompt("Add new values (separated by space).\nValues with more than "+ this.column + " characters or out of [A-z] are ignored!");
        if((/\S/.test(newValueInString))&& newValueInString) //testing if only blanks & canceled
        {
            this.init();

            var tempStrArr = newValueInString.split(" ");

            for (var i = 0; i < tempStrArr.length; ++i)
            {
                var valueLength = tempStrArr[i].length;
                var tempStrValue = tempStrArr[i];
                var patt = /[^A-z]/g; //testing, if only chars from [a-Z]
                var result = patt.test(tempStrValue);
                if (!result && (tempStrValue.length != 0)) // for blanks
                {
                    if (!(valueLength > this.column) )
                    {
                        for (var j = this.column -1; j > -1; --j, --valueLength)
                        {
                            if (valueLength > 0)
                            {
                                this.elements[j].push(tempStrValue.charAt(valueLength - 1));
                            }
                            else
                            {
                                this.elements[j].push('A');
                            }
                        }
                    }
                }
            }
        }
        else
        {
            this.canceled = true;
        }
    }
    else // for numbers
    {
        var newValueInString = prompt("Add new values (separated by space).\nValues with more than "+ this.column + " digits are ignored!");
        if((/\S/.test(newValueInString))&& newValueInString) //testing if only blanks & canceled
        {
            this.init();

            var tempStrArr = newValueInString.split(" ");

            for(var i = 0; i < tempStrArr.length; ++i)
            {
                var allowed = true;

                if (!(isNaN(tempStrArr[i])))
                {
                    var valueLength = tempStrArr[i].length;
                    var tempStrValue = tempStrArr[i];
                    if (tempStrArr[i].charAt(0) == "-") //for negative values
                    {
                        if (!(valueLength - 1 > this.column))
                        {
                            var tempDigit = valueLength - 1;

                            for (var k = 1; k < tempStrArr[i].length; ++k)
                            {
                                if (tempStrArr[i].charAt(k) >= this.radix){allowed = false;}
                            }
                            if (allowed)
                            {
                                var minus = 0;
                                for (var j = this.column - 1; j > -1; --j, --tempDigit)
                                {
                                    if (tempDigit > 0) {
                                        this.elements[j].push(parseInt(tempStrValue[tempDigit]));
                                    }
                                    else
                                    {
                                        this.elements[j].push(0);
                                        ++minus;
                                    }
                                }
                                this.elements[minus][this.elements[0].length-1] = this.elements[minus][this.elements[0].length-1] * (-1);
                            }
                        }
                    }
                    else //for positive values
                    {
                        if (tempStrValue.length != 0) // for blanks
                        {
                            for (var k = 0; k < tempStrArr[i].length; ++k)
                            {
                                if (!(tempStrArr[i].charAt(k) < this.radix )){allowed = false;}
                            }
                            if (allowed)
                            {
                                if (!(valueLength > this.column))
                                {
                                    for (var j = this.column - 1; j > -1; --j, --valueLength)
                                    {
                                        if (valueLength > 0)
                                        {
                                            this.elements[j].push(parseInt(tempStrValue[valueLength - 1]));
                                        }
                                        else
                                        {
                                            this.elements[j].push(0);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            this.canceled = true;
        }
    }
    if (this.elements[0][0] !== undefined && (!this.canceled))
    {
        this.rows = this.elements[0].length;
        //this.lsdRadixsort();
        this.db = []; //clean db
        this.draw();
        this.saveInDB();
    }
};

Vector.prototype.editElements = function()
{
    var valueInString = "";
    for (var j = 0; j < this.elements[0].length; ++j)
    {
        if (j != 0) valueInString += " ";
        for (var i = 0; i < this.elements.length; ++i)
        {
            valueInString += this.elements[i][j];
        }
    }

    if(isNaN(this.radix)) //for chars
    {
        var newValueInString = prompt("Add new values or delete/edit existing ones.\nValues with more than "+ this.column + " characters or out of [A-z] are ignored!", valueInString);
        if(newValueInString && (/\S/.test(newValueInString)) && !(newValueInString == valueInString))
        {
            this.init();

            var tempStrArr = newValueInString.split(" ");

            for (var i = 0; i < tempStrArr.length; ++i)
            {
                var valueLength = tempStrArr[i].length;
                var tempStrValue = tempStrArr[i];
                var patt = /[^A-z]/g; //testing, if only chars from [a-Z]
                var result = patt.test(tempStrValue);
                if (!result && (tempStrValue.length != 0)) // for blanks
                {
                    if (!(valueLength > this.column) )
                    {
                        for (var j = this.column -1; j > -1; --j, --valueLength)
                        {
                            if (valueLength > 0)
                            {
                                this.elements[j].push(tempStrValue.charAt(valueLength - 1));
                            }
                            else
                            {
                                this.elements[j].push('A');
                            }
                        }
                    }
                }
            }
        }
    }
    else // for numbers
    {
        var newValueInString = prompt("Add new values or delete/edit existing ones.\nValues with more than "+ this.column + " digits are ignored!", valueInString);
        if(newValueInString &&(/\S/.test(newValueInString)) && !(newValueInString == valueInString))
        {
            this.init();

            var tempStrArr = newValueInString.split(" ");

            for(var i = 0; i < tempStrArr.length; ++i)
            {
                if (!(isNaN(tempStrArr[i])))
                {
                    var valueLength = tempStrArr[i].length;
                    var tempStrValue = tempStrArr[i];
                    if (tempStrArr[i].charAt(0) == "-") //for negative values
                    {
                        if (!(valueLength - 1 > this.column))
                        {
                            var tempDigit = valueLength - 1;
                            var minus = 0;
                            for (var j = this.column - 1; j > -1; --j, --tempDigit)
                            {
                                if (tempDigit > 0) {
                                    this.elements[j].push(parseInt(tempStrValue[tempDigit]));
                                    --valueLength;
                                }
                                else
                                {
                                    this.elements[j].push(0);
                                    ++minus;
                                }
                            }
                            this.elements[minus][i] = this.elements[minus][i] * (-1);
                        }
                    }
                    else //for positive values
                    {
                        if ((!(valueLength > this.column)) && valueLength != 0)
                        {
                            for (var j = this.column - 1; j > -1; --j, --valueLength)
                            {
                                if (valueLength > 0)
                                {
                                    this.elements[j].push(parseInt(tempStrValue[valueLength - 1]));
                                }
                                else
                                {
                                    this.elements[j].push(0);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (this.elements[0][0] !== undefined)
    {
        this.rows = this.elements[0].length;
        //this.lsdRadixsort();
        this.draw();
        this.db = []; //clean db
        this.saveInDB();
    }
};

Vector.prototype.example = function()
{
    this.init();
    for (var col = 0; col < this.column; ++col)
    {
        for (var row = 0; row < 10; ++row)
        {
            this.elements[col].push(Math.floor((Math.random() * 10)));
        }
    }

    this.saveInDB();
    this.draw();
};

Vector.prototype.setRadix = function()
{
    var help = false;
    do
    {
        help = false;
        var newRadix = prompt("Set the radix between 2 and 10 or \"a character\" for characters.", this.radix);
        if (!isNaN(newRadix))
        {
            if ((newRadix < 2 || newRadix > 10) && newRadix)  //&& newRadix for cancel
            {
                alert("This is not between 2 and 10");
                help = true;
            }
            else if (newRadix && !(newRadix == this.radix))
            {
                this.radix = parseInt(newRadix);
                this.init();
                this.setRandomElements();
            }
        }
        else
        {
            this.radix = "char";
            this.init();
            this.setRandomElements();
        }
    }
    while(help)
};

Vector.prototype.setKeylength = function()
{
    var help;
    do
    {
        help = false;
        var newKeylength = prompt("Set the keylength between 1 and 10", this.column);
        if ((newKeylength < 1 || newKeylength > 10 || isNaN(newKeylength)) && newKeylength)  //&& Keylength for cancel
        {
            alert("This is not between 1 and 10");
            help = true;
        }
        else if(newKeylength && !(newKeylength == this.column))
        {
            this.column = parseInt(newKeylength);
            this.init();
            this.setRandomElements();
        }
    }
    while(help)
};

Vector.prototype.lsdRadixsort = function()
{
    var matrix = this;

    if (matrix.actStateID == 0)
    {
        matrix.elementsInSort = matrix.elements.slice();
        matrix.actualRow = matrix.elementsInSort[0].length - 1;
        matrix.saveInDB();
    }

    function step()
    {
        if (matrix.newRound)
        {
            --matrix.colorColumn;
            matrix.elementsInSort = matrix.sortedElements.slice();
            matrix.elements = matrix.sortedElements.slice();
            matrix.sortedElements = matrix.getMatrix(matrix.column);
            matrix.newRound = false;
            if (matrix.actualColumn < 0)
            {
                matrix.finished = true;
                matrix.coloredElement = [];
                matrix.draw();
                clearTimes();
                matrix.saveInDB();

            }
            else
            {
                matrix.coloredElement = [];
                matrix.draw();
                matrix.saveInDB();
                setTimeout(step, 150 * matrix.speed);
            }
        }
        else if (matrix.rows == 1) //trivial case
        {
            matrix.column = matrix.elements.length;
            matrix.colorColumn = -1;
            for(var i = matrix.column - 1; i >= 0; --i)
            {
                matrix.sortedElements[i].push(matrix.elementsInSort[i][0]);
            }
            matrix.saveInDB();
            matrix.draw();
            clearTimes();
            matrix.finished = true;
        }

        else if (!(matrix.actualColumn < 0))
        {
            var rowToCopy = matrix.actualRow;
            var nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow];

            var indicesToCopy = []; // for stabilityView
            indicesToCopy.push(matrix.actualRow); // for stabilityView
            for (;matrix.actualRow > 0; --matrix.actualRow)
            {
                if (nextElement > matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1])
                {
                    indicesToCopy = [];
                    indicesToCopy.push(matrix.actualRow - 1);
                    nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1];
                    rowToCopy = matrix.actualRow - 1;
                }

                else if (nextElement == matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1]) //equal for stabilityView
                {
                    indicesToCopy.push(matrix.actualRow - 1);
                    nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1];
                    rowToCopy = matrix.actualRow - 1;
                }
            }
            for (var m = indicesToCopy.length - 1; m > -1; --m)
            {
                for(var i = matrix.column - 1; i > -1; --i)
                {
                    matrix.sortedElements[i].push(matrix.elementsInSort[i][indicesToCopy[m]]);
                }
            }
            matrix.coloredElement[0] = nextElement; // stability view
            matrix.coloredElement[1] = matrix.actualColumn; // stability view
            indicesToCopy.forEach  //remove pushed elements
            (
                function(index)
                {
                    for(var i = matrix.column - 1; i > -1; --i)
                    {
                        //matrix.elementsInSort[i].splice(rowToCopy,1);
                        matrix.elementsInSort[i] = matrix.elementsInSort[i].slice(0,index).concat(matrix.elementsInSort[i].slice(index+1)).slice();
                    }
                }
            );

            if (matrix.elementsInSort[0].length == 0)
            {
                matrix.actualRow = 0;
                --matrix.actualColumn;
                matrix.draw();
                matrix.actualRow = matrix.rows - 1;
                matrix.newRound = true;
                matrix.saveInDB();
                matrix.coloredElement = [];
                setTimeout(step, 150 * matrix.speed);
            }
            else
            {
                matrix.actualRow = matrix.elementsInSort[0].length - 1;
                matrix.draw();
                matrix.saveInDB();
                setTimeout(step, 150 * matrix.speed);
            }
        }
    }
    step();
};

Vector.prototype.lsdRadixsortOneStep = function()
{
    if (!this.finished)
    {
        var matrix = this;

        if (matrix.actStateID == 0)
        {
            matrix.elementsInSort = matrix.elements.slice();
            matrix.actualRow = matrix.elementsInSort[0].length - 1;

            matrix.saveInDB();
        }

        if (matrix.newRound)
        {
            --matrix.colorColumn;
            matrix.elementsInSort = matrix.sortedElements.slice();
            matrix.elements = matrix.sortedElements.slice();
            matrix.sortedElements = matrix.getMatrix(matrix.column);
            matrix.newRound = false;
            if (matrix.actualColumn < 0)
            {
                matrix.finished = true;
                matrix.draw();
                matrix.saveInDB();

            }
            else
            {
                matrix.draw();
                matrix.saveInDB();
            }
        }
        else if (matrix.rows == 1) //trivial case
        {
            matrix.column = matrix.elements.length;
            matrix.colorColumn = -1;
            for(var i = matrix.column - 1; i >= 0; --i)
            {
                matrix.sortedElements[i].push(matrix.elementsInSort[i][0]);
            }
            matrix.saveInDB();
            matrix.draw();
            matrix.finished = true;
        }

        else if (!(matrix.actualColumn < 0))
        {
            var rowToCopy = matrix.actualRow;
            var nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow];

            var indicesToCopy = []; // for stabilityView
            indicesToCopy.push(matrix.actualRow); // for stabilityView
            for (;matrix.actualRow > 0; --matrix.actualRow)
            {
                if (nextElement > matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1])
                {
                    indicesToCopy = [];
                    indicesToCopy.push(matrix.actualRow - 1);
                    nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1];
                    rowToCopy = matrix.actualRow - 1;
                }

                else if (nextElement == matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1]) //equal for stabilityView
                {
                    indicesToCopy.push(matrix.actualRow - 1);
                    nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1];
                    rowToCopy = matrix.actualRow - 1;
                }

            }
            for (var m = indicesToCopy.length - 1; m > -1; --m)
            {
                for(var i = matrix.column - 1; i > -1; --i)
                {
                    matrix.sortedElements[i].push(matrix.elementsInSort[i][indicesToCopy[m]]);
                }
            }
            matrix.coloredElement[0] = nextElement; // stability view
            matrix.coloredElement[1] = matrix.actualColumn; // stability view
            indicesToCopy.forEach
            (
                function(index)
                {
                    for(var i = matrix.column - 1; i > -1; --i)
                    {
                        //matrix.elementsInSort[i].splice(rowToCopy,1);
                        matrix.elementsInSort[i] = matrix.elementsInSort[i].slice(0,index).concat(matrix.elementsInSort[i].slice(index+1)).slice();
                    }
                }
            );

            if (matrix.elementsInSort[0].length == 0)
            {
                matrix.actualRow = 0;
                --matrix.actualColumn;
                matrix.draw();
                matrix.actualRow = matrix.rows - 1;
                matrix.newRound = true;
                matrix.saveInDB();
                matrix.coloredElement = [];
            }
            else
            {
                matrix.actualRow = matrix.elementsInSort[0].length - 1;
                matrix.draw();
                matrix.saveInDB();
            }
        }
    }
};

Vector.prototype.lsdRadixsortLastState = function()
{
    if (!this.finished)
    {
        var matrix = this;

        if (matrix.actStateID == 0)
        {
            matrix.elementsInSort = matrix.elements.slice();
            matrix.actualRow = matrix.elementsInSort[0].length - 1;

            matrix.saveInDB();
        }

        function step()
        {
            if (matrix.newRound)
            {
                --matrix.colorColumn;
                matrix.elementsInSort = matrix.sortedElements.slice();
                matrix.elements = matrix.sortedElements.slice();
                matrix.sortedElements = matrix.getMatrix(matrix.column);
                matrix.newRound = false;
                if (matrix.actualColumn < 0)
                {
                    matrix.finished = true;
                    matrix.draw();
                    matrix.saveInDB();

                }
                else
                {
                    matrix.saveInDB();
                    step();
                }
            }
            else if (matrix.rows == 1) //trivial case
            {
                matrix.column = matrix.elements.length;
                matrix.colorColumn = -1;
                for(var i = matrix.column - 1; i >= 0; --i)
                {
                    matrix.sortedElements[i].push(matrix.elementsInSort[i][0]);
                }
                matrix.saveInDB();
                matrix.draw();
                matrix.finished = true;
            }

            else if (!(matrix.actualColumn < 0))
            {
                var rowToCopy = matrix.actualRow;
                var nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow];

                var indicesToCopy = []; // for stabilityView
                indicesToCopy.push(matrix.actualRow); // for stabilityView
                for (;matrix.actualRow > 0; --matrix.actualRow)
                {
                    if (nextElement > matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1])
                    {
                        indicesToCopy = [];
                        indicesToCopy.push(matrix.actualRow - 1);
                        nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1];
                        rowToCopy = matrix.actualRow - 1;
                    }

                    else if (nextElement == matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1]) //equal for stabilityView
                    {
                        indicesToCopy.push(matrix.actualRow - 1);
                        nextElement = matrix.elementsInSort[matrix.actualColumn][matrix.actualRow - 1];
                        rowToCopy = matrix.actualRow - 1;
                    }

                }
                for (var m = indicesToCopy.length - 1; m > -1; --m)
                {
                    for(var i = matrix.column - 1; i > -1; --i)
                    {
                        matrix.sortedElements[i].push(matrix.elementsInSort[i][indicesToCopy[m]]);
                    }
                }
                matrix.coloredElement[0] = nextElement; // stability view
                matrix.coloredElement[1] = matrix.actualColumn; // stability view
                indicesToCopy.forEach
                (
                    function(index)
                    {
                        for(var i = matrix.column - 1; i > -1; --i)
                        {
                            //matrix.elementsInSort[i].splice(rowToCopy,1);
                            matrix.elementsInSort[i] = matrix.elementsInSort[i].slice(0,index).concat(matrix.elementsInSort[i].slice(index+1)).slice();
                        }
                    }
                );

                if (matrix.elementsInSort[0].length == 0)
                {
                    matrix.actualRow = 0;
                    --matrix.actualColumn;
                    matrix.actualRow = matrix.rows - 1;
                    matrix.newRound = true;
                    matrix.saveInDB();
                    matrix.coloredElement = [];
                    step();
                }
                else
                {
                    matrix.actualRow = matrix.elementsInSort[0].length - 1;
                    matrix.saveInDB();
                    step();
                }
            }
        }
        step();
    }
};

Vector.prototype.size=function()
{
    return this.elements[0].length;
}