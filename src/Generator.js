import _ from 'underscore';
import $ from 'jquery';

const directions = {
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

export { directions };

/**
 * A maze generation class that will generate a maze of height by width cells
 */
export default class {
    /**
     * Initialize the two dimensional array containing cell definitions
     *
     * @private
     */
    _populateCells () {
        this._cells = [];

        for ( let i = 0; i < this.height; i++ ) {
            this._cells.push( [] );

            for ( let j = 0; j < this.width; j++ ) {
                this._cells[ i ].push( {
                    x: j,
                    y: i,
                    exits: [],
                    linkedCells: [
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined
                    ],
                    distance: -1,
                    visited: false,
                    complete: false
                } );
            }
        }
    }

    /**
     * Get the starting x position, a random number between 0 and maze width
     *
     * @private
     */
    _getStartXPos () {
        return Math.floor( Math.random() * this.width );
    }

    /**
     * Get the starting y position, a random number between 0 and maze height
     */
    _getStartYPos () {
        return Math.floor( Math.random() * this.height );
    }

    /**
     * Get node to act as head node for generation, will either select a node at
     * random, or the last added node
     *
     * @private
     * @return  {Number}    the index of the new head node to use
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

    /**
     * Store the unvisted cell in the result array
     *
     * @private
     * @param  {Object} cell      - the cell to store
     * @param  {Array}  result    - the array of stored, unvisted cells
     * @param  {Number} direction - the direction of the unvisted cell
     */
    _storeUnvisitedCell( cell, result, direction ) {
        if ( !cell.visited ) {
            result.push( { cell: cell, direction: direction } );
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
    _getUnvisitedNeighbors ( cell ) {
        var result = [];

        // North
        if ( cell.y !== 0 ) {
            this._storeUnvisitedCell(
                this._cells[ cell.y - 1 ][ cell.x ],
                result,
                directions.LOOKUP.NORTH
            );
        }

        // West
        if ( cell.x !== 0 ) {
            this._storeUnvisitedCell(
                this._cells[ cell.y ][ cell.x - 1 ],
                result,
                directions.LOOKUP.WEST
            );
        }

        // South
        if ( cell.y !== this.height - 1 ) {
            this._storeUnvisitedCell(
                this._cells[ cell.y + 1 ][ cell.x ],
                result,
                directions.LOOKUP.SOUTH
            );
        }

        // East
        if ( cell.x !== this.width - 1 ) {
            this._storeUnvisitedCell(
                this._cells[ cell.y ][ cell.x + 1 ],
                result,
                directions.LOOKUP.EAST
            );
        }

        // No unvisited cells
        if ( result.length === 0 ) {
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
    _generate () {
        var current, next, neighbors, n;

        // While there are cells that are still "active"
        while ( this._activeSet.length ) {
            n = this._getHeadNode();
            current = this._activeSet[ n ];

            // If this cell is the furthest, or tied for the furthest,
            // from start, store it
            if ( this._maxDistance <= current.distance ) {

                // Store the new furthest distance
                this._maxDistance = current.distance;

                // If we already had a cell found at this distance, just
                // push it onto furthestCells
                if ( this._maxDistance === current.distance ) {
                    this._furthestCells.push( current );
                }

                // Otherwise we create a new array with this cell
                else {
                    this._furthestCells = [ current ];
                }
            }

            neighbors = this._getUnvisitedNeighbors( current );

            // If there are unvisited neighbors, select one to create a link to
            // from this cell
            if ( neighbors ) {

                // Pick one neighbor at random
                //
                // TODO: This would be a good spot to modify the algorithm
                // to allow for directional wandering, ie: favoring east/west
                // movement to north/south
                next = neighbors[ Math.floor( Math.random() * neighbors.length ) ];

                // Update the current cell to have an exit to the neighbor
                current.exits.push(
                    directions.ENCODED[ next.direction ]
                );
                current.linkedCells[ next.direction ] = next;

                // Update the neighbor cell to have an exit to this cell
                next.cell.exits.push(
                    directions.ENCODED[ directions.INVERSE_LOOKUP[ next.direction ] ]
                );
                next.cell.linkedCells[ directions.INVERSE_LOOKUP[ next.direction ]  ] = current;

                // Store the distance of this cell from the starting cell
                // This is just a statistic and doesn't current have an
                // impact on the evaluation of the algorithm
                next.cell.distance = current.distance + 1;

                // Track that this cell has been visited, that is, it is
                // accessible from another cell in the maze
                next.cell.visited = true;

                // Push this cell onto the array of cells that are potential
                // new head nodes to continue generating the maze from
                this._activeSet.push( next.cell );
            } else {
                this._activeSet.splice( n, 1 );
            }
        }
    }

    constructor ( options = {} ) {
        this.saveOptions( options );
    }

    /**
     * Save options for this generator
     *
     * @param  {Object} options - a Generator options object
     */
    saveOptions ( options = {} ) {
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
    generate ( options = {} ) {
        var current;

        this.saveOptions( options );

        this._populateCells();

        this._maxDistance = 0;
        this._furthestCells = [];
        this._activeSet = [];

        this._startingCell = current = this._cells[ this.startY ][ this.startX ];
        current.distance = 0;
        current.visited = true;

        this._activeSet.push( current );

        this._generate();
    }

    getCell ( x, y ) {
        return this._cells[ y ][ x ];
    }

    get furthestCells () {
        return this._furthestCells;
    }

    get startingCell () {
        return this._startingCell;
    }

    get cells () {
        return this._cells;
    }
}
