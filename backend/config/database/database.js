const {Client,Pool} = require('pg');
const pg = require('pg');
const settings = require('./../settings');
const shell = require('shelljs');
const path = require('path');



var conStringPri = 'postgres://' + settings.development.db.user + '@' + settings.development.db.host + ":" + settings.development.db.port + 
    '/postgres';
var conStringPri2 = 'postgres://' + 'postgres' + ':kraleva1' + '@' + '127.0.0.1' + ":" + '5432' +  '/postgres';
var isDbCreated = settings.development.db.isDbCreated;
let helperpool = new pg.Pool({connectionString:conStringPri2});

//The Creation of the tables in postgreSQL
const tweetQueryCreate = 'CREATE TABLE tweet ( Tweet_ID INT NOT NULL,User_ID INT NOT NULL, createdAt DATE,tweet VARCHAR(280),originalUser_ID INT , PRIMARY KEY (Tweet_ID),UNIQUE(Tweet_ID),FOREIGN KEY(User_ID) REFERENCES user(ID), FOREIGN KEY(originalUser_ID) REFERENCES user(ID),);';
const followingQueryCreate = 'CREATE TABLE following ( Follower_ID INT NOT NULL,User_ID INT NOT NULL, PRIMARY KEY (Follower_ID,User_ID), FOREIGN KEY(User_ID) REFERENCES user(ID), FOREIGN KEY (Follower_ID) REFERENCES user(ID),);';
const userQueryCreate = 'CREATE TABLE "user" ( ID INT NOT NULL, name VARCHAR(32) NOT NULL,screenName VARCHAR(32) NOT NULL,location VARCHAR(70),url VARCHAR(100),description VARCHAR(200),protected BOOLEAN NOT NULL,verified BOOLEAN NOT NULL,followers INT(8) NOT NULL,friends INT(8) NOT NULL, listed INT NOT NULL, favourites INT NOT NULL, statuses INT NOT NULL, createdAt DATE,defaultAcc BOOLEAN NOT NULL,hobby1 VARCHAR(20),hobby2 VARCHAR(20),isBrillenTrager BOOLEAN NOT NULL, PRIMARY KEY(ID),);';

const createPool =  (callback) => {
     const pool = new Pool({
        user: settings.development.db.user,
        host: settings.development.db.host,
        database: settings.development.db.database,
        password: settings.development.db.password,
        port: settings.development.db.port,
       });
   try{
     pool.connect((err,req,done)=>{
       //console.log(pool);
       callback(pool);
      });
     
   } catch(e){
     console.error(e);
     return;
   }
}
const checkIfDBExists = async(callback) => {
    helperpool.connect(()=>{
    helperpool.query("SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('miniFB');", async(err, res) => {
          if (err) {
            //console.log(err);
            rej(err);
            return;
          } else if(res.rows.length==0) {
            createDatabase(callback);
            return;
          }
          //console.log(res.rows.length);
          callback();
          return;
     });
  })
  
}
 //MAKE THE SCRIPT EXECUTABLE 

let createDatabase = async(callback) => {
     console.log(__dirname);
      shell.exec(path.join(__dirname,'/init'),(err)=>{
        callback();
        return;
      });
      
}

let initializeTables = async(client,callback)=>{
    searchTable(client,'user').then(callback(client)).catch((err)=>{
      console.log(err);
    });
  
}

let searchTable = async(client,string)=>{
  return new Promise((res,rej)=>{
      client.query('SELECT * FROM "' + string + '";',(err,resu)=>{
      if(err){
        rej(err);
        return;
      } else {
        res(client);
        return;
      }
  })
  });
} 

let connectAndCreateDB =(callback)=>{
  checkIfDBExists(()=>{
    console.log("READY");
    createPool((pool)=>{
      console.log("READY");
      initializeTables(pool,(postclient)=>{
        //console.log(pool);
        callback(postclient);
        //return postclient;
      });
    })
 })
}  
  /*return new Promise((res,rej)=>{
    checkIfDBExists().then(async()=>{
      let result = await createPool()
      return result;
      }).then(async(postclient)=>{
        await initializeTables(postclient)
        return postclient;
        }).then((postclient)=>{
          res(postclient);
          return;}).catch((e)=>{
            console.log(e);
            res();
            return;}).catch(err=>{
            console.log(err)
            res();
            return;}); */


module.exports = {
  connectAndCreateDB
  }
