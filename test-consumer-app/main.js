// This mimics the developer's implementation using v2.0.3 Named Exports
import { create, open, nextPage, prevPage } from '@treinetic/treinetic-epub-reader';
import '@treinetic/treinetic-epub-reader/dist/style.css';

console.log('Initializing Reader...');

// 1. Initialize the Reader
// V2.0.4 VERIFICATION: Calling create twice to simulate React Strict Mode
console.log('Call 1: Creating Reader...');
const reader1 = create('#reader-container');

console.log('Call 2: Creating Reader (Simulation of Strict Mode)...');
const reader = create('#reader-container'); 
console.log('Reader Instance Created:', reader);

// 2. Open the Book
// Using a valid .epub file (not a PDF)
open('/epubs/alice.epub');

// 3. Bind Controls
document.getElementById('btn-next').addEventListener('click', () => {
    console.log('Next Page');
    nextPage();
});

document.getElementById('btn-prev').addEventListener('click', () => {
    console.log('Prev Page');
    prevPage();
});

console.log('Setup Complete.');
