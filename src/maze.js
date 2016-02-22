import _ from 'underscore';
import $ from 'jquery';

export default class {
    constructor () {
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

    _generate () {
        var current, next, neighbors, n;

        while ( this._activeSet.length ) {
            n = this._getHeadNode();
            current = this._activeSet[ n ];

            this.maxDistance = Math.max( this.maxDistance, current.distance );

            neighbors = this._getUnvisitedNeighbors( current );

            if ( neighbors ) {
                next = neighbors[ Math.floor( Math.random() * neighbors.length ) ];

                next.cell.exits.push( this.inversePassage[ next.direction ] );
                next.cell.distance = current.distance + 1;
                next.cell.visited = true;

                this._activeSet.push( next.cell );

                current.exits.push( this.passageToClass[ next.direction ] );
            } else {
                this._activeSet.splice( n, 1 );
            }
        }
    }

    generate( startX, startY ) {
        var current;

        this._populateCells();

        this.maxDistance = 0;

        if ( startX === undefined ) {
            startX = this._getStartXPos();
        }

        if ( startY === undefined ) {
            startY = this._getStartYPos();
        }

        current = this._cells[ startY ][ startX ];
        current.distance = 0;
        current.visited = true;

        this._activeSet.push( current );

        this._generate();
    }
}
