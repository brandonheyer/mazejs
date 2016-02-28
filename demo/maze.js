(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class($element, maze) {
        _classCallCheck(this, _class);

        this.$maze = $element;
        this.cellSize = 10;
        this.height = maze.height;
        this.width = maze.width;

        this._cells = maze._cells;
    }

    _createClass(_class, [{
        key: 'draw',
        value: function draw() {
            var output = '';

            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    output += '<div id="' + j + '-' + i + '" class="cell visited complete ' + this._cells[i][j].exits.join(' ') + '" style="width: ' + this.cellSize + 'px; height: ' + this.cellSize + 'px;"></div>';
                }
            }

            this.$maze.width(this.width * this.cellSize).height(this.height * this.cellSize).attr('data-width', this.width).attr('data-height', this.height).append(output).addClass('finished');
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _maze = require('./maze');

var _maze2 = _interopRequireDefault(_maze);

var _draw = require('./draw');

var _draw2 = _interopRequireDefault(_draw);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $current, $new, neighbors, direction, n, $maze, maze;

var saveMappings = {
    'n': '0',
    'n e': '1',
    'n s': '2',
    'n w': '3',
    'n e s': '4',
    'n e w': '5',
    'n s w': '6',
    'n e s w': '7',
    'e': '8',
    'e s': '9',
    'e w': 'A',
    'e s w': 'B',
    's': 'C',
    's w': 'D',
    'w': 'E'
};

var loadMappings = {
    '0': 'n',
    '1': 'n e',
    '2': 'n s',
    '3': 'n w',
    '4': 'n e s',
    '5': 'n e w',
    '6': 'n s w',
    '7': 'n e s w',
    '8': 'e',
    '9': 'e s',
    'A': 'e w',
    'B': 'e s w',
    'C': 's',
    'D': 's w',
    'E': 'w'
};

var getSaveString = function getSaveString() {
    var finishes = '',
        saveString = height + '|' + width + '|' + $maze.find('.start').attr('id') + '|';

    $maze.find('.finish').each(function () {
        finishes += '.' + (0, _jquery2.default)(this).attr('id');
    });

    saveString += finishes.substring(1) + ':';

    $maze.find('.cell').each(function () {
        var $this = (0, _jquery2.default)(this),
            classString = '';

        if ($this.hasClass('n')) {
            classString += ' n';
        }

        if ($this.hasClass('e')) {
            classString += ' e';
        }

        if ($this.hasClass('s')) {
            classString += ' s';
        }

        if ($this.hasClass('w')) {
            classString += ' w';
        }

        saveString += saveMappings[classString.substring(1)];
    });

    return saveString;
};

var loadSaveString = function loadSaveString(saveString) {
    var subParts,
        parts = saveString.split(':');
    if (parts.length !== 2) {
        return 'Invalid Maze String';
    }

    subParts = parts[0].split('|');
    if (subParts.length !== 4) {
        return 'Invalid Maze String';
    }

    width = parseInt(subParts[1], 10);
    height = parseInt(subParts[0], 10);

    if (isNaN(width) || isNaN(height)) {
        return 'Invalid Maze String';
    }

    clearGrid();
    drawGrid(height, width, _underscore2.default.partial(loadDraw, parts[1], subParts[2], subParts[3].split('.')));
};

var loadDrawCell = function loadDrawCell(saveString, i) {
    (0, _jquery2.default)(this).addClass(loadMappings[saveString.charAt(i)]);
};

var loadDraw = function loadDraw(saveString, startID, finishIDs) {
    $maze.find('.cell').each(_underscore2.default.partial(loadDrawCell, saveString)).addClass('visited complete');
    $maze.find('#' + startID).addClass('start');

    _underscore2.default.each(finishIDs, function (id) {
        $maze.find('#' + id).addClass('finish');
    });

    finalizeMaze();
};

var clearGrid = function clearGrid() {
    $maze.empty().removeClass('finished');
};

(0, _jquery2.default)(document).ready(function () {
    $maze = (0, _jquery2.default)('.maze');
    maze = new _maze2.default();

    (0, _jquery2.default)('.maze-input').hide().first().show();

    (0, _jquery2.default)('#generate').click(function (event) {
        event.preventDefault();
        clearGrid();

        maze.height = parseInt((0, _jquery2.default)('#grid-height').val(), 10);
        maze.width = parseInt((0, _jquery2.default)('#grid-width').val(), 10);
        maze.cellSize = parseInt((0, _jquery2.default)('#cell-size').val(), 10);
        maze.split = parseInt((0, _jquery2.default)('#maze-style').val(), 10);

        maze.generate();
        new _draw2.default($maze, maze).draw();
    });

    (0, _jquery2.default)('#grid-width').change(function () {
        var $col = (0, _jquery2.default)('.large-12.columns'),
            colWidth = $col.innerWidth() - 100,
            gridWidth = parseInt((0, _jquery2.default)(this).val());
        if (isNaN(gridWidth)) {
            (0, _jquery2.default)(this).val(40);
        } else if (gridWidth < 2) {
            (0, _jquery2.default)(this).val(2);
        } else {
            (0, _jquery2.default)(this).val(Math.floor(gridWidth));
        }
    });

    (0, _jquery2.default)('#grid-height').change(function () {
        var gridHeight = parseInt((0, _jquery2.default)(this).val());
        if (isNaN(gridHeight)) {
            (0, _jquery2.default)(this).val(20);
        } else if (gridHeight < 2) {
            (0, _jquery2.default)(this).val(2);
        } else {
            (0, _jquery2.default)(this).val(Math.floor(gridHeight));
        }
    });

    (0, _jquery2.default)('#cell-size').change(function () {
        var cellSize = parseInt((0, _jquery2.default)(this).val());

        if (isNaN(cellSize)) {
            (0, _jquery2.default)(this).val(20);
        } else if (cellSize < 3) {
            (0, _jquery2.default)(this).val(3);
        } else if (cellSize > 30) {
            (0, _jquery2.default)(this).val(30);
        } else {
            (0, _jquery2.default)(this).val(Math.floor(cellSize));
        }

        cellSize = parseInt((0, _jquery2.default)(this).val());
        var $col = (0, _jquery2.default)('.large-12.columns'),
            colWidth = $col.innerWidth() - 100,
            gridWidth = parseInt((0, _jquery2.default)('#grid-width').val()),
            gridHeight = parseInt((0, _jquery2.default)('#grid-height').val());

        if (gridWidth > colWidth / cellSize) {
            (0, _jquery2.default)('#grid-width').val(Math.floor(colWidth / cellSize));
        }

        if (gridHeight > 600 / cellSize) {
            (0, _jquery2.default)('#grid-height').val(Math.floor(600 / cellSize));
        }
    });

    (0, _jquery2.default)('#maze-style').change(function () {
        var style = parseInt((0, _jquery2.default)(this).val());

        if (isNaN(style)) {
            (0, _jquery2.default)(this).val(50);
        } else if (style < 0) {
            (0, _jquery2.default)(this).val(0);
        } else if (style > 100) {
            (0, _jquery2.default)(this).val(100);
        } else {
            (0, _jquery2.default)(this).val(Math.floor(style));
        }
    });

    (0, _jquery2.default)('#qmark').click(function () {
        var $updates = (0, _jquery2.default)('#updates');

        if ($updates.hasClass('expanded')) {
            $updates.stop(true, true).removeClass('expanded').animate({ 'right': '-530px' });
        } else {
            $updates.stop(true, true).addClass('expanded').animate({ 'right': '5px' });
        }
    });

    (0, _jquery2.default)('#toggle-heatmap').click(function () {
        var i, j;
        if (maze.heats.length) {
            for (i = 0; i < maze.heats.length; i++) {
                maze.heats[i].removeClass('distance-' + i);
            }

            heats = [];
        } else {
            maze.heats.push($maze.find('[data-distance-class="distance-0"]').addClass('distance-0'));
            maze.heats.push($maze.find('[data-distance-class="distance-1"]').addClass('distance-1'));
            maze.heats.push($maze.find('[data-distance-class="distance-2"]').addClass('distance-2'));
            maze.heats.push($maze.find('[data-distance-class="distance-3"]').addClass('distance-3'));
            maze.heats.push($maze.find('[data-distance-class="distance-4"]').addClass('distance-4'));
            maze.heats.push($maze.find('[data-distance-class="distance-5"]').addClass('distance-5'));
            maze.heats.push($maze.find('[data-distance-class="distance-6"]').addClass('distance-6'));
            maze.heats.push($maze.find('[data-distance-class="distance-7"]').addClass('distance-7'));
            maze.heats.push($maze.find('[data-distance-class="distance-8"]').addClass('distance-8'));
            maze.heats.push($maze.find('[data-distance-class="distance-9"]').addClass('distance-9'));
            maze.heats.push($maze.find('[data-distance-class="distance-10"]').addClass('distance-10'));
        }
    });

    (0, _jquery2.default)('#zoom-out').click(function () {
        if (cellSize <= 5) {
            return;
        }

        cellSize = cellSize - 2;
        (0, _jquery2.default)('.cell').css({
            width: cellSize,
            height: cellSize
        });

        $maze.width(cellSize * parseInt($maze.attr('data-width'), 10)).height(cellSize * parseInt($maze.attr('data-height'), 10));
    });

    (0, _jquery2.default)('#zoom-in').click(function () {
        if (cellSize >= 98) {
            return;
        }

        cellSize = cellSize + 2;
        (0, _jquery2.default)('.cell').css({
            width: cellSize,
            height: cellSize
        });

        $maze.width(cellSize * parseInt($maze.attr('data-width'), 10)).height(cellSize * parseInt($maze.attr('data-height'), 10));
    });

    (0, _jquery2.default)('#save-maze').click(function () {
        if ($maze.hasClass('finished')) {
            (0, _jquery2.default)('#maze-savestring').val(getSaveString());
        } else {
            (0, _jquery2.default)('#maze-savestring').val('Generate or load a maze first!');
        }
    });

    (0, _jquery2.default)('#maze-savestring').click(function (e) {
        this.select();
        e.preventDefault();
    });

    (0, _jquery2.default)('#load-maze').click(function () {
        loadSaveString((0, _jquery2.default)('#maze-savestring').val());
    });

    (0, _jquery2.default)('#io-button').click(function () {
        var $this = (0, _jquery2.default)(this);

        if ($this.hasClass('secondary')) {
            $this.removeClass('secondary');
            (0, _jquery2.default)('.maze-input').hide().filter('#maze-io').show();
        } else {
            $this.addClass('secondary');
            (0, _jquery2.default)('.maze-input').hide().first().show();
        }
    });

    (0, _jquery2.default)(window).resize(function () {
        var height = 0;

        (0, _jquery2.default)('body > .row:not(.mc-row)').each(function () {
            height += (0, _jquery2.default)(this).height();
        });

        (0, _jquery2.default)('#maze-container').height((0, _jquery2.default)(this).height() - height - 30);
    }).resize();

    (0, _jquery2.default)('#enter-printmode').click(function () {
        (0, _jquery2.default)('body').addClass('print-mode');
        (0, _jquery2.default)('#maze-container').attr('data-style', (0, _jquery2.default)('#maze-container').attr('style')).attr('style', '');
    });

    (0, _jquery2.default)('#exit-printmode').click(function () {
        (0, _jquery2.default)('body').removeClass('print-mode');
        (0, _jquery2.default)('#maze-container').attr('style', (0, _jquery2.default)('#maze-container').attr('data-style'));
    });
});

},{"./draw":1,"./maze":3,"jquery":"jquery","underscore":"underscore"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.directions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var directions = {
    LOOKUP: {
        NORTH: 0,
        SOUTH: 1,
        EAST: 2,
        WEST: 3,
        UP: 4,
        DOWN: 5
    },

    INVERSE_LOOKUP: {
        0: 1,
        1: 0,
        2: 3,
        3: 2,
        4: 5,
        5: 4
    },

    ENCODED: {
        0: 'n',
        1: 's',
        2: 'e',
        3: 'w',
        4: 'u',
        5: 'd'
    }
};

exports.directions = directions;

/**
 * A maze generation class that will generate a maze of height by width cells
 */

var _class = function () {
    _createClass(_class, [{
        key: '_populateCells',

        /**
         * Initialize the two dimensional array containing cell definitions
         *
         * @private
         */
        value: function _populateCells() {
            this._cells = [];

            for (var i = 0; i < this.height; i++) {
                this._cells.push([]);

                for (var j = 0; j < this.width; j++) {
                    this._cells[i].push({
                        x: j,
                        y: i,
                        exits: [],
                        linkedCells: [undefined, undefined, undefined, undefined, undefined, undefined],
                        distance: -1,
                        visited: false,
                        complete: false
                    });
                }
            }
        }

        /**
         * Get the starting x position, a random number between 0 and maze width
         *
         * @private
         */

    }, {
        key: '_getStartXPos',
        value: function _getStartXPos() {
            return Math.floor(Math.random() * this.width);
        }

        /**
         * Get the starting y position, a random number between 0 and maze height
         */

    }, {
        key: '_getStartYPos',
        value: function _getStartYPos() {
            return Math.floor(Math.random() * this.height);
        }

        /**
         * Get node to act as head node for generation, will either select a node at
         * random, or the last added node
         *
         * @private
         * @return  {Number}    the index of the new head node to use
         */

    }, {
        key: '_getHeadNode',
        value: function _getHeadNode() {
            // Get a random number between 0 - 99
            var n = Math.floor(Math.random() * 100);

            // If the random number is less than the split modifier,
            // select an existing node ( will cause a trend towards dead ends )
            if (n < this.split) {
                n = Math.floor(Math.random() * this._activeSet.length);
            }

            // Otherwise, select the last added node
            // ( will cause a trend towards winding trails )
            else {
                    n = this._activeSet.length - 1;
                }

            return n;
        }

        /**
         * Store the unvisted cell in the result array
         *
         * @private
         * @param  {Object} cell      - the cell to store
         * @param  {Array}  result    - the array of stored, unvisted cells
         * @param  {Number} direction - the direction of the unvisted cell
         */

    }, {
        key: '_storeUnvisitedCell',
        value: function _storeUnvisitedCell(cell, result, direction) {
            if (!cell.visited) {
                result.push({ cell: cell, direction: direction });
            }
        }

        /**
         * Locate and store unvisted cells connected to the current cell
         *
         * @private
         * @param  {Object} cell    - the cell to locate neighbors of
         * @return {Array|boolean}  An array of unvisted cells, or false if there
         *                          are no unvisited cells
         */

    }, {
        key: '_getUnvisitedNeighbors',
        value: function _getUnvisitedNeighbors(cell) {
            var result = [];

            // North
            if (cell.y !== 0) {
                this._storeUnvisitedCell(this._cells[cell.y - 1][cell.x], result, directions.LOOKUP.NORTH);
            }

            // West
            if (cell.x !== 0) {
                this._storeUnvisitedCell(this._cells[cell.y][cell.x - 1], result, directions.LOOKUP.WEST);
            }

            // South
            if (cell.y !== this.height - 1) {
                this._storeUnvisitedCell(this._cells[cell.y + 1][cell.x], result, directions.LOOKUP.SOUTH);
            }

            // East
            if (cell.x !== this.width - 1) {
                this._storeUnvisitedCell(this._cells[cell.y][cell.x + 1], result, directions.LOOKUP.EAST);
            }

            // No unvisited cells
            if (result.length === 0) {
                cell.complete = true;
                return false;
            }

            return result;
        }

        /**
         * Generate the maze
         *
         * @private
         */

    }, {
        key: '_generate',
        value: function _generate() {
            var current, next, neighbors, n;

            // While there are cells that are still "active"
            while (this._activeSet.length) {
                n = this._getHeadNode();
                current = this._activeSet[n];

                // If this cell is the furthest, or tied for the furthest,
                // from start, store it
                if (this._maxDistance <= current.distance) {

                    // Store the new furthest distance
                    this._maxDistance = current.distance;

                    // If we already had a cell found at this distance, just
                    // push it onto furthestCells
                    if (this._maxDistance === current.distance) {
                        this._furthestCells.push(current);
                    }

                    // Otherwise we create a new array with this cell
                    else {
                            this._furthestCells = [current];
                        }
                }

                neighbors = this._getUnvisitedNeighbors(current);

                // If there are unvisited neighbors, select one to create a link to
                // from this cell
                if (neighbors) {

                    // Pick one neighbor at random
                    //
                    // TODO: This would be a good spot to modify the algorithm
                    // to allow for directional wandering, ie: favoring east/west
                    // movement to north/south
                    next = neighbors[Math.floor(Math.random() * neighbors.length)];

                    // Update the current cell to have an exit to the neighbor
                    current.exits.push(directions.ENCODED[next.direction]);
                    current.linkedCells[next.direction] = next;

                    // Update the neighbor cell to have an exit to this cell
                    next.cell.exits.push(directions.ENCODED[directions.INVERSE_LOOKUP[next.direction]]);
                    next.cell.linkedCells[directions.INVERSE_LOOKUP[next.direction]] = current;

                    // Store the distance of this cell from the starting cell
                    // This is just a statistic and doesn't current have an
                    // impact on the evaluation of the algorithm
                    next.cell.distance = current.distance + 1;

                    // Track that this cell has been visited, that is, it is
                    // accessible from another cell in the maze
                    next.cell.visited = true;

                    // Push this cell onto the array of cells that are potential
                    // new head nodes to continue generating the maze from
                    this._activeSet.push(next.cell);
                } else {
                    this._activeSet.splice(n, 1);
                }
            }
        }
    }]);

    function _class() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, _class);

        this.split = options.split || 0;
        this.height = options.height || 20;
        this.width = options.width || 50;
    }

    /**
     * Generate the maze from the provided starting x,y position
     *
     * @param  {Number} startX  - the x position of the starting cell
     * @param  {Number} startY  - the y position of the starting cell
     */


    _createClass(_class, [{
        key: 'generate',
        value: function generate(startX, startY) {
            var current;

            this._populateCells();

            this._maxDistance = 0;
            this._furthestCells = [];
            this._activeSet = [];

            if (startX === undefined) {
                startX = this._getStartXPos();
            }

            if (startY === undefined) {
                startY = this._getStartYPos();
            }

            this._startingCell = current = this._cells[startY][startX];
            current.distance = 0;
            current.visited = true;

            this._activeSet.push(current);

            this._generate();
        }
    }, {
        key: 'furthestCells',
        get: function get() {
            return this._furthestCells;
        }
    }, {
        key: 'startingCell',
        get: function get() {
            return this._startingCell;
        }
    }, {
        key: 'cells',
        get: function get() {
            return this._cells;
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"jquery":"jquery","underscore":"underscore"}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZHJhdy5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9tYXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSUksb0JBQWMsUUFBZCxFQUF3QixJQUF4QixFQUErQjs7O0FBQzNCLGFBQUssS0FBTCxHQUFhLFFBQWIsQ0FEMkI7QUFFM0IsYUFBSyxRQUFMLEdBQWdCLEVBQWhCLENBRjJCO0FBRzNCLGFBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxDQUhhO0FBSTNCLGFBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxDQUpjOztBQU0zQixhQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FOYTtLQUEvQjs7OzsrQkFTUTtBQUNKLGdCQUFJLFNBQVMsRUFBVCxDQURBOztBQUdKLGlCQUFNLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLE1BQUwsRUFBYSxHQUFsQyxFQUF3QztBQUNwQyxxQkFBTSxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksS0FBSyxLQUFMLEVBQVksR0FBakMsRUFBdUM7QUFDbkMsOEJBQVUsY0FBYyxDQUFkLEdBQWtCLEdBQWxCLEdBQXdCLENBQXhCLEdBQTRCLGlDQUE1QixHQUFnRSxLQUFLLE1BQUwsQ0FBYSxDQUFiLEVBQWtCLENBQWxCLEVBQXNCLEtBQXRCLENBQTRCLElBQTVCLENBQWtDLEdBQWxDLENBQWhFLEdBQ04sa0JBRE0sR0FDZSxLQUFLLFFBQUwsR0FBZ0IsY0FEL0IsR0FDZ0QsS0FBSyxRQUFMLEdBQWdCLGFBRGhFLENBRHlCO2lCQUF2QzthQURKOztBQU9BLGlCQUFLLEtBQUwsQ0FDSyxLQURMLENBQ1ksS0FBSyxLQUFMLEdBQWEsS0FBSyxRQUFMLENBRHpCLENBRUssTUFGTCxDQUVhLEtBQUssTUFBTCxHQUFjLEtBQUssUUFBTCxDQUYzQixD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QUssYUFBTCxHQUFxQixVQUFVLEtBQUssTUFBTCxDQUFhLE1BQWIsRUFBdUIsTUFBdkIsQ0FBVixDQWpCRTtBQWtCdkIsb0JBQVEsUUFBUixHQUFtQixDQUFuQixDQWxCdUI7QUFtQnZCLG9CQUFRLE9BQVIsR0FBa0IsSUFBbEIsQ0FuQnVCOztBQXFCdkIsaUJBQUssVUFBTCxDQUFnQixJQUFoQixDQUFzQixPQUF0QixFQXJCdUI7O0FBdUJ2QixpQkFBSyxTQUFMLEdBdkJ1Qjs7Ozs0QkEwQk47QUFDakIsbUJBQU8sS0FBSyxjQUFMLENBRFU7Ozs7NEJBSUQ7QUFDaEIsbUJBQU8sS0FBSyxhQUFMLENBRFM7Ozs7NEJBSVA7QUFDVCxtQkFBTyxLQUFLLE1BQUwsQ0FERSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvciAoICRlbGVtZW50LCBtYXplICkge1xuICAgICAgICB0aGlzLiRtYXplID0gJGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSAxMDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBtYXplLmhlaWdodDtcbiAgICAgICAgdGhpcy53aWR0aCA9IG1hemUud2lkdGg7XG5cbiAgICAgICAgdGhpcy5fY2VsbHMgPSBtYXplLl9jZWxscztcbiAgICB9XG5cbiAgICBkcmF3ICgpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKysgKSB7XG4gICAgICAgICAgICBmb3IgKCBsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKysgKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8ZGl2IGlkPVwiJyArIGogKyAnLScgKyBpICsgJ1wiIGNsYXNzPVwiY2VsbCB2aXNpdGVkIGNvbXBsZXRlICcgKyB0aGlzLl9jZWxsc1sgaSBdWyBqIF0uZXhpdHMuam9pbiggJyAnICkgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgc3R5bGU9XCJ3aWR0aDogJyArIHRoaXMuY2VsbFNpemUgKyAncHg7IGhlaWdodDogJyArIHRoaXMuY2VsbFNpemUgKyAncHg7XCI+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1hemVcbiAgICAgICAgICAgIC53aWR0aCggdGhpcy53aWR0aCAqIHRoaXMuY2VsbFNpemUgKVxuICAgICAgICAgICAgLmhlaWdodCggdGhpcy5oZWlnaHQgKiB0aGlzLmNlbGxTaXplIClcbiAgICAgICAgICAgIC5hdHRyKCAnZGF0YS13aWR0aCcsIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgLmF0dHIoICdkYXRhLWhlaWdodCcsIHRoaXMuaGVpZ2h0IClcbiAgICAgICAgICAgIC5hcHBlbmQoIG91dHB1dCApLmFkZENsYXNzKCAnZmluaXNoZWQnICk7XG4gICAgfVxufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IE1hemUgZnJvbSAnLi9tYXplJztcbmltcG9ydCBEcmF3IGZyb20gJy4vZHJhdyc7XG5cbnZhciAkY3VycmVudCwgJG5ldywgbmVpZ2hib3JzLCBkaXJlY3Rpb24sIG4sICRtYXplLCBtYXplO1xuXG52YXIgc2F2ZU1hcHBpbmdzID0ge1xuICAgICduJzogJzAnLFxuICAgICduIGUnOiAnMScsXG4gICAgJ24gcyc6ICcyJyxcbiAgICAnbiB3JzogJzMnLFxuICAgICduIGUgcyc6ICc0JyxcbiAgICAnbiBlIHcnOiAnNScsXG4gICAgJ24gcyB3JzogJzYnLFxuICAgICduIGUgcyB3JzogJzcnLFxuICAgICdlJzogJzgnLFxuICAgICdlIHMnOiAnOScsXG4gICAgJ2Ugdyc6ICdBJyxcbiAgICAnZSBzIHcnOiAnQicsXG4gICAgJ3MnOiAnQycsXG4gICAgJ3Mgdyc6ICdEJyxcbiAgICAndyc6ICdFJ1xufTtcblxudmFyIGxvYWRNYXBwaW5ncyA9IHtcbiAgICAnMCc6ICduJyxcbiAgICAnMSc6ICduIGUnLFxuICAgICcyJzogJ24gcycsXG4gICAgJzMnOiAnbiB3JyxcbiAgICAnNCc6ICduIGUgcycsXG4gICAgJzUnOiAnbiBlIHcnLFxuICAgICc2JzogJ24gcyB3JyxcbiAgICAnNyc6ICduIGUgcyB3JyxcbiAgICAnOCc6ICdlJyxcbiAgICAnOSc6ICdlIHMnLFxuICAgICdBJzogJ2UgdycsXG4gICAgJ0InOiAnZSBzIHcnLFxuICAgICdDJzogJ3MnLFxuICAgICdEJzogJ3MgdycsXG4gICAgJ0UnOiAndydcbn07XG5cbnZhciBnZXRTYXZlU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbmlzaGVzID0gJycsIHNhdmVTdHJpbmcgPSBoZWlnaHQgKyAnfCcgKyB3aWR0aCArICd8JyArICRtYXplLmZpbmQoICcuc3RhcnQnICkuYXR0ciggJ2lkJyApICsgJ3wnO1xuXG4gICAgJG1hemUuZmluZCggJy5maW5pc2gnICkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgIGZpbmlzaGVzICs9ICcuJyArICQoIHRoaXMgKS5hdHRyKCAnaWQnICk7XG4gICAgfSApO1xuXG4gICAgc2F2ZVN0cmluZyArPSBmaW5pc2hlcy5zdWJzdHJpbmcoIDEgKSArICc6JztcblxuICAgICRtYXplLmZpbmQoICcuY2VsbCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCggdGhpcyApLCBjbGFzc1N0cmluZyA9ICcnO1xuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICduJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICdlJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICdzJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBzJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICd3JyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyB3JztcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVTdHJpbmcgKz0gc2F2ZU1hcHBpbmdzWyBjbGFzc1N0cmluZy5zdWJzdHJpbmcoIDEgKSBdO1xuICAgIH0gKTtcblxuICAgIHJldHVybiBzYXZlU3RyaW5nO1xufTtcblxudmFyIGxvYWRTYXZlU3RyaW5nID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcgKSB7XG4gICAgdmFyIHN1YlBhcnRzLCBwYXJ0cyA9IHNhdmVTdHJpbmcuc3BsaXQoICc6JyApO1xuICAgIGlmICggcGFydHMubGVuZ3RoICE9PSAyICkge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgTWF6ZSBTdHJpbmcnO1xuICAgIH1cblxuICAgIHN1YlBhcnRzID0gcGFydHNbIDAgXS5zcGxpdCggJ3wnICk7XG4gICAgaWYgKCBzdWJQYXJ0cy5sZW5ndGggIT09IDQgKSB7XG4gICAgICAgIHJldHVybiAnSW52YWxpZCBNYXplIFN0cmluZyc7XG4gICAgfVxuXG4gICAgd2lkdGggPSBwYXJzZUludCggc3ViUGFydHMgWyAxIF0sIDEwICk7XG4gICAgaGVpZ2h0ID0gcGFyc2VJbnQoIHN1YlBhcnRzWyAwIF0sIDEwICk7XG5cbiAgICBpZiAoIGlzTmFOKCB3aWR0aCApIHx8IGlzTmFOKCBoZWlnaHQgKSApIHtcbiAgICAgICAgcmV0dXJuICdJbnZhbGlkIE1hemUgU3RyaW5nJztcbiAgICB9XG5cbiAgICBjbGVhckdyaWQoKTtcbiAgICBkcmF3R3JpZCggaGVpZ2h0LCB3aWR0aCwgXy5wYXJ0aWFsKCBsb2FkRHJhdywgcGFydHNbIDEgXSwgc3ViUGFydHNbIDIgXSwgc3ViUGFydHNbIDMgXS5zcGxpdCggJy4nICkgKSApO1xufTtcblxudmFyIGxvYWREcmF3Q2VsbCA9IGZ1bmN0aW9uKCBzYXZlU3RyaW5nLCBpICkge1xuICAgICQoIHRoaXMgKS5hZGRDbGFzcyggbG9hZE1hcHBpbmdzWyBzYXZlU3RyaW5nLmNoYXJBdCggaSApIF0gKTtcbn1cblxudmFyIGxvYWREcmF3ID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcsIHN0YXJ0SUQsIGZpbmlzaElEcyApIHtcbiAgICAkbWF6ZS5maW5kKCAnLmNlbGwnICkuZWFjaCggXy5wYXJ0aWFsKCBsb2FkRHJhd0NlbGwsIHNhdmVTdHJpbmcgKSApLmFkZENsYXNzKCAndmlzaXRlZCBjb21wbGV0ZScgKTtcbiAgICAkbWF6ZS5maW5kKCAnIycgKyBzdGFydElEICkuYWRkQ2xhc3MoICdzdGFydCcgKTtcblxuICAgIF8uZWFjaCggZmluaXNoSURzLCBmdW5jdGlvbiggaWQgKSB7XG4gICAgICAgICRtYXplLmZpbmQoICcjJyArIGlkICkuYWRkQ2xhc3MoICdmaW5pc2gnICk7XG4gICAgfSApO1xuXG4gICAgZmluYWxpemVNYXplKCk7XG59O1xuXG52YXIgY2xlYXJHcmlkID0gZnVuY3Rpb24oKSB7XG4gICAgJG1hemUuZW1wdHkoKS5yZW1vdmVDbGFzcyggJ2ZpbmlzaGVkJyApO1xufTtcblxuJCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG4gICAgJG1hemUgPSAkKCAnLm1hemUnICk7XG4gICAgbWF6ZSA9IG5ldyBNYXplKCk7XG5cbiAgICAkKCAnLm1hemUtaW5wdXQnICkuaGlkZSgpLmZpcnN0KCkuc2hvdygpO1xuXG4gICAgJCggJyNnZW5lcmF0ZScgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjbGVhckdyaWQoKTtcblxuICAgICAgICBtYXplLmhlaWdodCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtaGVpZ2h0JyApLnZhbCgpLCAxMCApO1xuICAgICAgICBtYXplLndpZHRoID0gcGFyc2VJbnQoICQoICcjZ3JpZC13aWR0aCcgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgbWF6ZS5jZWxsU2l6ZSA9IHBhcnNlSW50KCAkKCAnI2NlbGwtc2l6ZScgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgbWF6ZS5zcGxpdCA9IHBhcnNlSW50KCAkKCAnI21hemUtc3R5bGUnICkudmFsKCksIDEwICk7XG5cbiAgICAgICAgbWF6ZS5nZW5lcmF0ZSgpO1xuICAgICAgICAoIG5ldyBEcmF3KCAkbWF6ZSwgbWF6ZSApICkuZHJhdygpO1xuICAgIH0gKTtcblxuICAgICQoICcjZ3JpZC13aWR0aCcgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGNvbCA9ICQoICcubGFyZ2UtMTIuY29sdW1ucycgKSxcbiAgICAgICAgICAgIGNvbFdpZHRoID0gJGNvbC5pbm5lcldpZHRoKCkgLSAxMDAsXG4gICAgICAgICAgICBncmlkV2lkdGggPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIGlmICggaXNOYU4oIGdyaWRXaWR0aCApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNDAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggZ3JpZFdpZHRoIDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRXaWR0aCApICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI2dyaWQtaGVpZ2h0JyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBncmlkSGVpZ2h0ID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuICAgICAgICBpZiAoIGlzTmFOKCBncmlkSGVpZ2h0ICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBncmlkSGVpZ2h0IDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRIZWlnaHQgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNjZWxsLXNpemUnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNlbGxTaXplID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggaXNOYU4oIGNlbGxTaXplICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBjZWxsU2l6ZSA8IDMgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNlbGxTaXplID4gMzAgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggY2VsbFNpemUgKSApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbFNpemUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIHZhciAkY29sID0gJCggJy5sYXJnZS0xMi5jb2x1bW5zJyApLFxuICAgICAgICAgICAgY29sV2lkdGggPSAkY29sLmlubmVyV2lkdGgoKSAtIDEwMCxcbiAgICAgICAgICAgIGdyaWRXaWR0aCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtd2lkdGgnICkudmFsKCkgKSxcbiAgICAgICAgICAgIGdyaWRIZWlnaHQgPSBwYXJzZUludCggJCggJyNncmlkLWhlaWdodCcgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggZ3JpZFdpZHRoID4gY29sV2lkdGggLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC13aWR0aCcgKS52YWwoIE1hdGguZmxvb3IoIGNvbFdpZHRoIC8gY2VsbFNpemUgKSApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGdyaWRIZWlnaHQgPiA2MDAgLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC1oZWlnaHQnICkudmFsKCBNYXRoLmZsb29yKCA2MDAgLyBjZWxsU2l6ZSApIClcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjbWF6ZS1zdHlsZScgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG5cbiAgICAgICAgaWYoIGlzTmFOKCBzdHlsZSApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNTAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggc3R5bGUgPCAwICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBzdHlsZSA+IDEwMCApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDEwMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggc3R5bGUgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNxbWFyaycgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdXBkYXRlcyA9ICQoICcjdXBkYXRlcycgKTtcblxuICAgICAgICBpZiAoICR1cGRhdGVzLmhhc0NsYXNzKCAnZXhwYW5kZWQnICkgKSB7XG4gICAgICAgICAgICAkdXBkYXRlcy5zdG9wKCB0cnVlLCB0cnVlICkucmVtb3ZlQ2xhc3MoICdleHBhbmRlZCcgKS5hbmltYXRlKCB7ICdyaWdodCc6ICctNTMwcHgnIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR1cGRhdGVzLnN0b3AoIHRydWUsIHRydWUgKS5hZGRDbGFzcyggJ2V4cGFuZGVkJyApLmFuaW1hdGUoIHsgJ3JpZ2h0JzogJzVweCcgfSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN0b2dnbGUtaGVhdG1hcCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLGo7XG4gICAgICAgIGlmICggbWF6ZS5oZWF0cy5sZW5ndGggKSB7XG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IG1hemUuaGVhdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgbWF6ZS5oZWF0c1sgaSBdLnJlbW92ZUNsYXNzKCAnZGlzdGFuY2UtJyArIGkgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGVhdHMgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTAnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTEnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTInICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtM1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTMnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTQnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTUnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTYnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtN1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTcnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTgnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTknICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMTBcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0xMCcgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN6b29tLW91dCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPD0gNSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgLSAyO1xuICAgICAgICAkKCAnLmNlbGwnICkuY3NzKCB7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkbWF6ZS53aWR0aCggY2VsbFNpemUgKiBwYXJzZUludCggJG1hemUuYXR0ciggJ2RhdGEtd2lkdGgnICksIDEwICkgKS5oZWlnaHQoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLWhlaWdodCcgKSwgMTAgKSApO1xuICAgIH0gKTtcblxuICAgICQoICcjem9vbS1pbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPj0gOTggKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplICsgMjtcbiAgICAgICAgJCggJy5jZWxsJyApLmNzcygge1xuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgJG1hemUud2lkdGgoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLXdpZHRoJyApLCAxMCApICkuaGVpZ2h0KCBjZWxsU2l6ZSAqIHBhcnNlSW50KCAkbWF6ZS5hdHRyKCAnZGF0YS1oZWlnaHQnICksIDEwICkgKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI3NhdmUtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggJG1hemUuaGFzQ2xhc3MoICdmaW5pc2hlZCcgKSApIHtcbiAgICAgICAgICAgICQoICcjbWF6ZS1zYXZlc3RyaW5nJyApLnZhbCggZ2V0U2F2ZVN0cmluZygpICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoICdHZW5lcmF0ZSBvciBsb2FkIGEgbWF6ZSBmaXJzdCEnICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI2xvYWQtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvYWRTYXZlU3RyaW5nKCAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoKSApO1xuICAgIH0pXG5cbiAgICAkKCAnI2lvLWJ1dHRvbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAnc2Vjb25kYXJ5JyApICkge1xuICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoICdzZWNvbmRhcnknICk7XG4gICAgICAgICAgICAkKCAnLm1hemUtaW5wdXQnICkuaGlkZSgpLmZpbHRlciggJyNtYXplLWlvJyApLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCAnc2Vjb25kYXJ5JyApO1xuICAgICAgICAgICAgJCggJy5tYXplLWlucHV0JyApLmhpZGUoKS5maXJzdCgpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoIHdpbmRvdyApLnJlc2l6ZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSAwO1xuXG4gICAgICAgICQoICdib2R5ID4gLnJvdzpub3QoLm1jLXJvdyknKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhlaWdodCArPSAkKCB0aGlzICkuaGVpZ2h0KCk7XG4gICAgICAgIH0gKVxuXG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuaGVpZ2h0KCAkKCB0aGlzICkuaGVpZ2h0KCkgLSBoZWlnaHQgLSAzMCApO1xuICAgIH0gKS5yZXNpemUoKTtcblxuICAgICQoICcjZW50ZXItcHJpbnRtb2RlJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgJCggJ2JvZHknICkuYWRkQ2xhc3MoICdwcmludC1tb2RlJyApO1xuICAgICAgICAkKCAnI21hemUtY29udGFpbmVyJyApLmF0dHIoICdkYXRhLXN0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnc3R5bGUnICkgKS5hdHRyKCAnc3R5bGUnLCAnJyApO1xuICAgIH0gKTtcblxuICAgICQoICcjZXhpdC1wcmludG1vZGUnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCAnYm9keScgKS5yZW1vdmVDbGFzcyggJ3ByaW50LW1vZGUnICk7XG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuYXR0ciggJ3N0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnZGF0YS1zdHlsZScgKSApO1xuICAgIH0gKTtcbn0gKTtcbiIsImltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxuY29uc3QgZGlyZWN0aW9ucyA9IHtcbiAgICBMT09LVVA6IHtcbiAgICAgICAgTk9SVEg6IDAsXG4gICAgICAgIFNPVVRIOiAxLFxuICAgICAgICBFQVNUOiAyLFxuICAgICAgICBXRVNUOiAzLFxuICAgICAgICBVUDogNCxcbiAgICAgICAgRE9XTjogNVxuICAgIH0sXG5cbiAgICBJTlZFUlNFX0xPT0tVUDoge1xuICAgICAgICAwOiAxLFxuICAgICAgICAxOiAwLFxuICAgICAgICAyOiAzLFxuICAgICAgICAzOiAyLFxuICAgICAgICA0OiA1LFxuICAgICAgICA1OiA0XG4gICAgfSxcblxuICAgIEVOQ09ERUQ6IHtcbiAgICAgICAgMDogJ24nLFxuICAgICAgICAxOiAncycsXG4gICAgICAgIDI6ICdlJyxcbiAgICAgICAgMzogJ3cnLFxuICAgICAgICA0OiAndScsXG4gICAgICAgIDU6ICdkJ1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGRpcmVjdGlvbnMgfTtcblxuLyoqXG4gKiBBIG1hemUgZ2VuZXJhdGlvbiBjbGFzcyB0aGF0IHdpbGwgZ2VuZXJhdGUgYSBtYXplIG9mIGhlaWdodCBieSB3aWR0aCBjZWxsc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgdHdvIGRpbWVuc2lvbmFsIGFycmF5IGNvbnRhaW5pbmcgY2VsbCBkZWZpbml0aW9uc1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcG9wdWxhdGVDZWxscyAoKSB7XG4gICAgICAgIHRoaXMuX2NlbGxzID0gW107XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKyApIHtcbiAgICAgICAgICAgIHRoaXMuX2NlbGxzLnB1c2goIFtdICk7XG5cbiAgICAgICAgICAgIGZvciAoIGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jZWxsc1sgaSBdLnB1c2goIHtcbiAgICAgICAgICAgICAgICAgICAgeDogaixcbiAgICAgICAgICAgICAgICAgICAgeTogaSxcbiAgICAgICAgICAgICAgICAgICAgZXhpdHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBsaW5rZWRDZWxsczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc3RhcnRpbmcgeCBwb3NpdGlvbiwgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gMCBhbmQgbWF6ZSB3aWR0aFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0U3RhcnRYUG9zICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBzdGFydGluZyB5IHBvc2l0aW9uLCBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAwIGFuZCBtYXplIGhlaWdodFxuICAgICAqL1xuICAgIF9nZXRTdGFydFlQb3MgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0ICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG5vZGUgdG8gYWN0IGFzIGhlYWQgbm9kZSBmb3IgZ2VuZXJhdGlvbiwgd2lsbCBlaXRoZXIgc2VsZWN0IGEgbm9kZSBhdFxuICAgICAqIHJhbmRvbSwgb3IgdGhlIGxhc3QgYWRkZWQgbm9kZVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmV0dXJuICB7TnVtYmVyfSAgICB0aGUgaW5kZXggb2YgdGhlIG5ldyBoZWFkIG5vZGUgdG8gdXNlXG4gICAgICovXG4gICAgX2dldEhlYWROb2RlICgpIHtcbiAgICAgICAgLy8gR2V0IGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDAgLSA5OVxuICAgICAgICB2YXIgbiA9IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiAxMDAgKTtcblxuICAgICAgICAvLyBJZiB0aGUgcmFuZG9tIG51bWJlciBpcyBsZXNzIHRoYW4gdGhlIHNwbGl0IG1vZGlmaWVyLFxuICAgICAgICAvLyBzZWxlY3QgYW4gZXhpc3Rpbmcgbm9kZSAoIHdpbGwgY2F1c2UgYSB0cmVuZCB0b3dhcmRzIGRlYWQgZW5kcyApXG4gICAgICAgIGlmICggbiA8IHRoaXMuc3BsaXQgKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMuX2FjdGl2ZVNldC5sZW5ndGggKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2VsZWN0IHRoZSBsYXN0IGFkZGVkIG5vZGVcbiAgICAgICAgLy8gKCB3aWxsIGNhdXNlIGEgdHJlbmQgdG93YXJkcyB3aW5kaW5nIHRyYWlscyApXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbiA9IHRoaXMuX2FjdGl2ZVNldC5sZW5ndGggLSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcmUgdGhlIHVudmlzdGVkIGNlbGwgaW4gdGhlIHJlc3VsdCBhcnJheVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGNlbGwgICAgICAtIHRoZSBjZWxsIHRvIHN0b3JlXG4gICAgICogQHBhcmFtICB7QXJyYXl9ICByZXN1bHQgICAgLSB0aGUgYXJyYXkgb2Ygc3RvcmVkLCB1bnZpc3RlZCBjZWxsc1xuICAgICAqIEBwYXJhbSAge051bWJlcn0gZGlyZWN0aW9uIC0gdGhlIGRpcmVjdGlvbiBvZiB0aGUgdW52aXN0ZWQgY2VsbFxuICAgICAqL1xuICAgIF9zdG9yZVVudmlzaXRlZENlbGwoIGNlbGwsIHJlc3VsdCwgZGlyZWN0aW9uICkge1xuICAgICAgICBpZiAoICFjZWxsLnZpc2l0ZWQgKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCggeyBjZWxsOiBjZWxsLCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9ICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2NhdGUgYW5kIHN0b3JlIHVudmlzdGVkIGNlbGxzIGNvbm5lY3RlZCB0byB0aGUgY3VycmVudCBjZWxsXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSAge09iamVjdH0gY2VsbCAgICAtIHRoZSBjZWxsIHRvIGxvY2F0ZSBuZWlnaGJvcnMgb2ZcbiAgICAgKiBAcmV0dXJuIHtBcnJheXxib29sZWFufSAgQW4gYXJyYXkgb2YgdW52aXN0ZWQgY2VsbHMsIG9yIGZhbHNlIGlmIHRoZXJlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIGFyZSBubyB1bnZpc2l0ZWQgY2VsbHNcbiAgICAgKi9cbiAgICBfZ2V0VW52aXNpdGVkTmVpZ2hib3JzICggY2VsbCApIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgIC8vIE5vcnRoXG4gICAgICAgIGlmICggY2VsbC55ICE9PSAwICkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVVbnZpc2l0ZWRDZWxsKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NlbGxzWyBjZWxsLnkgLSAxIF1bIGNlbGwueCBdLFxuICAgICAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLkxPT0tVUC5OT1JUSFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlc3RcbiAgICAgICAgaWYgKCBjZWxsLnggIT09IDAgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoXG4gICAgICAgICAgICAgICAgdGhpcy5fY2VsbHNbIGNlbGwueSBdWyBjZWxsLnggLSAxIF0sXG4gICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuTE9PS1VQLldFU1RcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb3V0aFxuICAgICAgICBpZiAoIGNlbGwueSAhPT0gdGhpcy5oZWlnaHQgLSAxICkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVVbnZpc2l0ZWRDZWxsKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NlbGxzWyBjZWxsLnkgKyAxIF1bIGNlbGwueCBdLFxuICAgICAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLkxPT0tVUC5TT1VUSFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVhc3RcbiAgICAgICAgaWYgKCBjZWxsLnggIT09IHRoaXMud2lkdGggLSAxICkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVVbnZpc2l0ZWRDZWxsKFxuICAgICAgICAgICAgICAgIHRoaXMuX2NlbGxzWyBjZWxsLnkgXVsgY2VsbC54ICsgMSBdLFxuICAgICAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLkxPT0tVUC5FQVNUXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm8gdW52aXNpdGVkIGNlbGxzXG4gICAgICAgIGlmICggcmVzdWx0Lmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIGNlbGwuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSB0aGUgbWF6ZVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2VuZXJhdGUgKCkge1xuICAgICAgICB2YXIgY3VycmVudCwgbmV4dCwgbmVpZ2hib3JzLCBuO1xuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIGFyZSBjZWxscyB0aGF0IGFyZSBzdGlsbCBcImFjdGl2ZVwiXG4gICAgICAgIHdoaWxlICggdGhpcy5fYWN0aXZlU2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgIG4gPSB0aGlzLl9nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgY3VycmVudCA9IHRoaXMuX2FjdGl2ZVNldFsgbiBdO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGNlbGwgaXMgdGhlIGZ1cnRoZXN0LCBvciB0aWVkIGZvciB0aGUgZnVydGhlc3QsXG4gICAgICAgICAgICAvLyBmcm9tIHN0YXJ0LCBzdG9yZSBpdFxuICAgICAgICAgICAgaWYgKCB0aGlzLl9tYXhEaXN0YW5jZSA8PSBjdXJyZW50LmRpc3RhbmNlICkge1xuXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIG5ldyBmdXJ0aGVzdCBkaXN0YW5jZVxuICAgICAgICAgICAgICAgIHRoaXMuX21heERpc3RhbmNlID0gY3VycmVudC5kaXN0YW5jZTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHdlIGFscmVhZHkgaGFkIGEgY2VsbCBmb3VuZCBhdCB0aGlzIGRpc3RhbmNlLCBqdXN0XG4gICAgICAgICAgICAgICAgLy8gcHVzaCBpdCBvbnRvIGZ1cnRoZXN0Q2VsbHNcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMuX21heERpc3RhbmNlID09PSBjdXJyZW50LmRpc3RhbmNlICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mdXJ0aGVzdENlbGxzLnB1c2goIGN1cnJlbnQgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY3JlYXRlIGEgbmV3IGFycmF5IHdpdGggdGhpcyBjZWxsXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Z1cnRoZXN0Q2VsbHMgPSBbIGN1cnJlbnQgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5laWdoYm9ycyA9IHRoaXMuX2dldFVudmlzaXRlZE5laWdoYm9ycyggY3VycmVudCApO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgdW52aXNpdGVkIG5laWdoYm9ycywgc2VsZWN0IG9uZSB0byBjcmVhdGUgYSBsaW5rIHRvXG4gICAgICAgICAgICAvLyBmcm9tIHRoaXMgY2VsbFxuICAgICAgICAgICAgaWYgKCBuZWlnaGJvcnMgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBQaWNrIG9uZSBuZWlnaGJvciBhdCByYW5kb21cbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IFRoaXMgd291bGQgYmUgYSBnb29kIHNwb3QgdG8gbW9kaWZ5IHRoZSBhbGdvcml0aG1cbiAgICAgICAgICAgICAgICAvLyB0byBhbGxvdyBmb3IgZGlyZWN0aW9uYWwgd2FuZGVyaW5nLCBpZTogZmF2b3JpbmcgZWFzdC93ZXN0XG4gICAgICAgICAgICAgICAgLy8gbW92ZW1lbnQgdG8gbm9ydGgvc291dGhcbiAgICAgICAgICAgICAgICBuZXh0ID0gbmVpZ2hib3JzWyBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogbmVpZ2hib3JzLmxlbmd0aCApIF07XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGN1cnJlbnQgY2VsbCB0byBoYXZlIGFuIGV4aXQgdG8gdGhlIG5laWdoYm9yXG4gICAgICAgICAgICAgICAgY3VycmVudC5leGl0cy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLkVOQ09ERURbIG5leHQuZGlyZWN0aW9uIF1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGN1cnJlbnQubGlua2VkQ2VsbHNbIG5leHQuZGlyZWN0aW9uIF0gPSBuZXh0O1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBuZWlnaGJvciBjZWxsIHRvIGhhdmUgYW4gZXhpdCB0byB0aGlzIGNlbGxcbiAgICAgICAgICAgICAgICBuZXh0LmNlbGwuZXhpdHMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5FTkNPREVEWyBkaXJlY3Rpb25zLklOVkVSU0VfTE9PS1VQWyBuZXh0LmRpcmVjdGlvbiBdIF1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIG5leHQuY2VsbC5saW5rZWRDZWxsc1sgZGlyZWN0aW9ucy5JTlZFUlNFX0xPT0tVUFsgbmV4dC5kaXJlY3Rpb24gXSAgXSA9IGN1cnJlbnQ7XG5cbiAgICAgICAgICAgICAgICAvLyBTdG9yZSB0aGUgZGlzdGFuY2Ugb2YgdGhpcyBjZWxsIGZyb20gdGhlIHN0YXJ0aW5nIGNlbGxcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGp1c3QgYSBzdGF0aXN0aWMgYW5kIGRvZXNuJ3QgY3VycmVudCBoYXZlIGFuXG4gICAgICAgICAgICAgICAgLy8gaW1wYWN0IG9uIHRoZSBldmFsdWF0aW9uIG9mIHRoZSBhbGdvcml0aG1cbiAgICAgICAgICAgICAgICBuZXh0LmNlbGwuZGlzdGFuY2UgPSBjdXJyZW50LmRpc3RhbmNlICsgMTtcblxuICAgICAgICAgICAgICAgIC8vIFRyYWNrIHRoYXQgdGhpcyBjZWxsIGhhcyBiZWVuIHZpc2l0ZWQsIHRoYXQgaXMsIGl0IGlzXG4gICAgICAgICAgICAgICAgLy8gYWNjZXNzaWJsZSBmcm9tIGFub3RoZXIgY2VsbCBpbiB0aGUgbWF6ZVxuICAgICAgICAgICAgICAgIG5leHQuY2VsbC52aXNpdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIFB1c2ggdGhpcyBjZWxsIG9udG8gdGhlIGFycmF5IG9mIGNlbGxzIHRoYXQgYXJlIHBvdGVudGlhbFxuICAgICAgICAgICAgICAgIC8vIG5ldyBoZWFkIG5vZGVzIHRvIGNvbnRpbnVlIGdlbmVyYXRpbmcgdGhlIG1hemUgZnJvbVxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVNldC5wdXNoKCBuZXh0LmNlbGwgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnNwbGljZSggbiwgMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKCBvcHRpb25zID0ge30gKSB7XG4gICAgICAgIHRoaXMuc3BsaXQgPSBvcHRpb25zLnNwbGl0IHx8IDA7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgfHwgMjA7XG4gICAgICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoIHx8IDUwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBtYXplIGZyb20gdGhlIHByb3ZpZGVkIHN0YXJ0aW5nIHgseSBwb3NpdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBzdGFydFggIC0gdGhlIHggcG9zaXRpb24gb2YgdGhlIHN0YXJ0aW5nIGNlbGxcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHN0YXJ0WSAgLSB0aGUgeSBwb3NpdGlvbiBvZiB0aGUgc3RhcnRpbmcgY2VsbFxuICAgICAqL1xuICAgIGdlbmVyYXRlKCBzdGFydFgsIHN0YXJ0WSApIHtcbiAgICAgICAgdmFyIGN1cnJlbnQ7XG5cbiAgICAgICAgdGhpcy5fcG9wdWxhdGVDZWxscygpO1xuXG4gICAgICAgIHRoaXMuX21heERpc3RhbmNlID0gMDtcbiAgICAgICAgdGhpcy5fZnVydGhlc3RDZWxscyA9IFtdO1xuICAgICAgICB0aGlzLl9hY3RpdmVTZXQgPSBbXTtcblxuICAgICAgICBpZiAoIHN0YXJ0WCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgc3RhcnRYID0gdGhpcy5fZ2V0U3RhcnRYUG9zKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHN0YXJ0WSA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgc3RhcnRZID0gdGhpcy5fZ2V0U3RhcnRZUG9zKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdGFydGluZ0NlbGwgPSBjdXJyZW50ID0gdGhpcy5fY2VsbHNbIHN0YXJ0WSBdWyBzdGFydFggXTtcbiAgICAgICAgY3VycmVudC5kaXN0YW5jZSA9IDA7XG4gICAgICAgIGN1cnJlbnQudmlzaXRlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnB1c2goIGN1cnJlbnQgKTtcblxuICAgICAgICB0aGlzLl9nZW5lcmF0ZSgpO1xuICAgIH1cblxuICAgIGdldCBmdXJ0aGVzdENlbGxzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1cnRoZXN0Q2VsbHM7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXJ0aW5nQ2VsbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFydGluZ0NlbGw7XG4gICAgfVxuXG4gICAgZ2V0IGNlbGxzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxzO1xuICAgIH1cbn1cbiJdfQ==
