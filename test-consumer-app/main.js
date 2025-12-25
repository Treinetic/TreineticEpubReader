import Treinetic, { create, init } from './../dist/treinetic-epub-reader.es.js';

console.log('--- NAMED EXPORT DEBUG ---');
console.log('Named create type:', typeof create);
console.log('Named init type:', typeof init);
console.log('Default Export:', Treinetic);

if (typeof create === 'function') {
    console.log('SUCCESS: Named export "create" is working!');
} else {
    console.log('FAILURE: Named export "create" is missing.');
}

if (Treinetic && typeof Treinetic.init === 'function') {
    console.log('SUCCESS: Default export property "init" works (legacy).');
} else if (Treinetic && Treinetic.default && typeof Treinetic.default.init === 'function') { 
    console.log('INFO: Default export is nested (requires .default).');
}
