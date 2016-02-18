import _ from 'underscore';
import $ from 'jquery';

export default class {
    constructor ( $element ) {
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

    _populateCells () {
        this._cells = [];

        for ( let i = 0; i < this.height; i++ ) {
            this._cells.push( [] );

            for ( let j = 0; j < this.width; j++ ) {
                this._cells[ i ].push( {
                    x: j,
                    y: i,
                    exits: [],
                    distance: -1,
                    visited: false,
                    complete: false
                } );
            }
        }
    }

    _getStartXPos () {
        return Math.floor( Math.random() * this.width );
    }

    _getStartYPos () {
        return Math.floor( Math.random() * this.height );
    }

    /**
     * Get node to act as head node for generation, will either select a node at
     * random, or the last added node
     */
    _getHeadNode () {
        // Get a random number between 0 - 99
        var n = Math.floor( Math.random() * 100 );

        // If the random number is less than the split modifier,
        // select an existing node ( will cause a trend towards dead ends )
        if ( n < this.split ) {
            n = Math.floor( Math.random() * this._activeSet.length );
        }

        // Otherwise, select the last added node
        // ( will cause a trend towards winding trails )
        else {
            n = this._activeSet.length - 1;
        }

        return n;
    }

    _storeUnvisitedCell( current, result, direction ) {
        if ( !current.visited ) {
            result.push( { cell: current, direction: direction } );
        }
    }

    _getUnvisitedNeighbors ( cell ) {
        var result = [];

        // North
        if ( cell.y !== 0 ) {
            this._storeUnvisitedCell( this._cells[ cell.y - 1 ][ cell.x ], result, 0 );
        }

        // West
        if ( cell.x !== 0 ) {
            this._storeUnvisitedCell( this._cells[ cell.y ][ cell.x - 1 ], result, 3 );
        }

        // South
        if ( cell.y !== this.height - 1 ) {
            this._storeUnvisitedCell( this._cells[ cell.y + 1 ][ cell.x ], result, 1 );
        }

        // East
        if ( cell.x !== this.width - 1 ) {
            this._storeUnvisitedCell( this._cells[ cell.y ][ cell.x + 1 ], result, 2 );
        }

        if ( result.length === 0 ) {
            cell.complete = true;
            return false;
        }

        return result;
    }

    draw () {
        var output = '';

        for ( let i = 0; i < this.height; i++ ) {
            for ( let j = 0; j < this.width; j++ ) {
                output += '<div id="' + j + '-' + i + '" class="cell visited complete ' + this._cells[ i ][ j ].exits.join( ' ' ) +
                    '" style="width: ' + this.cellSize + 'px; height: ' + this.cellSize + 'px;"></div>';
            }
        }

        this.$maze.append( output ).addClass( 'finished' );
    }

    generate( callback ) {
        var current;

        this.$maze
            .width( this.width * this.cellSize )
            .height( this.height * this.cellSize )
            .attr( 'data-width', this.width )
            .attr( 'data-height', this.height );

        this._populateCells();

        this.maxDistance = 0;

        current = this._cells[ this._getStartYPos() ][ this._getStartXPos() ];
        current.distance = 0;
        current.visited = true;

        this._activeSet.push( current );

        this._generate( _.bind( this.draw, this ) );
    }

    _generate ( callback ) {
        var current, next, neighbors, n;

        n = this._getHeadNode();

        current = this._activeSet[ n ];

        this.maxDistance = Math.max( this.maxDistance, current.distance );

        neighbors = this._getUnvisitedNeighbors( current );

        if ( neighbors ) {
            n = Math.floor( Math.random() * neighbors.length );
            next = neighbors[ n ];

            next.cell.exits.push( this.inversePassage[ next.direction ] );
            next.cell.distance = current.distance + 1;
            next.cell.visited = true;

            this._activeSet.push( next.cell );

            current.exits.push( this.passageToClass[ next.direction ] );
        } else {
            this._activeSet.splice( n, 1 );
        }

        if ( this._activeSet.length ) {
            try {
                this._generate( callback );
            } catch ( e ) {
                if ( e instanceof RangeError ) {
                    let context = this;
                    _.defer( function() {
                        context._generate( callback );
                    } );
                } else {
                    throw e;
                }
            }
        } else {
            callback();
        }
    }
}
