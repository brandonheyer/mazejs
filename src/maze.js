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

    drawGrid( h, w, onFinish ) {
        var i, j, callCnt = 0;

        var h = this.height;
        var w = this.width;

        for( i = 0; i < h; i++ ) {
            _.defer( _.bind( function() {
                this.cells[ callCnt ] = [];

                for( j = 0; j < w; j++ ) {
                    this.cells[ callCnt ].push(
                        $( '<div id="' + j + '-' + callCnt + '" class="cell" style="width:' + this.cellSize + 'px;height:' + this.cellSize +'px" />' )
                            .appendTo( this.$maze )
                    );
                }

                if ( callCnt + 1 === h ) {
                    if ( !onFinish ) {
                        this.continueDrawing();
                    } else {
                        onFinish();
                    }
                }

                callCnt++;
            }, this ) );
        }

        this.$maze
            .width( w * this.cellSize )
            .height( h * this.cellSize )
            .attr( 'data-width', w )
            .attr( 'data-height', h );
    }

    continueDrawing () {
        this.distance = this.maxDistance = 0;
        this.activeSet.push(
            $( '#' + Math.floor( Math.random() * this.width ) + '-' +  Math.floor( Math.random() * this.height ) )
                .addClass( 'visited start' )
                .attr( 'data-distance', this.distance ) );

        this.draw();
    }

    draw () {
        var $current, $new, neighbors, tempTime, n = Math.floor( Math.random() * 100 );

        if ( n < this.split ) {
            n = Math.floor( Math.random() * this.activeSet.length );
        } else {
            n = this.activeSet.length - 1;
        }

        $current = this.activeSet[ n ];

        this.distance = parseInt( $current.attr( 'data-distance' ), 10 );
        this.maxDistance = Math.max( this.maxDistance, this.distance );

        neighbors = this.getUnvisitedNeighbors( $current );

        if( neighbors.length ) {
            n = Math.floor( Math.random() * neighbors.length );
            $new = neighbors[ n ];

            this.activeSet.push(
                $new.cell.addClass( 'visited ' + this.inversePassage[ $new.direction ] )
                    .attr( 'data-distance', this.distance + 1 )
            );

            $current.addClass( this.passageToClass[ $new.direction ] );
        } else {
            this.activeSet.splice( n, 1 );
        }

        tempTime = ( new Date() ).getTime();

        this.renderSteps++;

        if ( this.activeSet.length ) {
            if ( this.renderSteps % 1 === 0 ) {
                _.defer( _.bind( this.draw, this ) );
            } else {
                this.draw();
            }
        } else {
            $( 'div[data-distance=' + this.maxDistance + ']' ).addClass( 'finish' );

            this.finalizeMaze();
            this.addDepthClasses();
        }
    }

    finalizeMaze () {
        this.$maze.find( 'div.n' ).css( 'border-top', '0' );
        this.$maze.find( 'div.s' ).css( 'border-bottom', '0' );
        this.$maze.find( 'div.w' ).css( 'border-left', '0' );
        this.$maze.find( 'div.e' ).css( 'border-right', '0' );

        this.$maze.addClass( 'finished' );
    }

    addDepthClasses() {
        var i, j, distance;

        for ( i = 0; i < this.cells.length; i++ ) {
            for( j = 0; j < this.cells[ i ].length; j++ ) {
                this.cells[ i ][ j ]
                    .attr( 'data-distance-class', 'distance-' +
                        Math.floor( ( parseInt( this.cells[ i ][ j ].attr( 'data-distance' ) ) / this.maxDistance * 10 ) )
                    );
            }
        }
    }

    getUnvisitedNeighbors ( $cell ) {
        var result = [], $current,
            pos = $cell.attr( 'id' ).split( '-' ),
            x = parseInt( pos[ 0 ], 10 ), y = parseInt( pos[ 1 ], 10 );

        // North
        if ( y !== 0 ) {
            $current = this.cells[ y - 1 ][ x ];

            if ( !$current.hasClass( 'visited' ) ) {
                result.push( { cell: $current, direction: 0 } );
            }
        }

        // West
        if ( x !== 0 ) {
            $current = this.cells[ y ][ x - 1 ];

            if ( !$current.hasClass( 'visited' ) ) {
                result.push( { cell: $current, direction: 3 } );
            }
        }

        // South
        if ( y !== this.height - 1 ) {
            $current = this.cells[ y + 1 ][ x ];


            if ( !$current.hasClass( 'visited' ) ) {
                result.push( { cell: $current, direction: 1 } );
            }
        }

        // East
        if ( x !== this.width - 1 ) {
            $current = this.cells[ y ][ x + 1 ];

            if ( !$current.hasClass( 'visited' ) ) {
                result.push( { cell: $current, direction: 2 } );
            }
        }

        if ( result.length === 0 ) {
            $cell.addClass( 'complete' );
            return false;
        }

        return result;
    }
}
