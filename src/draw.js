import _ from 'underscore';
import $ from 'jquery';

export default class {
    constructor ( $element, maze ) {
        this.$maze = $element;
        this.cellSize = 10;
        this.height = maze.height;
        this.width = maze.width;

        this._cells = maze._cells;
    }

    draw () {
        var output = '';

        for ( let i = 0; i < this.height; i++ ) {
            for ( let j = 0; j < this.width; j++ ) {
                output += '<div id="' + j + '-' + i + '" class="cell visited complete ' + this._cells[ i ][ j ].exits.join( ' ' ) +
                    '" style="width: ' + this.cellSize + 'px; height: ' + this.cellSize + 'px;"></div>';
            }
        }

        this.$maze
            .width( this.width * this.cellSize )
            .height( this.height * this.cellSize )
            .attr( 'data-width', this.width )
            .attr( 'data-height', this.height )
            .append( output ).addClass( 'finished' );
    }
}
