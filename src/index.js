import $ from 'jquery';
import _ from 'underscore';
import Maze from './maze';
import Draw from './draw';

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

var getSaveString = function() {
    var finishes = '', saveString = height + '|' + width + '|' + $maze.find( '.start' ).attr( 'id' ) + '|';

    $maze.find( '.finish' ).each( function() {
        finishes += '.' + $( this ).attr( 'id' );
    } );

    saveString += finishes.substring( 1 ) + ':';

    $maze.find( '.cell' ).each( function() {
        var $this = $( this ), classString = '';

        if ( $this.hasClass( 'n' ) ) {
            classString += ' n';
        }

        if ( $this.hasClass( 'e' ) ) {
            classString += ' e';
        }

        if ( $this.hasClass( 's' ) ) {
            classString += ' s';
        }

        if ( $this.hasClass( 'w' ) ) {
            classString += ' w';
        }

        saveString += saveMappings[ classString.substring( 1 ) ];
    } );

    return saveString;
};

var loadSaveString = function( saveString ) {
    var subParts, parts = saveString.split( ':' );
    if ( parts.length !== 2 ) {
        return 'Invalid Maze String';
    }

    subParts = parts[ 0 ].split( '|' );
    if ( subParts.length !== 4 ) {
        return 'Invalid Maze String';
    }

    width = parseInt( subParts [ 1 ], 10 );
    height = parseInt( subParts[ 0 ], 10 );

    if ( isNaN( width ) || isNaN( height ) ) {
        return 'Invalid Maze String';
    }

    clearGrid();
    drawGrid( height, width, _.partial( loadDraw, parts[ 1 ], subParts[ 2 ], subParts[ 3 ].split( '.' ) ) );
};

var loadDrawCell = function( saveString, i ) {
    $( this ).addClass( loadMappings[ saveString.charAt( i ) ] );
}

var loadDraw = function( saveString, startID, finishIDs ) {
    $maze.find( '.cell' ).each( _.partial( loadDrawCell, saveString ) ).addClass( 'visited complete' );
    $maze.find( '#' + startID ).addClass( 'start' );

    _.each( finishIDs, function( id ) {
        $maze.find( '#' + id ).addClass( 'finish' );
    } );

    finalizeMaze();
};

var clearGrid = function() {
    $maze.empty().removeClass( 'finished' );
    maze.cells = [];
};

