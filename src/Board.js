// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var counter = 0;
      var row = this.rows()[rowIndex];
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          counter++;
          if (counter > 1) {
            return true;
          }
        }
      }
      return false;
    },
    // TIME COMPLEXITY: O(n) - linear time


    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        var counter = 0;
        var row = rows[i];
        for (var j = 0; j < row.length; j++) {
          if (row[j] === 1) {
            counter++;
            if (counter > 1) {
              return true;
            }
          }
        }
      }
      return false;
    },
    // TIME COMPLEXITY: O(n^2) - quadratic time



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var counter = 0;
      var rows = this.rows();
      for(var i = 0; i < rows.length; i++){
        if(rows[i][colIndex] === 1){
          counter++;
          if(counter > 1){
            return true;
          }
        }
      }
      return false;
    },
    // TIME COMPLEXITY: O(n) - linear time

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      var storage = {};
      for(var i = 0; i < rows.length; i++){
        var row = rows[i];
        for(var j = 0; j < row.length; j++){
          if(row[j] === 1){
            if(storage[j]){
              return true;
            } else {
              storage[j] = 1;
            }
          }
        }
      }
      return false;
    },
    // TIME COMPLEXITY: O(n^2) - quadratic time


    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      // call rows method
      //LOOP WITHIN RECURSE
      //define recurse function (rowIndex) {
      var checkDiagonals = function(rowIndex){
        var colIndex = majorDiagonalColumnIndexAtFirstRow;
        //if rowIndex > rows.length

        if(rowIndex >= rows.length) {
          return false;
        }
        //otherwise
        //initialize counter to 0
        var counter = 0;
        //loop through each row
        for( var i = rowIndex; i < rows.length; i++){
          var row = rows[i];
          //check row[colIndex]
          if(row[colIndex] === 1){
            //add to counter if row[colIndex] = 1
            counter++;
            //check if counter > 1, if so return true
            if(counter > 1){
              return true;
            }
          }
          //increment colIndex
          colIndex++;
          if(colIndex > rows.length){
            break;
          }
        }
        return checkDiagonals(rowIndex + 1);
      }
      return checkDiagonals(0);
    },
    // TIME COMPLEXITY: O(n) - linear time

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },
    // TIME COMPLEXITY: O(n) - linear time



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      // call rows method
      //LOOP WITHIN RECURSE
      //define recurse function (rowIndex) {
      var checkDiagonals = function(rowIndex){
        var colIndex = minorDiagonalColumnIndexAtFirstRow;
        //if rowIndex > rows.length

        if(rowIndex >= rows.length) {
          return false;
        }
        //otherwise
        //initialize counter to 0
        var counter = 0;
        //loop through each row
        for( var i = rowIndex; i < rows.length; i++){
          var row = rows[i];
          //check row[colIndex]
          if(row[colIndex] === 1){
            //add to counter if row[colIndex] = 1
            counter++;
            //check if counter > 1, if so return true
            if(counter > 1){
              return true;
            }
          }
            //increment colIndex
          colIndex--;
          if(colIndex < 0){
            break;
          }
        }
        return checkDiagonals(rowIndex + 1);
      };
      return checkDiagonals(0);
    },
    // TIME COMPLEXITY: O(n) - linear time

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }
    // TIME COMPLEXITY: O(n) - linear time

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
