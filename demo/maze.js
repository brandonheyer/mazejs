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

        maze.drawGrid();
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
        key: 'drawGrid',
        value: function drawGrid() {
            var current;

            this.$maze.width(this.width * this.cellSize).height(this.height * this.cellSize).attr('data-width', this.width).attr('data-height', this.height);

            this._populateCells();

            this.maxDistance = 0;

            current = this._cells[this._getStartYPos()][this._getStartXPos()];
            current.distance = 0;
            current.visited = true;

            this._activeSet.push(current);

            this.draw();
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
        key: 'generate',
        value: function generate() {}
    }, {
        key: 'draw',
        value: function draw() {
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
                    this.draw();
                } catch (e) {
                    (function () {
                        var context = _this;
                        _underscore2.default.defer(function () {
                            context.draw();
                        });
                    })();
                }
            } else {
                this.finalizeMaze();
            }

            // else {
            //this.finalizeMaze();
            //this.addDepthClasses();
            //}
        }
    }, {
        key: 'finalizeMaze',
        value: function finalizeMaze() {
            var output = '';

            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    output += '<div id="' + j + '-' + i + '" class="cell visited complete ' + this._cells[i][j].exits.join(' ') + '" style="width: ' + this.cellSize + 'px; height: ' + this.cellSize + 'px;"></div>';
                }
            }

            this.$maze.append(output).addClass('finished');
        }

        /*
            addDepthClasses() {
                var i, j, distance;
        
                for ( i = 0; i < this._cells.length; i++ ) {
                    for( j = 0; j < this._cells[ i ].length; j++ ) {
                        this._cells[ i ][ j ]
                            .attr( 'data-distance-class', 'distance-' +
                                Math.floor( ( parseInt( this.cells[ i ][ j ].attr( 'data-distance' ) ) / this.maxDistance * 10 ) )
                            );
                    }
                }
            }*/

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
    }]);

    return _class;
}();

