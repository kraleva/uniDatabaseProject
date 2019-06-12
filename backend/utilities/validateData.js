const papaparse = require('papaparse');
const settings = require('./../config/settings').development.data;
const fs = require('fs');
let rootpath = require('./../config/settings').development.rootPath;
const path = require('path');
var bigInt = require("big-integer");
var checkfunctions = require('./checkfunctions');

const wrapperUser = require('./validateUser').wrapperUser;
const wrapperTweet = require('./validateTweet').wrapperTweet;
const wrapperFollowing = require('./validateFollowing').wrapperFollowing;
const iterator= require('./relationShipInsert').iterator;

 /*let filepath1 = path.join(rootpath,'/data/try/prj_tweet.csv');
 let content1 = fs.readFileSync(filepath, { encoding: 'utf-8' });
*/
const validateData = async (pool)=>{ 
  //SEE WHy is it still asynchronus
  new Promise(async(res, rej) => {
    let filepath = path.join(rootpath,'/data/try/prj_user.csv');
    let content = fs.readFileSync(filepath, { encoding: 'utf-8' });
    parseConent(content,pool,wrapperUser).then((pool1)=>{
      let filepath1 = path.join(rootpath,'/data/try/prj_tweet.csv');
      let content1 = fs.readFileSync(filepath1, { encoding: 'utf-8' });
      return parseConent(content1,pool1,wrapperTweet);
    }).then((pool3)=>{
      let filepath2 = path.join(rootpath,'/data/try/prj_following.csv');
      let content2 = fs.readFileSync(filepath2, { encoding: 'utf-8' });
      return parseConent(content2,pool3,wrapperFollowing);
    });
});
}

let helperfunction = async(pool)=>{
  
}

let parseConent = (path,pool,callback)=>{
  return new Promise((res,rej)=>{
    papaparse.parse(path, {
      "worker":true,
      "delimiter":';',
      "header":true,
      //here we must choose this wisely,because of our js framework
      "quoteChar":"`",
      //dynamicTyping: true,
      step:async function(data){
        //console.log(data);
       // let content = await callback(data.data,pool);
        
        return callback(data.data,pool);;
        //console.log(pool);

      },
      complete: function(data){
        //console.log(data.data);
        res(pool);
      }
    
  });
  })
}



module.exports = {
  validateData,
}