$( document ).ready( function() {
    $maze = $( '.maze' );
    maze = new Maze();

    $( '.maze-input' ).hide().first().show();

    $( '#generate' ).click( function( event ) {
        event.preventDefault();
        clearGrid();

        maze.height = parseInt( $( '#grid-height' ).val(), 10 );
        maze.width = parseInt( $( '#grid-width' ).val(), 10 );
        maze.cellSize = parseInt( $( '#cell-size' ).val(), 10 );
        maze.split = parseInt( $( '#maze-style' ).val(), 10 );

        maze.generate();
        ( new Draw( $maze, maze ) ).draw();
    } );

    $( '#grid-width' ).change( function() {
        var $col = $( '.large-12.columns' ),
            colWidth = $col.innerWidth() - 100,
            gridWidth = parseInt( $( this ).val() );
        if ( isNaN( gridWidth ) ) {
            $( this ).val( 40 );
        } else if ( gridWidth < 2 ) {
            $( this ).val( 2 );
        } else {
            $( this ).val( Math.floor( gridWidth ) );
        }
    } );

    $( '#grid-height' ).change( function() {
        var gridHeight = parseInt( $( this ).val() );
        if ( isNaN( gridHeight ) ) {
            $( this ).val( 20 );
        } else if ( gridHeight < 2 ) {
            $( this ).val( 2 );
        } else {
            $( this ).val( Math.floor( gridHeight ) );
        }
    } );

    $( '#cell-size' ).change( function() {
        var cellSize = parseInt( $( this ).val() );

        if ( isNaN( cellSize ) ) {
            $( this ).val( 20 );
        } else if ( cellSize < 3 ) {
            $( this ).val( 3 );
        } else if ( cellSize > 30 ) {
            $( this ).val( 30 );
        } else {
            $( this ).val( Math.floor( cellSize ) );
        }

        cellSize = parseInt( $( this ).val() );
        var $col = $( '.large-12.columns' ),
            colWidth = $col.innerWidth() - 100,
            gridWidth = parseInt( $( '#grid-width' ).val() ),
            gridHeight = parseInt( $( '#grid-height' ).val() );

        if ( gridWidth > colWidth / cellSize ) {
            $( '#grid-width' ).val( Math.floor( colWidth / cellSize ) )
        }

        if ( gridHeight > 600 / cellSize ) {
            $( '#grid-height' ).val( Math.floor( 600 / cellSize ) )
        }
    } );

    $( '#maze-style' ).change( function() {
        var style = parseInt( $( this ).val() );

        if( isNaN( style ) ) {
            $( this ).val( 50 );
        } else if ( style < 0 ) {
            $( this ).val( 0 );
        } else if ( style > 100 ) {
            $( this ).val( 100 );
        } else {
            $( this ).val( Math.floor( style ) );
        }
    } );

    $( '#qmark' ).click( function() {
        var $updates = $( '#updates' );

        if ( $updates.hasClass( 'expanded' ) ) {
            $updates.stop( true, true ).removeClass( 'expanded' ).animate( { 'right': '-530px' } );
        } else {
            $updates.stop( true, true ).addClass( 'expanded' ).animate( { 'right': '5px' } );
        }
    } );

    $( '#toggle-heatmap' ).click( function() {
        var i,j;
        if ( maze.heats.length ) {
            for ( i = 0; i < maze.heats.length; i++ ) {
                maze.heats[ i ].removeClass( 'distance-' + i );
            }

            heats = [];
        } else {
            maze.heats.push( $maze.find( '[data-distance-class="distance-0"]' ).addClass( 'distance-0' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-1"]' ).addClass( 'distance-1' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-2"]' ).addClass( 'distance-2' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-3"]' ).addClass( 'distance-3' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-4"]' ).addClass( 'distance-4' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-5"]' ).addClass( 'distance-5' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-6"]' ).addClass( 'distance-6' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-7"]' ).addClass( 'distance-7' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-8"]' ).addClass( 'distance-8' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-9"]' ).addClass( 'distance-9' ) );
            maze.heats.push( $maze.find( '[data-distance-class="distance-10"]' ).addClass( 'distance-10' ) );
        }
    } );

    $( '#zoom-out' ).click( function() {
        if ( cellSize <= 5 ) {
            return;
        }

        cellSize = cellSize - 2;
        $( '.cell' ).css( {
            width: cellSize,
            height: cellSize
        } );

        $maze.width( cellSize * parseInt( $maze.attr( 'data-width' ), 10 ) ).height( cellSize * parseInt( $maze.attr( 'data-height' ), 10 ) );
    } );

    $( '#zoom-in' ).click( function() {
        if ( cellSize >= 98 ) {
            return;
        }

        cellSize = cellSize + 2;
        $( '.cell' ).css( {
            width: cellSize,
            height: cellSize
        } );

        $maze.width( cellSize * parseInt( $maze.attr( 'data-width' ), 10 ) ).height( cellSize * parseInt( $maze.attr( 'data-height' ), 10 ) );
    } );

    $( '#save-maze' ).click( function() {
        if ( $maze.hasClass( 'finished' ) ) {
            $( '#maze-savestring' ).val( getSaveString() );
        } else {
            $( '#maze-savestring' ).val( 'Generate or load a maze first!' );
        }
    } );

    $( '#maze-savestring' ).click( function( e ) {
        this.select();
        e.preventDefault();
    } );

    $( '#load-maze' ).click( function() {
        loadSaveString( $( '#maze-savestring' ).val() );
    })

    $( '#io-button' ).click( function() {
        var $this = $( this );

        if ( $this.hasClass( 'secondary' ) ) {
            $this.removeClass( 'secondary' );
            $( '.maze-input' ).hide().filter( '#maze-io' ).show();
        } else {
            $this.addClass( 'secondary' );
            $( '.maze-input' ).hide().first().show();
        }
    } );

    $( window ).resize( function() {
        var height = 0;

        $( 'body > .row:not(.mc-row)').each( function() {
            height += $( this ).height();
        } )

        $( '#maze-container' ).height( $( this ).height() - height - 30 );
    } ).resize();

    $( '#enter-printmode' ).click( function() {
        $( 'body' ).addClass( 'print-mode' );
        $( '#maze-container' ).attr( 'data-style', $( '#maze-container' ).attr( 'style' ) ).attr( 'style', '' );
    } );

    $( '#exit-printmode' ).click( function() {
        $( 'body' ).removeClass( 'print-mode' );
        $( '#maze-container' ).attr( 'style', $( '#maze-container' ).attr( 'data-style' ) );
    } );
} );
