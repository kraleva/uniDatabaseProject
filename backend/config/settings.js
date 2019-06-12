const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: {
      isDbCreated:false,
      host: "127.0.0.1",
      port: 5432,
      user: 'viki',
      database: 'minifb',
      password: 'password'
    },
    data: {
      path_tweet:path.normalize(path.join(__dirname,'../../../data/try/prj_tweet.csv')),
      path_user: path.normalize(path.join(__dirname,'../../../data/try/prj_usert.csv')),
      path_following: path.normalize(path.join(__dirname,'../../../data/try/prj_following.csv')),
    },
    port: 1337
  },
  production: {
    port: process.env.PORT
  }
}
