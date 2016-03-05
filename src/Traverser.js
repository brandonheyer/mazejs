import _ from 'underscore';

export default class {
    _storeCallback ( property, options ) {
        if ( _.isFunction( options[ property ] ) ) {
            this._callbacks[ property ] = options[ property ];
        } else {
            this._callbacks[ property ] = this[ property ];
        }
    }

    constructor ( options ) {
        this._callbacks = {};
        this.saveOptions ( options || this.options );
    }

    saveOptions ( options ) {
        this._maze = options.maze;

        if ( !this._maze ) {
            throw new Error ( 'Must specify a maze to traverse' );
        }

        this._storeCallback( 'traversalStart', options );
        this._storeCallback( 'traversalComplete', options );
        this._storeCallback( 'traversalCell', options );
    }

    traverse () {
        this._callbacks.traversalStart.call( this, this._maze, this );

        for ( let y = 0; y < this._maze.height; y++ ) {
            for ( let x = 0; x < this._maze.width; x++ ) {
                this._callbacks.traversalCell.call( this, this._maze.getCell( x, y ), this );
            }
        }

        this._callbacks.traversalComplete.call( this, this._maze, this );
    }

    traversalStart ( maze, traverser ) {

    }

    traversalComplete ( maze, traverser ) {

    }

    traversalCell ( cell, traverser ) {

    }

    get options () {
        return {
            traversalStart: this.traversalStart,
            traversalComplete: this.traversalComplete,
            traversalCell: this.traversalCell
        };
    }
}
