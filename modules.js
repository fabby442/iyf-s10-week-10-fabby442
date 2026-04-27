// fs - File System
const fs = require('fs');

// Read file (synchronous)
const content = fs.readFileSync('hello.js', 'utf-8');
console.log("SYNC READ:");
console.log(content);

// Read file (asynchronous - preferred)
fs.readFile('hello.js', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log("ASYNC READ:");
    console.log(data);
});

// Write file
fs.writeFileSync('output.txt', 'Hello, World!');

// path - Path utilities
const path = require('path');

console.log(
    path.join(__dirname, 'files', 'data.json')
);

console.log(
    path.extname('photo.jpg')
); // .jpg