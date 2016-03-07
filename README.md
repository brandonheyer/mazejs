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

# About
This maze generator and the accompanying algorithm was inspired by a slide show by Jamis Buck called
["Algorithm is Not a Four Letter Word"](a href="http://www.jamisbuck.org/presentations/rubyconf2011/index.html).
It is a great read that goes over what mazes are, various ways of generating mazes and the importance of working with algorithms. You can learn more about what I learned while making this generator and algorithm over at this blog post:
["Maze Generating Algorithms: Fun with HTML and JavaScript"](http://www.brandonheyer.com/2013/04/24/maze-generating-algorithms-fun-with-html-and-javascript).

# Usage

## Generator
Import the generator class and instantiate it. Call `generate()` to populate the
generator with maze data.

```JavaScript
import { Generator } from 'labyrinth';

var generator = new Generator();

generator.generate();
```

#### Options
These are the current options that can be passed to either the `generate()` method
or upon construction of the generator:

* `split` - a number from 0 - 100, defaulting to 50. This represents the style of the maze.
0 means a lot of long wondering corridors, and 100 means a lot of short dead ends.
* `height` - Defaults to 20. The number of cells tall the maze is.
* `width` - Defaults to 50. The number of cells wide the maze is.
* `startX` - Defaults to a random value. The starting cell's x position.
* `startY` - Defaults to a random value. The starting cell's y position.

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
