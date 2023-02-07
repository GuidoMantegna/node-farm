const fs = require('fs')
/*
   http module gives us networking capabilities 
   such as building an http server.
*/
const http = require('http');
/*
    We use url module to be able to analyze the URL.
*/
const url = require('url');

///////////////////////////////////
// FILES

// Blocking code execution
// const text = fs.readFileSync('./file.txt', 'utf-8')
// console.log(text)

// Non blocking code execution
/*
    Node will start reading 'start.txt' in the background
    and as soon as it is ready, it will continue with the 
    next callback func.

    step 1. Read start.txt
    setp 2. Get the resp. from the 1st callback and read another file (read-this.txt)
    setp 3. Get the resp. from the 2nd callback and write a file with the data from 1st and 2nd callback 
*/
// fs.readFile('./start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.writeFile('./final.txt', `${data1}: ${data2}`, 'utf-8', err => {
//             console.log('You file has been written 😁')
//         })
//     })
// })
// console.log('Writting file...')

////////////////////////////////////
// SERVER

/*
    All Node.js scripts get access to a variable called 
    __dirname, and that variable always translates to the 
    directory in which the script that we're currently 
    executing is located.
    The dot is where the script is running, and __dirname
    is where the current file is located.
*/
// We use a sync foo() at the top of the level so it'll called once and won't block the code.
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

/*
    1. Create a server. createServer()
    will accept a callback function, which will be fired off each time
    a new request hits our server. And this callback function gets access
    to two very important and fundamental variables. It is the request variable, 
    and a response variable.
    
    2. We start the server
    so that we can actually listen to incoming requests.
*/
const server = http.createServer((req, res) => {
    const pathName = req.url;

    switch (pathName) {
        case '/':
        case '/overview':
            res.end('OVERVIEW SECTION')    
            break;
        case '/product':
            res.end('PRODUCT SECTION')    
            break;
        case '/api':
            // We need to define the data that will be sended to the browser
            res.writeHead(404, {
                'Content-type': 'application/json',
            })
            res.end(data)    
            break;
        // If the path is not found we can set the resp. with its header
        default:
            res.writeHead(404, {
                'Content-type': 'text/html',
                'my-own-header': 'This is a custom header'
            })
            res.end('<h1>PAGE NOT FOUND! :(</h1>')    
            break;
    }
})

/*
    Listen accepts a couple of parameters.
    1. The port, and usually the port that we use in Node is 8000.
    2. The host (e.g. localhost '127.0.0.1)
    3. Optional we can set a callback function, 
    which will be run as soon as the server starts listening.
*/
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})

