var bigInt = require("big-integer");
var checkfunctions = require('./checkfunctions');
var tweetgetOriginalId = require('./insertAdditionalInformation').tweetgetOriginalID

let wrapperTweet = function(data,pool){
  const poolhelper = pool;
  //console.log(pool);
  return new Promise(async(res,rej)=>{
     cleanDataTweet(data,async function(data1){
        validateDataTweet(data1,async function(data2){
          //console.log(pool);
          insertDataTweet(data2,poolhelper,async(data3)=>{
            let helper = await tweetgetOriginalId(data3,pool);
            console.log(helper);
            res(poolhelper);
            // /return;
          })
        })
       });
  });
}


let insertDataTweet = (data,pool,callback) =>{
  if(!data){
    //console.log(pool);
    callback(data);
    return;
  } else if(typeof(data.tweetID)=='bigint' && typeof(data.userID)=='bigint'){
    //console.log(pool);
    pool.query('SELECT tweet_ID FROM "tweet" WHERE tweet_ID=$1',[data.tweetID],(err,resu)=>{
      if(typeof(resu)==='undefined'||resu.rows.length==0){
        console.log(err);
        pool.query(
            'INSERT into "tweet" (tweet_ID, user_ID, createdAt , tweet) VALUES($1, $2, $3, $4) RETURNING user_ID', 
            [data.tweetID, data.userID, data.createdAt, data.tweet], 
            function(err, result) {
                if (err) {
                    console.log(err);
                    callback(data);
                } else {
                    console.log('row inserted with id: ' + result.rows[0]);
                    callback(data);
                }
            });  
      } else {
        callback(data);
      }
    })
  } else {
        callback(data);
  }
}
//wir haben uns entschieden dass die Beschreibung leer sein kann, url auch, location auch
let cleanDataTweet = (data,callback)=>{
    if (data.tweetID == '' || data.userID == '' || data.createdAt == '' || data.tweet == '') {
     console.log("DATA NOT ACCEPTED:");
     delete data;
     //console.log(data);
     callback(data);
   } else {
     //console.log(data);
     //console.log(typeof(data.id));
     callback(data);
   }
}


let validateDataTweet = async(data,callback)=>{
     let proof = checkfunctions.validateSerial(data,'tweetID');
     //console.log(proof);
     let proof1 = checkfunctions.validateSerial(data,'userID');
     let proof2 =  checkfunctions.validateDate(data,'createdAt');
     Promise.all([proof,proof1,proof2]).then((values)=>{
         callback(data);
     });
}

module.exports = {
  wrapperTweet
}