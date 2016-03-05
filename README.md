```
    __         __               _       __  __  
   / /  ____ _/ /_  __  _______(_)___  / /_/ /_
  / /  / __ `/ __ \/ / / / ___/ / __ \/ __/ __ \
 / /__/ /_/ / /_/ / /_/ / /  / / / / / /_/ / / /
/_____|__,_/_.___/\__, /_/  /_/_/ /_/\__/_/ /_/
                 /____/                         
```

__AN ES6 JavaScript Maze Generation, Traversal and Rendering Library__

# Installation
```
npm install labyrinth
```

# Usage

## Generator
Import the generator class and instantiate it. Call `generate()` to populate the
generator with maze data.

```JavaScript
import { Generator } from 'labyrinth';

var generator = new Generator();

generator.generate();
```

## Traverser
Import the traverser and instantiate it with an instance of a generator. Call
`traverse()` to run the traversal.

```JavaScript
import { Generator, Traverser } from 'labyrinth';

var generator = new Generator();

generator.generate();
( new Traverser( { maze: generator } ) ).traverse();
```

### Traverser Types
Traversers can be extended or implemented to output the maze data in various formats.

#### Div Traverser
Will output the the maze as HTML Div elements
```JavaScript
import $ from 'jquery';
import { Generator, DivTraverser } from 'labyrinth';

var generator = new Generator(),
    $maze = $( 'body' ).append( 'div' );

generator.generate();

( new DivTraverser( { maze: generator, $maze: $maze } ) ).traverse();
```

# Other Information
This package is still in development and is more of a experimental product.
Please contact with any questions.
