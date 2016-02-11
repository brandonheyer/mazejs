(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _maze = require('./maze');

var _maze2 = _interopRequireDefault(_maze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $current, $new, neighbors, direction, n;

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
    cells = [];
};

(0, _jquery2.default)(document).ready(function () {
    var $maze, maze;
    $maze = (0, _jquery2.default)('.maze');

    maze = new _maze2.default($maze);

    (0, _jquery2.default)('.maze-input').hide().first().show();

    (0, _jquery2.default)('#generate').click(function (event) {
        event.preventDefault();
        //clearGrid();

        /*height = parseInt( $( '#grid-height' ).val(), 10 );
        width = parseInt( $( '#grid-width' ).val(), 10 );
        cellSize = parseInt( $( '#cell-size' ).val(), 10 );
        split = parseInt( $( '#maze-style' ).val(), 10 );*/

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

        this.renderSteps = 2;
        this.currTime = new Date();
        this.drawTime = 0;
        this.split = 0;

        this.activeSet = [];
        this.cells = [];
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
        key: 'drawGrid',
        value: function drawGrid(h, w, onFinish) {
            var i,
                j,
                callCnt = 0;

            var h = this.height;
            var w = this.width;

            for (i = 0; i < h; i++) {
                _underscore2.default.defer(_underscore2.default.bind(function () {
                    this.cells[callCnt] = [];

                    for (j = 0; j < w; j++) {
                        this.cells[callCnt].push((0, _jquery2.default)('<div id="' + j + '-' + callCnt + '" class="cell" style="width:' + this.cellSize + 'px;height:' + this.cellSize + 'px" />').appendTo(this.$maze));
                    }

                    if (callCnt + 1 === h) {
                        if (!onFinish) {
                            this.continueDrawing();
                        } else {
                            onFinish();
                        }
                    }

                    callCnt++;
                }, this));
            }

            this.$maze.width(w * this.cellSize).height(h * this.cellSize).attr('data-width', w).attr('data-height', h);
        }
    }, {
        key: 'continueDrawing',
        value: function continueDrawing() {
            this.distance = this.maxDistance = 0;
            this.activeSet.push((0, _jquery2.default)('#' + Math.floor(Math.random() * this.width) + '-' + Math.floor(Math.random() * this.height)).addClass('visited start').attr('data-distance', this.distance));

            this.draw();
        }
    }, {
        key: 'draw',
        value: function draw() {
            var $current,
                $new,
                neighbors,
                tempTime,
                n = Math.floor(Math.random() * 100);

            if (n < this.split) {
                n = Math.floor(Math.random() * this.activeSet.length);
            } else {
                n = this.activeSet.length - 1;
            }

            $current = this.activeSet[n];

            this.distance = parseInt($current.attr('data-distance'), 10);
            this.maxDistance = Math.max(this.maxDistance, this.distance);

            neighbors = this.getUnvisitedNeighbors($current);

            if (neighbors.length) {
                n = Math.floor(Math.random() * neighbors.length);
                $new = neighbors[n];

                this.activeSet.push($new.cell.addClass('visited ' + this.inversePassage[$new.direction]).attr('data-distance', this.distance + 1));

                $current.addClass(this.passageToClass[$new.direction]);
            } else {
                this.activeSet.splice(n, 1);
            }

            tempTime = new Date().getTime();

            this.renderSteps++;

            if (this.activeSet.length) {
                if (this.renderSteps % 1 === 0) {
                    _underscore2.default.defer(_underscore2.default.bind(this.draw, this));
                } else {
                    this.draw();
                }
            } else {
                (0, _jquery2.default)('div[data-distance=' + this.maxDistance + ']').addClass('finish');

                this.finalizeMaze();
                this.addDepthClasses();
            }
        }
    }, {
        key: 'finalizeMaze',
        value: function finalizeMaze() {
            this.$maze.find('div.n').css('border-top', '0');
            this.$maze.find('div.s').css('border-bottom', '0');
            this.$maze.find('div.w').css('border-left', '0');
            this.$maze.find('div.e').css('border-right', '0');

            this.$maze.addClass('finished');
        }
    }, {
        key: 'addDepthClasses',
        value: function addDepthClasses() {
            var i, j, distance;

            for (i = 0; i < this.cells.length; i++) {
                for (j = 0; j < this.cells[i].length; j++) {
                    this.cells[i][j].attr('data-distance-class', 'distance-' + Math.floor(parseInt(this.cells[i][j].attr('data-distance')) / this.maxDistance * 10));
                }
            }
        }
    }, {
        key: 'getUnvisitedNeighbors',
        value: function getUnvisitedNeighbors($cell) {
            var result = [],
                $current,
                pos = $cell.attr('id').split('-'),
                x = parseInt(pos[0], 10),
                y = parseInt(pos[1], 10);

            // North
            if (y !== 0) {
                $current = this.cells[y - 1][x];

                if (!$current.hasClass('visited')) {
                    result.push({ cell: $current, direction: 0 });
                }
            }

            // West
            if (x !== 0) {
                $current = this.cells[y][x - 1];

                if (!$current.hasClass('visited')) {
                    result.push({ cell: $current, direction: 3 });
                }
            }

            // South
            if (y !== this.height - 1) {
                $current = this.cells[y + 1][x];

                if (!$current.hasClass('visited')) {
                    result.push({ cell: $current, direction: 1 });
                }
            }

            // East
            if (x !== this.width - 1) {
                $current = this.cells[y][x + 1];

                if (!$current.hasClass('visited')) {
                    result.push({ cell: $current, direction: 2 });
                }
            }

            if (result.length === 0) {
                $cell.addClass('complete');
                return false;
            }

            return result;
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"jquery":"jquery","underscore":"underscore"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbWF6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFJLFFBQUosRUFBYyxJQUFkLEVBQW9CLFNBQXBCLEVBQStCLFNBQS9CLEVBQTBDLENBQTFDOztBQUVBLElBQUksZUFBZTtBQUNmLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLGFBQVMsR0FBVDtBQUNBLGFBQVMsR0FBVDtBQUNBLGFBQVMsR0FBVDtBQUNBLGVBQVcsR0FBWDtBQUNBLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFdBQU8sR0FBUDtBQUNBLGFBQVMsR0FBVDtBQUNBLFNBQUssR0FBTDtBQUNBLFdBQU8sR0FBUDtBQUNBLFNBQUssR0FBTDtDQWZBOztBQWtCSixJQUFJLGVBQWU7QUFDZixTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLE9BQUw7QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEdBQUw7Q0FmQTs7QUFrQkosSUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsR0FBVztBQUMzQixRQUFJLFdBQVcsRUFBWDtRQUFlLGFBQWEsU0FBUyxHQUFULEdBQWUsS0FBZixHQUF1QixHQUF2QixHQUE2QixNQUFNLElBQU4sQ0FBWSxRQUFaLEVBQXVCLElBQXZCLENBQTZCLElBQTdCLENBQTdCLEdBQW1FLEdBQW5FLENBREw7O0FBRzNCLFVBQU0sSUFBTixDQUFZLFNBQVosRUFBd0IsSUFBeEIsQ0FBOEIsWUFBVztBQUNyQyxvQkFBWSxNQUFNLHNCQUFHLElBQUgsRUFBVSxJQUFWLENBQWdCLElBQWhCLENBQU4sQ0FEeUI7S0FBWCxDQUE5QixDQUgyQjs7QUFPM0Isa0JBQWMsU0FBUyxTQUFULENBQW9CLENBQXBCLElBQTBCLEdBQTFCLENBUGE7O0FBUzNCLFVBQU0sSUFBTixDQUFZLE9BQVosRUFBc0IsSUFBdEIsQ0FBNEIsWUFBVztBQUNuQyxZQUFJLFFBQVEsc0JBQUcsSUFBSCxDQUFSO1lBQW1CLGNBQWMsRUFBZCxDQURZOztBQUduQyxZQUFLLE1BQU0sUUFBTixDQUFnQixHQUFoQixDQUFMLEVBQTZCO0FBQ3pCLDJCQUFlLElBQWYsQ0FEeUI7U0FBN0I7O0FBSUEsWUFBSyxNQUFNLFFBQU4sQ0FBZ0IsR0FBaEIsQ0FBTCxFQUE2QjtBQUN6QiwyQkFBZSxJQUFmLENBRHlCO1NBQTdCOztBQUlBLFlBQUssTUFBTSxRQUFOLENBQWdCLEdBQWhCLENBQUwsRUFBNkI7QUFDekIsMkJBQWUsSUFBZixDQUR5QjtTQUE3Qjs7QUFJQSxZQUFLLE1BQU0sUUFBTixDQUFnQixHQUFoQixDQUFMLEVBQTZCO0FBQ3pCLDJCQUFlLElBQWYsQ0FEeUI7U0FBN0I7O0FBSUEsc0JBQWMsYUFBYyxZQUFZLFNBQVosQ0FBdUIsQ0FBdkIsQ0FBZCxDQUFkLENBbkJtQztLQUFYLENBQTVCLENBVDJCOztBQStCM0IsV0FBTyxVQUFQLENBL0IyQjtDQUFYOztBQWtDcEIsSUFBSSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBVSxVQUFWLEVBQXVCO0FBQ3hDLFFBQUksUUFBSjtRQUFjLFFBQVEsV0FBVyxLQUFYLENBQWtCLEdBQWxCLENBQVIsQ0FEMEI7QUFFeEMsUUFBSyxNQUFNLE1BQU4sS0FBaUIsQ0FBakIsRUFBcUI7QUFDdEIsZUFBTyxxQkFBUCxDQURzQjtLQUExQjs7QUFJQSxlQUFXLE1BQU8sQ0FBUCxFQUFXLEtBQVgsQ0FBa0IsR0FBbEIsQ0FBWCxDQU53QztBQU94QyxRQUFLLFNBQVMsTUFBVCxLQUFvQixDQUFwQixFQUF3QjtBQUN6QixlQUFPLHFCQUFQLENBRHlCO0tBQTdCOztBQUlBLFlBQVEsU0FBVSxTQUFXLENBQVgsQ0FBVixFQUEwQixFQUExQixDQUFSLENBWHdDO0FBWXhDLGFBQVMsU0FBVSxTQUFVLENBQVYsQ0FBVixFQUF5QixFQUF6QixDQUFULENBWndDOztBQWN4QyxRQUFLLE1BQU8sS0FBUCxLQUFrQixNQUFPLE1BQVAsQ0FBbEIsRUFBb0M7QUFDckMsZUFBTyxxQkFBUCxDQURxQztLQUF6Qzs7QUFJQSxnQkFsQndDO0FBbUJ4QyxhQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUIscUJBQUUsT0FBRixDQUFXLFFBQVgsRUFBcUIsTUFBTyxDQUFQLENBQXJCLEVBQWlDLFNBQVUsQ0FBVixDQUFqQyxFQUFnRCxTQUFVLENBQVYsRUFBYyxLQUFkLENBQXFCLEdBQXJCLENBQWhELENBQXpCLEVBbkJ3QztDQUF2Qjs7QUFzQnJCLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBVSxVQUFWLEVBQXNCLENBQXRCLEVBQTBCO0FBQ3pDLDBCQUFHLElBQUgsRUFBVSxRQUFWLENBQW9CLGFBQWMsV0FBVyxNQUFYLENBQW1CLENBQW5CLENBQWQsQ0FBcEIsRUFEeUM7Q0FBMUI7O0FBSW5CLElBQUksV0FBVyxTQUFYLFFBQVcsQ0FBVSxVQUFWLEVBQXNCLE9BQXRCLEVBQStCLFNBQS9CLEVBQTJDO0FBQ3RELFVBQU0sSUFBTixDQUFZLE9BQVosRUFBc0IsSUFBdEIsQ0FBNEIscUJBQUUsT0FBRixDQUFXLFlBQVgsRUFBeUIsVUFBekIsQ0FBNUIsRUFBb0UsUUFBcEUsQ0FBOEUsa0JBQTlFLEVBRHNEO0FBRXRELFVBQU0sSUFBTixDQUFZLE1BQU0sT0FBTixDQUFaLENBQTRCLFFBQTVCLENBQXNDLE9BQXRDLEVBRnNEOztBQUl0RCx5QkFBRSxJQUFGLENBQVEsU0FBUixFQUFtQixVQUFVLEVBQVYsRUFBZTtBQUM5QixjQUFNLElBQU4sQ0FBWSxNQUFNLEVBQU4sQ0FBWixDQUF1QixRQUF2QixDQUFpQyxRQUFqQyxFQUQ4QjtLQUFmLENBQW5CLENBSnNEOztBQVF0RCxtQkFSc0Q7Q0FBM0M7O0FBV2YsSUFBSSxZQUFZLFNBQVosU0FBWSxHQUFXO0FBQ3ZCLFVBQU0sS0FBTixHQUFjLFdBQWQsQ0FBMkIsVUFBM0IsRUFEdUI7QUFFdkIsWUFBUSxFQUFSLENBRnVCO0NBQVg7O0FBS2hCLHNCQUFHLFFBQUgsRUFBYyxLQUFkLENBQXFCLFlBQVc7QUFDNUIsUUFBSSxLQUFKLEVBQVcsSUFBWCxDQUQ0QjtBQUU1QixZQUFRLHNCQUFHLE9BQUgsQ0FBUixDQUY0Qjs7QUFJNUIsV0FBTyxtQkFBVSxLQUFWLENBQVAsQ0FKNEI7O0FBTTVCLDBCQUFHLGFBQUgsRUFBbUIsSUFBbkIsR0FBMEIsS0FBMUIsR0FBa0MsSUFBbEMsR0FONEI7O0FBUTVCLDBCQUFHLFdBQUgsRUFBaUIsS0FBakIsQ0FBd0IsVUFBVSxLQUFWLEVBQWtCO0FBQ3RDLGNBQU0sY0FBTjs7Ozs7Ozs7QUFEc0MsWUFTdEMsQ0FBSyxRQUFMLEdBVHNDO0tBQWxCLENBQXhCLENBUjRCOztBQW9CNUIsMEJBQUcsYUFBSCxFQUFtQixNQUFuQixDQUEyQixZQUFXO0FBQ2xDLFlBQUksT0FBTyxzQkFBRyxtQkFBSCxDQUFQO1lBQ0EsV0FBVyxLQUFLLFVBQUwsS0FBb0IsR0FBcEI7WUFDWCxZQUFZLFNBQVUsc0JBQUcsSUFBSCxFQUFVLEdBQVYsRUFBVixDQUFaLENBSDhCO0FBSWxDLFlBQUssTUFBTyxTQUFQLENBQUwsRUFBMEI7QUFDdEIsa0NBQUcsSUFBSCxFQUFVLEdBQVYsQ0FBZSxFQUFmLEVBRHNCO1NBQTFCLE1BRU8sSUFBSyxZQUFZLENBQVosRUFBZ0I7QUFDeEIsa0NBQUcsSUFBSCxFQUFVLEdBQVYsQ0FBZSxDQUFmLEVBRHdCO1NBQXJCLE1BRUE7QUFDSCxrQ0FBRyxJQUFILEVBQVUsR0FBVixDQUFlLEtBQUssS0FBTCxDQUFZLFNBQVosQ0FBZixFQURHO1NBRkE7S0FOZ0IsQ0FBM0IsQ0FwQjRCOztBQWlDNUIsMEJBQUcsY0FBSCxFQUFvQixNQUFwQixDQUE0QixZQUFXO0FBQ25DLFlBQUksYUFBYSxTQUFVLHNCQUFHLElBQUgsRUFBVSxHQUFWLEVBQVYsQ0FBYixDQUQrQjtBQUVuQyxZQUFLLE1BQU8sVUFBUCxDQUFMLEVBQTJCO0FBQ3ZCLGtDQUFHLElBQUgsRUFBVSxHQUFWLENBQWUsRUFBZixFQUR1QjtTQUEzQixNQUVPLElBQUssYUFBYSxDQUFiLEVBQWlCO0FBQ3pCLGtDQUFHLElBQUgsRUFBVSxHQUFWLENBQWUsQ0FBZixFQUR5QjtTQUF0QixNQUVBO0FBQ0gsa0NBQUcsSUFBSCxFQUFVLEdBQVYsQ0FBZSxLQUFLLEtBQUwsQ0FBWSxVQUFaLENBQWYsRUFERztTQUZBO0tBSmlCLENBQTVCLENBakM0Qjs7QUE0QzVCLDBCQUFHLFlBQUgsRUFBa0IsTUFBbEIsQ0FBMEIsWUFBVztBQUNqQyxZQUFJLFdBQVcsU0FBVSxzQkFBRyxJQUFILEVBQVUsR0FBVixFQUFWLENBQVgsQ0FENkI7O0FBR2pDLFlBQUssTUFBTyxRQUFQLENBQUwsRUFBeUI7QUFDckIsa0NBQUcsSUFBSCxFQUFVLEdBQVYsQ0FBZSxFQUFmLEVBRHFCO1NBQXpCLE1BRU8sSUFBSyxXQUFXLENBQVgsRUFBZTtBQUN2QixrQ0FBRyxJQUFILEVBQVUsR0FBVixDQUFlLENBQWYsRUFEdUI7U0FBcEIsTUFFQSxJQUFLLFdBQVcsRUFBWCxFQUFnQjtBQUN4QixrQ0FBRyxJQUFILEVBQVUsR0FBVixDQUFlLEVBQWYsRUFEd0I7U0FBckIsTUFFQTtBQUNILGtDQUFHLElBQUgsRUFBVSxHQUFWLENBQWUsS0FBSyxLQUFMLENBQVksUUFBWixDQUFmLEVBREc7U0FGQTs7QUFNUCxtQkFBVyxTQUFVLHNCQUFHLElBQUgsRUFBVSxHQUFWLEVBQVYsQ0FBWCxDQWJpQztBQWNqQyxZQUFJLE9BQU8sc0JBQUcsbUJBQUgsQ0FBUDtZQUNBLFdBQVcsS0FBSyxVQUFMLEtBQW9CLEdBQXBCO1lBQ1gsWUFBWSxTQUFVLHNCQUFHLGFBQUgsRUFBbUIsR0FBbkIsRUFBVixDQUFaO1lBQ0EsYUFBYSxTQUFVLHNCQUFHLGNBQUgsRUFBb0IsR0FBcEIsRUFBVixDQUFiLENBakI2Qjs7QUFtQmpDLFlBQUssWUFBWSxXQUFXLFFBQVgsRUFBc0I7QUFDbkMsa0NBQUcsYUFBSCxFQUFtQixHQUFuQixDQUF3QixLQUFLLEtBQUwsQ0FBWSxXQUFXLFFBQVgsQ0FBcEMsRUFEbUM7U0FBdkM7O0FBSUEsWUFBSyxhQUFhLE1BQU0sUUFBTixFQUFpQjtBQUMvQixrQ0FBRyxjQUFILEVBQW9CLEdBQXBCLENBQXlCLEtBQUssS0FBTCxDQUFZLE1BQU0sUUFBTixDQUFyQyxFQUQrQjtTQUFuQztLQXZCc0IsQ0FBMUIsQ0E1QzRCOztBQXdFNUIsMEJBQUcsYUFBSCxFQUFtQixNQUFuQixDQUEyQixZQUFXO0FBQ2xDLFlBQUksUUFBUSxTQUFVLHNCQUFHLElBQUgsRUFBVSxHQUFWLEVBQVYsQ0FBUixDQUQ4Qjs7QUFHbEMsWUFBSSxNQUFPLEtBQVAsQ0FBSixFQUFxQjtBQUNqQixrQ0FBRyxJQUFILEVBQVUsR0FBVixDQUFlLEVBQWYsRUFEaUI7U0FBckIsTUFFTyxJQUFLLFFBQVEsQ0FBUixFQUFZO0FBQ3BCLGtDQUFHLElBQUgsRUFBVSxHQUFWLENBQWUsQ0FBZixFQURvQjtTQUFqQixNQUVBLElBQUssUUFBUSxHQUFSLEVBQWM7QUFDdEIsa0NBQUcsSUFBSCxFQUFVLEdBQVYsQ0FBZSxHQUFmLEVBRHNCO1NBQW5CLE1BRUE7QUFDSCxrQ0FBRyxJQUFILEVBQVUsR0FBVixDQUFlLEtBQUssS0FBTCxDQUFZLEtBQVosQ0FBZixFQURHO1NBRkE7S0FQZ0IsQ0FBM0IsQ0F4RTRCOztBQXNGNUIsMEJBQUcsUUFBSCxFQUFjLEtBQWQsQ0FBcUIsWUFBVztBQUM1QixZQUFJLFdBQVcsc0JBQUcsVUFBSCxDQUFYLENBRHdCOztBQUc1QixZQUFLLFNBQVMsUUFBVCxDQUFtQixVQUFuQixDQUFMLEVBQXVDO0FBQ25DLHFCQUFTLElBQVQsQ0FBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTRCLFdBQTVCLENBQXlDLFVBQXpDLEVBQXNELE9BQXRELENBQStELEVBQUUsU0FBUyxRQUFULEVBQWpFLEVBRG1DO1NBQXZDLE1BRU87QUFDSCxxQkFBUyxJQUFULENBQWUsSUFBZixFQUFxQixJQUFyQixFQUE0QixRQUE1QixDQUFzQyxVQUF0QyxFQUFtRCxPQUFuRCxDQUE0RCxFQUFFLFNBQVMsS0FBVCxFQUE5RCxFQURHO1NBRlA7S0FIaUIsQ0FBckIsQ0F0RjRCOztBQWdHNUIsMEJBQUcsaUJBQUgsRUFBdUIsS0FBdkIsQ0FBOEIsWUFBVztBQUNyQyxZQUFJLENBQUosRUFBTSxDQUFOLENBRHFDO0FBRXJDLFlBQUssS0FBSyxLQUFMLENBQVcsTUFBWCxFQUFvQjtBQUNyQixpQkFBTSxJQUFJLENBQUosRUFBTyxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsRUFBbUIsR0FBcEMsRUFBMEM7QUFDdEMscUJBQUssS0FBTCxDQUFZLENBQVosRUFBZ0IsV0FBaEIsQ0FBNkIsY0FBYyxDQUFkLENBQTdCLENBRHNDO2FBQTFDOztBQUlBLG9CQUFRLEVBQVIsQ0FMcUI7U0FBekIsTUFNTztBQUNILGlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWlCLE1BQU0sSUFBTixDQUFZLG9DQUFaLEVBQW1ELFFBQW5ELENBQTZELFlBQTdELENBQWpCLEVBREc7QUFFSCxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFpQixNQUFNLElBQU4sQ0FBWSxvQ0FBWixFQUFtRCxRQUFuRCxDQUE2RCxZQUE3RCxDQUFqQixFQUZHO0FBR0gsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBaUIsTUFBTSxJQUFOLENBQVksb0NBQVosRUFBbUQsUUFBbkQsQ0FBNkQsWUFBN0QsQ0FBakIsRUFIRztBQUlILGlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWlCLE1BQU0sSUFBTixDQUFZLG9DQUFaLEVBQW1ELFFBQW5ELENBQTZELFlBQTdELENBQWpCLEVBSkc7QUFLSCxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFpQixNQUFNLElBQU4sQ0FBWSxvQ0FBWixFQUFtRCxRQUFuRCxDQUE2RCxZQUE3RCxDQUFqQixFQUxHO0FBTUgsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBaUIsTUFBTSxJQUFOLENBQVksb0NBQVosRUFBbUQsUUFBbkQsQ0FBNkQsWUFBN0QsQ0FBakIsRUFORztBQU9ILGlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWlCLE1BQU0sSUFBTixDQUFZLG9DQUFaLEVBQW1ELFFBQW5ELENBQTZELFlBQTdELENBQWpCLEVBUEc7QUFRSCxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFpQixNQUFNLElBQU4sQ0FBWSxvQ0FBWixFQUFtRCxRQUFuRCxDQUE2RCxZQUE3RCxDQUFqQixFQVJHO0FBU0gsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBaUIsTUFBTSxJQUFOLENBQVksb0NBQVosRUFBbUQsUUFBbkQsQ0FBNkQsWUFBN0QsQ0FBakIsRUFURztBQVVILGlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWlCLE1BQU0sSUFBTixDQUFZLG9DQUFaLEVBQW1ELFFBQW5ELENBQTZELFlBQTdELENBQWpCLEVBVkc7QUFXSCxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFpQixNQUFNLElBQU4sQ0FBWSxxQ0FBWixFQUFvRCxRQUFwRCxDQUE4RCxhQUE5RCxDQUFqQixFQVhHO1NBTlA7S0FGMEIsQ0FBOUIsQ0FoRzRCOztBQXVINUIsMEJBQUcsV0FBSCxFQUFpQixLQUFqQixDQUF3QixZQUFXO0FBQy9CLFlBQUssWUFBWSxDQUFaLEVBQWdCO0FBQ2pCLG1CQURpQjtTQUFyQjs7QUFJQSxtQkFBVyxXQUFXLENBQVgsQ0FMb0I7QUFNL0IsOEJBQUcsT0FBSCxFQUFhLEdBQWIsQ0FBa0I7QUFDZCxtQkFBTyxRQUFQO0FBQ0Esb0JBQVEsUUFBUjtTQUZKLEVBTitCOztBQVcvQixjQUFNLEtBQU4sQ0FBYSxXQUFXLFNBQVUsTUFBTSxJQUFOLENBQVksWUFBWixDQUFWLEVBQXNDLEVBQXRDLENBQVgsQ0FBYixDQUFxRSxNQUFyRSxDQUE2RSxXQUFXLFNBQVUsTUFBTSxJQUFOLENBQVksYUFBWixDQUFWLEVBQXVDLEVBQXZDLENBQVgsQ0FBN0UsQ0FYK0I7S0FBWCxDQUF4QixDQXZINEI7O0FBcUk1QiwwQkFBRyxVQUFILEVBQWdCLEtBQWhCLENBQXVCLFlBQVc7QUFDOUIsWUFBSyxZQUFZLEVBQVosRUFBaUI7QUFDbEIsbUJBRGtCO1NBQXRCOztBQUlBLG1CQUFXLFdBQVcsQ0FBWCxDQUxtQjtBQU05Qiw4QkFBRyxPQUFILEVBQWEsR0FBYixDQUFrQjtBQUNkLG1CQUFPLFFBQVA7QUFDQSxvQkFBUSxRQUFSO1NBRkosRUFOOEI7O0FBVzlCLGNBQU0sS0FBTixDQUFhLFdBQVcsU0FBVSxNQUFNLElBQU4sQ0FBWSxZQUFaLENBQVYsRUFBc0MsRUFBdEMsQ0FBWCxDQUFiLENBQXFFLE1BQXJFLENBQTZFLFdBQVcsU0FBVSxNQUFNLElBQU4sQ0FBWSxhQUFaLENBQVYsRUFBdUMsRUFBdkMsQ0FBWCxDQUE3RSxDQVg4QjtLQUFYLENBQXZCLENBckk0Qjs7QUFtSjVCLDBCQUFHLFlBQUgsRUFBa0IsS0FBbEIsQ0FBeUIsWUFBVztBQUNoQyxZQUFLLE1BQU0sUUFBTixDQUFnQixVQUFoQixDQUFMLEVBQW9DO0FBQ2hDLGtDQUFHLGtCQUFILEVBQXdCLEdBQXhCLENBQTZCLGVBQTdCLEVBRGdDO1NBQXBDLE1BRU87QUFDSCxrQ0FBRyxrQkFBSCxFQUF3QixHQUF4QixDQUE2QixnQ0FBN0IsRUFERztTQUZQO0tBRHFCLENBQXpCLENBbko0Qjs7QUEySjVCLDBCQUFHLGtCQUFILEVBQXdCLEtBQXhCLENBQStCLFVBQVUsQ0FBVixFQUFjO0FBQ3pDLGFBQUssTUFBTCxHQUR5QztBQUV6QyxVQUFFLGNBQUYsR0FGeUM7S0FBZCxDQUEvQixDQTNKNEI7O0FBZ0s1QiwwQkFBRyxZQUFILEVBQWtCLEtBQWxCLENBQXlCLFlBQVc7QUFDaEMsdUJBQWdCLHNCQUFHLGtCQUFILEVBQXdCLEdBQXhCLEVBQWhCLEVBRGdDO0tBQVgsQ0FBekIsQ0FoSzRCOztBQW9LNUIsMEJBQUcsWUFBSCxFQUFrQixLQUFsQixDQUF5QixZQUFXO0FBQ2hDLFlBQUksUUFBUSxzQkFBRyxJQUFILENBQVIsQ0FENEI7O0FBR2hDLFlBQUssTUFBTSxRQUFOLENBQWdCLFdBQWhCLENBQUwsRUFBcUM7QUFDakMsa0JBQU0sV0FBTixDQUFtQixXQUFuQixFQURpQztBQUVqQyxrQ0FBRyxhQUFILEVBQW1CLElBQW5CLEdBQTBCLE1BQTFCLENBQWtDLFVBQWxDLEVBQStDLElBQS9DLEdBRmlDO1NBQXJDLE1BR087QUFDSCxrQkFBTSxRQUFOLENBQWdCLFdBQWhCLEVBREc7QUFFSCxrQ0FBRyxhQUFILEVBQW1CLElBQW5CLEdBQTBCLEtBQTFCLEdBQWtDLElBQWxDLEdBRkc7U0FIUDtLQUhxQixDQUF6QixDQXBLNEI7O0FBZ0w1QiwwQkFBRyxNQUFILEVBQVksTUFBWixDQUFvQixZQUFXO0FBQzNCLFlBQUksU0FBUyxDQUFULENBRHVCOztBQUczQiw4QkFBRywwQkFBSCxFQUErQixJQUEvQixDQUFxQyxZQUFXO0FBQzVDLHNCQUFVLHNCQUFHLElBQUgsRUFBVSxNQUFWLEVBQVYsQ0FENEM7U0FBWCxDQUFyQyxDQUgyQjs7QUFPM0IsOEJBQUcsaUJBQUgsRUFBdUIsTUFBdkIsQ0FBK0Isc0JBQUcsSUFBSCxFQUFVLE1BQVYsS0FBcUIsTUFBckIsR0FBOEIsRUFBOUIsQ0FBL0IsQ0FQMkI7S0FBWCxDQUFwQixDQVFJLE1BUkosR0FoTDRCOztBQTBMNUIsMEJBQUcsa0JBQUgsRUFBd0IsS0FBeEIsQ0FBK0IsWUFBVztBQUN0Qyw4QkFBRyxNQUFILEVBQVksUUFBWixDQUFzQixZQUF0QixFQURzQztBQUV0Qyw4QkFBRyxpQkFBSCxFQUF1QixJQUF2QixDQUE2QixZQUE3QixFQUEyQyxzQkFBRyxpQkFBSCxFQUF1QixJQUF2QixDQUE2QixPQUE3QixDQUEzQyxFQUFvRixJQUFwRixDQUEwRixPQUExRixFQUFtRyxFQUFuRyxFQUZzQztLQUFYLENBQS9CLENBMUw0Qjs7QUErTDVCLDBCQUFHLGlCQUFILEVBQXVCLEtBQXZCLENBQThCLFlBQVc7QUFDckMsOEJBQUcsTUFBSCxFQUFZLFdBQVosQ0FBeUIsWUFBekIsRUFEcUM7QUFFckMsOEJBQUcsaUJBQUgsRUFBdUIsSUFBdkIsQ0FBNkIsT0FBN0IsRUFBc0Msc0JBQUcsaUJBQUgsRUFBdUIsSUFBdkIsQ0FBNkIsWUFBN0IsQ0FBdEMsRUFGcUM7S0FBWCxDQUE5QixDQS9MNEI7Q0FBWCxDQUFyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEhJLG9CQUFjLFFBQWQsRUFBeUI7OztBQUNyQixhQUFLLEtBQUwsR0FBYSxRQUFiLENBRHFCO0FBRXJCLGFBQUssUUFBTCxHQUFnQixFQUFoQixDQUZxQjtBQUdyQixhQUFLLFFBQUwsR0FBZ0IsQ0FBaEIsQ0FIcUI7QUFJckIsYUFBSyxXQUFMLEdBQW1CLENBQW5CLENBSnFCOztBQU1yQixhQUFLLE1BQUwsR0FBYyxFQUFkLENBTnFCO0FBT3JCLGFBQUssS0FBTCxHQUFhLEVBQWIsQ0FQcUI7O0FBU3JCLGFBQUssV0FBTCxHQUFtQixDQUFuQixDQVRxQjtBQVVyQixhQUFLLFFBQUwsR0FBZ0IsSUFBSSxJQUFKLEVBQWhCLENBVnFCO0FBV3JCLGFBQUssUUFBTCxHQUFnQixDQUFoQixDQVhxQjtBQVlyQixhQUFLLEtBQUwsR0FBYSxDQUFiLENBWnFCOztBQWNyQixhQUFLLFNBQUwsR0FBaUIsRUFBakIsQ0FkcUI7QUFlckIsYUFBSyxLQUFMLEdBQWEsRUFBYixDQWZxQjtBQWdCckIsYUFBSyxLQUFMLEdBQWEsRUFBYixDQWhCcUI7O0FBa0JyQixhQUFLLGNBQUwsR0FBc0I7QUFDbEIsZUFBRyxHQUFIO0FBQ0EsZUFBRyxHQUFIO0FBQ0EsZUFBRyxHQUFIO0FBQ0EsZUFBRyxHQUFIO1NBSkosQ0FsQnFCOztBQXlCckIsYUFBSyxjQUFMLEdBQXNCO0FBQ2xCLGVBQUcsR0FBSDtBQUNBLGVBQUcsR0FBSDtBQUNBLGVBQUcsR0FBSDtBQUNBLGVBQUcsR0FBSDtTQUpKLENBekJxQjtLQUF6Qjs7OztpQ0FpQ1UsR0FBRyxHQUFHLFVBQVc7QUFDdkIsZ0JBQUksQ0FBSjtnQkFBTyxDQUFQO2dCQUFVLFVBQVUsQ0FBVixDQURhOztBQUd2QixnQkFBSSxJQUFJLEtBQUssTUFBTCxDQUhlO0FBSXZCLGdCQUFJLElBQUksS0FBSyxLQUFMLENBSmU7O0FBTXZCLGlCQUFLLElBQUksQ0FBSixFQUFPLElBQUksQ0FBSixFQUFPLEdBQW5CLEVBQXlCO0FBQ3JCLHFDQUFFLEtBQUYsQ0FBUyxxQkFBRSxJQUFGLENBQVEsWUFBVztBQUN4Qix5QkFBSyxLQUFMLENBQVksT0FBWixJQUF3QixFQUF4QixDQUR3Qjs7QUFHeEIseUJBQUssSUFBSSxDQUFKLEVBQU8sSUFBSSxDQUFKLEVBQU8sR0FBbkIsRUFBeUI7QUFDckIsNkJBQUssS0FBTCxDQUFZLE9BQVosRUFBc0IsSUFBdEIsQ0FDSSxzQkFBRyxjQUFjLENBQWQsR0FBa0IsR0FBbEIsR0FBd0IsT0FBeEIsR0FBa0MsOEJBQWxDLEdBQW1FLEtBQUssUUFBTCxHQUFnQixZQUFuRixHQUFrRyxLQUFLLFFBQUwsR0FBZSxRQUFqSCxDQUFILENBQ0ssUUFETCxDQUNlLEtBQUssS0FBTCxDQUZuQixFQURxQjtxQkFBekI7O0FBT0Esd0JBQUssVUFBVSxDQUFWLEtBQWdCLENBQWhCLEVBQW9CO0FBQ3JCLDRCQUFLLENBQUMsUUFBRCxFQUFZO0FBQ2IsaUNBQUssZUFBTCxHQURhO3lCQUFqQixNQUVPO0FBQ0gsdUNBREc7eUJBRlA7cUJBREo7O0FBUUEsOEJBbEJ3QjtpQkFBWCxFQW1CZCxJQW5CTSxDQUFULEVBRHFCO2FBQXpCOztBQXVCQSxpQkFBSyxLQUFMLENBQ0ssS0FETCxDQUNZLElBQUksS0FBSyxRQUFMLENBRGhCLENBRUssTUFGTCxDQUVhLElBQUksS0FBSyxRQUFMLENBRmpCLENBR0ssSUFITCxDQUdXLFlBSFgsRUFHeUIsQ0FIekIsRUFJSyxJQUpMLENBSVcsYUFKWCxFQUkwQixDQUoxQixFQTdCdUI7Ozs7MENBb0NSO0FBQ2YsaUJBQUssUUFBTCxHQUFnQixLQUFLLFdBQUwsR0FBbUIsQ0FBbkIsQ0FERDtBQUVmLGlCQUFLLFNBQUwsQ0FBZSxJQUFmLENBQ0ksc0JBQUcsTUFBTSxLQUFLLEtBQUwsQ0FBWSxLQUFLLE1BQUwsS0FBZ0IsS0FBSyxLQUFMLENBQWxDLEdBQWlELEdBQWpELEdBQXdELEtBQUssS0FBTCxDQUFZLEtBQUssTUFBTCxLQUFnQixLQUFLLE1BQUwsQ0FBcEYsQ0FBSCxDQUNLLFFBREwsQ0FDZSxlQURmLEVBRUssSUFGTCxDQUVXLGVBRlgsRUFFNEIsS0FBSyxRQUFMLENBSGhDLEVBRmU7O0FBT2YsaUJBQUssSUFBTCxHQVBlOzs7OytCQVVYO0FBQ0osZ0JBQUksUUFBSjtnQkFBYyxJQUFkO2dCQUFvQixTQUFwQjtnQkFBK0IsUUFBL0I7Z0JBQXlDLElBQUksS0FBSyxLQUFMLENBQVksS0FBSyxNQUFMLEtBQWdCLEdBQWhCLENBQWhCLENBRHJDOztBQUdKLGdCQUFLLElBQUksS0FBSyxLQUFMLEVBQWE7QUFDbEIsb0JBQUksS0FBSyxLQUFMLENBQVksS0FBSyxNQUFMLEtBQWdCLEtBQUssU0FBTCxDQUFlLE1BQWYsQ0FBaEMsQ0FEa0I7YUFBdEIsTUFFTztBQUNILG9CQUFJLEtBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsQ0FBeEIsQ0FERDthQUZQOztBQU1BLHVCQUFXLEtBQUssU0FBTCxDQUFnQixDQUFoQixDQUFYLENBVEk7O0FBV0osaUJBQUssUUFBTCxHQUFnQixTQUFVLFNBQVMsSUFBVCxDQUFlLGVBQWYsQ0FBVixFQUE0QyxFQUE1QyxDQUFoQixDQVhJO0FBWUosaUJBQUssV0FBTCxHQUFtQixLQUFLLEdBQUwsQ0FBVSxLQUFLLFdBQUwsRUFBa0IsS0FBSyxRQUFMLENBQS9DLENBWkk7O0FBY0osd0JBQVksS0FBSyxxQkFBTCxDQUE0QixRQUE1QixDQUFaLENBZEk7O0FBZ0JKLGdCQUFJLFVBQVUsTUFBVixFQUFtQjtBQUNuQixvQkFBSSxLQUFLLEtBQUwsQ0FBWSxLQUFLLE1BQUwsS0FBZ0IsVUFBVSxNQUFWLENBQWhDLENBRG1CO0FBRW5CLHVCQUFPLFVBQVcsQ0FBWCxDQUFQLENBRm1COztBQUluQixxQkFBSyxTQUFMLENBQWUsSUFBZixDQUNJLEtBQUssSUFBTCxDQUFVLFFBQVYsQ0FBb0IsYUFBYSxLQUFLLGNBQUwsQ0FBcUIsS0FBSyxTQUFMLENBQWxDLENBQXBCLENBQ0ssSUFETCxDQUNXLGVBRFgsRUFDNEIsS0FBSyxRQUFMLEdBQWdCLENBQWhCLENBRmhDLEVBSm1COztBQVNuQix5QkFBUyxRQUFULENBQW1CLEtBQUssY0FBTCxDQUFxQixLQUFLLFNBQUwsQ0FBeEMsRUFUbUI7YUFBdkIsTUFVTztBQUNILHFCQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBREc7YUFWUDs7QUFjQSx1QkFBVyxJQUFNLElBQUosRUFBRixDQUFlLE9BQWYsRUFBWCxDQTlCSTs7QUFnQ0osaUJBQUssV0FBTCxHQWhDSTs7QUFrQ0osZ0JBQUssS0FBSyxTQUFMLENBQWUsTUFBZixFQUF3QjtBQUN6QixvQkFBSyxLQUFLLFdBQUwsR0FBbUIsQ0FBbkIsS0FBeUIsQ0FBekIsRUFBNkI7QUFDOUIseUNBQUUsS0FBRixDQUFTLHFCQUFFLElBQUYsQ0FBUSxLQUFLLElBQUwsRUFBVyxJQUFuQixDQUFULEVBRDhCO2lCQUFsQyxNQUVPO0FBQ0gseUJBQUssSUFBTCxHQURHO2lCQUZQO2FBREosTUFNTztBQUNILHNDQUFHLHVCQUF1QixLQUFLLFdBQUwsR0FBbUIsR0FBMUMsQ0FBSCxDQUFtRCxRQUFuRCxDQUE2RCxRQUE3RCxFQURHOztBQUdILHFCQUFLLFlBQUwsR0FIRztBQUlILHFCQUFLLGVBQUwsR0FKRzthQU5QOzs7O3VDQWNZO0FBQ1osaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBaUIsT0FBakIsRUFBMkIsR0FBM0IsQ0FBZ0MsWUFBaEMsRUFBOEMsR0FBOUMsRUFEWTtBQUVaLGlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWlCLE9BQWpCLEVBQTJCLEdBQTNCLENBQWdDLGVBQWhDLEVBQWlELEdBQWpELEVBRlk7QUFHWixpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFpQixPQUFqQixFQUEyQixHQUEzQixDQUFnQyxhQUFoQyxFQUErQyxHQUEvQyxFQUhZO0FBSVosaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBaUIsT0FBakIsRUFBMkIsR0FBM0IsQ0FBZ0MsY0FBaEMsRUFBZ0QsR0FBaEQsRUFKWTs7QUFNWixpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFxQixVQUFyQixFQU5ZOzs7OzBDQVNFO0FBQ2QsZ0JBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxRQUFWLENBRGM7O0FBR2QsaUJBQU0sSUFBSSxDQUFKLEVBQU8sSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQW1CLEdBQXBDLEVBQTBDO0FBQ3RDLHFCQUFLLElBQUksQ0FBSixFQUFPLElBQUksS0FBSyxLQUFMLENBQVksQ0FBWixFQUFnQixNQUFoQixFQUF3QixHQUF4QyxFQUE4QztBQUMxQyx5QkFBSyxLQUFMLENBQVksQ0FBWixFQUFpQixDQUFqQixFQUNLLElBREwsQ0FDVyxxQkFEWCxFQUNrQyxjQUMxQixLQUFLLEtBQUwsQ0FBYyxTQUFVLEtBQUssS0FBTCxDQUFZLENBQVosRUFBaUIsQ0FBakIsRUFBcUIsSUFBckIsQ0FBMkIsZUFBM0IsQ0FBVixJQUEyRCxLQUFLLFdBQUwsR0FBbUIsRUFBOUUsQ0FEWSxDQURsQyxDQUQwQztpQkFBOUM7YUFESjs7Ozs4Q0FVb0IsT0FBUTtBQUM1QixnQkFBSSxTQUFTLEVBQVQ7Z0JBQWEsUUFBakI7Z0JBQ0ksTUFBTSxNQUFNLElBQU4sQ0FBWSxJQUFaLEVBQW1CLEtBQW5CLENBQTBCLEdBQTFCLENBQU47Z0JBQ0EsSUFBSSxTQUFVLElBQUssQ0FBTCxDQUFWLEVBQW9CLEVBQXBCLENBQUo7Z0JBQThCLElBQUksU0FBVSxJQUFLLENBQUwsQ0FBVixFQUFvQixFQUFwQixDQUFKOzs7QUFITixnQkFNdkIsTUFBTSxDQUFOLEVBQVU7QUFDWCwyQkFBVyxLQUFLLEtBQUwsQ0FBWSxJQUFJLENBQUosQ0FBWixDQUFxQixDQUFyQixDQUFYLENBRFc7O0FBR1gsb0JBQUssQ0FBQyxTQUFTLFFBQVQsQ0FBbUIsU0FBbkIsQ0FBRCxFQUFrQztBQUNuQywyQkFBTyxJQUFQLENBQWEsRUFBRSxNQUFNLFFBQU4sRUFBZ0IsV0FBVyxDQUFYLEVBQS9CLEVBRG1DO2lCQUF2QzthQUhKOzs7QUFONEIsZ0JBZXZCLE1BQU0sQ0FBTixFQUFVO0FBQ1gsMkJBQVcsS0FBSyxLQUFMLENBQVksQ0FBWixFQUFpQixJQUFJLENBQUosQ0FBNUIsQ0FEVzs7QUFHWCxvQkFBSyxDQUFDLFNBQVMsUUFBVCxDQUFtQixTQUFuQixDQUFELEVBQWtDO0FBQ25DLDJCQUFPLElBQVAsQ0FBYSxFQUFFLE1BQU0sUUFBTixFQUFnQixXQUFXLENBQVgsRUFBL0IsRUFEbUM7aUJBQXZDO2FBSEo7OztBQWY0QixnQkF3QnZCLE1BQU0sS0FBSyxNQUFMLEdBQWMsQ0FBZCxFQUFrQjtBQUN6QiwyQkFBVyxLQUFLLEtBQUwsQ0FBWSxJQUFJLENBQUosQ0FBWixDQUFxQixDQUFyQixDQUFYLENBRHlCOztBQUl6QixvQkFBSyxDQUFDLFNBQVMsUUFBVCxDQUFtQixTQUFuQixDQUFELEVBQWtDO0FBQ25DLDJCQUFPLElBQVAsQ0FBYSxFQUFFLE1BQU0sUUFBTixFQUFnQixXQUFXLENBQVgsRUFBL0IsRUFEbUM7aUJBQXZDO2FBSko7OztBQXhCNEIsZ0JBa0N2QixNQUFNLEtBQUssS0FBTCxHQUFhLENBQWIsRUFBaUI7QUFDeEIsMkJBQVcsS0FBSyxLQUFMLENBQVksQ0FBWixFQUFpQixJQUFJLENBQUosQ0FBNUIsQ0FEd0I7O0FBR3hCLG9CQUFLLENBQUMsU0FBUyxRQUFULENBQW1CLFNBQW5CLENBQUQsRUFBa0M7QUFDbkMsMkJBQU8sSUFBUCxDQUFhLEVBQUUsTUFBTSxRQUFOLEVBQWdCLFdBQVcsQ0FBWCxFQUEvQixFQURtQztpQkFBdkM7YUFISjs7QUFRQSxnQkFBSyxPQUFPLE1BQVAsS0FBa0IsQ0FBbEIsRUFBc0I7QUFDdkIsc0JBQU0sUUFBTixDQUFnQixVQUFoQixFQUR1QjtBQUV2Qix1QkFBTyxLQUFQLENBRnVCO2FBQTNCOztBQUtBLG1CQUFPLE1BQVAsQ0EvQzRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBNYXplIGZyb20gJy4vbWF6ZSc7XG5cbnZhciAkY3VycmVudCwgJG5ldywgbmVpZ2hib3JzLCBkaXJlY3Rpb24sIG47XG5cbnZhciBzYXZlTWFwcGluZ3MgPSB7XG4gICAgJ24nOiAnMCcsXG4gICAgJ24gZSc6ICcxJyxcbiAgICAnbiBzJzogJzInLFxuICAgICduIHcnOiAnMycsXG4gICAgJ24gZSBzJzogJzQnLFxuICAgICduIGUgdyc6ICc1JyxcbiAgICAnbiBzIHcnOiAnNicsXG4gICAgJ24gZSBzIHcnOiAnNycsXG4gICAgJ2UnOiAnOCcsXG4gICAgJ2Ugcyc6ICc5JyxcbiAgICAnZSB3JzogJ0EnLFxuICAgICdlIHMgdyc6ICdCJyxcbiAgICAncyc6ICdDJyxcbiAgICAncyB3JzogJ0QnLFxuICAgICd3JzogJ0UnXG59O1xuXG52YXIgbG9hZE1hcHBpbmdzID0ge1xuICAgICcwJzogJ24nLFxuICAgICcxJzogJ24gZScsXG4gICAgJzInOiAnbiBzJyxcbiAgICAnMyc6ICduIHcnLFxuICAgICc0JzogJ24gZSBzJyxcbiAgICAnNSc6ICduIGUgdycsXG4gICAgJzYnOiAnbiBzIHcnLFxuICAgICc3JzogJ24gZSBzIHcnLFxuICAgICc4JzogJ2UnLFxuICAgICc5JzogJ2UgcycsXG4gICAgJ0EnOiAnZSB3JyxcbiAgICAnQic6ICdlIHMgdycsXG4gICAgJ0MnOiAncycsXG4gICAgJ0QnOiAncyB3JyxcbiAgICAnRSc6ICd3J1xufTtcblxudmFyIGdldFNhdmVTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmluaXNoZXMgPSAnJywgc2F2ZVN0cmluZyA9IGhlaWdodCArICd8JyArIHdpZHRoICsgJ3wnICsgJG1hemUuZmluZCggJy5zdGFydCcgKS5hdHRyKCAnaWQnICkgKyAnfCc7XG5cbiAgICAkbWF6ZS5maW5kKCAnLmZpbmlzaCcgKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgZmluaXNoZXMgKz0gJy4nICsgJCggdGhpcyApLmF0dHIoICdpZCcgKTtcbiAgICB9ICk7XG5cbiAgICBzYXZlU3RyaW5nICs9IGZpbmlzaGVzLnN1YnN0cmluZyggMSApICsgJzonO1xuXG4gICAgJG1hemUuZmluZCggJy5jZWxsJyApLmVhY2goIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKCB0aGlzICksIGNsYXNzU3RyaW5nID0gJyc7XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ24nICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIG4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ2UnICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ3MnICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIHMnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkdGhpcy5oYXNDbGFzcyggJ3cnICkgKSB7XG4gICAgICAgICAgICBjbGFzc1N0cmluZyArPSAnIHcnO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F2ZVN0cmluZyArPSBzYXZlTWFwcGluZ3NbIGNsYXNzU3RyaW5nLnN1YnN0cmluZyggMSApIF07XG4gICAgfSApO1xuXG4gICAgcmV0dXJuIHNhdmVTdHJpbmc7XG59O1xuXG52YXIgbG9hZFNhdmVTdHJpbmcgPSBmdW5jdGlvbiggc2F2ZVN0cmluZyApIHtcbiAgICB2YXIgc3ViUGFydHMsIHBhcnRzID0gc2F2ZVN0cmluZy5zcGxpdCggJzonICk7XG4gICAgaWYgKCBwYXJ0cy5sZW5ndGggIT09IDIgKSB7XG4gICAgICAgIHJldHVybiAnSW52YWxpZCBNYXplIFN0cmluZyc7XG4gICAgfVxuXG4gICAgc3ViUGFydHMgPSBwYXJ0c1sgMCBdLnNwbGl0KCAnfCcgKTtcbiAgICBpZiAoIHN1YlBhcnRzLmxlbmd0aCAhPT0gNCApIHtcbiAgICAgICAgcmV0dXJuICdJbnZhbGlkIE1hemUgU3RyaW5nJztcbiAgICB9XG5cbiAgICB3aWR0aCA9IHBhcnNlSW50KCBzdWJQYXJ0cyBbIDEgXSwgMTAgKTtcbiAgICBoZWlnaHQgPSBwYXJzZUludCggc3ViUGFydHNbIDAgXSwgMTAgKTtcblxuICAgIGlmICggaXNOYU4oIHdpZHRoICkgfHwgaXNOYU4oIGhlaWdodCApICkge1xuICAgICAgICByZXR1cm4gJ0ludmFsaWQgTWF6ZSBTdHJpbmcnO1xuICAgIH1cblxuICAgIGNsZWFyR3JpZCgpO1xuICAgIGRyYXdHcmlkKCBoZWlnaHQsIHdpZHRoLCBfLnBhcnRpYWwoIGxvYWREcmF3LCBwYXJ0c1sgMSBdLCBzdWJQYXJ0c1sgMiBdLCBzdWJQYXJ0c1sgMyBdLnNwbGl0KCAnLicgKSApICk7XG59O1xuXG52YXIgbG9hZERyYXdDZWxsID0gZnVuY3Rpb24oIHNhdmVTdHJpbmcsIGkgKSB7XG4gICAgJCggdGhpcyApLmFkZENsYXNzKCBsb2FkTWFwcGluZ3NbIHNhdmVTdHJpbmcuY2hhckF0KCBpICkgXSApO1xufVxuXG52YXIgbG9hZERyYXcgPSBmdW5jdGlvbiggc2F2ZVN0cmluZywgc3RhcnRJRCwgZmluaXNoSURzICkge1xuICAgICRtYXplLmZpbmQoICcuY2VsbCcgKS5lYWNoKCBfLnBhcnRpYWwoIGxvYWREcmF3Q2VsbCwgc2F2ZVN0cmluZyApICkuYWRkQ2xhc3MoICd2aXNpdGVkIGNvbXBsZXRlJyApO1xuICAgICRtYXplLmZpbmQoICcjJyArIHN0YXJ0SUQgKS5hZGRDbGFzcyggJ3N0YXJ0JyApO1xuXG4gICAgXy5lYWNoKCBmaW5pc2hJRHMsIGZ1bmN0aW9uKCBpZCApIHtcbiAgICAgICAgJG1hemUuZmluZCggJyMnICsgaWQgKS5hZGRDbGFzcyggJ2ZpbmlzaCcgKTtcbiAgICB9ICk7XG5cbiAgICBmaW5hbGl6ZU1hemUoKTtcbn07XG5cbnZhciBjbGVhckdyaWQgPSBmdW5jdGlvbigpIHtcbiAgICAkbWF6ZS5lbXB0eSgpLnJlbW92ZUNsYXNzKCAnZmluaXNoZWQnICk7XG4gICAgY2VsbHMgPSBbXTtcbn07XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuICAgIHZhciAkbWF6ZSwgbWF6ZTtcbiAgICAkbWF6ZSA9ICQoICcubWF6ZScgKTtcblxuICAgIG1hemUgPSBuZXcgTWF6ZSggJG1hemUgKTtcblxuICAgICQoICcubWF6ZS1pbnB1dCcgKS5oaWRlKCkuZmlyc3QoKS5zaG93KCk7XG5cbiAgICAkKCAnI2dlbmVyYXRlJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vY2xlYXJHcmlkKCk7XG5cbiAgICAgICAgLypoZWlnaHQgPSBwYXJzZUludCggJCggJyNncmlkLWhlaWdodCcgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgd2lkdGggPSBwYXJzZUludCggJCggJyNncmlkLXdpZHRoJyApLnZhbCgpLCAxMCApO1xuICAgICAgICBjZWxsU2l6ZSA9IHBhcnNlSW50KCAkKCAnI2NlbGwtc2l6ZScgKS52YWwoKSwgMTAgKTtcbiAgICAgICAgc3BsaXQgPSBwYXJzZUludCggJCggJyNtYXplLXN0eWxlJyApLnZhbCgpLCAxMCApOyovXG5cbiAgICAgICAgbWF6ZS5kcmF3R3JpZCgpO1xuICAgIH0gKTtcblxuICAgICQoICcjZ3JpZC13aWR0aCcgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGNvbCA9ICQoICcubGFyZ2UtMTIuY29sdW1ucycgKSxcbiAgICAgICAgICAgIGNvbFdpZHRoID0gJGNvbC5pbm5lcldpZHRoKCkgLSAxMDAsXG4gICAgICAgICAgICBncmlkV2lkdGggPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIGlmICggaXNOYU4oIGdyaWRXaWR0aCApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNDAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggZ3JpZFdpZHRoIDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRXaWR0aCApICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI2dyaWQtaGVpZ2h0JyApLmNoYW5nZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBncmlkSGVpZ2h0ID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuICAgICAgICBpZiAoIGlzTmFOKCBncmlkSGVpZ2h0ICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBncmlkSGVpZ2h0IDwgMiApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDIgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIE1hdGguZmxvb3IoIGdyaWRIZWlnaHQgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNjZWxsLXNpemUnICkuY2hhbmdlKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNlbGxTaXplID0gcGFyc2VJbnQoICQoIHRoaXMgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggaXNOYU4oIGNlbGxTaXplICkgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAyMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBjZWxsU2l6ZSA8IDMgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNlbGxTaXplID4gMzAgKSB7XG4gICAgICAgICAgICAkKCB0aGlzICkudmFsKCAzMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggY2VsbFNpemUgKSApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbFNpemUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG4gICAgICAgIHZhciAkY29sID0gJCggJy5sYXJnZS0xMi5jb2x1bW5zJyApLFxuICAgICAgICAgICAgY29sV2lkdGggPSAkY29sLmlubmVyV2lkdGgoKSAtIDEwMCxcbiAgICAgICAgICAgIGdyaWRXaWR0aCA9IHBhcnNlSW50KCAkKCAnI2dyaWQtd2lkdGgnICkudmFsKCkgKSxcbiAgICAgICAgICAgIGdyaWRIZWlnaHQgPSBwYXJzZUludCggJCggJyNncmlkLWhlaWdodCcgKS52YWwoKSApO1xuXG4gICAgICAgIGlmICggZ3JpZFdpZHRoID4gY29sV2lkdGggLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC13aWR0aCcgKS52YWwoIE1hdGguZmxvb3IoIGNvbFdpZHRoIC8gY2VsbFNpemUgKSApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIGdyaWRIZWlnaHQgPiA2MDAgLyBjZWxsU2l6ZSApIHtcbiAgICAgICAgICAgICQoICcjZ3JpZC1oZWlnaHQnICkudmFsKCBNYXRoLmZsb29yKCA2MDAgLyBjZWxsU2l6ZSApIClcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoICcjbWF6ZS1zdHlsZScgKS5jaGFuZ2UoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBwYXJzZUludCggJCggdGhpcyApLnZhbCgpICk7XG5cbiAgICAgICAgaWYoIGlzTmFOKCBzdHlsZSApICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggNTAgKTtcbiAgICAgICAgfSBlbHNlIGlmICggc3R5bGUgPCAwICkge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggMCApO1xuICAgICAgICB9IGVsc2UgaWYgKCBzdHlsZSA+IDEwMCApIHtcbiAgICAgICAgICAgICQoIHRoaXMgKS52YWwoIDEwMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggdGhpcyApLnZhbCggTWF0aC5mbG9vciggc3R5bGUgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyNxbWFyaycgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdXBkYXRlcyA9ICQoICcjdXBkYXRlcycgKTtcblxuICAgICAgICBpZiAoICR1cGRhdGVzLmhhc0NsYXNzKCAnZXhwYW5kZWQnICkgKSB7XG4gICAgICAgICAgICAkdXBkYXRlcy5zdG9wKCB0cnVlLCB0cnVlICkucmVtb3ZlQ2xhc3MoICdleHBhbmRlZCcgKS5hbmltYXRlKCB7ICdyaWdodCc6ICctNTMwcHgnIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR1cGRhdGVzLnN0b3AoIHRydWUsIHRydWUgKS5hZGRDbGFzcyggJ2V4cGFuZGVkJyApLmFuaW1hdGUoIHsgJ3JpZ2h0JzogJzVweCcgfSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN0b2dnbGUtaGVhdG1hcCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpLGo7XG4gICAgICAgIGlmICggbWF6ZS5oZWF0cy5sZW5ndGggKSB7XG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IG1hemUuaGVhdHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgbWF6ZS5oZWF0c1sgaSBdLnJlbW92ZUNsYXNzKCAnZGlzdGFuY2UtJyArIGkgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaGVhdHMgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTAnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTEnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTInICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtM1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTMnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTQnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTUnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtNlwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTYnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtN1wiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTcnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOFwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTgnICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtOVwiXScgKS5hZGRDbGFzcyggJ2Rpc3RhbmNlLTknICkgKTtcbiAgICAgICAgICAgIG1hemUuaGVhdHMucHVzaCggJG1hemUuZmluZCggJ1tkYXRhLWRpc3RhbmNlLWNsYXNzPVwiZGlzdGFuY2UtMTBcIl0nICkuYWRkQ2xhc3MoICdkaXN0YW5jZS0xMCcgKSApO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgJCggJyN6b29tLW91dCcgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPD0gNSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgLSAyO1xuICAgICAgICAkKCAnLmNlbGwnICkuY3NzKCB7XG4gICAgICAgICAgICB3aWR0aDogY2VsbFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IGNlbGxTaXplXG4gICAgICAgIH0gKTtcblxuICAgICAgICAkbWF6ZS53aWR0aCggY2VsbFNpemUgKiBwYXJzZUludCggJG1hemUuYXR0ciggJ2RhdGEtd2lkdGgnICksIDEwICkgKS5oZWlnaHQoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLWhlaWdodCcgKSwgMTAgKSApO1xuICAgIH0gKTtcblxuICAgICQoICcjem9vbS1pbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggY2VsbFNpemUgPj0gOTggKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplICsgMjtcbiAgICAgICAgJCggJy5jZWxsJyApLmNzcygge1xuICAgICAgICAgICAgd2lkdGg6IGNlbGxTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiBjZWxsU2l6ZVxuICAgICAgICB9ICk7XG5cbiAgICAgICAgJG1hemUud2lkdGgoIGNlbGxTaXplICogcGFyc2VJbnQoICRtYXplLmF0dHIoICdkYXRhLXdpZHRoJyApLCAxMCApICkuaGVpZ2h0KCBjZWxsU2l6ZSAqIHBhcnNlSW50KCAkbWF6ZS5hdHRyKCAnZGF0YS1oZWlnaHQnICksIDEwICkgKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI3NhdmUtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggJG1hemUuaGFzQ2xhc3MoICdmaW5pc2hlZCcgKSApIHtcbiAgICAgICAgICAgICQoICcjbWF6ZS1zYXZlc3RyaW5nJyApLnZhbCggZ2V0U2F2ZVN0cmluZygpICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoICdHZW5lcmF0ZSBvciBsb2FkIGEgbWF6ZSBmaXJzdCEnICk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAkKCAnI21hemUtc2F2ZXN0cmluZycgKS5jbGljayggZnVuY3Rpb24oIGUgKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9ICk7XG5cbiAgICAkKCAnI2xvYWQtbWF6ZScgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIGxvYWRTYXZlU3RyaW5nKCAkKCAnI21hemUtc2F2ZXN0cmluZycgKS52YWwoKSApO1xuICAgIH0pXG5cbiAgICAkKCAnI2lvLWJ1dHRvbicgKS5jbGljayggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcblxuICAgICAgICBpZiAoICR0aGlzLmhhc0NsYXNzKCAnc2Vjb25kYXJ5JyApICkge1xuICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoICdzZWNvbmRhcnknICk7XG4gICAgICAgICAgICAkKCAnLm1hemUtaW5wdXQnICkuaGlkZSgpLmZpbHRlciggJyNtYXplLWlvJyApLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCAnc2Vjb25kYXJ5JyApO1xuICAgICAgICAgICAgJCggJy5tYXplLWlucHV0JyApLmhpZGUoKS5maXJzdCgpLnNob3coKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgICQoIHdpbmRvdyApLnJlc2l6ZSggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSAwO1xuXG4gICAgICAgICQoICdib2R5ID4gLnJvdzpub3QoLm1jLXJvdyknKS5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGhlaWdodCArPSAkKCB0aGlzICkuaGVpZ2h0KCk7XG4gICAgICAgIH0gKVxuXG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuaGVpZ2h0KCAkKCB0aGlzICkuaGVpZ2h0KCkgLSBoZWlnaHQgLSAzMCApO1xuICAgIH0gKS5yZXNpemUoKTtcblxuICAgICQoICcjZW50ZXItcHJpbnRtb2RlJyApLmNsaWNrKCBmdW5jdGlvbigpIHtcbiAgICAgICAgJCggJ2JvZHknICkuYWRkQ2xhc3MoICdwcmludC1tb2RlJyApO1xuICAgICAgICAkKCAnI21hemUtY29udGFpbmVyJyApLmF0dHIoICdkYXRhLXN0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnc3R5bGUnICkgKS5hdHRyKCAnc3R5bGUnLCAnJyApO1xuICAgIH0gKTtcblxuICAgICQoICcjZXhpdC1wcmludG1vZGUnICkuY2xpY2soIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCAnYm9keScgKS5yZW1vdmVDbGFzcyggJ3ByaW50LW1vZGUnICk7XG4gICAgICAgICQoICcjbWF6ZS1jb250YWluZXInICkuYXR0ciggJ3N0eWxlJywgJCggJyNtYXplLWNvbnRhaW5lcicgKS5hdHRyKCAnZGF0YS1zdHlsZScgKSApO1xuICAgIH0gKTtcbn0gKTtcbiIsImltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yICggJGVsZW1lbnQgKSB7XG4gICAgICAgIHRoaXMuJG1hemUgPSAkZWxlbWVudDtcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IDEwO1xuICAgICAgICB0aGlzLmRpc3RhbmNlID0gMDtcbiAgICAgICAgdGhpcy5tYXhEaXN0YW5jZSA9IDA7XG5cbiAgICAgICAgdGhpcy5oZWlnaHQgPSAyMDtcbiAgICAgICAgdGhpcy53aWR0aCA9IDUwO1xuXG4gICAgICAgIHRoaXMucmVuZGVyU3RlcHMgPSAyO1xuICAgICAgICB0aGlzLmN1cnJUaW1lID0gbmV3IERhdGUoKTtcbiAgICAgICAgdGhpcy5kcmF3VGltZSA9IDA7XG4gICAgICAgIHRoaXMuc3BsaXQgPSAwO1xuXG4gICAgICAgIHRoaXMuYWN0aXZlU2V0ID0gW107XG4gICAgICAgIHRoaXMuY2VsbHMgPSBbXTtcbiAgICAgICAgdGhpcy5oZWF0cyA9IFtdO1xuXG4gICAgICAgIHRoaXMucGFzc2FnZVRvQ2xhc3MgPSB7XG4gICAgICAgICAgICAwOiAnbicsXG4gICAgICAgICAgICAxOiAncycsXG4gICAgICAgICAgICAyOiAnZScsXG4gICAgICAgICAgICAzOiAndydcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmludmVyc2VQYXNzYWdlID0ge1xuICAgICAgICAgICAgMDogJ3MnLFxuICAgICAgICAgICAgMTogJ24nLFxuICAgICAgICAgICAgMjogJ3cnLFxuICAgICAgICAgICAgMzogJ2UnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZHJhd0dyaWQoIGgsIHcsIG9uRmluaXNoICkge1xuICAgICAgICB2YXIgaSwgaiwgY2FsbENudCA9IDA7XG5cbiAgICAgICAgdmFyIGggPSB0aGlzLmhlaWdodDtcbiAgICAgICAgdmFyIHcgPSB0aGlzLndpZHRoO1xuXG4gICAgICAgIGZvciggaSA9IDA7IGkgPCBoOyBpKysgKSB7XG4gICAgICAgICAgICBfLmRlZmVyKCBfLmJpbmQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbIGNhbGxDbnQgXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yKCBqID0gMDsgaiA8IHc7IGorKyApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1sgY2FsbENudCBdLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCAnPGRpdiBpZD1cIicgKyBqICsgJy0nICsgY2FsbENudCArICdcIiBjbGFzcz1cImNlbGxcIiBzdHlsZT1cIndpZHRoOicgKyB0aGlzLmNlbGxTaXplICsgJ3B4O2hlaWdodDonICsgdGhpcy5jZWxsU2l6ZSArJ3B4XCIgLz4nIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oIHRoaXMuJG1hemUgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICggY2FsbENudCArIDEgPT09IGggKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIW9uRmluaXNoICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250aW51ZURyYXdpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRmluaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjYWxsQ250Kys7XG4gICAgICAgICAgICB9LCB0aGlzICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1hemVcbiAgICAgICAgICAgIC53aWR0aCggdyAqIHRoaXMuY2VsbFNpemUgKVxuICAgICAgICAgICAgLmhlaWdodCggaCAqIHRoaXMuY2VsbFNpemUgKVxuICAgICAgICAgICAgLmF0dHIoICdkYXRhLXdpZHRoJywgdyApXG4gICAgICAgICAgICAuYXR0ciggJ2RhdGEtaGVpZ2h0JywgaCApO1xuICAgIH1cblxuICAgIGNvbnRpbnVlRHJhd2luZyAoKSB7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLm1heERpc3RhbmNlID0gMDtcbiAgICAgICAgdGhpcy5hY3RpdmVTZXQucHVzaChcbiAgICAgICAgICAgICQoICcjJyArIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoICkgKyAnLScgKyAgTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0ICkgKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ3Zpc2l0ZWQgc3RhcnQnIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ2RhdGEtZGlzdGFuY2UnLCB0aGlzLmRpc3RhbmNlICkgKTtcblxuICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICB9XG5cbiAgICBkcmF3ICgpIHtcbiAgICAgICAgdmFyICRjdXJyZW50LCAkbmV3LCBuZWlnaGJvcnMsIHRlbXBUaW1lLCBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIDEwMCApO1xuXG4gICAgICAgIGlmICggbiA8IHRoaXMuc3BsaXQgKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHRoaXMuYWN0aXZlU2V0Lmxlbmd0aCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbiA9IHRoaXMuYWN0aXZlU2V0Lmxlbmd0aCAtIDE7XG4gICAgICAgIH1cblxuICAgICAgICAkY3VycmVudCA9IHRoaXMuYWN0aXZlU2V0WyBuIF07XG5cbiAgICAgICAgdGhpcy5kaXN0YW5jZSA9IHBhcnNlSW50KCAkY3VycmVudC5hdHRyKCAnZGF0YS1kaXN0YW5jZScgKSwgMTAgKTtcbiAgICAgICAgdGhpcy5tYXhEaXN0YW5jZSA9IE1hdGgubWF4KCB0aGlzLm1heERpc3RhbmNlLCB0aGlzLmRpc3RhbmNlICk7XG5cbiAgICAgICAgbmVpZ2hib3JzID0gdGhpcy5nZXRVbnZpc2l0ZWROZWlnaGJvcnMoICRjdXJyZW50ICk7XG5cbiAgICAgICAgaWYoIG5laWdoYm9ycy5sZW5ndGggKSB7XG4gICAgICAgICAgICBuID0gTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGggKTtcbiAgICAgICAgICAgICRuZXcgPSBuZWlnaGJvcnNbIG4gXTtcblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVTZXQucHVzaChcbiAgICAgICAgICAgICAgICAkbmV3LmNlbGwuYWRkQ2xhc3MoICd2aXNpdGVkICcgKyB0aGlzLmludmVyc2VQYXNzYWdlWyAkbmV3LmRpcmVjdGlvbiBdIClcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoICdkYXRhLWRpc3RhbmNlJywgdGhpcy5kaXN0YW5jZSArIDEgKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgJGN1cnJlbnQuYWRkQ2xhc3MoIHRoaXMucGFzc2FnZVRvQ2xhc3NbICRuZXcuZGlyZWN0aW9uIF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlU2V0LnNwbGljZSggbiwgMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGVtcFRpbWUgPSAoIG5ldyBEYXRlKCkgKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJTdGVwcysrO1xuXG4gICAgICAgIGlmICggdGhpcy5hY3RpdmVTZXQubGVuZ3RoICkge1xuICAgICAgICAgICAgaWYgKCB0aGlzLnJlbmRlclN0ZXBzICUgMSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICBfLmRlZmVyKCBfLmJpbmQoIHRoaXMuZHJhdywgdGhpcyApICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCggJ2RpdltkYXRhLWRpc3RhbmNlPScgKyB0aGlzLm1heERpc3RhbmNlICsgJ10nICkuYWRkQ2xhc3MoICdmaW5pc2gnICk7XG5cbiAgICAgICAgICAgIHRoaXMuZmluYWxpemVNYXplKCk7XG4gICAgICAgICAgICB0aGlzLmFkZERlcHRoQ2xhc3NlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluYWxpemVNYXplICgpIHtcbiAgICAgICAgdGhpcy4kbWF6ZS5maW5kKCAnZGl2Lm4nICkuY3NzKCAnYm9yZGVyLXRvcCcsICcwJyApO1xuICAgICAgICB0aGlzLiRtYXplLmZpbmQoICdkaXYucycgKS5jc3MoICdib3JkZXItYm90dG9tJywgJzAnICk7XG4gICAgICAgIHRoaXMuJG1hemUuZmluZCggJ2Rpdi53JyApLmNzcyggJ2JvcmRlci1sZWZ0JywgJzAnICk7XG4gICAgICAgIHRoaXMuJG1hemUuZmluZCggJ2Rpdi5lJyApLmNzcyggJ2JvcmRlci1yaWdodCcsICcwJyApO1xuXG4gICAgICAgIHRoaXMuJG1hemUuYWRkQ2xhc3MoICdmaW5pc2hlZCcgKTtcbiAgICB9XG5cbiAgICBhZGREZXB0aENsYXNzZXMoKSB7XG4gICAgICAgIHZhciBpLCBqLCBkaXN0YW5jZTtcblxuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBmb3IoIGogPSAwOyBqIDwgdGhpcy5jZWxsc1sgaSBdLmxlbmd0aDsgaisrICkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbIGkgXVsgaiBdXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCAnZGF0YS1kaXN0YW5jZS1jbGFzcycsICdkaXN0YW5jZS0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoICggcGFyc2VJbnQoIHRoaXMuY2VsbHNbIGkgXVsgaiBdLmF0dHIoICdkYXRhLWRpc3RhbmNlJyApICkgLyB0aGlzLm1heERpc3RhbmNlICogMTAgKSApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRVbnZpc2l0ZWROZWlnaGJvcnMgKCAkY2VsbCApIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdLCAkY3VycmVudCxcbiAgICAgICAgICAgIHBvcyA9ICRjZWxsLmF0dHIoICdpZCcgKS5zcGxpdCggJy0nICksXG4gICAgICAgICAgICB4ID0gcGFyc2VJbnQoIHBvc1sgMCBdLCAxMCApLCB5ID0gcGFyc2VJbnQoIHBvc1sgMSBdLCAxMCApO1xuXG4gICAgICAgIC8vIE5vcnRoXG4gICAgICAgIGlmICggeSAhPT0gMCApIHtcbiAgICAgICAgICAgICRjdXJyZW50ID0gdGhpcy5jZWxsc1sgeSAtIDEgXVsgeCBdO1xuXG4gICAgICAgICAgICBpZiAoICEkY3VycmVudC5oYXNDbGFzcyggJ3Zpc2l0ZWQnICkgKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIHsgY2VsbDogJGN1cnJlbnQsIGRpcmVjdGlvbjogMCB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZXN0XG4gICAgICAgIGlmICggeCAhPT0gMCApIHtcbiAgICAgICAgICAgICRjdXJyZW50ID0gdGhpcy5jZWxsc1sgeSBdWyB4IC0gMSBdO1xuXG4gICAgICAgICAgICBpZiAoICEkY3VycmVudC5oYXNDbGFzcyggJ3Zpc2l0ZWQnICkgKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIHsgY2VsbDogJGN1cnJlbnQsIGRpcmVjdGlvbjogMyB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb3V0aFxuICAgICAgICBpZiAoIHkgIT09IHRoaXMuaGVpZ2h0IC0gMSApIHtcbiAgICAgICAgICAgICRjdXJyZW50ID0gdGhpcy5jZWxsc1sgeSArIDEgXVsgeCBdO1xuXG5cbiAgICAgICAgICAgIGlmICggISRjdXJyZW50Lmhhc0NsYXNzKCAndmlzaXRlZCcgKSApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCggeyBjZWxsOiAkY3VycmVudCwgZGlyZWN0aW9uOiAxIH0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVhc3RcbiAgICAgICAgaWYgKCB4ICE9PSB0aGlzLndpZHRoIC0gMSApIHtcbiAgICAgICAgICAgICRjdXJyZW50ID0gdGhpcy5jZWxsc1sgeSBdWyB4ICsgMSBdO1xuXG4gICAgICAgICAgICBpZiAoICEkY3VycmVudC5oYXNDbGFzcyggJ3Zpc2l0ZWQnICkgKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goIHsgY2VsbDogJGN1cnJlbnQsIGRpcmVjdGlvbjogMiB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHJlc3VsdC5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAkY2VsbC5hZGRDbGFzcyggJ2NvbXBsZXRlJyApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iXX0=
