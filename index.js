const PORT = process.env.PORT || 5050;

const http = require('http');
const url = require('url');

const dictionaryHandler = require('./utils/dictionaryHandler')

const server = http.createServer(function (req, res) {
    
    const path = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;

    if (req.method === 'GET') {

      if (path === '/autocomplete') {

        async function autcomplete() {
          try {

            let result = await dictionaryHandler.init(query);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        
          } catch(error) {
            console.log(error.message);
          }
        }

        autcomplete();

      }
      else {
        res.end(JSON.stringify('Url not found'));
     }
   }
});

server.listen( PORT,  () => {
  console.log(`Listening on ${PORT}`);
});