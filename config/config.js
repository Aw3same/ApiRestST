var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'practicafinalfti'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/practicafinalfti-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'practicafinalfti'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/practicafinalfti-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'practicafinalfti'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/practicafinalfti-production'
  }
};

module.exports = config[env];
