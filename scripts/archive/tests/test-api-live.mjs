import handler from './api/wsl-standings.js';

const req = {};
const res = {
  status: function(c) { this.statusCode = c; return this; },
  setHeader: function() { return this; },
  json: function(data) { console.log(JSON.stringify(data, null, 2)); }
};

await handler(req, res);
