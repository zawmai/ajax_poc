var express = require('express');
var proxy = require('http-proxy-middleware');

const ajaxUrlHost = 'zmai-learn-ajax.glitch.me';
const shipEngineUrlHost = 'zmai-shipengine-demo.glitch.me';

// proxy middleware options
var filter = function (pathname, req) {
  // replace www.myapp.example with origin(s) that your content will be served from
  // return (req.headers.origin === 'https://www.myapp.example');
  // multiple origin version:
  return (
          (req.headers.origin === 'http://' + ajaxUrlHost) || 
          (req.headers.origin === 'https://' + ajaxUrlHost) ||
          (req.headers.origin === 'http://' + shipEngineUrlHost) ||
          (req.headers.origin === 'https://' + shipEngineUrlHost)
         );   
};

var npsApiOptions = {
  // replace api.datasource.example with the url of your target host
  target: 'https://developer.nps.gov',
  changeOrigin: true, // needed for virtual hosted sites like Heroku
  pathRewrite: {
    '^/nps/': '/', // remove endpoint from request path ('^/api/': '/')
  },
  onProxyReq: (proxyReq) => {
    // append key-value pair for API key to end of path
    // using KEYNAME provided by web service
    // and KEYVALUE stored in Heroku environment variable
    proxyReq.path += ('&api_key=' + process.env.NPS_APIKEY);
  },
  logLevel: 'debug' // verbose server logging
};

var smartyApiOptions = {
  // replace api.datasource.example with the url of your target host
  target: 'https://us-street.api.smartystreets.com',
  changeOrigin: true, // needed for virtual hosted sites like Heroku
  pathRewrite: {
    '^/smarty/': '/', // remove endpoint from request path ('^/api/': '/')
  },
  onProxyReq: (proxyReq) => {
    // append key-value pair for API key to end of path
    // using KEYNAME provided by web service
    // and KEYVALUE stored in Heroku environment variable
    proxyReq.path += ('&api_key=' + process.env.NPS_APIKEY);
  },
  logLevel: 'debug' // verbose server logging
};

// create the proxy (without context)
var npsApiProxy = proxy(filter, npsApiOptions);
var smartyApiProxy = proxy(filter, smartyApiOptions);

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use('/nps', npsApiProxy);
app.use('/smarty', smartyApiProxy);

app.listen(app.get('port'));