exports.default = _class;

},{"jquery":"jquery","underscore":"underscore"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbWF6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFJLFFBQUosRUFBYyxJQUFkLEVBQW9CLFNBQXBCLEVBQStCLFNBQS9CLEVBQTBDLENBQTFDLEVBQTZDLEtBQTdDLEVBQW9ELElBQXBEOztBQUVBLElBQUksZUFBZTtBQUNmLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLGFBQVMsR0FBVDtBQUNBLGFBQVMsR0FBVDtBQUNBLGFBQVMsR0FBVDtBQUNBLGVBQVcsR0FBWDtBQUNBLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLGFBQVMsR0FBVDtBQUNBLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFNBQUssR0FBTDtDQWZBOztBQWtCSixJQUFJLGVBQWU7QUFDZixTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEdBQUw7Q0FmQTs7QUFrQkosSUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsR0FBVztBQUMzQixRQUFJLFdBQVcsRUFBWDtRQUFlLGFBQWEsU0FBUyxHQUFULEdBQWUsS0FBZixHQUF1QixHQUF2QixHQUE2QixNQUFNLElBQU4sQ0FBWSxRQUFaLEVBQXVCLElBQXZCLENBQTZCLElBQTdCLENBQTdC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QWIsQ0FBMkIsS0FBSyxDQUFMLENBQXJELEVBQStELE1BQS9ELEVBQXVFLENBQXZFLEVBRDhCO2FBQWxDOzs7QUFkNEIsZ0JBbUJ2QixLQUFLLENBQUwsS0FBVyxLQUFLLEtBQUwsR0FBYSxDQUFiLEVBQWlCO0FBQzdCLHFCQUFLLG1CQUFMLENBQTBCLEtBQUssTUFBTCxDQUFhLEtBQUssQ0FBTCxDQUFiLENBQXVCLEtBQUssQ0FBTCxHQUFTLENBQVQsQ0FBakQsRUFBK0QsTUFBL0QsRUFBdUUsQ0FBdkUsRUFENkI7YUFBakM7O0FBSUEsZ0JBQUssT0FBTyxNQUFQLEtBQWtCLENBQWxCLEVBQXNCO0FBQ3ZCLHFCQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FEdUI7QUFFdkIsdUJBQU8sS0FBUCxDQUZ1QjthQUEzQjs7QUFLQSxtQkFBTyxNQUFQLENBNUI0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IF8gZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgTWF6ZSBmcm9tICcuL21hemUnO1xuXG52YXIgJGN1cnJlbnQsICRuZXcsIG5laWdoYm9ycywgZGlyZWN0aW9uLCBuLCAkbWF6ZSwgbWF6ZTtcblxudmFyIHNhdmVNYXBwaW5ncyA9IHtcbiAgICAnbic6ICcwJyxcbiAgICAnbiBlJzogJzEnLFxuICAgICduIHMnOiAnMicsXG4gICAgJ24gdyc6ICczJyxcbiAgICAnbiBlIHMnOiAnNCcsXG4gICAgJ24gZSB3JzogJzUnLFxuICAgICduIHMgdyc6ICc2JyxcbiAgICAnbiBlIHMgdyc6ICc3JyxcbiAgICAnZSc6ICc4JyxcbiAgICAnZSBzJzogJzknLFxuICAgICdlIHcnOiAnQScsXG4gICAgJ2UgcyB3JzogJ0InLFxuICAgICdzJzogJ0MnLFxuICAgICdzIHcnOiAnRCcsXG4gICAgJ3cnOiAnRSdcbn07XG5cbnZhciBsb2FkTWFwcGluZ3MgPSB7XG4gICAgJzAnOiAnbicsXG4gICAgJzEnOiAnbiBlJyxcbiAgICAnMic6ICduIHMnLFxuICAgICczJzogJ24gdycsXG4gICAgJzQnOiAnbiBlIHMnLFxuICAgICc1JzogJ24gZSB3JyxcbiAgICAnNic6ICduIHMgdycsXG4gICAgJzcnOiAnbiBlIHMgdycsXG4gICAgJzgnOiAnZScsXG4gICAgJzknOiAnZSBzJyxcbiAgICAnQSc6ICdlIHcnLFxuICAgICdCJzogJ2UgcyB3JyxcbiAgICAnQyc6ICdzJyxcbiAgICAnRCc6ICdzIHcnLFxuICAgICdFJzogJ3cnXG59O1xuXG52YXIgZ2V0U2F2ZVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaW5pc2hlcyA9ICcnLCBzYXZlU3RyaW5nID0gaGVpZ2h0ICsgJ3wnICsgd2lkdGggKyAnfCcgKyAkbWF6ZS5maW5kKCAnLnN0YXJ0JyApLmF0dHIoICdpZCcgKSArICd8JztcblxuICAgICRtYXplLmZpbmQoICcuZmluaXNoJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICBmaW5pc2hlcyArPSAnLicgKyAkKCB0aGlzICkuYXR0ciggJ2lkJyApO1xuICAgIH0gKTtcblxuICAgIHNhdmVTdHJpbmcgKz0gZmluaXNoZXMuc3Vic3RyaW5nKCAxICkgKyAnOic7XG5cbiAgICAkbWF6ZS5maW5kKCAnLmNlbGwnICkuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQoIHRoaXMgKSwgY2xhc3NTdHJpbmcgPSAnJztcblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAnbicgKSApIHtcbiAgICAgICAgICAgIGNsYXNzU3RyaW5nICs9ICcgbic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAnZScgKSApIHtcbiAgICAgICAgICAgIGNsYXNzU3RyaW5nICs9ICcgZSc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAncycgKSApIHtcbiAgICAgICAgICAgIGNsYXNzU3RyaW5nICs9ICcgcyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAndycgKSApIHtcbiAgICAgICAgICAgIGNsYXNzU3RyaW5nICs9ICcgdyc7XG4gICAgICAgIH1cblxuICAgICAgICBzYXZlU3RyaW5nICs9IHNhdmVNYXBwaW5nc1sgY2xhc3NTdHJpbmcuc3Vic3RyaW5nKCAxICkgXTtcbiAgICB9ICk7XG5cbiAgICByZXR1cm4gc2F2ZVN0cmluZztcbn07XG5cbnZhciBsb2FkU2F2ZVN0cmluZyA9IGZ1bmN0aW9uKCBzYXZlU3RyaW5nICkge1xuICAgIHZhciBzdWJQYXJ0cywgcGFydHMgPSBzYXZlU3RyaW5nLnNwbGl0KCAnOicgKTtcbiAgICBpZiAoIHBhcnRzLmxlbmd0aCAhPT0gMiApIHtcbiAgICAgICAgcmV0dXJuICdJbnZhbGlkIE1hemUgU3RyaW5nJztcbiAgICB9XG5cbiAgICBzdWJQYXJ0cyA9IHBhcnRzWyAwIF0uc3BsaXQoICd8JyApO1xuICAgIGlmICggc3ViUGFydHMubGVuZ3RoICE9PSA0ICkge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgTWF6ZSBTdHJpbmcnO1xuICAgIH1cblxuICAgIHdpZHRoID0gcGFyc2VJbnQoIHN1YlBhcnRzIFsgMSBdLCAxMCApO1xuICAgIGhlaWdodCA9IHBhcnNlSW50KCBzdWJQYXJ0c1sgMCBdLCAxMCApO1xuXG4gICAgaWYgKCBpc05hTiggd2lkdGggKSB8fCBpc05hTiggaGVpZ2h0ICkgKSB7XG4gICAgICAgIHJldHVybiAnSW52YWxpZCBNYXplIFN0cmluZyc7XG4gICAgfVxuXG4gICAgY2xlYXJHcmlkKCk7XG4gICAgZHJhd0dyaWQoIGhlaWdodCwgd2lkdGgsIF8ucGFydGlhbCggbG9hZERyYXcsIHBhcnRzWyAxIF0sIHN1YlBhcnRzWyAyIF0sIHN1YlBhcnRzWyAzIF0uc3BsaXQoICcuJyApICkgKTtcbn07XG5cbnZhciBsb2FkRHJhd0NlbGwgPSBmdW5jdGlvbiggc2F2ZVN0cmluZywgaSApIHtcbiAgICAkKCB0aGlzICkuYWRkQ2xhc3MoIGxvYWRNYXBwaW5nc1sgc2F2ZVN0cmluZy5jaGFyQXQoIGkgKSBdICk7XG59XG5cbnZhciBsb2FkRHJhdyA9IGZ1bmN0aW9uKCBzYXZlU3RyaW5nLCBzdGFydElELCBmaW5pc2hJRHMgKSB7XG4gICAgJG1hemUuZmluZCggJy5jZWxsJyApLmVhY2goIF8ucGFydGlhbCggbG9hZERyYXdDZWxsLCBzYXZlU3RyaW5nICkgKS5hZGRDbGFzcyggJ3Zpc2l0ZWQgY29tcGxldGUnICk7XG4gICAgJG1hemUuZmluZCggJyMnICsgc3RhcnRJRCApLmFkZENsYXNzKCAnc3RhcnQnICk7XG5cbiAgICBfLmVhY2goIGZpbmlzaElEcywgZnVuY3Rpb24oIGlkICkge1xuICAgICAgICAkbWF6ZS5maW5kKCAnIycgKyBpZCApLmFkZENsYXNzKCAnZmluaXNoJyApO1xuICAgIH0gKTtcblxuICAgIGZpbmFsaXplTWF6ZSgpO1xufTtcblxudmFyIGNsZWFyR3JpZCA9IGZ1bmN0aW9uKCkge1xuICAgICRtYXplLmVtcHR5KCkucmVtb3ZlQ2xhc3MoICdmaW5pc2hlZCcgKTtcbiAgICBtYXplLmNlbGxzID0gW107XG59O1xuXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcbiAgICAkbWF6ZSA9ICQoICcubWF6ZScgKTtcbiAgICBtYXplID0gbmV3IE1hemUoICRtYXplICk7XG5cbiAgICAkKCAnLm1hemUtaW5wdXQnICkuaGlkZSgpLmZpcnN0KCkuc2hvdygpO1xuXG4gICAgJCggJyNnZW5lcmF0ZScgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjbGVhckdyaWQoKTtcblxuICAgICAgICBtYXplLmhlaWdodCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtaGVpZ2h0JyApLnZhbCgpLCAxMCApO1xuICAgICAgICBtYXplLndpZHRoID0gcGFyc2VJbnQoICQoICcjZ3JpZC13aWR0aCcgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgbWF6ZS5jZWxsU2l6ZSA9IHBhcnNlSW50KCAkKCAnI2NlbGwtc2l6ZScgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgbWF6ZS5zcGxpdCA9IHBhcnNlSW50KCAkKCAnI21hemUtc3R5bGUnICkudmFsKCksIDEwICk7XG5cbiAgICAgICAgbWF6ZS5kcmF3R3JpZCgpO1xuICAgIH0gKTtcblxuICAgICQoICcjZ3JpZC13aWR0aCcgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGNvbCA9ICQoICcubGFyZ2UtMTIuY29sdW1ucycgKSxcbiAgICAgICAgICAgIGNvbFdpZHRoID0gJGNvbC5pbm5lcldpZHRoKCkgLSAxMDAsXG4gICAgICAgICAgICBncmlkV2lkdGggPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIGlmICggaXNOYU4oIGdyaWRXaWR0aCApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNDAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggZ3JpZFdpZHRoIDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRXaWR0aCApICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI2dyaWQtaGVpZ2h0JyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBncmlkSGVpZ2h0ID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuICAgICAgICBpZiAoIGlzTmFOKCBncmlkSGVpZ2h0ICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBncmlkSGVpZ2h0IDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRIZWlnaHQgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNjZWxsLXNpemUnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNlbGxTaXplID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggaXNOYU4oIGNlbGxTaXplICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBjZWxsU2l6ZSA8IDMgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNlbGxTaXplID4gMzAgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggY2VsbFNpemUgKSApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbFNpemUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIHZhciAkY29sID0gJCggJy5sYXJnZS0xMi5jb2x1bW5zJyApLFxuICAgICAgICAgICAgY29sV2lkdGggPSAkY29sLmlubmVyV2lkdGgoKSAtIDEwMCxcbiAgICAgICAgICAgIGdyaWRXaWR0aCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtd2lkdGgnICkudmFsKCkgKSxcbiAgICAgICAgICAgIGdyaWRIZWlnaHQgPSBwYXJzZUludCggJCggJyNncmlkLWhlaWdodCcgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggZ3JpZFdpZHRoID4gY29sV2lkdGggLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC13aWR0aCcgKS52YWwoIE1hdGguZmxvb3IoIGNvbFdpZHRoIC8gY2VsbFNpemUgKSApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGdyaWRIZWlnaHQgPiA2MDAgLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC1oZWlnaHQnICkudmFsKCBNYXRoLmZsb29yKCA2MDAgLyBjZWxsU2l6ZSApIClcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjbWF6ZS1zdHlsZScgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG5cbiAgICAgICAgaWYoIGlzTmFOKCBzdHlsZSApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNTAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggc3R5bGUgPCAwICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBzdHlsZSA+IDEwMCApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDEwMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggc3R5bGUgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNxbWFyaycgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdXBkYXRlcyA9ICQoICcjdXBkYXRlcycgKTtcblxuICAgICAgICBpZiAoICR1cGRhdGVzLmhhc0NsYXNzKCAnZXhwYW5kZWQnICkgKSB7XG4gICAgICAgICAgICAkdXBkYXRlcy5zdG9wKCB0cnVlLCB0cnVlICkucmVtb3ZlQ2xhc3MoICdleHBhbmRlZCcgKS5hbmltYXRlKCB7ICdyaWdodCc6ICctNTMwcHgnIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR1cGRhdGVzLnN0b3AoIHRydWUsIHRydWUgKS5hZGRDbGFzcyggJ2V4cGFuZGVkJyApLmFuaW1hdGUoIHsgJ3JpZ2h0JzogJzVweCcgfSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN0b2dnbGUtaGVhdG1hcCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLGo7XG4gICAgICAgIGlmICggbWF6ZS5oZWF0cy5sZW5ndGggKSB7XG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IG1hemUuaGVhdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgbWF6ZS5oZWF0c1sgaSBdLnJlbW92ZUNsYXNzKCAnZGlzdGFuY2UtJyArIGkgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGVhdHMgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTAnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTEnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTInICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtM1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTMnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTQnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTUnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTYnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtN1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTcnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTgnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTknICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMTBcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0xMCcgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN6b29tLW91dCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPD0gNSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgLSAyO1xuICAgICAgICAkKCAnLmNlbGwnICkuY3NzKCB7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkbWF6ZS53aWR0aCggY2VsbFNpemUgKiBwYXJzZUludCggJG1hemUuYXR0ciggJ2RhdGEtd2lkdGgnICksIDEwICkgKS5oZWlnaHQoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLWhlaWdodCcgKSwgMTAgKSApO1xuICAgIH0gKTtcblxuICAgICQoICcjem9vbS1pbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPj0gOTggKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplICsgMjtcbiAgICAgICAgJCggJy5jZWxsJyApLmNzcygge1xuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgJG1hemUud2lkdGgoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLXdpZHRoJyApLCAxMCApICkuaGVpZ2h0KCBjZWxsU2l6ZSAqIHBhcnNlSW50KCAkbWF6ZS5hdHRyKCAnZGF0YS1oZWlnaHQnICksIDEwICkgKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI3NhdmUtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggJG1hemUuaGFzQ2xhc3MoICdmaW5pc2hlZCcgKSApIHtcbiAgICAgICAgICAgICQoICcjbWF6ZS1zYXZlc3RyaW5nJyApLnZhbCggZ2V0U2F2ZVN0cmluZygpICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoICdHZW5lcmF0ZSBvciBsb2FkIGEgbWF6ZSBmaXJzdCEnICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI2xvYWQtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvYWRTYXZlU3RyaW5nKCAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoKSApO1xuICAgIH0pXG5cbiAgICAkKCAnI2lvLWJ1dHRvbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAnc2Vjb25kYXJ5JyApICkge1xuICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoICdzZWNvbmRhcnknICk7XG4gICAgICAgICAgICAkKCAnLm1hemUtaW5wdXQnICkuaGlkZSgpLmZpbHRlciggJyNtYXplLWlvJyApLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCAnc2Vjb25kYXJ5JyApO1xuICAgICAgICAgICAgJCggJy5tYXplLWlucHV0JyApLmhpZGUoKS5maXJzdCgpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoIHdpbmRvdyApLnJlc2l6ZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSAwO1xuXG4gICAgICAgICQoICdib2R5ID4gLnJvdzpub3QoLm1jLXJvdyknKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhlaWdodCArPSAkKCB0aGlzICkuaGVpZ2h0KCk7XG4gICAgICAgIH0gKVxuXG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuaGVpZ2h0KCAkKCB0aGlzICkuaGVpZ2h0KCkgLSBoZWlnaHQgLSAzMCApO1xuICAgIH0gKS5yZXNpemUoKTtcblxuICAgICQoICcjZW50ZXItcHJpbnRtb2RlJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgJCggJ2JvZHknICkuYWRkQ2xhc3MoICdwcmludC1tb2RlJyApO1xuICAgICAgICAkKCAnI21hemUtY29udGFpbmVyJyApLmF0dHIoICdkYXRhLXN0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnc3R5bGUnICkgKS5hdHRyKCAnc3R5bGUnLCAnJyApO1xuICAgIH0gKTtcblxuICAgICQoICcjZXhpdC1wcmludG1vZGUnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCAnYm9keScgKS5yZW1vdmVDbGFzcyggJ3ByaW50LW1vZGUnICk7XG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuYXR0ciggJ3N0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnZGF0YS1zdHlsZScgKSApO1xuICAgIH0gKTtcbn0gKTtcbiIsImltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yICggJGVsZW1lbnQgKSB7XG4gICAgICAgIHRoaXMuJG1hemUgPSAkZWxlbWVudDtcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IDEwO1xuICAgICAgICB0aGlzLmRpc3RhbmNlID0gMDtcbiAgICAgICAgdGhpcy5tYXhEaXN0YW5jZSA9IDA7XG5cbiAgICAgICAgdGhpcy5oZWlnaHQgPSAyMDtcbiAgICAgICAgdGhpcy53aWR0aCA9IDUwO1xuXG4gICAgICAgIHRoaXMuY3VyclRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0aGlzLmRyYXdUaW1lID0gMDtcbiAgICAgICAgdGhpcy5zcGxpdCA9IDA7XG5cbiAgICAgICAgdGhpcy5fYWN0aXZlU2V0ID0gW107XG5cbiAgICAgICAgdGhpcy5oZWF0cyA9IFtdO1xuXG4gICAgICAgIHRoaXMucGFzc2FnZVRvQ2xhc3MgPSB7XG4gICAgICAgICAgICAwOiAnbicsXG4gICAgICAgICAgICAxOiAncycsXG4gICAgICAgICAgICAyOiAnZScsXG4gICAgICAgICAgICAzOiAndydcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmludmVyc2VQYXNzYWdlID0ge1xuICAgICAgICAgICAgMDogJ3MnLFxuICAgICAgICAgICAgMTogJ24nLFxuICAgICAgICAgICAgMjogJ3cnLFxuICAgICAgICAgICAgMzogJ2UnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX3BvcHVsYXRlQ2VsbHMgKCkge1xuICAgICAgICB0aGlzLl9jZWxscyA9IFtdO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKysgKSB7XG4gICAgICAgICAgICB0aGlzLl9jZWxscy5wdXNoKCBbXSApO1xuXG4gICAgICAgICAgICBmb3IgKCBsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKysgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2VsbHNbIGkgXS5wdXNoKCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGosXG4gICAgICAgICAgICAgICAgICAgIHk6IGksXG4gICAgICAgICAgICAgICAgICAgIGV4aXRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IC0xLFxuICAgICAgICAgICAgICAgICAgICB2aXNpdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhd0dyaWQoKSB7XG4gICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgIHRoaXMuJG1hemVcbiAgICAgICAgICAgIC53aWR0aCggdGhpcy53aWR0aCAqIHRoaXMuY2VsbFNpemUgKVxuICAgICAgICAgICAgLmhlaWdodCggdGhpcy5oZWlnaHQgKiB0aGlzLmNlbGxTaXplIClcbiAgICAgICAgICAgIC5hdHRyKCAnZGF0YS13aWR0aCcsIHRoaXMud2lkdGggKVxuICAgICAgICAgICAgLmF0dHIoICdkYXRhLWhlaWdodCcsIHRoaXMuaGVpZ2h0ICk7XG5cbiAgICAgICAgdGhpcy5fcG9wdWxhdGVDZWxscygpO1xuXG4gICAgICAgIHRoaXMubWF4RGlzdGFuY2UgPSAwO1xuXG4gICAgICAgIGN1cnJlbnQgPSB0aGlzLl9jZWxsc1sgdGhpcy5fZ2V0U3RhcnRZUG9zKCkgXVsgdGhpcy5fZ2V0U3RhcnRYUG9zKCkgXTtcbiAgICAgICAgY3VycmVudC5kaXN0YW5jZSA9IDA7XG4gICAgICAgIGN1cnJlbnQudmlzaXRlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnB1c2goIGN1cnJlbnQgKTtcblxuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICB9XG5cbiAgICBfZ2V0U3RhcnRYUG9zICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoICk7XG4gICAgfVxuXG4gICAgX2dldFN0YXJ0WVBvcyAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogdGhpcy5oZWlnaHQgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbm9kZSB0byBhY3QgYXMgaGVhZCBub2RlIGZvciBnZW5lcmF0aW9uLCB3aWxsIGVpdGhlciBzZWxlY3QgYSBub2RlIGF0XG4gICAgICogcmFuZG9tLCBvciB0aGUgbGFzdCBhZGRlZCBub2RlXG4gICAgICovXG4gICAgX2dldEhlYWROb2RlICgpIHtcbiAgICAgICAgLy8gR2V0IGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIDAgLSA5OVxuICAgICAgICB2YXIgbiA9IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiAxMDAgKTtcblxuICAgICAgICAvLyBJZiB0aGUgcmFuZG9tIG51bWJlciBpcyBsZXNzIHRoYW4gdGhlIHNwbGl0IG1vZGlmaWVyLFxuICAgICAgICAvLyBzZWxlY3QgYW4gZXhpc3Rpbmcgbm9kZSAoIHdpbGwgY2F1c2UgYSB0cmVuZCB0b3dhcmRzIGRlYWQgZW5kcyApXG4gICAgICAgIGlmICggbiA8IHRoaXMuc3BsaXQgKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMuX2FjdGl2ZVNldC5sZW5ndGggKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2VsZWN0IHRoZSBsYXN0IGFkZGVkIG5vZGVcbiAgICAgICAgLy8gKCB3aWxsIGNhdXNlIGEgdHJlbmQgdG93YXJkcyB3aW5kaW5nIHRyYWlscyApXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbiA9IHRoaXMuX2FjdGl2ZVNldC5sZW5ndGggLSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfVxuXG4gICAgZ2VuZXJhdGUgKCkge1xuXG4gICAgfVxuXG4gICAgZHJhdyAoKSB7XG4gICAgICAgIHZhciBjdXJyZW50LCBuZXh0LCBuZWlnaGJvcnMsIG47XG5cbiAgICAgICAgbiA9IHRoaXMuX2dldEhlYWROb2RlKCk7XG5cbiAgICAgICAgY3VycmVudCA9IHRoaXMuX2FjdGl2ZVNldFsgbiBdO1xuXG4gICAgICAgIHRoaXMubWF4RGlzdGFuY2UgPSBNYXRoLm1heCggdGhpcy5tYXhEaXN0YW5jZSwgY3VycmVudC5kaXN0YW5jZSApO1xuXG4gICAgICAgIG5laWdoYm9ycyA9IHRoaXMuX2dldFVudmlzaXRlZE5laWdoYm9ycyggY3VycmVudCApO1xuXG4gICAgICAgIGlmICggbmVpZ2hib3JzICkge1xuICAgICAgICAgICAgbiA9IE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoICk7XG4gICAgICAgICAgICBuZXh0ID0gbmVpZ2hib3JzWyBuIF07XG5cbiAgICAgICAgICAgIG5leHQuY2VsbC5leGl0cy5wdXNoKCB0aGlzLmludmVyc2VQYXNzYWdlWyBuZXh0LmRpcmVjdGlvbiBdICk7XG4gICAgICAgICAgICBuZXh0LmNlbGwuZGlzdGFuY2UgPSBjdXJyZW50LmRpc3RhbmNlICsgMTtcbiAgICAgICAgICAgIG5leHQuY2VsbC52aXNpdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5fYWN0aXZlU2V0LnB1c2goIG5leHQuY2VsbCApO1xuXG4gICAgICAgICAgICBjdXJyZW50LmV4aXRzLnB1c2goIHRoaXMucGFzc2FnZVRvQ2xhc3NbIG5leHQuZGlyZWN0aW9uIF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVNldC5zcGxpY2UoIG4sIDEgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdGhpcy5fYWN0aXZlU2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgICAgICAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgXy5kZWZlciggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhdygpO1xuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmluYWxpemVNYXplKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAgIC8vdGhpcy5maW5hbGl6ZU1hemUoKTtcbiAgICAgICAgICAgIC8vdGhpcy5hZGREZXB0aENsYXNzZXMoKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG4gICAgZmluYWxpemVNYXplICgpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMuaGVpZ2h0OyBpKysgKSB7XG4gICAgICAgICAgICBmb3IgKCBsZXQgaiA9IDA7IGogPCB0aGlzLndpZHRoOyBqKysgKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8ZGl2IGlkPVwiJyArIGogKyAnLScgKyBpICsgJ1wiIGNsYXNzPVwiY2VsbCB2aXNpdGVkIGNvbXBsZXRlICcgKyB0aGlzLl9jZWxsc1sgaSBdWyBqIF0uZXhpdHMuam9pbiggJyAnICkgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgc3R5bGU9XCJ3aWR0aDogJyArIHRoaXMuY2VsbFNpemUgKyAncHg7IGhlaWdodDogJyArIHRoaXMuY2VsbFNpemUgKyAncHg7XCI+PC9kaXY+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1hemUuYXBwZW5kKCBvdXRwdXQgKS5hZGRDbGFzcyggJ2ZpbmlzaGVkJyApO1xuICAgIH1cblxuLypcbiAgICBhZGREZXB0aENsYXNzZXMoKSB7XG4gICAgICAgIHZhciBpLCBqLCBkaXN0YW5jZTtcblxuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHRoaXMuX2NlbGxzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgZm9yKCBqID0gMDsgaiA8IHRoaXMuX2NlbGxzWyBpIF0ubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2VsbHNbIGkgXVsgaiBdXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCAnZGF0YS1kaXN0YW5jZS1jbGFzcycsICdkaXN0YW5jZS0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoICggcGFyc2VJbnQoIHRoaXMuY2VsbHNbIGkgXVsgaiBdLmF0dHIoICdkYXRhLWRpc3RhbmNlJyApICkgLyB0aGlzLm1heERpc3RhbmNlICogMTAgKSApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9Ki9cblxuICAgIF9zdG9yZVVudmlzaXRlZENlbGwoIGN1cnJlbnQsIHJlc3VsdCwgZGlyZWN0aW9uICkge1xuICAgICAgICBpZiAoICFjdXJyZW50LnZpc2l0ZWQgKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCggeyBjZWxsOiBjdXJyZW50LCBkaXJlY3Rpb246IGRpcmVjdGlvbiB9ICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0VW52aXNpdGVkTmVpZ2hib3JzICggY2VsbCApIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgIC8vIE5vcnRoXG4gICAgICAgIGlmICggY2VsbC55ICE9PSAwICkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVVbnZpc2l0ZWRDZWxsKCB0aGlzLl9jZWxsc1sgY2VsbC55IC0gMSBdWyBjZWxsLnggXSwgcmVzdWx0LCAwICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZXN0XG4gICAgICAgIGlmICggY2VsbC54ICE9PSAwICkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVVbnZpc2l0ZWRDZWxsKCB0aGlzLl9jZWxsc1sgY2VsbC55IF1bIGNlbGwueCAtIDEgXSwgcmVzdWx0LCAzICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb3V0aFxuICAgICAgICBpZiAoIGNlbGwueSAhPT0gdGhpcy5oZWlnaHQgLSAxICkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmVVbnZpc2l0ZWRDZWxsKCB0aGlzLl9jZWxsc1sgY2VsbC55ICsgMSBdWyBjZWxsLnggXSwgcmVzdWx0LCAxICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFYXN0XG4gICAgICAgIGlmICggY2VsbC54ICE9PSB0aGlzLndpZHRoIC0gMSApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0b3JlVW52aXNpdGVkQ2VsbCggdGhpcy5fY2VsbHNbIGNlbGwueSBdWyBjZWxsLnggKyAxIF0sIHJlc3VsdCwgMiApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCByZXN1bHQubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgY2VsbC5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbiJdfQ==
