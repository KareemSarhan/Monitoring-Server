const http = require('http');
let app = http.createServer((req, res) => {
    // Set a response type of plain text for the response
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\n');
});
app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');