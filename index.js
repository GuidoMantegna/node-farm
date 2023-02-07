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
const replaceTemplate = (temp, product) => {
    /* 
        We replace all the placeholder for the current object property using a RegEx
        We use the g-flag on it which means global. It will replaces all the 
        placeholders which match the RegEx and not just the first one that occurs.
    */
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
  }
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

// As we did with general data, we can call the templates at the top with a sync method while it will be called once.
// We don't do it whithin server const because the templeates would be read every time a user make a request. 
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')


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
        // Overview section
        case '/':
        case '/overview':
            //Set the header as we send html
            res.writeHead(200, { 'Content-type': 'text/html' } ) 

            //We loop over dataObj which holds all the products
            //and in each iteration, we will replace the placeholders
            //in the template card with the current product info.
            //Finally cardsHtml will contain a string (becuase of .join(')) 
            //with all new custom templates. 
            const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

            //Then replace tempOverview placeholder with the HTML that we just created.
            const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

            //Send the tempOverview as the resp.
            res.end(output)    
            break;

        // Product section
        case '/product':
            //Set the header as we send html
            res.writeHead(200, { 'Content-type': 'text/html' } ) 
            //Send the tempOverview as the resp.
            res.end(tempProduct)       
            break;

        // API
        case '/api':
            // We need to define the data that will be sended to the browser
            res.writeHead(404, {
                'Content-type': 'application/json',
            })
            res.end(data)    
            break;

        // Not Found
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

