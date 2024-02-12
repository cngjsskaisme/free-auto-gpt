const express = require('express');
const app = express();
const port = 3000;
const getWrtnAgent = require('./getWrtnAgent');
const wrtnCookieInfo = require('./wrtnCookieInfo');
const https = require('https');
const fs = require("fs");
const promisedFs = require('node:fs/promises');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const _ = require("lodash");

(async () => {
  // const wrtnAgent = await getWrtnAgent({
  //   // useCookie: wrtnCookieInfo,
  //   credential: {
  //     id: 'tlw2401@www.gmail.com.lal.kr',
  //     pw: 'hello!!Kitty32'
  //   }
  // })

  // {
  //   "model": "gpt-3.5-turbo",
  //   "messages": [{"role": "user", "content": "야!"}]
  // }

  app.use(express.json())

  // Middleware to log request and response bodies
  app.use(morgan('combined'));

  // Define the endpoints you want to exclude
  const excludedEndpoints = ['/v1/chat/completions', '/v1/embeddings'];
  
  app.post('/v1/chat/completions', async (req, res) => {
    // const textResponse = await wrtnAgent.chatCompletion(req.body.messages)
    let log = JSON.stringify(req.body, null, 2)

    console.log("//////////////////////////////////////////////")
    console.log(JSON.stringify(req.body, null, 2))
    console.log("//////////////////////////////////////////////")
    
    var fetchedResult = await fetch("http://localhost:3000/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body)
    })

    const responseJson = await fetchedResult.json()
    responseJson.model = req.body.model

    console.log("//////////////////////////////////////////////")
    console.log(JSON.stringify(responseJson, null, 2))
    console.log("//////////////////////////////////////////////")
    
    log +=  "\n\n" + JSON.stringify(responseJson, null, 2) + "\n\n==========================================================\n\n"
    await promisedFs.appendFile("./output.completions.txt", log)
    
    res.json(responseJson)
  });

  app.post('/v1/embeddings', async (req, res) => {
    let log = JSON.stringify(req.body, null, 2)

    const storedModel = req.body.model + ""
    req.body.model = "bge-small-en-v1.5"
    
    console.log("//////////////////////////////////////////////")
    console.log(JSON.stringify(req.body, null, 2))
    console.log("//////////////////////////////////////////////")

    console.log("entered in fetch")
    var fetchedResult = await fetch("http://localhost:7997/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body)
    })

    const responseJson = await fetchedResult.json()
    responseJson.model = storedModel
    
    console.log("//////////////////////////////////////////////")
    console.log(JSON.stringify(responseJson, null, 2))
    console.log("//////////////////////////////////////////////")

    const clonedResponseJson = _.cloneDeep(JSON.parse(JSON.stringify(responseJson)))
    clonedResponseJson.data = clonedResponseJson.data.map((el) => {
      el.embedding = [ el.embedding[0], el.embedding[1] ]
      return el
    })
    log +=  "\n\n" + JSON.stringify(clonedResponseJson, null, 2) + "\n\n==========================================================\n\n"
    await promisedFs.appendFile("./output.embeddings.txt", log)

    res.json(responseJson)
  });

  // Middleware to exclude certain endpoints
  app.use((req, res, next) => {
    if (excludedEndpoints.includes(req.path)) {
      next('route'); // Skip to next route
    } else {
      next(); // Continue to next middleware
    }
  });

  // Proxy middleware
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:3000', // replace with your target server address
    changeOrigin: false,
  }));

  const httpsOptions = {
    key: fs.readFileSync('./keyfile.pem'),
    cert: fs.readFileSync('./certfile.crt'),
  }

  https.createServer(httpsOptions, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
})()