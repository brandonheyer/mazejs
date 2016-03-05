(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

        this.saveOptions(options);
    }

    /**
     * Save options for this generator
     *
     * @param  {Object} options - a Generator options object
     */


    _createClass(_class, [{
        key: 'saveOptions',
        value: function saveOptions() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            this.split = options.split || this.split || 0;
            this.height = options.height || this.height || 20;
            this.width = options.width || this.width || 50;
            this.startX = options.startX || this.startX || this._getStartXPos();
            this.startY = options.startY || this.startY || this._getStartYPos();
        }

        /**
         * Generate the maze from the provided starting x,y position
         *
         * @param  {Object} options - a Generator options object
         */

    }, {
        key: 'generate',
        value: function generate() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var current;

            this.saveOptions(options);

            this._populateCells();

            this._maxDistance = 0;
            this._furthestCells = [];
            this._activeSet = [];

            this._startingCell = current = this._cells[this.startY][this.startX];
            current.distance = 0;
            current.visited = true;

            this._activeSet.push(current);

            this._generate();
        }
    }, {
        key: 'getCell',
        value: function getCell(x, y) {
            return this._cells[y][x];
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

},{"jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Traverser2 = require('./Traverser');

var _Traverser3 = _interopRequireDefault(_Traverser2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_Traverser) {
    _inherits(_class, _Traverser);

    function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
        key: 'saveOptions',
        value: function saveOptions(options) {
            _get(Object.getPrototypeOf(_class.prototype), 'saveOptions', this).call(this, options);

            this._cells = '';
            this._$maze = options.$maze;
            this._cellSize = options.cellSize || 10;
        }
    }, {
        key: 'traversalStart',
        value: function traversalStart(maze) {
            this._$maze.empty().width(maze.width * this._cellSize).height(maze.height * this._cellSize);
        }
    }, {
        key: 'traversalCell',
        value: function traversalCell(cell) {
            this._cells += ' <div id="' + cell.x + '-' + cell.y + '" class="cell visited complete ' + cell.exits.join(' ') + '" style="width: ' + this._cellSize + 'px; height: ' + this._cellSize + 'px;"></div>';
        }
    }, {
        key: 'traversalComplete',
        value: function traversalComplete(maze) {
            this._$maze.append(this._cells).addClass('finished');
        }
    }]);

    return _class;
}(_Traverser3.default);

