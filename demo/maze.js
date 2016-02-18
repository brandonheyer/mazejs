(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _maze = require('./maze');

var _maze2 = _interopRequireDefault(_maze);

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
    maze = new _maze2.default($maze);

    (0, _jquery2.default)('.maze-input').hide().first().show();

    (0, _jquery2.default)('#generate').click(function (event) {
        event.preventDefault();
        clearGrid();

        maze.height = parseInt((0, _jquery2.default)('#grid-height').val(), 10);
        maze.width = parseInt((0, _jquery2.default)('#grid-width').val(), 10);
        maze.cellSize = parseInt((0, _jquery2.default)('#cell-size').val(), 10);
        maze.split = parseInt((0, _jquery2.default)('#maze-style').val(), 10);

        maze.generate();
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

},{"./maze":2,"jquery":"jquery","underscore":"underscore"}],2:[function(require,module,exports){
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
    function _class($element) {
        _classCallCheck(this, _class);

        this.$maze = $element;
        this.cellSize = 10;
        this.distance = 0;
        this.maxDistance = 0;

        this.height = 20;
        this.width = 50;

        this.currTime = new Date();
        this.drawTime = 0;
        this.split = 0;

        this._activeSet = [];

        this.heats = [];

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
        key: 'draw',
        value: function draw() {
            var output = '';

            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    output += '<div id="' + j + '-' + i + '" class="cell visited complete ' + this._cells[i][j].exits.join(' ') + '" style="width: ' + this.cellSize + 'px; height: ' + this.cellSize + 'px;"></div>';
                }
            }

            this.$maze.append(output).addClass('finished');
        }
    }, {
        key: 'generate',
        value: function generate(callback) {
            var current;

            this.$maze.width(this.width * this.cellSize).height(this.height * this.cellSize).attr('data-width', this.width).attr('data-height', this.height);

            this._populateCells();

            this.maxDistance = 0;

            current = this._cells[this._getStartYPos()][this._getStartXPos()];
            current.distance = 0;
            current.visited = true;

            this._activeSet.push(current);

            this._generate(_underscore2.default.bind(this.draw, this));
        }
    }, {
        key: '_generate',
        value: function _generate(callback) {
            var _this = this;

            var current, next, neighbors, n;

            n = this._getHeadNode();

            current = this._activeSet[n];

            this.maxDistance = Math.max(this.maxDistance, current.distance);

            neighbors = this._getUnvisitedNeighbors(current);

            if (neighbors) {
                n = Math.floor(Math.random() * neighbors.length);
                next = neighbors[n];

                next.cell.exits.push(this.inversePassage[next.direction]);
                next.cell.distance = current.distance + 1;
                next.cell.visited = true;

                this._activeSet.push(next.cell);

                current.exits.push(this.passageToClass[next.direction]);
            } else {
                this._activeSet.splice(n, 1);
            }

            if (this._activeSet.length) {
                try {
                    this._generate(callback);
                } catch (e) {
                    if (e instanceof RangeError) {
                        (function () {
                            var context = _this;
                            _underscore2.default.defer(function () {
                                context._generate(callback);
                            });
                        })();
                    } else {
                        throw e;
                    }
                }
            } else {
                callback();
            }
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"jquery":"jquery","underscore":"underscore"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbWF6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFJLFFBQUosRUFBYyxJQUFkLEVBQW9CLFNBQXBCLEVBQStCLFNBQS9CLEVBQTBDLENBQTFDLEVBQTZDLEtBQTdDLEVBQW9ELElBQXBEOztBQUVBLElBQUksZUFBZTtBQUNmLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLGFBQVMsR0FBVDtBQUNBLGFBQVMsR0FBVDtBQUNBLGFBQVMsR0FBVDtBQUNBLGVBQVcsR0FBWDtBQUNBLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLGFBQVMsR0FBVDtBQUNBLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFNBQUssR0FBTDtDQWZBOztBQWtCSixJQUFJLGVBQWU7QUFDZixTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEdBQUw7Q0FmQTs7QUFrQkosSUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsR0FBVztBQUMzQixRQUFJLFdBQVcsRUFBWDtRQUFlLGFBQWEsU0FBUyxHQUFULEdBQWUsS0FBZixHQUF1QixHQUF2QixHQUE2QixNQUFNLElBQU4sQ0FBWSxRQUFaLEVBQXVCLElBQXZCLENBQTZCLElBQTdCLENBQTdC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O0FBUWIscUJBQUssVUFBTCxDQUFnQixJQUFoQixDQUFzQixLQUFLLElBQUwsQ0FBdEIsQ0FSYTs7QUFVYix3QkFBUSxLQUFSLENBQWMsSUFBZCxDQUFvQixLQUFLLGNBQUwsQ0FBcUIsS0FBSyxTQUFMLENBQXpDLEVBVmE7YUFBakIsTUFXTztBQUNILHFCQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFERzthQVhQOztBQWVBLGdCQUFLLEtBQUssVUFBTCxDQUFnQixNQUFoQixFQUF5QjtBQUMxQixvQkFBSTtBQUNBLHlCQUFLLFNBQUwsQ0FBZ0IsUUFBaEIsRUFEQTtpQkFBSixDQUVFLE9BQVEsQ0FBUixFQUFZO0FBQ1Ysd0JBQUssYUFBYSxVQUFiLEVBQTBCOztBQUMzQixnQ0FBSSxlQUFKO0FBQ0EsaURBQUUsS0FBRixDQUFTLFlBQVc7QUFDaEIsd0NBQVEsU0FBUixDQUFtQixRQUFuQixFQURnQjs2QkFBWCxDQUFUOzZCQUYyQjtxQkFBL0IsTUFLTztBQUNILDhCQUFNLENBQU4sQ0FERztxQkFMUDtpQkFERjthQUhOLE1BYU87QUFDSCwyQkFERzthQWJQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBNYXplIGZyb20gJy4vbWF6ZSc7XG5cbnZhciAkY3VycmVudCwgJG5ldywgbmVpZ2hib3JzLCBkaXJlY3Rpb24sIG4sICRtYXplLCBtYXplO1xuXG52YXIgc2F2ZU1hcHBpbmdzID0ge1xuICAgICduJzogJzAnLFxuICAgICduIGUnOiAnMScsXG4gICAgJ24gcyc6ICcyJyxcbiAgICAnbiB3JzogJzMnLFxuICAgICduIGUgcyc6ICc0JyxcbiAgICAnbiBlIHcnOiAnNScsXG4gICAgJ24gcyB3JzogJzYnLFxuICAgICduIGUgcyB3JzogJzcnLFxuICAgICdlJzogJzgnLFxuICAgICdlIHMnOiAnOScsXG4gICAgJ2Ugdyc6ICdBJyxcbiAgICAnZSBzIHcnOiAnQicsXG4gICAgJ3MnOiAnQycsXG4gICAgJ3Mgdyc6ICdEJyxcbiAgICAndyc6ICdFJ1xufTtcblxudmFyIGxvYWRNYXBwaW5ncyA9IHtcbiAgICAnMCc6ICduJyxcbiAgICAnMSc6ICduIGUnLFxuICAgICcyJzogJ24gcycsXG4gICAgJzMnOiAnbiB3JyxcbiAgICAnNCc6ICduIGUgcycsXG4gICAgJzUnOiAnbiBlIHcnLFxuICAgICc2JzogJ24gcyB3JyxcbiAgICAnNyc6ICduIGUgcyB3JyxcbiAgICAnOCc6ICdlJyxcbiAgICAnOSc6ICdlIHMnLFxuICAgICdBJzogJ2UgdycsXG4gICAgJ0InOiAnZSBzIHcnLFxuICAgICdDJzogJ3MnLFxuICAgICdEJzogJ3MgdycsXG4gICAgJ0UnOiAndydcbn07XG5cbnZhciBnZXRTYXZlU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbmlzaGVzID0gJycsIHNhdmVTdHJpbmcgPSBoZWlnaHQgKyAnfCcgKyB3aWR0aCArICd8JyArICRtYXplLmZpbmQoICcuc3RhcnQnICkuYXR0ciggJ2lkJyApICsgJ3wnO1xuXG4gICAgJG1hemUuZmluZCggJy5maW5pc2gnICkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgIGZpbmlzaGVzICs9ICcuJyArICQoIHRoaXMgKS5hdHRyKCAnaWQnICk7XG4gICAgfSApO1xuXG4gICAgc2F2ZVN0cmluZyArPSBmaW5pc2hlcy5zdWJzdHJpbmcoIDEgKSArICc6JztcblxuICAgICRtYXplLmZpbmQoICcuY2VsbCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCggdGhpcyApLCBjbGFzc1N0cmluZyA9ICcnO1xuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICduJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICdlJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICdzJyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyBzJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICd3JyApICkge1xuICAgICAgICAgICAgY2xhc3NTdHJpbmcgKz0gJyB3JztcbiAgICAgICAgfVxuXG4gICAgICAgIHNhdmVTdHJpbmcgKz0gc2F2ZU1hcHBpbmdzWyBjbGFzc1N0cmluZy5zdWJzdHJpbmcoIDEgKSBdO1xuICAgIH0gKTtcblxuICAgIHJldHVybiBzYXZlU3RyaW5nO1xufTtcblxudmFyIGxvYWRTYXZlU3RyaW5nID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcgKSB7XG4gICAgdmFyIHN1YlBhcnRzLCBwYXJ0cyA9IHNhdmVTdHJpbmcuc3BsaXQoICc6JyApO1xuICAgIGlmICggcGFydHMubGVuZ3RoICE9PSAyICkge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgTWF6ZSBTdHJpbmcnO1xuICAgIH1cblxuICAgIHN1YlBhcnRzID0gcGFydHNbIDAgXS5zcGxpdCggJ3wnICk7XG4gICAgaWYgKCBzdWJQYXJ0cy5sZW5ndGggIT09IDQgKSB7XG4gICAgICAgIHJldHVybiAnSW52YWxpZCBNYXplIFN0cmluZyc7XG4gICAgfVxuXG4gICAgd2lkdGggPSBwYXJzZUludCggc3ViUGFydHMgWyAxIF0sIDEwICk7XG4gICAgaGVpZ2h0ID0gcGFyc2VJbnQoIHN1YlBhcnRzWyAwIF0sIDEwICk7XG5cbiAgICBpZiAoIGlzTmFOKCB3aWR0aCApIHx8IGlzTmFOKCBoZWlnaHQgKSApIHtcbiAgICAgICAgcmV0dXJuICdJbnZhbGlkIE1hemUgU3RyaW5nJztcbiAgICB9XG5cbiAgICBjbGVhckdyaWQoKTtcbiAgICBkcmF3R3JpZCggaGVpZ2h0LCB3aWR0aCwgXy5wYXJ0aWFsKCBsb2FkRHJhdywgcGFydHNbIDEgXSwgc3ViUGFydHNbIDIgXSwgc3ViUGFydHNbIDMgXS5zcGxpdCggJy4nICkgKSApO1xufTtcblxudmFyIGxvYWREcmF3Q2VsbCA9IGZ1bmN0aW9uKCBzYXZlU3RyaW5nLCBpICkge1xuICAgICQoIHRoaXMgKS5hZGRDbGFzcyggbG9hZE1hcHBpbmdzWyBzYXZlU3RyaW5nLmNoYXJBdCggaSApIF0gKTtcbn1cblxudmFyIGxvYWREcmF3ID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcsIHN0YXJ0SUQsIGZpbmlzaElEcyApIHtcbiAgICAkbWF6ZS5maW5kKCAnLmNlbGwnICkuZWFjaCggXy5wYXJ0aWFsKCBsb2FkRHJhd0NlbGwsIHNhdmVTdHJpbmcgKSApLmFkZENsYXNzKCAndmlzaXRlZCBjb21wbGV0ZScgKTtcbiAgICAkbWF6ZS5maW5kKCAnIycgKyBzdGFydElEICkuYWRkQ2xhc3MoICdzdGFydCcgKTtcblxuICAgIF8uZWFjaCggZmluaXNoSURzLCBmdW5jdGlvbiggaWQgKSB7XG4gICAgICAgICRtYXplLmZpbmQoICcjJyArIGlkICkuYWRkQ2xhc3MoICdmaW5pc2gnICk7XG4gICAgfSApO1xuXG4gICAgZmluYWxpemVNYXplKCk7XG59O1xuXG52YXIgY2xlYXJHcmlkID0gZnVuY3Rpb24oKSB7XG4gICAgJG1hemUuZW1wdHkoKS5yZW1vdmVDbGFzcyggJ2ZpbmlzaGVkJyApO1xuICAgIG1hemUuY2VsbHMgPSBbXTtcbn07XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuICAgICRtYXplID0gJCggJy5tYXplJyApO1xuICAgIG1hemUgPSBuZXcgTWF6ZSggJG1hemUgKTtcblxuICAgICQoICcubWF6ZS1pbnB1dCcgKS5oaWRlKCkuZmlyc3QoKS5zaG93KCk7XG5cbiAgICAkKCAnI2dlbmVyYXRlJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNsZWFyR3JpZCgpO1xuXG4gICAgICAgIG1hemUuaGVpZ2h0ID0gcGFyc2VJbnQoICQoICcjZ3JpZC1oZWlnaHQnICkudmFsKCksIDEwICk7XG4gICAgICAgIG1hemUud2lkdGggPSBwYXJzZUludCggJCggJyNncmlkLXdpZHRoJyApLnZhbCgpLCAxMCApO1xuICAgICAgICBtYXplLmNlbGxTaXplID0gcGFyc2VJbnQoICQoICcjY2VsbC1zaXplJyApLnZhbCgpLCAxMCApO1xuICAgICAgICBtYXplLnNwbGl0ID0gcGFyc2VJbnQoICQoICcjbWF6ZS1zdHlsZScgKS52YWwoKSwgMTAgKTtcblxuICAgICAgICBtYXplLmdlbmVyYXRlKCk7XG4gICAgfSApO1xuXG4gICAgJCggJyNncmlkLXdpZHRoJyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkY29sID0gJCggJy5sYXJnZS0xMi5jb2x1bW5zJyApLFxuICAgICAgICAgICAgY29sV2lkdGggPSAkY29sLmlubmVyV2lkdGgoKSAtIDEwMCxcbiAgICAgICAgICAgIGdyaWRXaWR0aCA9IHBhcnNlSW50KCAkKCB0aGlzICkudmFsKCkgKTtcbiAgICAgICAgaWYgKCBpc05hTiggZ3JpZFdpZHRoICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCA0MCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBncmlkV2lkdGggPCAyICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggZ3JpZFdpZHRoICkgKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjZ3JpZC1oZWlnaHQnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGdyaWRIZWlnaHQgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIGlmICggaXNOYU4oIGdyaWRIZWlnaHQgKSApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIwICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGdyaWRIZWlnaHQgPCAyICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggZ3JpZEhlaWdodCApICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI2NlbGwtc2l6ZScgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2VsbFNpemUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG5cbiAgICAgICAgaWYgKCBpc05hTiggY2VsbFNpemUgKSApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIwICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNlbGxTaXplIDwgMyApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDMgKTtcbiAgICAgICAgfSBlbHNlIGlmICggY2VsbFNpemUgPiAzMCApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDMwICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCBNYXRoLmZsb29yKCBjZWxsU2l6ZSApICk7XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsU2l6ZSA9IHBhcnNlSW50KCAkKCB0aGlzICkudmFsKCkgKTtcbiAgICAgICAgdmFyICRjb2wgPSAkKCAnLmxhcmdlLTEyLmNvbHVtbnMnICksXG4gICAgICAgICAgICBjb2xXaWR0aCA9ICRjb2wuaW5uZXJXaWR0aCgpIC0gMTAwLFxuICAgICAgICAgICAgZ3JpZFdpZHRoID0gcGFyc2VJbnQoICQoICcjZ3JpZC13aWR0aCcgKS52YWwoKSApLFxuICAgICAgICAgICAgZ3JpZEhlaWdodCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtaGVpZ2h0JyApLnZhbCgpICk7XG5cbiAgICAgICAgaWYgKCBncmlkV2lkdGggPiBjb2xXaWR0aCAvIGNlbGxTaXplICkge1xuICAgICAgICAgICAgJCggJyNncmlkLXdpZHRoJyApLnZhbCggTWF0aC5mbG9vciggY29sV2lkdGggLyBjZWxsU2l6ZSApIClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggZ3JpZEhlaWdodCA+IDYwMCAvIGNlbGxTaXplICkge1xuICAgICAgICAgICAgJCggJyNncmlkLWhlaWdodCcgKS52YWwoIE1hdGguZmxvb3IoIDYwMCAvIGNlbGxTaXplICkgKVxuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNtYXplLXN0eWxlJyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IHBhcnNlSW50KCAkKCB0aGlzICkudmFsKCkgKTtcblxuICAgICAgICBpZiggaXNOYU4oIHN0eWxlICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCA1MCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBzdHlsZSA8IDAgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAwICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIHN0eWxlID4gMTAwICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMTAwICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCBNYXRoLmZsb29yKCBzdHlsZSApICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI3FtYXJrJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR1cGRhdGVzID0gJCggJyN1cGRhdGVzJyApO1xuXG4gICAgICAgIGlmICggJHVwZGF0ZXMuaGFzQ2xhc3MoICdleHBhbmRlZCcgKSApIHtcbiAgICAgICAgICAgICR1cGRhdGVzLnN0b3AoIHRydWUsIHRydWUgKS5yZW1vdmVDbGFzcyggJ2V4cGFuZGVkJyApLmFuaW1hdGUoIHsgJ3JpZ2h0JzogJy01MzBweCcgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHVwZGF0ZXMuc3RvcCggdHJ1ZSwgdHJ1ZSApLmFkZENsYXNzKCAnZXhwYW5kZWQnICkuYW5pbWF0ZSggeyAncmlnaHQnOiAnNXB4JyB9ICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI3RvZ2dsZS1oZWF0bWFwJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksajtcbiAgICAgICAgaWYgKCBtYXplLmhlYXRzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGZvciAoIGkgPSAwOyBpIDwgbWF6ZS5oZWF0cy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBtYXplLmhlYXRzWyBpIF0ucmVtb3ZlQ2xhc3MoICdkaXN0YW5jZS0nICsgaSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBoZWF0cyA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS0wXCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtMCcgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS0xXCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtMScgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS0yXCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtMicgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS0zXCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtMycgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS00XCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtNCcgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS01XCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtNScgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS02XCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtNicgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS03XCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtNycgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS04XCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtOCcgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS05XCJdJyApLmFkZENsYXNzKCAnZGlzdGFuY2UtOScgKSApO1xuICAgICAgICAgICAgbWF6ZS5oZWF0cy5wdXNoKCAkbWF6ZS5maW5kKCAnW2RhdGEtZGlzdGFuY2UtY2xhc3M9XCJkaXN0YW5jZS0xMFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTEwJyApICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI3pvb20tb3V0JyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCBjZWxsU2l6ZSA8PSA1ICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSAtIDI7XG4gICAgICAgICQoICcuY2VsbCcgKS5jc3MoIHtcbiAgICAgICAgICAgIHdpZHRoOiBjZWxsU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogY2VsbFNpemVcbiAgICAgICAgfSApO1xuXG4gICAgICAgICRtYXplLndpZHRoKCBjZWxsU2l6ZSAqIHBhcnNlSW50KCAkbWF6ZS5hdHRyKCAnZGF0YS13aWR0aCcgKSwgMTAgKSApLmhlaWdodCggY2VsbFNpemUgKiBwYXJzZUludCggJG1hemUuYXR0ciggJ2RhdGEtaGVpZ2h0JyApLCAxMCApICk7XG4gICAgfSApO1xuXG4gICAgJCggJyN6b29tLWluJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCBjZWxsU2l6ZSA+PSA5OCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgKyAyO1xuICAgICAgICAkKCAnLmNlbGwnICkuY3NzKCB7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkbWF6ZS53aWR0aCggY2VsbFNpemUgKiBwYXJzZUludCggJG1hemUuYXR0ciggJ2RhdGEtd2lkdGgnICksIDEwICkgKS5oZWlnaHQoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLWhlaWdodCcgKSwgMTAgKSApO1xuICAgIH0gKTtcblxuICAgICQoICcjc2F2ZS1tYXplJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCAkbWF6ZS5oYXNDbGFzcyggJ2ZpbmlzaGVkJyApICkge1xuICAgICAgICAgICAgJCggJyNtYXplLXNhdmVzdHJpbmcnICkudmFsKCBnZXRTYXZlU3RyaW5nKCkgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoICcjbWF6ZS1zYXZlc3RyaW5nJyApLnZhbCggJ0dlbmVyYXRlIG9yIGxvYWQgYSBtYXplIGZpcnN0IScgKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjbWF6ZS1zYXZlc3RyaW5nJyApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcbiAgICAgICAgdGhpcy5zZWxlY3QoKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gKTtcblxuICAgICQoICcjbG9hZC1tYXplJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgbG9hZFNhdmVTdHJpbmcoICQoICcjbWF6ZS1zYXZlc3RyaW5nJyApLnZhbCgpICk7XG4gICAgfSlcblxuICAgICQoICcjaW8tYnV0dG9uJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCggdGhpcyApO1xuXG4gICAgICAgIGlmICggJHRoaXMuaGFzQ2xhc3MoICdzZWNvbmRhcnknICkgKSB7XG4gICAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcyggJ3NlY29uZGFyeScgKTtcbiAgICAgICAgICAgICQoICcubWF6ZS1pbnB1dCcgKS5oaWRlKCkuZmlsdGVyKCAnI21hemUtaW8nICkuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoICdzZWNvbmRhcnknICk7XG4gICAgICAgICAgICAkKCAnLm1hemUtaW5wdXQnICkuaGlkZSgpLmZpcnN0KCkuc2hvdygpO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggd2luZG93ICkucmVzaXplKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhlaWdodCA9IDA7XG5cbiAgICAgICAgJCggJ2JvZHkgPiAucm93Om5vdCgubWMtcm93KScpLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGVpZ2h0ICs9ICQoIHRoaXMgKS5oZWlnaHQoKTtcbiAgICAgICAgfSApXG5cbiAgICAgICAgJCggJyNtYXplLWNvbnRhaW5lcicgKS5oZWlnaHQoICQoIHRoaXMgKS5oZWlnaHQoKSAtIGhlaWdodCAtIDMwICk7XG4gICAgfSApLnJlc2l6ZSgpO1xuXG4gICAgJCggJyNlbnRlci1wcmludG1vZGUnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCAnYm9keScgKS5hZGRDbGFzcyggJ3ByaW50LW1vZGUnICk7XG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuYXR0ciggJ2RhdGEtc3R5bGUnLCAkKCAnI21hemUtY29udGFpbmVyJyApLmF0dHIoICdzdHlsZScgKSApLmF0dHIoICdzdHlsZScsICcnICk7XG4gICAgfSApO1xuXG4gICAgJCggJyNleGl0LXByaW50bW9kZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgICQoICdib2R5JyApLnJlbW92ZUNsYXNzKCAncHJpbnQtbW9kZScgKTtcbiAgICAgICAgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnc3R5bGUnLCAkKCAnI21hemUtY29udGFpbmVyJyApLmF0dHIoICdkYXRhLXN0eWxlJyApICk7XG4gICAgfSApO1xufSApO1xuIiwiaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IgKCAkZWxlbWVudCApIHtcbiAgICAgICAgdGhpcy4kbWF6ZSA9ICRlbGVtZW50O1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gMTA7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSAwO1xuICAgICAgICB0aGlzLm1heERpc3RhbmNlID0gMDtcblxuICAgICAgICB0aGlzLmhlaWdodCA9IDIwO1xuICAgICAgICB0aGlzLndpZHRoID0gNTA7XG5cbiAgICAgICAgdGhpcy5jdXJyVGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHRoaXMuZHJhd1RpbWUgPSAwO1xuICAgICAgICB0aGlzLnNwbGl0ID0gMDtcblxuICAgICAgICB0aGlzLl9hY3RpdmVTZXQgPSBbXTtcblxuICAgICAgICB0aGlzLmhlYXRzID0gW107XG5cbiAgICAgICAgdGhpcy5wYXNzYWdlVG9DbGFzcyA9IHtcbiAgICAgICAgICAgIDA6ICduJyxcbiAgICAgICAgICAgIDE6ICdzJyxcbiAgICAgICAgICAgIDI6ICdlJyxcbiAgICAgICAgICAgIDM6ICd3J1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW52ZXJzZVBhc3NhZ2UgPSB7XG4gICAgICAgICAgICAwOiAncycsXG4gICAgICAgICAgICAxOiAnbicsXG4gICAgICAgICAgICAyOiAndycsXG4gICAgICAgICAgICAzOiAnZSdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBfcG9wdWxhdGVDZWxscyAoKSB7XG4gICAgICAgIHRoaXMuX2NlbGxzID0gW107XG5cbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5oZWlnaHQ7IGkrKyApIHtcbiAgICAgICAgICAgIHRoaXMuX2NlbGxzLnB1c2goIFtdICk7XG5cbiAgICAgICAgICAgIGZvciAoIGxldCBqID0gMDsgaiA8IHRoaXMud2lkdGg7IGorKyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jZWxsc1sgaSBdLnB1c2goIHtcbiAgICAgICAgICAgICAgICAgICAgeDogaixcbiAgICAgICAgICAgICAgICAgICAgeTogaSxcbiAgICAgICAgICAgICAgICAgICAgZXhpdHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogLTEsXG4gICAgICAgICAgICAgICAgICAgIHZpc2l0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0U3RhcnRYUG9zICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoICk7XG4gICAgfVxuXG4gICAgX2dldFN0YXJ0WVBvcyAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogdGhpcy5oZWlnaHQgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbm9kZSB0byBhY3QgYXMgaGVhZCBub2RlIGZvciBnZW5lcmF0aW9uLCB3aWxsIGVpdGhlciBzZWxlY3QgYSBub2RlIGF0XG4gICAgICogcmFuZG9tLCBvciB0aGUgbGFzdCBhZGRlZCBub2RlXG4gICAgICovXG4gICAgX2dldEhlYWROb2RlICgpIHtcbiAgICAgICAgLy8gR2V0IGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDAgLSA5OVxuICAgICAgICB2YXIgbiA9IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiAxMDAgKTtcblxuICAgICAgICAvLyBJZiB0aGUgcmFuZG9tIG51bWJlciBpcyBsZXNzIHRoYW4gdGhlIHNwbGl0IG1vZGlmaWVyLFxuICAgICAgICAvLyBzZWxlY3QgYW4gZXhpc3Rpbmcgbm9kZSAoIHdpbGwgY2F1c2UgYSB0cmVuZCB0b3dhcmRzIGRlYWQgZW5kcyApXG4gICAgICAgIGlmICggbiA8IHRoaXMuc3BsaXQgKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMuX2FjdGl2ZVNldC5sZW5ndGggKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2VsZWN0IHRoZSBsYXN0IGFkZGVkIG5vZGVcbiAgICAgICAgLy8gKCB3aWxsIGNhdXNlIGEgdHJlbmQgdG93YXJkcyB3aW5kaW5nIHRyYWlscyApXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbiA9IHRoaXMuX2FjdGl2ZVNldC5sZW5ndGggLSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfVxuXG4gICAgX3N0b3JlVW52aXNpdGVkQ2VsbCggY3VycmVudCwgcmVzdWx0LCBkaXJlY3Rpb24gKSB7XG4gICAgICAgIGlmICggIWN1cnJlbnQudmlzaXRlZCApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCB7IGNlbGw6IGN1cnJlbnQsIGRpcmVjdGlvbjogZGlyZWN0aW9uIH0gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9nZXRVbnZpc2l0ZWROZWlnaGJvcnMgKCBjZWxsICkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgLy8gTm9ydGhcbiAgICAgICAgaWYgKCBjZWxsLnkgIT09IDAgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoIHRoaXMuX2NlbGxzWyBjZWxsLnkgLSAxIF1bIGNlbGwueCBdLCByZXN1bHQsIDAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlc3RcbiAgICAgICAgaWYgKCBjZWxsLnggIT09IDAgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoIHRoaXMuX2NlbGxzWyBjZWxsLnkgXVsgY2VsbC54IC0gMSBdLCByZXN1bHQsIDMgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvdXRoXG4gICAgICAgIGlmICggY2VsbC55ICE9PSB0aGlzLmhlaWdodCAtIDEgKSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yZVVudmlzaXRlZENlbGwoIHRoaXMuX2NlbGxzWyBjZWxsLnkgKyAxIF1bIGNlbGwueCBdLCByZXN1bHQsIDEgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVhc3RcbiAgICAgICAgaWYgKCBjZWxsLnggIT09IHRoaXMud2lkdGggLSAxICkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVVbnZpc2l0ZWRDZWxsKCB0aGlzLl9jZWxsc1sgY2VsbC55IF1bIGNlbGwueCArIDEgXSwgcmVzdWx0LCAyICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHJlc3VsdC5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICBjZWxsLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSAnJztcblxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLmhlaWdodDsgaSsrICkge1xuICAgICAgICAgICAgZm9yICggbGV0IGogPSAwOyBqIDwgdGhpcy53aWR0aDsgaisrICkge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnPGRpdiBpZD1cIicgKyBqICsgJy0nICsgaSArICdcIiBjbGFzcz1cImNlbGwgdmlzaXRlZCBjb21wbGV0ZSAnICsgdGhpcy5fY2VsbHNbIGkgXVsgaiBdLmV4aXRzLmpvaW4oICcgJyApICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIHN0eWxlPVwid2lkdGg6ICcgKyB0aGlzLmNlbGxTaXplICsgJ3B4OyBoZWlnaHQ6ICcgKyB0aGlzLmNlbGxTaXplICsgJ3B4O1wiPjwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRtYXplLmFwcGVuZCggb3V0cHV0ICkuYWRkQ2xhc3MoICdmaW5pc2hlZCcgKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZSggY2FsbGJhY2sgKSB7XG4gICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgIHRoaXMuJG1hemVcbiAgICAgICAgICAgIC53aWR0aCggdGhpcy53aWR0aCAqIHRoaXMuY2VsbFNpemUgKVxuICAgICAgICAgICAgLmhlaWdodCggdGhpcy5oZWlnaHQgKiB0aGlzLmNlbGxTaXplIClcbiAgICAgICAgICAgIC5hdHRyKCAnZGF0YS13aWR0aCcsIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgLmF0dHIoICdkYXRhLWhlaWdodCcsIHRoaXMuaGVpZ2h0ICk7XG5cbiAgICAgICAgdGhpcy5fcG9wdWxhdGVDZWxscygpO1xuXG4gICAgICAgIHRoaXMubWF4RGlzdGFuY2UgPSAwO1xuXG4gICAgICAgIGN1cnJlbnQgPSB0aGlzLl9jZWxsc1sgdGhpcy5fZ2V0U3RhcnRZUG9zKCkgXVsgdGhpcy5fZ2V0U3RhcnRYUG9zKCkgXTtcbiAgICAgICAgY3VycmVudC5kaXN0YW5jZSA9IDA7XG4gICAgICAgIGN1cnJlbnQudmlzaXRlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnB1c2goIGN1cnJlbnQgKTtcblxuICAgICAgICB0aGlzLl9nZW5lcmF0ZSggXy5iaW5kKCB0aGlzLmRyYXcsIHRoaXMgKSApO1xuICAgIH1cblxuICAgIF9nZW5lcmF0ZSAoIGNhbGxiYWNrICkge1xuICAgICAgICB2YXIgY3VycmVudCwgbmV4dCwgbmVpZ2hib3JzLCBuO1xuXG4gICAgICAgIG4gPSB0aGlzLl9nZXRIZWFkTm9kZSgpO1xuXG4gICAgICAgIGN1cnJlbnQgPSB0aGlzLl9hY3RpdmVTZXRbIG4gXTtcblxuICAgICAgICB0aGlzLm1heERpc3RhbmNlID0gTWF0aC5tYXgoIHRoaXMubWF4RGlzdGFuY2UsIGN1cnJlbnQuZGlzdGFuY2UgKTtcblxuICAgICAgICBuZWlnaGJvcnMgPSB0aGlzLl9nZXRVbnZpc2l0ZWROZWlnaGJvcnMoIGN1cnJlbnQgKTtcblxuICAgICAgICBpZiAoIG5laWdoYm9ycyApIHtcbiAgICAgICAgICAgIG4gPSBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogbmVpZ2hib3JzLmxlbmd0aCApO1xuICAgICAgICAgICAgbmV4dCA9IG5laWdoYm9yc1sgbiBdO1xuXG4gICAgICAgICAgICBuZXh0LmNlbGwuZXhpdHMucHVzaCggdGhpcy5pbnZlcnNlUGFzc2FnZVsgbmV4dC5kaXJlY3Rpb24gXSApO1xuICAgICAgICAgICAgbmV4dC5jZWxsLmRpc3RhbmNlID0gY3VycmVudC5kaXN0YW5jZSArIDE7XG4gICAgICAgICAgICBuZXh0LmNlbGwudmlzaXRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVNldC5wdXNoKCBuZXh0LmNlbGwgKTtcblxuICAgICAgICAgICAgY3VycmVudC5leGl0cy5wdXNoKCB0aGlzLnBhc3NhZ2VUb0NsYXNzWyBuZXh0LmRpcmVjdGlvbiBdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hY3RpdmVTZXQuc3BsaWNlKCBuLCAxICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHRoaXMuX2FjdGl2ZVNldC5sZW5ndGggKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2dlbmVyYXRlKCBjYWxsYmFjayApO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBlIGluc3RhbmNlb2YgUmFuZ2VFcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBfLmRlZmVyKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2dlbmVyYXRlKCBjYWxsYmFjayApO1xuICAgICAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
