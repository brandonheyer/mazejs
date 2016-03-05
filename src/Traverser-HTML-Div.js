import Traverser from './Traverser'

export default class extends Traverser {
    saveOptions ( options ) {
        super.saveOptions( options );

        this._cells = '';
        this._$maze = options.$maze;
        this._cellSize = options.cellSize || 10;
    }

    traversalStart ( maze ) {
        this._$maze
            .empty()
            .width( maze.width * this._cellSize )
            .height( maze.height * this._cellSize );
    }

    traversalCell ( cell ) {
        this._cells +=' <div id="' + cell.x + '-' + cell.y + '" class="cell visited complete ' + cell.exits.join( ' ' ) +
            '" style="width: ' + this._cellSize + 'px; height: ' + this._cellSize + 'px;"></div>';
    }

    traversalComplete ( maze ) {
        this._$maze.append( this._cells ).addClass( 'finished' );
    }
}