exports.default = _class;

},{"./Traverser":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    _createClass(_class, [{
        key: '_storeCallback',
        value: function _storeCallback(property, options) {
            if (_underscore2.default.isFunction(options[property])) {
                this._callbacks[property] = options[property];
            } else {
                this._callbacks[property] = this[property];
            }
        }
    }]);

    function _class(options) {
        _classCallCheck(this, _class);

        this._callbacks = {};
        this.saveOptions(options || this.options);
    }

    _createClass(_class, [{
        key: 'saveOptions',
        value: function saveOptions(options) {
            this._maze = options.maze;

            if (!this._maze) {
                throw new Error('Must specify a maze to traverse');
            }

            this._storeCallback('traversalStart', options);
            this._storeCallback('traversalComplete', options);
            this._storeCallback('traversalCell', options);
        }
    }, {
        key: 'traverse',
        value: function traverse() {
            this._callbacks.traversalStart.call(this, this._maze, this);

            for (var y = 0; y < this._maze.height; y++) {
                for (var x = 0; x < this._maze.width; x++) {
                    this._callbacks.traversalCell.call(this, this._maze.getCell(x, y), this);
                }
            }

            this._callbacks.traversalComplete.call(this, this._maze, this);
        }
    }, {
        key: 'traversalStart',
        value: function traversalStart(maze, traverser) {}
    }, {
        key: 'traversalComplete',
        value: function traversalComplete(maze, traverser) {}
    }, {
        key: 'traversalCell',
        value: function traversalCell(cell, traverser) {}
    }, {
        key: 'options',
        get: function get() {
            return {
                traversalStart: this.traversalStart,
                traversalComplete: this.traversalComplete,
                traversalCell: this.traversalCell
            };
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"underscore":"underscore"}],4:[function(require,module,exports){
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _labyrinth = require('./labyrinth');

var labyrinth = _interopRequireWildcard(_labyrinth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Generator = labyrinth.Generator,
    Traverser = labyrinth.DivTraverser;

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
    maze = new Generator();

    (0, _jquery2.default)('.maze-input').hide().first().show();

    (0, _jquery2.default)('#generate').click(function (event) {
        event.preventDefault();
        clearGrid();

        maze.height = parseInt((0, _jquery2.default)('#grid-height').val(), 10);
        maze.width = parseInt((0, _jquery2.default)('#grid-width').val(), 10);
        maze.cellSize = parseInt((0, _jquery2.default)('#cell-size').val(), 10);
        maze.split = parseInt((0, _jquery2.default)('#maze-style').val(), 10);

        maze.generate();
        new Traverser({
            maze: maze,
            $maze: $maze,
            cellSize: parseInt((0, _jquery2.default)('#cell-size').val(), 10)
        }).traverse();
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

},{"./labyrinth":5,"jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DivTraverser = exports.Traverser = exports.Generator = undefined;

var _Generator = require('./Generator');

var _Generator2 = _interopRequireDefault(_Generator);

var _Traverser = require('./Traverser');

var _Traverser2 = _interopRequireDefault(_Traverser);

var _TraverserHTMLDiv = require('./Traverser-HTML-Div');

var _TraverserHTMLDiv2 = _interopRequireDefault(_TraverserHTMLDiv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Generator = _Generator2.default;
exports.Traverser = _Traverser2.default;
exports.DivTraverser = _TraverserHTMLDiv2.default;

},{"./Generator":1,"./Traverser":3,"./Traverser-HTML-Div":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvR2VuZXJhdG9yLmpzIiwic3JjL1RyYXZlcnNlci1IVE1MLURpdi5qcyIsInNyYy9UcmF2ZXJzZXIuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbGFieXJpbnRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDR0EsSUFBTSxhQUFhO0FBQ2YsWUFBUTtBQUNKLGVBQU8sQ0FBUDtBQUNBLGVBQU8sQ0FBUDtBQUNBLGNBQU0sQ0FBTjtBQUNBLGNBQU0sQ0FBTjtBQUNBLFlBQUksQ0FBSjtBQUNBLGNBQU0sQ0FBTjtLQU5KOztBQVNBLG9CQUFnQjtBQUNaLFdBQUcsQ0FBSDtBQUNBLFdBQUcsQ0FBSDtBQUNBLFdBQUcsQ0FBSDtBQUNBLFdBQUcsQ0FBSDtBQUNBLFdBQUcsQ0FBSDtBQUNBLFdBQUcsQ0FBSDtLQU5KOztBQVNBLGFBQVM7QUFDTCxXQUFHLEdBQUg7QUFDQSxXQUFHLEdBQUg7QUFDQSxXQUFHLEdBQUg7QUFDQSxXQUFHLEdBQUg7QUFDQSxXQUFHLEdBQUg7QUFDQSxXQUFHLEdBQUg7S0FOSjtDQW5CRTs7UUE2Qkc7Ozs7Ozs7Ozs7Ozs7Ozt5Q0FXYTtBQUNkLGlCQUFLLE1BQUwsR0FBYyxFQUFkLENBRGM7O0FBR2QsaUJBQU0sSUFBSSxJQUFJLENBQUosRUFBTyxJQUFJLEtBQUssTUFBTCxFQUFhLEdBQWxDLEVBQXdDO0FBQ3BDLHFCQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWtCLEVBQWxCLEVBRG9DOztBQUdwQyxxQkFBTSxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksS0FBSyxLQUFMLEVBQVksR0FBakMsRUFBdUM7QUFDbkMseUJBQUssTUFBTCxDQUFhLENBQWIsRUFBaUIsSUFBakIsQ0FBdUI7QUFDbkIsMkJBQUcsQ0FBSDtBQUNBLDJCQUFHLENBQUg7QUFDQSwr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Ozs7Ozs7OztRQ3BIUztRQUFXO1FBQVciLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG5jb25zdCBkaXJlY3Rpb25zID0ge1xuICAgIExPT0tVUDoge1xuICAgICAgICBOT1JUSDogMCxcbiAgICAgICAgU09VVEg6IDEsXG4gICAgICAgIEVBU1Q6IDIsXG4gICAgICAgIFdFU1Q6IDMsXG4gICAgICAgIFVQOiA0LFxuICAgICAgICBET1dOOiA1XG4gICAgfSxcblxuICAgIElOVkVSU0VfTE9PS1VQOiB7XG4gICAgICAgIDA6IDEsXG4gICAgICAgIDE6IDAsXG4gICAgICAgIDI6IDMsXG4gICAgICAgIDM6IDIsXG4gICAgICAgIDQ6IDUsXG4gICAgICAgIDU6IDRcbiAgICB9LFxuXG4gICAgRU5DT0RFRDoge1xuICAgICAgICAwOiAnbicsXG4gICAgICAgIDE6ICdzJyxcbiAgICAgICAgMjogJ2UnLFxuICAgICAgICAzOiAndycsXG4gICAgICAgIDQ6ICd1JyxcbiAgICAgICAgNTogJ2QnXG4gICAgfVxufTtcblxuZXhwb3J0IHsgZGlyZWN0aW9ucyB9O1xuXG4vKipcbiAqIEEgbWF6ZSBnZW5lcmF0aW9uIGNsYXNzIHRoYXQgd2lsbCBnZW5lcmF0ZSBhIG1hemUgb2YgaGVpZ2h0IGJ5IHdpZHRoIGNlbGxzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIHRoZSB0d28gZGltZW5zaW9uYWwgYXJyYXkgY29udGFpbmluZyBjZWxsIGRlZmluaXRpb25zXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9wb3B1bGF0ZUNlbGxzICgpIHtcbiAgICAgICAgdGhpcy5fY2VsbHMgPSBbXTtcblxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrICkge1xuICAgICAgICAgICAgdGhpcy5fY2VsbHMucHVzaCggW10gKTtcblxuICAgICAgICAgICAgZm9yICggbGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NlbGxzWyBpIF0ucHVzaCgge1xuICAgICAgICAgICAgICAgICAgICB4OiBqLFxuICAgICAgICAgICAgICAgICAgICB5OiBpLFxuICAgICAgICAgICAgICAgICAgICBleGl0czogW10sXG4gICAgICAgICAgICAgICAgICAgIGxpbmtlZENlbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IC0xLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBzdGFydGluZyB4IHBvc2l0aW9uLCBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiAwIGFuZCBtYXplIHdpZHRoXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRTdGFydFhQb3MgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGggKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHN0YXJ0aW5nIHkgcG9zaXRpb24sIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDAgYW5kIG1hemUgaGVpZ2h0XG4gICAgICovXG4gICAgX2dldFN0YXJ0WVBvcyAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogdGhpcy5oZWlnaHQgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbm9kZSB0byBhY3QgYXMgaGVhZCBub2RlIGZvciBnZW5lcmF0aW9uLCB3aWxsIGVpdGhlciBzZWxlY3QgYSBub2RlIGF0XG4gICAgICogcmFuZG9tLCBvciB0aGUgbGFzdCBhZGRlZCBub2RlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZXR1cm4gIHtOdW1iZXJ9ICAgIHRoZSBpbmRleCBvZiB0aGUgbmV3IGhlYWQgbm9kZSB0byB1c2VcbiAgICAgKi9cbiAgICBfZ2V0SGVhZE5vZGUgKCkge1xuICAgICAgICAvLyBHZXQgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gMCAtIDk5XG4gICAgICAgIHZhciBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIDEwMCApO1xuXG4gICAgICAgIC8vIElmIHRoZSByYW5kb20gbnVtYmVyIGlzIGxlc3MgdGhhbiB0aGUgc3BsaXQgbW9kaWZpZXIsXG4gICAgICAgIC8vIHNlbGVjdCBhbiBleGlzdGluZyBub2RlICggd2lsbCBjYXVzZSBhIHRyZW5kIHRvd2FyZHMgZGVhZCBlbmRzIClcbiAgICAgICAgaWYgKCBuIDwgdGhpcy5zcGxpdCApIHtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogdGhpcy5fYWN0aXZlU2V0Lmxlbmd0aCApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzZWxlY3QgdGhlIGxhc3QgYWRkZWQgbm9kZVxuICAgICAgICAvLyAoIHdpbGwgY2F1c2UgYSB0cmVuZCB0b3dhcmRzIHdpbmRpbmcgdHJhaWxzIClcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuID0gdGhpcy5fYWN0aXZlU2V0Lmxlbmd0aCAtIDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSB0aGUgdW52aXN0ZWQgY2VsbCBpbiB0aGUgcmVzdWx0IGFycmF5XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSAge09iamVjdH0gY2VsbCAgICAgIC0gdGhlIGNlbGwgdG8gc3RvcmVcbiAgICAgKiBAcGFyYW0gIHtBcnJheX0gIHJlc3VsdCAgICAtIHRoZSBhcnJheSBvZiBzdG9yZWQsIHVudmlzdGVkIGNlbGxzXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBkaXJlY3Rpb24gLSB0aGUgZGlyZWN0aW9uIG9mIHRoZSB1bnZpc3RlZCBjZWxsXG4gICAgICovXG4gICAgX3N0b3JlVW52aXNpdGVkQ2VsbCggY2VsbCwgcmVzdWx0LCBkaXJlY3Rpb24gKSB7XG4gICAgICAgIGlmICggIWNlbGwudmlzaXRlZCApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCB7IGNlbGw6IGNlbGwsIGRpcmVjdGlvbjogZGlyZWN0aW9uIH0gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvY2F0ZSBhbmQgc3RvcmUgdW52aXN0ZWQgY2VsbHMgY29ubmVjdGVkIHRvIHRoZSBjdXJyZW50IGNlbGxcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBjZWxsICAgIC0gdGhlIGNlbGwgdG8gbG9jYXRlIG5laWdoYm9ycyBvZlxuICAgICAqIEByZXR1cm4ge0FycmF5fGJvb2xlYW59ICBBbiBhcnJheSBvZiB1bnZpc3RlZCBjZWxscywgb3IgZmFsc2UgaWYgdGhlcmVcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlIG5vIHVudmlzaXRlZCBjZWxsc1xuICAgICAqL1xuICAgIF9nZXRVbnZpc2l0ZWROZWlnaGJvcnMgKCBjZWxsICkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgLy8gTm9ydGhcbiAgICAgICAgaWYgKCBjZWxsLnkgIT09IDAgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoXG4gICAgICAgICAgICAgICAgdGhpcy5fY2VsbHNbIGNlbGwueSAtIDEgXVsgY2VsbC54IF0sXG4gICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuTE9PS1VQLk5PUlRIXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2VzdFxuICAgICAgICBpZiAoIGNlbGwueCAhPT0gMCApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JlVW52aXNpdGVkQ2VsbChcbiAgICAgICAgICAgICAgICB0aGlzLl9jZWxsc1sgY2VsbC55IF1bIGNlbGwueCAtIDEgXSxcbiAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9ucy5MT09LVVAuV0VTVFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvdXRoXG4gICAgICAgIGlmICggY2VsbC55ICE9PSB0aGlzLmhlaWdodCAtIDEgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoXG4gICAgICAgICAgICAgICAgdGhpcy5fY2VsbHNbIGNlbGwueSArIDEgXVsgY2VsbC54IF0sXG4gICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuTE9PS1VQLlNPVVRIXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRWFzdFxuICAgICAgICBpZiAoIGNlbGwueCAhPT0gdGhpcy53aWR0aCAtIDEgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoXG4gICAgICAgICAgICAgICAgdGhpcy5fY2VsbHNbIGNlbGwueSBdWyBjZWxsLnggKyAxIF0sXG4gICAgICAgICAgICAgICAgcmVzdWx0LFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuTE9PS1VQLkVBU1RcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBObyB1bnZpc2l0ZWQgY2VsbHNcbiAgICAgICAgaWYgKCByZXN1bHQubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgY2VsbC5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIHRoZSBtYXplXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZW5lcmF0ZSAoKSB7XG4gICAgICAgIHZhciBjdXJyZW50LCBuZXh0LCBuZWlnaGJvcnMsIG47XG5cbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgYXJlIGNlbGxzIHRoYXQgYXJlIHN0aWxsIFwiYWN0aXZlXCJcbiAgICAgICAgd2hpbGUgKCB0aGlzLl9hY3RpdmVTZXQubGVuZ3RoICkge1xuICAgICAgICAgICAgbiA9IHRoaXMuX2dldEhlYWROb2RlKCk7XG4gICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5fYWN0aXZlU2V0WyBuIF07XG5cbiAgICAgICAgICAgIC8vIElmIHRoaXMgY2VsbCBpcyB0aGUgZnVydGhlc3QsIG9yIHRpZWQgZm9yIHRoZSBmdXJ0aGVzdCxcbiAgICAgICAgICAgIC8vIGZyb20gc3RhcnQsIHN0b3JlIGl0XG4gICAgICAgICAgICBpZiAoIHRoaXMuX21heERpc3RhbmNlIDw9IGN1cnJlbnQuZGlzdGFuY2UgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBTdG9yZSB0aGUgbmV3IGZ1cnRoZXN0IGRpc3RhbmNlXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4RGlzdGFuY2UgPSBjdXJyZW50LmRpc3RhbmNlO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgd2UgYWxyZWFkeSBoYWQgYSBjZWxsIGZvdW5kIGF0IHRoaXMgZGlzdGFuY2UsIGp1c3RcbiAgICAgICAgICAgICAgICAvLyBwdXNoIGl0IG9udG8gZnVydGhlc3RDZWxsc1xuICAgICAgICAgICAgICAgIGlmICggdGhpcy5fbWF4RGlzdGFuY2UgPT09IGN1cnJlbnQuZGlzdGFuY2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Z1cnRoZXN0Q2VsbHMucHVzaCggY3VycmVudCApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSB3ZSBjcmVhdGUgYSBuZXcgYXJyYXkgd2l0aCB0aGlzIGNlbGxcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnVydGhlc3RDZWxscyA9IFsgY3VycmVudCBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbmVpZ2hib3JzID0gdGhpcy5fZ2V0VW52aXNpdGVkTmVpZ2hib3JzKCBjdXJyZW50ICk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSB1bnZpc2l0ZWQgbmVpZ2hib3JzLCBzZWxlY3Qgb25lIHRvIGNyZWF0ZSBhIGxpbmsgdG9cbiAgICAgICAgICAgIC8vIGZyb20gdGhpcyBjZWxsXG4gICAgICAgICAgICBpZiAoIG5laWdoYm9ycyApIHtcblxuICAgICAgICAgICAgICAgIC8vIFBpY2sgb25lIG5laWdoYm9yIGF0IHJhbmRvbVxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogVGhpcyB3b3VsZCBiZSBhIGdvb2Qgc3BvdCB0byBtb2RpZnkgdGhlIGFsZ29yaXRobVxuICAgICAgICAgICAgICAgIC8vIHRvIGFsbG93IGZvciBkaXJlY3Rpb25hbCB3YW5kZXJpbmcsIGllOiBmYXZvcmluZyBlYXN0L3dlc3RcbiAgICAgICAgICAgICAgICAvLyBtb3ZlbWVudCB0byBub3J0aC9zb3V0aFxuICAgICAgICAgICAgICAgIG5leHQgPSBuZWlnaGJvcnNbIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoICkgXTtcblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgY3VycmVudCBjZWxsIHRvIGhhdmUgYW4gZXhpdCB0byB0aGUgbmVpZ2hib3JcbiAgICAgICAgICAgICAgICBjdXJyZW50LmV4aXRzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnMuRU5DT0RFRFsgbmV4dC5kaXJlY3Rpb24gXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY3VycmVudC5saW5rZWRDZWxsc1sgbmV4dC5kaXJlY3Rpb24gXSA9IG5leHQ7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIG5laWdoYm9yIGNlbGwgdG8gaGF2ZSBhbiBleGl0IHRvIHRoaXMgY2VsbFxuICAgICAgICAgICAgICAgIG5leHQuY2VsbC5leGl0cy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLkVOQ09ERURbIGRpcmVjdGlvbnMuSU5WRVJTRV9MT09LVVBbIG5leHQuZGlyZWN0aW9uIF0gXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgbmV4dC5jZWxsLmxpbmtlZENlbGxzWyBkaXJlY3Rpb25zLklOVkVSU0VfTE9PS1VQWyBuZXh0LmRpcmVjdGlvbiBdICBdID0gY3VycmVudDtcblxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBkaXN0YW5jZSBvZiB0aGlzIGNlbGwgZnJvbSB0aGUgc3RhcnRpbmcgY2VsbFxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMganVzdCBhIHN0YXRpc3RpYyBhbmQgZG9lc24ndCBjdXJyZW50IGhhdmUgYW5cbiAgICAgICAgICAgICAgICAvLyBpbXBhY3Qgb24gdGhlIGV2YWx1YXRpb24gb2YgdGhlIGFsZ29yaXRobVxuICAgICAgICAgICAgICAgIG5leHQuY2VsbC5kaXN0YW5jZSA9IGN1cnJlbnQuZGlzdGFuY2UgKyAxO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJhY2sgdGhhdCB0aGlzIGNlbGwgaGFzIGJlZW4gdmlzaXRlZCwgdGhhdCBpcywgaXQgaXNcbiAgICAgICAgICAgICAgICAvLyBhY2Nlc3NpYmxlIGZyb20gYW5vdGhlciBjZWxsIGluIHRoZSBtYXplXG4gICAgICAgICAgICAgICAgbmV4dC5jZWxsLnZpc2l0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gUHVzaCB0aGlzIGNlbGwgb250byB0aGUgYXJyYXkgb2YgY2VsbHMgdGhhdCBhcmUgcG90ZW50aWFsXG4gICAgICAgICAgICAgICAgLy8gbmV3IGhlYWQgbm9kZXMgdG8gY29udGludWUgZ2VuZXJhdGluZyB0aGUgbWF6ZSBmcm9tXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnB1c2goIG5leHQuY2VsbCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVTZXQuc3BsaWNlKCBuLCAxICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAoIG9wdGlvbnMgPSB7fSApIHtcbiAgICAgICAgdGhpcy5zYXZlT3B0aW9ucyggb3B0aW9ucyApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhdmUgb3B0aW9ucyBmb3IgdGhpcyBnZW5lcmF0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAtIGEgR2VuZXJhdG9yIG9wdGlvbnMgb2JqZWN0XG4gICAgICovXG4gICAgc2F2ZU9wdGlvbnMgKCBvcHRpb25zID0ge30gKSB7XG4gICAgICAgIHRoaXMuc3BsaXQgPSBvcHRpb25zLnNwbGl0IHx8IHRoaXMuc3BsaXQgfHwgMDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCB0aGlzLmhlaWdodCB8fCAyMDtcbiAgICAgICAgdGhpcy53aWR0aCA9IG9wdGlvbnMud2lkdGggfHwgdGhpcy53aWR0aCB8fCA1MDtcbiAgICAgICAgdGhpcy5zdGFydFggPSBvcHRpb25zLnN0YXJ0WCB8fCB0aGlzLnN0YXJ0WCB8fCB0aGlzLl9nZXRTdGFydFhQb3MoKTtcbiAgICAgICAgdGhpcy5zdGFydFkgPSBvcHRpb25zLnN0YXJ0WSB8fCB0aGlzLnN0YXJ0WSB8fCB0aGlzLl9nZXRTdGFydFlQb3MoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSB0aGUgbWF6ZSBmcm9tIHRoZSBwcm92aWRlZCBzdGFydGluZyB4LHkgcG9zaXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAtIGEgR2VuZXJhdG9yIG9wdGlvbnMgb2JqZWN0XG4gICAgICovXG4gICAgZ2VuZXJhdGUgKCBvcHRpb25zID0ge30gKSB7XG4gICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgIHRoaXMuc2F2ZU9wdGlvbnMoIG9wdGlvbnMgKTtcblxuICAgICAgICB0aGlzLl9wb3B1bGF0ZUNlbGxzKCk7XG5cbiAgICAgICAgdGhpcy5fbWF4RGlzdGFuY2UgPSAwO1xuICAgICAgICB0aGlzLl9mdXJ0aGVzdENlbGxzID0gW107XG4gICAgICAgIHRoaXMuX2FjdGl2ZVNldCA9IFtdO1xuXG4gICAgICAgIHRoaXMuX3N0YXJ0aW5nQ2VsbCA9IGN1cnJlbnQgPSB0aGlzLl9jZWxsc1sgdGhpcy5zdGFydFkgXVsgdGhpcy5zdGFydFggXTtcbiAgICAgICAgY3VycmVudC5kaXN0YW5jZSA9IDA7XG4gICAgICAgIGN1cnJlbnQudmlzaXRlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnB1c2goIGN1cnJlbnQgKTtcblxuICAgICAgICB0aGlzLl9nZW5lcmF0ZSgpO1xuICAgIH1cblxuICAgIGdldENlbGwgKCB4LCB5ICkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2VsbHNbIHkgXVsgeCBdO1xuICAgIH1cblxuICAgIGdldCBmdXJ0aGVzdENlbGxzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1cnRoZXN0Q2VsbHM7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXJ0aW5nQ2VsbCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFydGluZ0NlbGw7XG4gICAgfVxuXG4gICAgZ2V0IGNlbGxzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxzO1xuICAgIH1cbn1cbiIsImltcG9ydCBUcmF2ZXJzZXIgZnJvbSAnLi9UcmF2ZXJzZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgVHJhdmVyc2VyIHtcbiAgICBzYXZlT3B0aW9ucyAoIG9wdGlvbnMgKSB7XG4gICAgICAgIHN1cGVyLnNhdmVPcHRpb25zKCBvcHRpb25zICk7XG5cbiAgICAgICAgdGhpcy5fY2VsbHMgPSAnJztcbiAgICAgICAgdGhpcy5fJG1hemUgPSBvcHRpb25zLiRtYXplO1xuICAgICAgICB0aGlzLl9jZWxsU2l6ZSA9IG9wdGlvbnMuY2VsbFNpemUgfHwgMTA7XG4gICAgfVxuXG4gICAgdHJhdmVyc2FsU3RhcnQgKCBtYXplICkge1xuICAgICAgICB0aGlzLl8kbWF6ZVxuICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgIC53aWR0aCggbWF6ZS53aWR0aCAqIHRoaXMuX2NlbGxTaXplIClcbiAgICAgICAgICAgIC5oZWlnaHQoIG1hemUuaGVpZ2h0ICogdGhpcy5fY2VsbFNpemUgKTtcbiAgICB9XG5cbiAgICB0cmF2ZXJzYWxDZWxsICggY2VsbCApIHtcbiAgICAgICAgdGhpcy5fY2VsbHMgKz0nIDxkaXYgaWQ9XCInICsgY2VsbC54ICsgJy0nICsgY2VsbC55ICsgJ1wiIGNsYXNzPVwiY2VsbCB2aXNpdGVkIGNvbXBsZXRlICcgKyBjZWxsLmV4aXRzLmpvaW4oICcgJyApICtcbiAgICAgICAgICAgICdcIiBzdHlsZT1cIndpZHRoOiAnICsgdGhpcy5fY2VsbFNpemUgKyAncHg7IGhlaWdodDogJyArIHRoaXMuX2NlbGxTaXplICsgJ3B4O1wiPjwvZGl2Pic7XG4gICAgfVxuXG4gICAgdHJhdmVyc2FsQ29tcGxldGUgKCBtYXplICkge1xuICAgICAgICB0aGlzLl8kbWF6ZS5hcHBlbmQoIHRoaXMuX2NlbGxzICkuYWRkQ2xhc3MoICdmaW5pc2hlZCcgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIF9zdG9yZUNhbGxiYWNrICggcHJvcGVydHksIG9wdGlvbnMgKSB7XG4gICAgICAgIGlmICggXy5pc0Z1bmN0aW9uKCBvcHRpb25zWyBwcm9wZXJ0eSBdICkgKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFja3NbIHByb3BlcnR5IF0gPSBvcHRpb25zWyBwcm9wZXJ0eSBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tzWyBwcm9wZXJ0eSBdID0gdGhpc1sgcHJvcGVydHkgXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yICggb3B0aW9ucyApIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgICAgIHRoaXMuc2F2ZU9wdGlvbnMgKCBvcHRpb25zIHx8IHRoaXMub3B0aW9ucyApO1xuICAgIH1cblxuICAgIHNhdmVPcHRpb25zICggb3B0aW9ucyApIHtcbiAgICAgICAgdGhpcy5fbWF6ZSA9IG9wdGlvbnMubWF6ZTtcblxuICAgICAgICBpZiAoICF0aGlzLl9tYXplICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yICggJ011c3Qgc3BlY2lmeSBhIG1hemUgdG8gdHJhdmVyc2UnICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdG9yZUNhbGxiYWNrKCAndHJhdmVyc2FsU3RhcnQnLCBvcHRpb25zICk7XG4gICAgICAgIHRoaXMuX3N0b3JlQ2FsbGJhY2soICd0cmF2ZXJzYWxDb21wbGV0ZScsIG9wdGlvbnMgKTtcbiAgICAgICAgdGhpcy5fc3RvcmVDYWxsYmFjayggJ3RyYXZlcnNhbENlbGwnLCBvcHRpb25zICk7XG4gICAgfVxuXG4gICAgdHJhdmVyc2UgKCkge1xuICAgICAgICB0aGlzLl9jYWxsYmFja3MudHJhdmVyc2FsU3RhcnQuY2FsbCggdGhpcywgdGhpcy5fbWF6ZSwgdGhpcyApO1xuXG4gICAgICAgIGZvciAoIGxldCB5ID0gMDsgeSA8IHRoaXMuX21hemUuaGVpZ2h0OyB5KysgKSB7XG4gICAgICAgICAgICBmb3IgKCBsZXQgeCA9IDA7IHggPCB0aGlzLl9tYXplLndpZHRoOyB4KysgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2tzLnRyYXZlcnNhbENlbGwuY2FsbCggdGhpcywgdGhpcy5fbWF6ZS5nZXRDZWxsKCB4LCB5ICksIHRoaXMgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrcy50cmF2ZXJzYWxDb21wbGV0ZS5jYWxsKCB0aGlzLCB0aGlzLl9tYXplLCB0aGlzICk7XG4gICAgfVxuXG4gICAgdHJhdmVyc2FsU3RhcnQgKCBtYXplLCB0cmF2ZXJzZXIgKSB7XG5cbiAgICB9XG5cbiAgICB0cmF2ZXJzYWxDb21wbGV0ZSAoIG1hemUsIHRyYXZlcnNlciApIHtcblxuICAgIH1cblxuICAgIHRyYXZlcnNhbENlbGwgKCBjZWxsLCB0cmF2ZXJzZXIgKSB7XG5cbiAgICB9XG5cbiAgICBnZXQgb3B0aW9ucyAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmF2ZXJzYWxTdGFydDogdGhpcy50cmF2ZXJzYWxTdGFydCxcbiAgICAgICAgICAgIHRyYXZlcnNhbENvbXBsZXRlOiB0aGlzLnRyYXZlcnNhbENvbXBsZXRlLFxuICAgICAgICAgICAgdHJhdmVyc2FsQ2VsbDogdGhpcy50cmF2ZXJzYWxDZWxsXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICogYXMgbGFieXJpbnRoIGZyb20gJy4vbGFieXJpbnRoJztcblxudmFyIEdlbmVyYXRvciA9IGxhYnlyaW50aC5HZW5lcmF0b3IsXG4gICAgVHJhdmVyc2VyID0gbGFieXJpbnRoLkRpdlRyYXZlcnNlcjtcblxudmFyICRjdXJyZW50LCAkbmV3LCBuZWlnaGJvcnMsIGRpcmVjdGlvbiwgbiwgJG1hemUsIG1hemU7XG5cbnZhciBzYXZlTWFwcGluZ3MgPSB7XG4gICAgJ24nOiAnMCcsXG4gICAgJ24gZSc6ICcxJyxcbiAgICAnbiBzJzogJzInLFxuICAgICduIHcnOiAnMycsXG4gICAgJ24gZSBzJzogJzQnLFxuICAgICduIGUgdyc6ICc1JyxcbiAgICAnbiBzIHcnOiAnNicsXG4gICAgJ24gZSBzIHcnOiAnNycsXG4gICAgJ2UnOiAnOCcsXG4gICAgJ2Ugcyc6ICc5JyxcbiAgICAnZSB3JzogJ0EnLFxuICAgICdlIHMgdyc6ICdCJyxcbiAgICAncyc6ICdDJyxcbiAgICAncyB3JzogJ0QnLFxuICAgICd3JzogJ0UnXG59O1xuXG52YXIgbG9hZE1hcHBpbmdzID0ge1xuICAgICcwJzogJ24nLFxuICAgICcxJzogJ24gZScsXG4gICAgJzInOiAnbiBzJyxcbiAgICAnMyc6ICduIHcnLFxuICAgICc0JzogJ24gZSBzJyxcbiAgICAnNSc6ICduIGUgdycsXG4gICAgJzYnOiAnbiBzIHcnLFxuICAgICc3JzogJ24gZSBzIHcnLFxuICAgICc4JzogJ2UnLFxuICAgICc5JzogJ2UgcycsXG4gICAgJ0EnOiAnZSB3JyxcbiAgICAnQic6ICdlIHMgdycsXG4gICAgJ0MnOiAncycsXG4gICAgJ0QnOiAncyB3JyxcbiAgICAnRSc6ICd3J1xufTtcblxudmFyIGdldFNhdmVTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmluaXNoZXMgPSAnJywgc2F2ZVN0cmluZyA9IGhlaWdodCArICd8JyArIHdpZHRoICsgJ3wnICsgJG1hemUuZmluZCggJy5zdGFydCcgKS5hdHRyKCAnaWQnICkgKyAnfCc7XG5cbiAgICAkbWF6ZS5maW5kKCAnLmZpbmlzaCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgZmluaXNoZXMgKz0gJy4nICsgJCggdGhpcyApLmF0dHIoICdpZCcgKTtcbiAgICB9ICk7XG5cbiAgICBzYXZlU3RyaW5nICs9IGZpbmlzaGVzLnN1YnN0cmluZyggMSApICsgJzonO1xuXG4gICAgJG1hemUuZmluZCggJy5jZWxsJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKCB0aGlzICksIGNsYXNzU3RyaW5nID0gJyc7XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ24nICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIG4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ2UnICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ3MnICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIHMnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ3cnICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIHcnO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVN0cmluZyArPSBzYXZlTWFwcGluZ3NbIGNsYXNzU3RyaW5nLnN1YnN0cmluZyggMSApIF07XG4gICAgfSApO1xuXG4gICAgcmV0dXJuIHNhdmVTdHJpbmc7XG59O1xuXG52YXIgbG9hZFNhdmVTdHJpbmcgPSBmdW5jdGlvbiggc2F2ZVN0cmluZyApIHtcbiAgICB2YXIgc3ViUGFydHMsIHBhcnRzID0gc2F2ZVN0cmluZy5zcGxpdCggJzonICk7XG4gICAgaWYgKCBwYXJ0cy5sZW5ndGggIT09IDIgKSB7XG4gICAgICAgIHJldHVybiAnSW52YWxpZCBNYXplIFN0cmluZyc7XG4gICAgfVxuXG4gICAgc3ViUGFydHMgPSBwYXJ0c1sgMCBdLnNwbGl0KCAnfCcgKTtcbiAgICBpZiAoIHN1YlBhcnRzLmxlbmd0aCAhPT0gNCApIHtcbiAgICAgICAgcmV0dXJuICdJbnZhbGlkIE1hemUgU3RyaW5nJztcbiAgICB9XG5cbiAgICB3aWR0aCA9IHBhcnNlSW50KCBzdWJQYXJ0cyBbIDEgXSwgMTAgKTtcbiAgICBoZWlnaHQgPSBwYXJzZUludCggc3ViUGFydHNbIDAgXSwgMTAgKTtcblxuICAgIGlmICggaXNOYU4oIHdpZHRoICkgfHwgaXNOYU4oIGhlaWdodCApICkge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgTWF6ZSBTdHJpbmcnO1xuICAgIH1cblxuICAgIGNsZWFyR3JpZCgpO1xuICAgIGRyYXdHcmlkKCBoZWlnaHQsIHdpZHRoLCBfLnBhcnRpYWwoIGxvYWREcmF3LCBwYXJ0c1sgMSBdLCBzdWJQYXJ0c1sgMiBdLCBzdWJQYXJ0c1sgMyBdLnNwbGl0KCAnLicgKSApICk7XG59O1xuXG52YXIgbG9hZERyYXdDZWxsID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcsIGkgKSB7XG4gICAgJCggdGhpcyApLmFkZENsYXNzKCBsb2FkTWFwcGluZ3NbIHNhdmVTdHJpbmcuY2hhckF0KCBpICkgXSApO1xufVxuXG52YXIgbG9hZERyYXcgPSBmdW5jdGlvbiggc2F2ZVN0cmluZywgc3RhcnRJRCwgZmluaXNoSURzICkge1xuICAgICRtYXplLmZpbmQoICcuY2VsbCcgKS5lYWNoKCBfLnBhcnRpYWwoIGxvYWREcmF3Q2VsbCwgc2F2ZVN0cmluZyApICkuYWRkQ2xhc3MoICd2aXNpdGVkIGNvbXBsZXRlJyApO1xuICAgICRtYXplLmZpbmQoICcjJyArIHN0YXJ0SUQgKS5hZGRDbGFzcyggJ3N0YXJ0JyApO1xuXG4gICAgXy5lYWNoKCBmaW5pc2hJRHMsIGZ1bmN0aW9uKCBpZCApIHtcbiAgICAgICAgJG1hemUuZmluZCggJyMnICsgaWQgKS5hZGRDbGFzcyggJ2ZpbmlzaCcgKTtcbiAgICB9ICk7XG5cbiAgICBmaW5hbGl6ZU1hemUoKTtcbn07XG5cbnZhciBjbGVhckdyaWQgPSBmdW5jdGlvbigpIHtcbiAgICAkbWF6ZS5lbXB0eSgpLnJlbW92ZUNsYXNzKCAnZmluaXNoZWQnICk7XG59O1xuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcbiAgICAkbWF6ZSA9ICQoICcubWF6ZScgKTtcbiAgICBtYXplID0gbmV3IEdlbmVyYXRvcigpO1xuXG4gICAgJCggJy5tYXplLWlucHV0JyApLmhpZGUoKS5maXJzdCgpLnNob3coKTtcblxuICAgICQoICcjZ2VuZXJhdGUnICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xlYXJHcmlkKCk7XG5cbiAgICAgICAgbWF6ZS5oZWlnaHQgPSBwYXJzZUludCggJCggJyNncmlkLWhlaWdodCcgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgbWF6ZS53aWR0aCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtd2lkdGgnICkudmFsKCksIDEwICk7XG4gICAgICAgIG1hemUuY2VsbFNpemUgPSBwYXJzZUludCggJCggJyNjZWxsLXNpemUnICkudmFsKCksIDEwICk7XG4gICAgICAgIG1hemUuc3BsaXQgPSBwYXJzZUludCggJCggJyNtYXplLXN0eWxlJyApLnZhbCgpLCAxMCApO1xuXG4gICAgICAgIG1hemUuZ2VuZXJhdGUoKTtcbiAgICAgICAgKCBuZXcgVHJhdmVyc2VyKCB7XG4gICAgICAgICAgICBtYXplOiBtYXplLFxuICAgICAgICAgICAgJG1hemU6ICRtYXplLFxuICAgICAgICAgICAgY2VsbFNpemU6IHBhcnNlSW50KCAkKCAnI2NlbGwtc2l6ZScgKS52YWwoKSwgMTAgKVxuICAgICAgICB9ICkgKS50cmF2ZXJzZSgpO1xuICAgIH0gKTtcblxuICAgICQoICcjZ3JpZC13aWR0aCcgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGNvbCA9ICQoICcubGFyZ2UtMTIuY29sdW1ucycgKSxcbiAgICAgICAgICAgIGNvbFdpZHRoID0gJGNvbC5pbm5lcldpZHRoKCkgLSAxMDAsXG4gICAgICAgICAgICBncmlkV2lkdGggPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIGlmICggaXNOYU4oIGdyaWRXaWR0aCApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNDAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggZ3JpZFdpZHRoIDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRXaWR0aCApICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI2dyaWQtaGVpZ2h0JyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBncmlkSGVpZ2h0ID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuICAgICAgICBpZiAoIGlzTmFOKCBncmlkSGVpZ2h0ICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBncmlkSGVpZ2h0IDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRIZWlnaHQgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNjZWxsLXNpemUnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNlbGxTaXplID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggaXNOYU4oIGNlbGxTaXplICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBjZWxsU2l6ZSA8IDMgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNlbGxTaXplID4gMzAgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggY2VsbFNpemUgKSApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbFNpemUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIHZhciAkY29sID0gJCggJy5sYXJnZS0xMi5jb2x1bW5zJyApLFxuICAgICAgICAgICAgY29sV2lkdGggPSAkY29sLmlubmVyV2lkdGgoKSAtIDEwMCxcbiAgICAgICAgICAgIGdyaWRXaWR0aCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtd2lkdGgnICkudmFsKCkgKSxcbiAgICAgICAgICAgIGdyaWRIZWlnaHQgPSBwYXJzZUludCggJCggJyNncmlkLWhlaWdodCcgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggZ3JpZFdpZHRoID4gY29sV2lkdGggLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC13aWR0aCcgKS52YWwoIE1hdGguZmxvb3IoIGNvbFdpZHRoIC8gY2VsbFNpemUgKSApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGdyaWRIZWlnaHQgPiA2MDAgLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC1oZWlnaHQnICkudmFsKCBNYXRoLmZsb29yKCA2MDAgLyBjZWxsU2l6ZSApIClcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjbWF6ZS1zdHlsZScgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG5cbiAgICAgICAgaWYoIGlzTmFOKCBzdHlsZSApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNTAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggc3R5bGUgPCAwICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBzdHlsZSA+IDEwMCApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDEwMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggc3R5bGUgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNxbWFyaycgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdXBkYXRlcyA9ICQoICcjdXBkYXRlcycgKTtcblxuICAgICAgICBpZiAoICR1cGRhdGVzLmhhc0NsYXNzKCAnZXhwYW5kZWQnICkgKSB7XG4gICAgICAgICAgICAkdXBkYXRlcy5zdG9wKCB0cnVlLCB0cnVlICkucmVtb3ZlQ2xhc3MoICdleHBhbmRlZCcgKS5hbmltYXRlKCB7ICdyaWdodCc6ICctNTMwcHgnIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR1cGRhdGVzLnN0b3AoIHRydWUsIHRydWUgKS5hZGRDbGFzcyggJ2V4cGFuZGVkJyApLmFuaW1hdGUoIHsgJ3JpZ2h0JzogJzVweCcgfSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN0b2dnbGUtaGVhdG1hcCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLGo7XG4gICAgICAgIGlmICggbWF6ZS5oZWF0cy5sZW5ndGggKSB7XG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IG1hemUuaGVhdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgbWF6ZS5oZWF0c1sgaSBdLnJlbW92ZUNsYXNzKCAnZGlzdGFuY2UtJyArIGkgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGVhdHMgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTAnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTEnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTInICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtM1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTMnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTQnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTUnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTYnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtN1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTcnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTgnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTknICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMTBcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0xMCcgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN6b29tLW91dCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPD0gNSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgLSAyO1xuICAgICAgICAkKCAnLmNlbGwnICkuY3NzKCB7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkbWF6ZS53aWR0aCggY2VsbFNpemUgKiBwYXJzZUludCggJG1hemUuYXR0ciggJ2RhdGEtd2lkdGgnICksIDEwICkgKS5oZWlnaHQoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLWhlaWdodCcgKSwgMTAgKSApO1xuICAgIH0gKTtcblxuICAgICQoICcjem9vbS1pbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPj0gOTggKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplICsgMjtcbiAgICAgICAgJCggJy5jZWxsJyApLmNzcygge1xuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgJG1hemUud2lkdGgoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLXdpZHRoJyApLCAxMCApICkuaGVpZ2h0KCBjZWxsU2l6ZSAqIHBhcnNlSW50KCAkbWF6ZS5hdHRyKCAnZGF0YS1oZWlnaHQnICksIDEwICkgKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI3NhdmUtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggJG1hemUuaGFzQ2xhc3MoICdmaW5pc2hlZCcgKSApIHtcbiAgICAgICAgICAgICQoICcjbWF6ZS1zYXZlc3RyaW5nJyApLnZhbCggZ2V0U2F2ZVN0cmluZygpICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoICdHZW5lcmF0ZSBvciBsb2FkIGEgbWF6ZSBmaXJzdCEnICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI2xvYWQtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvYWRTYXZlU3RyaW5nKCAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoKSApO1xuICAgIH0pXG5cbiAgICAkKCAnI2lvLWJ1dHRvbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAnc2Vjb25kYXJ5JyApICkge1xuICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoICdzZWNvbmRhcnknICk7XG4gICAgICAgICAgICAkKCAnLm1hemUtaW5wdXQnICkuaGlkZSgpLmZpbHRlciggJyNtYXplLWlvJyApLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCAnc2Vjb25kYXJ5JyApO1xuICAgICAgICAgICAgJCggJy5tYXplLWlucHV0JyApLmhpZGUoKS5maXJzdCgpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoIHdpbmRvdyApLnJlc2l6ZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSAwO1xuXG4gICAgICAgICQoICdib2R5ID4gLnJvdzpub3QoLm1jLXJvdyknKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhlaWdodCArPSAkKCB0aGlzICkuaGVpZ2h0KCk7XG4gICAgICAgIH0gKVxuXG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuaGVpZ2h0KCAkKCB0aGlzICkuaGVpZ2h0KCkgLSBoZWlnaHQgLSAzMCApO1xuICAgIH0gKS5yZXNpemUoKTtcblxuICAgICQoICcjZW50ZXItcHJpbnRtb2RlJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgJCggJ2JvZHknICkuYWRkQ2xhc3MoICdwcmludC1tb2RlJyApO1xuICAgICAgICAkKCAnI21hemUtY29udGFpbmVyJyApLmF0dHIoICdkYXRhLXN0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnc3R5bGUnICkgKS5hdHRyKCAnc3R5bGUnLCAnJyApO1xuICAgIH0gKTtcblxuICAgICQoICcjZXhpdC1wcmludG1vZGUnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCAnYm9keScgKS5yZW1vdmVDbGFzcyggJ3ByaW50LW1vZGUnICk7XG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuYXR0ciggJ3N0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnZGF0YS1zdHlsZScgKSApO1xuICAgIH0gKTtcbn0gKTtcbiIsImltcG9ydCBHZW5lcmF0b3IgZnJvbSAnLi9HZW5lcmF0b3InO1xuaW1wb3J0IFRyYXZlcnNlciBmcm9tICcuL1RyYXZlcnNlcic7XG5pbXBvcnQgRGl2VHJhdmVyc2VyIGZyb20gJy4vVHJhdmVyc2VyLUhUTUwtRGl2JztcblxuZXhwb3J0IHsgR2VuZXJhdG9yLCBUcmF2ZXJzZXIsIERpdlRyYXZlcnNlcn07XG4iXX0=
