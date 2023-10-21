import Deck, { VERSION } from './reveal.js'

// Get the SVG images by their IDs
const cover1x1 = document.getElementById('cover1x1');
const cover1x2 = document.getElementById('cover1x2');
const cover2x1 = document.getElementById('cover2x1');
const cover2x2 = document.getElementById('cover2x2');

const svg = document.getElementById('cover-svg');
const svgWidth = svg.width.baseVal.value;
const svgHeight = svg.height.baseVal.value;
// Convert percentage to absolute values
function convertToAbsolute(value, isX) {
    if (value.endsWith('%')) {
        const percentage = parseFloat(value.slice(0, -1));
        return isX ? (svgWidth * percentage) / 100 : (svgHeight * percentage) / 100;
    }
    return parseFloat(value);
}

// Store their initial positions
const positions = {};
positions["cover1x1"] = { x: convertToAbsolute(cover1x1.getAttribute('x'), true), y: convertToAbsolute(cover1x1.getAttribute('y'), false) };
positions["cover1x2"] = { x: convertToAbsolute(cover1x2.getAttribute('x'), true), y: convertToAbsolute(cover1x2.getAttribute('y'), false) };
positions["cover2x1"] = { x: convertToAbsolute(cover2x1.getAttribute('x'), true), y: convertToAbsolute(cover2x1.getAttribute('y'), false) };
positions["cover2x2"] = { x: convertToAbsolute(cover2x2.getAttribute('x'), true), y: convertToAbsolute(cover2x2.getAttribute('y'), false) };

let startTime;

let coverStartedIn1x1 = 'cover1x1';
let coverStartedIn1x2 = 'cover1x2';
let coverStartedIn2x1 = 'cover2x1';

let angle = 0;

function animateCircularMovement(timestamp) {
    // Center position for cover2x2
    const centerX = convertToAbsolute(cover2x2.getAttribute('x'), true); // Adjust as needed
    const centerY = convertToAbsolute(cover2x2.getAttribute('y'), false); // Adjust as needed

    // Radius of the circular path
    const radius = convertToAbsolute(cover2x2.getAttribute('width', true)); // Adjust as needed

    // Calculate new positions using sine and cosine
    const newX1 = centerX + radius * Math.cos(angle);
    const newY1 = centerY + radius * Math.sin(angle);

    const newX2 = centerX + radius * Math.cos(angle + 2 * Math.PI / 3);
    const newY2 = centerY + radius * Math.sin(angle + 2 * Math.PI / 3);

    const newX3 = centerX + radius * Math.cos(angle - 2 * Math.PI / 3);
    const newY3 = centerY + radius * Math.sin(angle - 2 * Math.PI / 3);

    // Update positions
    cover1x1.setAttribute('x', newX1);
    cover1x1.setAttribute('y', newY1);

    cover1x2.setAttribute('x', newX2);
    cover1x2.setAttribute('y', newY2);

    cover2x1.setAttribute('x', newX3);
    cover2x1.setAttribute('y', newY3);

    // Increment angle for the next frame
    angle += 0.001; // Adjust speed as needed

    // Loop the animation
    requestAnimationFrame(animateCircularMovement);
}

// Start the animation
requestAnimationFrame(animateCircularMovement);

function rectangularAnimateMovement(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = (timestamp - startTime) / 10000; // time in seconds

    // Calculate intermediate positions
    let intermediatePositions = {};
    intermediatePositions[coverStartedIn1x1] = {
        x: parseFloat(positions[coverStartedIn1x1].x) + progress * (positions[coverStartedIn1x2].x - positions[coverStartedIn1x1].x),
        y: parseFloat(positions[coverStartedIn1x1].y) + progress * (positions[coverStartedIn1x2].y - positions[coverStartedIn1x1].y)
    };

    intermediatePositions[coverStartedIn1x2] = {
        x: parseFloat(positions[coverStartedIn1x2].x) + progress * (positions[coverStartedIn2x1].x - positions[coverStartedIn1x2].x),
        y: parseFloat(positions[coverStartedIn1x2].y) + progress * (positions[coverStartedIn2x1].y - positions[coverStartedIn1x2].y)
    };

    intermediatePositions[coverStartedIn2x1] = {
        x: parseFloat(positions[coverStartedIn2x1].x) + progress * (positions[coverStartedIn1x1].x - positions[coverStartedIn2x1].x),
        y: parseFloat(positions[coverStartedIn2x1].y) + progress * (positions[coverStartedIn1x1].y - positions[coverStartedIn2x1].y)
    };

    // Update positions
    const coverStartedIn1x1Obj = document.getElementById(coverStartedIn1x1);
    const coverStartedIn1x2Obj = document.getElementById(coverStartedIn1x2);
    const coverStartedIn2x1Obj = document.getElementById(coverStartedIn2x1);

    coverStartedIn1x1Obj.setAttribute('x', intermediatePositions[coverStartedIn1x1].x);
    coverStartedIn1x1Obj.setAttribute('y', intermediatePositions[coverStartedIn1x1].y);
    coverStartedIn1x2Obj.setAttribute('x', intermediatePositions[coverStartedIn1x2].x);
    coverStartedIn1x2Obj.setAttribute('y', intermediatePositions[coverStartedIn1x2].y);
    coverStartedIn2x1Obj.setAttribute('x', intermediatePositions[coverStartedIn2x1].x);
    coverStartedIn2x1Obj.setAttribute('y', intermediatePositions[coverStartedIn2x1].y);

    // Loop the animation
    if (progress < 1) {
        requestAnimationFrame(animateRectangularMovement);
    } else {
        // Reset startTime and update initial positions for the next cycle
        startTime = null;
        let aux = positions[coverStartedIn1x1];
        positions[coverStartedIn1x1] = positions[coverStartedIn1x2];
        positions[coverStartedIn1x2] = positions[coverStartedIn2x1];
        positions[coverStartedIn2x1] = aux;
        requestAnimationFrame(animateRectangularMovement);
    }
}

// Start the animation
requestAnimationFrame(animateCircularMovement);

/**
 * Expose the Reveal class to the window. To create a
 * new instance:
 * let deck = new Reveal( document.querySelector( '.reveal' ), {
 *   controls: false
 * } );
 * deck.initialize().then(() => {
 *   // reveal.js is ready
 * });
 */
let Reveal = Deck;


/**
 * The below is a thin shell that mimics the pre 4.0
 * reveal.js API and ensures backwards compatibility.
 * This API only allows for one Reveal instance per
 * page, whereas the new API above lets you run many
 * presentations on the same page.
 *
 * Reveal.initialize( { controls: false } ).then(() => {
 *   // reveal.js is ready
 * });
 */

let enqueuedAPICalls = [];

Reveal.initialize = options => {

	// Create our singleton reveal.js instance
	Object.assign( Reveal, new Deck( document.querySelector( '.reveal' ), options ) );

	// Invoke any enqueued API calls
	enqueuedAPICalls.map( method => method( Reveal ) );

	return Reveal.initialize();

}

/**
 * The pre 4.0 API let you add event listener before
 * initializing. We maintain the same behavior by
 * queuing up premature API calls and invoking all
 * of them when Reveal.initialize is called.
 */
[ 'configure', 'on', 'off', 'addEventListener', 'removeEventListener', 'registerPlugin' ].forEach( method => {
	Reveal[method] = ( ...args ) => {
		enqueuedAPICalls.push( deck => deck[method].call( null, ...args ) );
	}
} );

Reveal.isReady = () => false;

Reveal.VERSION = VERSION;

export default Reveal;
