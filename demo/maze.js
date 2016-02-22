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
    maze.cells = [];
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);

        this.distance = 0;
        this.maxDistance = 0;
        this.split = 0;
        this.height = 20;
        this.width = 50;

        this._activeSet = [];

        this.passageToClass = {
            0: 'n',
            1: 's',
            2: 'e',
            3: 'w'
        };

        this.inversePassage = {
            0: 's',
            1: 'n',
            2: 'w',
            3: 'e'
        };
    }

    _createClass(_class, [{
        key: '_populateCells',
        value: function _populateCells() {
            this._cells = [];

            for (var i = 0; i < this.height; i++) {
                this._cells.push([]);

                for (var j = 0; j < this.width; j++) {
                    this._cells[i].push({
                        x: j,
                        y: i,
                        exits: [],
                        distance: -1,
                        visited: false,
                        complete: false
                    });
                }
            }
        }
    }, {
        key: '_getStartXPos',
        value: function _getStartXPos() {
            return Math.floor(Math.random() * this.width);
        }
    }, {
        key: '_getStartYPos',
        value: function _getStartYPos() {
            return Math.floor(Math.random() * this.height);
        }

        /**
         * Get node to act as head node for generation, will either select a node at
         * random, or the last added node
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
    }, {
        key: '_storeUnvisitedCell',
        value: function _storeUnvisitedCell(current, result, direction) {
            if (!current.visited) {
                result.push({ cell: current, direction: direction });
            }
        }
    }, {
        key: '_getUnvisitedNeighbors',
        value: function _getUnvisitedNeighbors(cell) {
            var result = [];

            // North
            if (cell.y !== 0) {
                this._storeUnvisitedCell(this._cells[cell.y - 1][cell.x], result, 0);
            }

            // West
            if (cell.x !== 0) {
                this._storeUnvisitedCell(this._cells[cell.y][cell.x - 1], result, 3);
            }

            // South
            if (cell.y !== this.height - 1) {
                this._storeUnvisitedCell(this._cells[cell.y + 1][cell.x], result, 1);
            }

            // East
            if (cell.x !== this.width - 1) {
                this._storeUnvisitedCell(this._cells[cell.y][cell.x + 1], result, 2);
            }

            if (result.length === 0) {
                cell.complete = true;
                return false;
            }

            return result;
        }
    }, {
        key: '_generate',
        value: function _generate() {
            var current, next, neighbors, n;

            while (this._activeSet.length) {
                n = this._getHeadNode();
                current = this._activeSet[n];

                this.maxDistance = Math.max(this.maxDistance, current.distance);

                neighbors = this._getUnvisitedNeighbors(current);

                if (neighbors) {
                    next = neighbors[Math.floor(Math.random() * neighbors.length)];

                    next.cell.exits.push(this.inversePassage[next.direction]);
                    next.cell.distance = current.distance + 1;
                    next.cell.visited = true;

                    this._activeSet.push(next.cell);

                    current.exits.push(this.passageToClass[next.direction]);
                } else {
                    this._activeSet.splice(n, 1);
                }
            }
        }
    }, {
        key: 'generate',
        value: function generate(startX, startY) {
            var current;

            this._populateCells();

            this.maxDistance = 0;

            if (startX === undefined) {
                startX = this._getStartXPos();
            }

            if (startY === undefined) {
                startY = this._getStartYPos();
            }

            current = this._cells[startY][startX];
            current.distance = 0;
            current.visited = true;

            this._activeSet.push(current);

            this._generate();
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"jquery":"jquery","underscore":"underscore"}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZHJhdy5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9tYXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSUksb0JBQWMsUUFBZCxFQUF3QixJQUF4QixFQUErQjs7O0FBQzNCLGFBQUssS0FBTCxHQUFhLFFBQWIsQ0FEMkI7QUFFM0IsYUFBSyxRQUFMLEdBQWdCLEVBQWhCLENBRjJCO0FBRzNCLGFBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxDQUhhO0FBSTNCLGFBQUssS0FBTCxHQUFhLEtBQUssS0FBTCxDQUpjOztBQU0zQixhQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FOYTtLQUEvQjs7OzsrQkFTUTtBQUNKLGdCQUFJLFNBQVMsRUFBVCxDQURBOztBQUdKLGlCQUFNLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLE1BQUwsRUFBYSxHQUFsQyxFQUF3QztBQUNwQyxxQkFBTSxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksS0FBSyxLQUFMLEVBQVksR0FBakMsRUFBdUM7QUFDbkMsOEJBQVUsY0FBYyxDQUFkLEdBQWtCLEdBQWxCLEdBQXdCLENBQXhCLEdBQTRCLGlDQUE1QixHQUFnRSxLQUFLLE1BQUwsQ0FBYSxDQUFiLEVBQWtCLENBQWxCLEVBQXNCLEtBQXRCLENBQTRCLElBQTVCLENBQWtDLEdBQWxDLENBQWhFLEdBQ04sa0JBRE0sR0FDZSxLQUFLLFFBQUwsR0FBZ0IsY0FEL0IsR0FDZ0QsS0FBSyxRQUFMLEdBQWdCLGFBRGhFLENBRHlCO2lCQUF2QzthQURKOztBQU9BLGlCQUFLLEtBQUwsQ0FDSyxLQURMLENBQ1ksS0FBSyxLQUFMLEdBQWEsS0FBSyxRQUFMLENBRHpCLENBRUssTUFGTCxDQUVhLEtBQUssTUFBTCxHQUFjLEtBQUssUUFBTCxDQUYzQixD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SyxXQUFMLEdBQW1CLENBQW5CLENBTHVCOztBQU92QixnQkFBSyxXQUFXLFNBQVgsRUFBdUI7QUFDeEIseUJBQVMsS0FBSyxhQUFMLEVBQVQsQ0FEd0I7YUFBNUI7O0FBSUEsZ0JBQUssV0FBVyxTQUFYLEVBQXVCO0FBQ3hCLHlCQUFTLEtBQUssYUFBTCxFQUFULENBRHdCO2FBQTVCOztBQUlBLHNCQUFVLEtBQUssTUFBTCxDQUFhLE1BQWIsRUFBdUIsTUFBdkIsQ0FBVixDQWZ1QjtBQWdCdkIsb0JBQVEsUUFBUixHQUFtQixDQUFuQixDQWhCdUI7QUFpQnZCLG9CQUFRLE9BQVIsR0FBa0IsSUFBbEIsQ0FqQnVCOztBQW1CdkIsaUJBQUssVUFBTCxDQUFnQixJQUFoQixDQUFzQixPQUF0QixFQW5CdUI7O0FBcUJ2QixpQkFBSyxTQUFMLEdBckJ1QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvciAoICRlbGVtZW50LCBtYXplICkge1xuICAgICAgICB0aGlzLiRtYXplID0gJGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSAxMDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBtYXplLmhlaWdodDtcbiAgICAgICAgdGhpcy53aWR0aCA9IG1hemUud2lkdGg7XG5cbiAgICAgICAgdGhpcy5fY2VsbHMgPSBtYXplLl9jZWxscztcbiAgICB9XG5cbiAgICBkcmF3ICgpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKysgKSB7XG4gICAgICAgICAgICBmb3IgKCBsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKysgKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8ZGl2IGlkPVwiJyArIGogKyAnLScgKyBpICsgJ1wiIGNsYXNzPVwiY2VsbCB2aXNpdGVkIGNvbXBsZXRlICcgKyB0aGlzLl9jZWxsc1sgaSBdWyBqIF0uZXhpdHMuam9pbiggJyAnICkgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgc3R5bGU9XCJ3aWR0aDogJyArIHRoaXMuY2VsbFNpemUgKyAncHg7IGhlaWdodDogJyArIHRoaXMuY2VsbFNpemUgKyAncHg7XCI+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1hemVcbiAgICAgICAgICAgIC53aWR0aCggdGhpcy53aWR0aCAqIHRoaXMuY2VsbFNpemUgKVxuICAgICAgICAgICAgLmhlaWdodCggdGhpcy5oZWlnaHQgKiB0aGlzLmNlbGxTaXplIClcbiAgICAgICAgICAgIC5hdHRyKCAnZGF0YS13aWR0aCcsIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgLmF0dHIoICdkYXRhLWhlaWdodCcsIHRoaXMuaGVpZ2h0IClcbiAgICAgICAgICAgIC5hcHBlbmQoIG91dHB1dCApLmFkZENsYXNzKCAnZmluaXNoZWQnICk7XG4gICAgfVxufVxuIiwiaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IE1hemUgZnJvbSAnLi9tYXplJztcbmltcG9ydCBEcmF3IGZyb20gJy4vZHJhdyc7XG5cbnZhciAkY3VycmVudCwgJG5ldywgbmVpZ2hib3JzLCBkaXJlY3Rpb24sIG4sICRtYXplLCBtYXplO1xuXG52YXIgc2F2ZU1hcHBpbmdzID0ge1xuICAgICduJzogJzAnLFxuICAgICduIGUnOiAnMScsXG4gICAgJ24gcyc6ICcyJyxcbiAgICAnbiB3JzogJzMnLFxuICAgICduIGUgcyc6ICc0JyxcbiAgICAnbiBlIHcnOiAnNScsXG4gICAgJ24gcyB3JzogJzYnLFxuICAgICduIGUgcyB3JzogJzcnLFxuICAgICdlJzogJzgnLFxuICAgICdlIHMnOiAnOScsXG4gICAgJ2Ugdyc6ICdBJyxcbiAgICAnZSBzIHcnOiAnQicsXG4gICAgJ3MnOiAnQycsXG4gICAgJ3Mgdyc6ICdEJyxcbiAgICAndyc6ICdFJ1xufTtcblxudmFyIGxvYWRNYXBwaW5ncyA9IHtcbiAgICAnMCc6ICduJyxcbiAgICAnMSc6ICduIGUnLFxuICAgICcyJzogJ24gcycsXG4gICAgJzMnOiAnbiB3JyxcbiAgICAnNCc6ICduIGUgcycsXG4gICAgJzUnOiAnbiBlIHcnLFxuICAgICc2JzogJ24gcyB3JyxcbiAgICAnNyc6ICduIGUgcyB3JyxcbiAgICAnOCc6ICdlJyxcbiAgICAnOSc6ICdlIHMnLFxuICAgICdBJzogJ2UgdycsXG4gICAgJ0InOiAnZSBzIHcnLFxuICAgICdDJzogJ3MnLFxuICAgICdEJzogJ3MgdycsXG4gICAgJ0UnOiAndydcbn07XG5cbnZhciBnZXRTYXZlU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbmlzaGVzID0gJycsIHNhdmVTdHJpbmcgPSBoZWlnaHQgKyAnfCcgKyB3aWR0aCArICd8JyArICRtYXplLmZpbmQoICcuc3RhcnQnICkuYXR0ciggJ2lkJyApICsgJ3wnO1xuXG4gICAgJG1hemUuZmluZCggJy5maW5pc2gnICkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgIGZpbmlzaGVzICs9ICcuJyArICQoIHRoaXMgKS5hdHRyKCAnaWQnICk7XG4gICAgfSApO1xuXG4gICAgc2F2ZVN0cmluZyArPSBmaW5pc2hlcy5zdWJzdHJpbmcoIDEgKSArICc6JztcblxuICAgICRtYXplLmZpbmQoICcuY2VsbCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCggdGhpcyApLCBjbGFzc1N0cmluZyA9ICcnO1xuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICduJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICdlJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICdzJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBzJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICd3JyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyB3JztcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVTdHJpbmcgKz0gc2F2ZU1hcHBpbmdzWyBjbGFzc1N0cmluZy5zdWJzdHJpbmcoIDEgKSBdO1xuICAgIH0gKTtcblxuICAgIHJldHVybiBzYXZlU3RyaW5nO1xufTtcblxudmFyIGxvYWRTYXZlU3RyaW5nID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcgKSB7XG4gICAgdmFyIHN1YlBhcnRzLCBwYXJ0cyA9IHNhdmVTdHJpbmcuc3BsaXQoICc6JyApO1xuICAgIGlmICggcGFydHMubGVuZ3RoICE9PSAyICkge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgTWF6ZSBTdHJpbmcnO1xuICAgIH1cblxuICAgIHN1YlBhcnRzID0gcGFydHNbIDAgXS5zcGxpdCggJ3wnICk7XG4gICAgaWYgKCBzdWJQYXJ0cy5sZW5ndGggIT09IDQgKSB7XG4gICAgICAgIHJldHVybiAnSW52YWxpZCBNYXplIFN0cmluZyc7XG4gICAgfVxuXG4gICAgd2lkdGggPSBwYXJzZUludCggc3ViUGFydHMgWyAxIF0sIDEwICk7XG4gICAgaGVpZ2h0ID0gcGFyc2VJbnQoIHN1YlBhcnRzWyAwIF0sIDEwICk7XG5cbiAgICBpZiAoIGlzTmFOKCB3aWR0aCApIHx8IGlzTmFOKCBoZWlnaHQgKSApIHtcbiAgICAgICAgcmV0dXJuICdJbnZhbGlkIE1hemUgU3RyaW5nJztcbiAgICB9XG5cbiAgICBjbGVhckdyaWQoKTtcbiAgICBkcmF3R3JpZCggaGVpZ2h0LCB3aWR0aCwgXy5wYXJ0aWFsKCBsb2FkRHJhdywgcGFydHNbIDEgXSwgc3ViUGFydHNbIDIgXSwgc3ViUGFydHNbIDMgXS5zcGxpdCggJy4nICkgKSApO1xufTtcblxudmFyIGxvYWREcmF3Q2VsbCA9IGZ1bmN0aW9uKCBzYXZlU3RyaW5nLCBpICkge1xuICAgICQoIHRoaXMgKS5hZGRDbGFzcyggbG9hZE1hcHBpbmdzWyBzYXZlU3RyaW5nLmNoYXJBdCggaSApIF0gKTtcbn1cblxudmFyIGxvYWREcmF3ID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcsIHN0YXJ0SUQsIGZpbmlzaElEcyApIHtcbiAgICAkbWF6ZS5maW5kKCAnLmNlbGwnICkuZWFjaCggXy5wYXJ0aWFsKCBsb2FkRHJhd0NlbGwsIHNhdmVTdHJpbmcgKSApLmFkZENsYXNzKCAndmlzaXRlZCBjb21wbGV0ZScgKTtcbiAgICAkbWF6ZS5maW5kKCAnIycgKyBzdGFydElEICkuYWRkQ2xhc3MoICdzdGFydCcgKTtcblxuICAgIF8uZWFjaCggZmluaXNoSURzLCBmdW5jdGlvbiggaWQgKSB7XG4gICAgICAgICRtYXplLmZpbmQoICcjJyArIGlkICkuYWRkQ2xhc3MoICdmaW5pc2gnICk7XG4gICAgfSApO1xuXG4gICAgZmluYWxpemVNYXplKCk7XG59O1xuXG52YXIgY2xlYXJHcmlkID0gZnVuY3Rpb24oKSB7XG4gICAgJG1hemUuZW1wdHkoKS5yZW1vdmVDbGFzcyggJ2ZpbmlzaGVkJyApO1xuICAgIG1hemUuY2VsbHMgPSBbXTtcbn07XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuICAgICRtYXplID0gJCggJy5tYXplJyApO1xuICAgIG1hemUgPSBuZXcgTWF6ZSgpO1xuXG4gICAgJCggJy5tYXplLWlucHV0JyApLmhpZGUoKS5maXJzdCgpLnNob3coKTtcblxuICAgICQoICcjZ2VuZXJhdGUnICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xlYXJHcmlkKCk7XG5cbiAgICAgICAgbWF6ZS5oZWlnaHQgPSBwYXJzZUludCggJCggJyNncmlkLWhlaWdodCcgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgbWF6ZS53aWR0aCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtd2lkdGgnICkudmFsKCksIDEwICk7XG4gICAgICAgIG1hemUuY2VsbFNpemUgPSBwYXJzZUludCggJCggJyNjZWxsLXNpemUnICkudmFsKCksIDEwICk7XG4gICAgICAgIG1hemUuc3BsaXQgPSBwYXJzZUludCggJCggJyNtYXplLXN0eWxlJyApLnZhbCgpLCAxMCApO1xuXG4gICAgICAgIG1hemUuZ2VuZXJhdGUoKTtcbiAgICAgICAgKCBuZXcgRHJhdyggJG1hemUsIG1hemUgKSApLmRyYXcoKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI2dyaWQtd2lkdGgnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICRjb2wgPSAkKCAnLmxhcmdlLTEyLmNvbHVtbnMnICksXG4gICAgICAgICAgICBjb2xXaWR0aCA9ICRjb2wuaW5uZXJXaWR0aCgpIC0gMTAwLFxuICAgICAgICAgICAgZ3JpZFdpZHRoID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuICAgICAgICBpZiAoIGlzTmFOKCBncmlkV2lkdGggKSApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDQwICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGdyaWRXaWR0aCA8IDIgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCBNYXRoLmZsb29yKCBncmlkV2lkdGggKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNncmlkLWhlaWdodCcgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZ3JpZEhlaWdodCA9IHBhcnNlSW50KCAkKCB0aGlzICkudmFsKCkgKTtcbiAgICAgICAgaWYgKCBpc05hTiggZ3JpZEhlaWdodCApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMjAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggZ3JpZEhlaWdodCA8IDIgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCBNYXRoLmZsb29yKCBncmlkSGVpZ2h0ICkgKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjY2VsbC1zaXplJyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjZWxsU2l6ZSA9IHBhcnNlSW50KCAkKCB0aGlzICkudmFsKCkgKTtcblxuICAgICAgICBpZiAoIGlzTmFOKCBjZWxsU2l6ZSApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMjAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggY2VsbFNpemUgPCAzICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMyApO1xuICAgICAgICB9IGVsc2UgaWYgKCBjZWxsU2l6ZSA+IDMwICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMzAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGNlbGxTaXplICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxTaXplID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuICAgICAgICB2YXIgJGNvbCA9ICQoICcubGFyZ2UtMTIuY29sdW1ucycgKSxcbiAgICAgICAgICAgIGNvbFdpZHRoID0gJGNvbC5pbm5lcldpZHRoKCkgLSAxMDAsXG4gICAgICAgICAgICBncmlkV2lkdGggPSBwYXJzZUludCggJCggJyNncmlkLXdpZHRoJyApLnZhbCgpICksXG4gICAgICAgICAgICBncmlkSGVpZ2h0ID0gcGFyc2VJbnQoICQoICcjZ3JpZC1oZWlnaHQnICkudmFsKCkgKTtcblxuICAgICAgICBpZiAoIGdyaWRXaWR0aCA+IGNvbFdpZHRoIC8gY2VsbFNpemUgKSB7XG4gICAgICAgICAgICAkKCAnI2dyaWQtd2lkdGgnICkudmFsKCBNYXRoLmZsb29yKCBjb2xXaWR0aCAvIGNlbGxTaXplICkgKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBncmlkSGVpZ2h0ID4gNjAwIC8gY2VsbFNpemUgKSB7XG4gICAgICAgICAgICAkKCAnI2dyaWQtaGVpZ2h0JyApLnZhbCggTWF0aC5mbG9vciggNjAwIC8gY2VsbFNpemUgKSApXG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI21hemUtc3R5bGUnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuXG4gICAgICAgIGlmKCBpc05hTiggc3R5bGUgKSApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDUwICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIHN0eWxlIDwgMCApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggc3R5bGUgPiAxMDAgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAxMDAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIHN0eWxlICkgKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjcW1hcmsnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHVwZGF0ZXMgPSAkKCAnI3VwZGF0ZXMnICk7XG5cbiAgICAgICAgaWYgKCAkdXBkYXRlcy5oYXNDbGFzcyggJ2V4cGFuZGVkJyApICkge1xuICAgICAgICAgICAgJHVwZGF0ZXMuc3RvcCggdHJ1ZSwgdHJ1ZSApLnJlbW92ZUNsYXNzKCAnZXhwYW5kZWQnICkuYW5pbWF0ZSggeyAncmlnaHQnOiAnLTUzMHB4JyB9ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkdXBkYXRlcy5zdG9wKCB0cnVlLCB0cnVlICkuYWRkQ2xhc3MoICdleHBhbmRlZCcgKS5hbmltYXRlKCB7ICdyaWdodCc6ICc1cHgnIH0gKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjdG9nZ2xlLWhlYXRtYXAnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSxqO1xuICAgICAgICBpZiAoIG1hemUuaGVhdHMubGVuZ3RoICkge1xuICAgICAgICAgICAgZm9yICggaSA9IDA7IGkgPCBtYXplLmhlYXRzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIG1hemUuaGVhdHNbIGkgXS5yZW1vdmVDbGFzcyggJ2Rpc3RhbmNlLScgKyBpICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhlYXRzID0gW107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTBcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0wJyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTFcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0xJyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTJcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0yJyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTNcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0zJyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTRcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS00JyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTVcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS01JyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTZcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS02JyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTdcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS03JyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLThcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS04JyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTlcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS05JyApICk7XG4gICAgICAgICAgICBtYXplLmhlYXRzLnB1c2goICRtYXplLmZpbmQoICdbZGF0YS1kaXN0YW5jZS1jbGFzcz1cImRpc3RhbmNlLTEwXCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtMTAnICkgKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjem9vbS1vdXQnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIGNlbGxTaXplIDw9IDUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplIC0gMjtcbiAgICAgICAgJCggJy5jZWxsJyApLmNzcygge1xuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgJG1hemUud2lkdGgoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLXdpZHRoJyApLCAxMCApICkuaGVpZ2h0KCBjZWxsU2l6ZSAqIHBhcnNlSW50KCAkbWF6ZS5hdHRyKCAnZGF0YS1oZWlnaHQnICksIDEwICkgKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI3pvb20taW4nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIGNlbGxTaXplID49IDk4ICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSArIDI7XG4gICAgICAgICQoICcuY2VsbCcgKS5jc3MoIHtcbiAgICAgICAgICAgIHdpZHRoOiBjZWxsU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogY2VsbFNpemVcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRtYXplLndpZHRoKCBjZWxsU2l6ZSAqIHBhcnNlSW50KCAkbWF6ZS5hdHRyKCAnZGF0YS13aWR0aCcgKSwgMTAgKSApLmhlaWdodCggY2VsbFNpemUgKiBwYXJzZUludCggJG1hemUuYXR0ciggJ2RhdGEtaGVpZ2h0JyApLCAxMCApICk7XG4gICAgfSApO1xuXG4gICAgJCggJyNzYXZlLW1hemUnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoICRtYXplLmhhc0NsYXNzKCAnZmluaXNoZWQnICkgKSB7XG4gICAgICAgICAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoIGdldFNhdmVTdHJpbmcoKSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggJyNtYXplLXNhdmVzdHJpbmcnICkudmFsKCAnR2VuZXJhdGUgb3IgbG9hZCBhIG1hemUgZmlyc3QhJyApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNtYXplLXNhdmVzdHJpbmcnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICB0aGlzLnNlbGVjdCgpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSApO1xuXG4gICAgJCggJyNsb2FkLW1hemUnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkU2F2ZVN0cmluZyggJCggJyNtYXplLXNhdmVzdHJpbmcnICkudmFsKCkgKTtcbiAgICB9KVxuXG4gICAgJCggJyNpby1idXR0b24nICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKCB0aGlzICk7XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ3NlY29uZGFyeScgKSApIHtcbiAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCAnc2Vjb25kYXJ5JyApO1xuICAgICAgICAgICAgJCggJy5tYXplLWlucHV0JyApLmhpZGUoKS5maWx0ZXIoICcjbWF6ZS1pbycgKS5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkdGhpcy5hZGRDbGFzcyggJ3NlY29uZGFyeScgKTtcbiAgICAgICAgICAgICQoICcubWF6ZS1pbnB1dCcgKS5oaWRlKCkuZmlyc3QoKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCB3aW5kb3cgKS5yZXNpemUoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaGVpZ2h0ID0gMDtcblxuICAgICAgICAkKCAnYm9keSA+IC5yb3c6bm90KC5tYy1yb3cpJykuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBoZWlnaHQgKz0gJCggdGhpcyApLmhlaWdodCgpO1xuICAgICAgICB9IClcblxuICAgICAgICAkKCAnI21hemUtY29udGFpbmVyJyApLmhlaWdodCggJCggdGhpcyApLmhlaWdodCgpIC0gaGVpZ2h0IC0gMzAgKTtcbiAgICB9ICkucmVzaXplKCk7XG5cbiAgICAkKCAnI2VudGVyLXByaW50bW9kZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgICQoICdib2R5JyApLmFkZENsYXNzKCAncHJpbnQtbW9kZScgKTtcbiAgICAgICAgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnZGF0YS1zdHlsZScsICQoICcjbWF6ZS1jb250YWluZXInICkuYXR0ciggJ3N0eWxlJyApICkuYXR0ciggJ3N0eWxlJywgJycgKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI2V4aXQtcHJpbnRtb2RlJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgJCggJ2JvZHknICkucmVtb3ZlQ2xhc3MoICdwcmludC1tb2RlJyApO1xuICAgICAgICAkKCAnI21hemUtY29udGFpbmVyJyApLmF0dHIoICdzdHlsZScsICQoICcjbWF6ZS1jb250YWluZXInICkuYXR0ciggJ2RhdGEtc3R5bGUnICkgKTtcbiAgICB9ICk7XG59ICk7XG4iLCJpbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSAwO1xuICAgICAgICB0aGlzLm1heERpc3RhbmNlID0gMDtcbiAgICAgICAgdGhpcy5zcGxpdCA9IDA7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMjA7XG4gICAgICAgIHRoaXMud2lkdGggPSA1MDtcblxuICAgICAgICB0aGlzLl9hY3RpdmVTZXQgPSBbXTtcblxuICAgICAgICB0aGlzLnBhc3NhZ2VUb0NsYXNzID0ge1xuICAgICAgICAgICAgMDogJ24nLFxuICAgICAgICAgICAgMTogJ3MnLFxuICAgICAgICAgICAgMjogJ2UnLFxuICAgICAgICAgICAgMzogJ3cnXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbnZlcnNlUGFzc2FnZSA9IHtcbiAgICAgICAgICAgIDA6ICdzJyxcbiAgICAgICAgICAgIDE6ICduJyxcbiAgICAgICAgICAgIDI6ICd3JyxcbiAgICAgICAgICAgIDM6ICdlJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIF9wb3B1bGF0ZUNlbGxzICgpIHtcbiAgICAgICAgdGhpcy5fY2VsbHMgPSBbXTtcblxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrICkge1xuICAgICAgICAgICAgdGhpcy5fY2VsbHMucHVzaCggW10gKTtcblxuICAgICAgICAgICAgZm9yICggbGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrICkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NlbGxzWyBpIF0ucHVzaCgge1xuICAgICAgICAgICAgICAgICAgICB4OiBqLFxuICAgICAgICAgICAgICAgICAgICB5OiBpLFxuICAgICAgICAgICAgICAgICAgICBleGl0czogW10sXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgdmlzaXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9nZXRTdGFydFhQb3MgKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGggKTtcbiAgICB9XG5cbiAgICBfZ2V0U3RhcnRZUG9zICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBub2RlIHRvIGFjdCBhcyBoZWFkIG5vZGUgZm9yIGdlbmVyYXRpb24sIHdpbGwgZWl0aGVyIHNlbGVjdCBhIG5vZGUgYXRcbiAgICAgKiByYW5kb20sIG9yIHRoZSBsYXN0IGFkZGVkIG5vZGVcbiAgICAgKi9cbiAgICBfZ2V0SGVhZE5vZGUgKCkge1xuICAgICAgICAvLyBHZXQgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gMCAtIDk5XG4gICAgICAgIHZhciBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIDEwMCApO1xuXG4gICAgICAgIC8vIElmIHRoZSByYW5kb20gbnVtYmVyIGlzIGxlc3MgdGhhbiB0aGUgc3BsaXQgbW9kaWZpZXIsXG4gICAgICAgIC8vIHNlbGVjdCBhbiBleGlzdGluZyBub2RlICggd2lsbCBjYXVzZSBhIHRyZW5kIHRvd2FyZHMgZGVhZCBlbmRzIClcbiAgICAgICAgaWYgKCBuIDwgdGhpcy5zcGxpdCApIHtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogdGhpcy5fYWN0aXZlU2V0Lmxlbmd0aCApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzZWxlY3QgdGhlIGxhc3QgYWRkZWQgbm9kZVxuICAgICAgICAvLyAoIHdpbGwgY2F1c2UgYSB0cmVuZCB0b3dhcmRzIHdpbmRpbmcgdHJhaWxzIClcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuID0gdGhpcy5fYWN0aXZlU2V0Lmxlbmd0aCAtIDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG5cbiAgICBfc3RvcmVVbnZpc2l0ZWRDZWxsKCBjdXJyZW50LCByZXN1bHQsIGRpcmVjdGlvbiApIHtcbiAgICAgICAgaWYgKCAhY3VycmVudC52aXNpdGVkICkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goIHsgY2VsbDogY3VycmVudCwgZGlyZWN0aW9uOiBkaXJlY3Rpb24gfSApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2dldFVudmlzaXRlZE5laWdoYm9ycyAoIGNlbGwgKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICAvLyBOb3J0aFxuICAgICAgICBpZiAoIGNlbGwueSAhPT0gMCApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JlVW52aXNpdGVkQ2VsbCggdGhpcy5fY2VsbHNbIGNlbGwueSAtIDEgXVsgY2VsbC54IF0sIHJlc3VsdCwgMCApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2VzdFxuICAgICAgICBpZiAoIGNlbGwueCAhPT0gMCApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JlVW52aXNpdGVkQ2VsbCggdGhpcy5fY2VsbHNbIGNlbGwueSBdWyBjZWxsLnggLSAxIF0sIHJlc3VsdCwgMyApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU291dGhcbiAgICAgICAgaWYgKCBjZWxsLnkgIT09IHRoaXMuaGVpZ2h0IC0gMSApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JlVW52aXNpdGVkQ2VsbCggdGhpcy5fY2VsbHNbIGNlbGwueSArIDEgXVsgY2VsbC54IF0sIHJlc3VsdCwgMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRWFzdFxuICAgICAgICBpZiAoIGNlbGwueCAhPT0gdGhpcy53aWR0aCAtIDEgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoIHRoaXMuX2NlbGxzWyBjZWxsLnkgXVsgY2VsbC54ICsgMSBdLCByZXN1bHQsIDIgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggcmVzdWx0Lmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIGNlbGwuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBfZ2VuZXJhdGUgKCkge1xuICAgICAgICB2YXIgY3VycmVudCwgbmV4dCwgbmVpZ2hib3JzLCBuO1xuXG4gICAgICAgIHdoaWxlICggdGhpcy5fYWN0aXZlU2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgIG4gPSB0aGlzLl9nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgY3VycmVudCA9IHRoaXMuX2FjdGl2ZVNldFsgbiBdO1xuXG4gICAgICAgICAgICB0aGlzLm1heERpc3RhbmNlID0gTWF0aC5tYXgoIHRoaXMubWF4RGlzdGFuY2UsIGN1cnJlbnQuZGlzdGFuY2UgKTtcblxuICAgICAgICAgICAgbmVpZ2hib3JzID0gdGhpcy5fZ2V0VW52aXNpdGVkTmVpZ2hib3JzKCBjdXJyZW50ICk7XG5cbiAgICAgICAgICAgIGlmICggbmVpZ2hib3JzICkge1xuICAgICAgICAgICAgICAgIG5leHQgPSBuZWlnaGJvcnNbIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoICkgXTtcblxuICAgICAgICAgICAgICAgIG5leHQuY2VsbC5leGl0cy5wdXNoKCB0aGlzLmludmVyc2VQYXNzYWdlWyBuZXh0LmRpcmVjdGlvbiBdICk7XG4gICAgICAgICAgICAgICAgbmV4dC5jZWxsLmRpc3RhbmNlID0gY3VycmVudC5kaXN0YW5jZSArIDE7XG4gICAgICAgICAgICAgICAgbmV4dC5jZWxsLnZpc2l0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnB1c2goIG5leHQuY2VsbCApO1xuXG4gICAgICAgICAgICAgICAgY3VycmVudC5leGl0cy5wdXNoKCB0aGlzLnBhc3NhZ2VUb0NsYXNzWyBuZXh0LmRpcmVjdGlvbiBdICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVNldC5zcGxpY2UoIG4sIDEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlKCBzdGFydFgsIHN0YXJ0WSApIHtcbiAgICAgICAgdmFyIGN1cnJlbnQ7XG5cbiAgICAgICAgdGhpcy5fcG9wdWxhdGVDZWxscygpO1xuXG4gICAgICAgIHRoaXMubWF4RGlzdGFuY2UgPSAwO1xuXG4gICAgICAgIGlmICggc3RhcnRYID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICBzdGFydFggPSB0aGlzLl9nZXRTdGFydFhQb3MoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggc3RhcnRZID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICBzdGFydFkgPSB0aGlzLl9nZXRTdGFydFlQb3MoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnQgPSB0aGlzLl9jZWxsc1sgc3RhcnRZIF1bIHN0YXJ0WCBdO1xuICAgICAgICBjdXJyZW50LmRpc3RhbmNlID0gMDtcbiAgICAgICAgY3VycmVudC52aXNpdGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9hY3RpdmVTZXQucHVzaCggY3VycmVudCApO1xuXG4gICAgICAgIHRoaXMuX2dlbmVyYXRlKCk7XG4gICAgfVxufVxuIl19
