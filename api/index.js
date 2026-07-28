const server = require('../cmd/server');

// Export the Express app as a serverless function
module.exports = server.then(app => app);
