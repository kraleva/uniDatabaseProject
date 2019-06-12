var bigInt = require("big-integer");
var checkfunctions = require('./checkfunctions');

let wrapperFollowing = function(data,pool){
  var poolhelper = pool;
  //console.log(pool);
  return new Promise((res,rej)=>{
     cleanDataFollowing(data,function(data1){
        validateDataFollowing(data1,function(data2){
          //console.log(pool);
          insertDataFollowing(data2,poolhelper,()=>{
            res(poolhelper);
            return;
          })
        })
       });
  });
}


let insertDataFollowing = (data,pool,callback) =>{
  //see why it doesnt import here
  if(!data){
    //console.log(pool);
    callback();
    return;
  } else if(typeof(data.followerID)=='bigint' && typeof(data.userID)=='bigint'){
    //console.log(pool);
    console.log('viksii');
    pool.query('SELECT * FROM "following" WHERE user_ID=$1 AND follower_ID=$2 ',[data.userID,data.followerID],(err,resu)=>{
      if(typeof(resu)==='undefined'||resu.rows.length==0){
        pool.query('SELECT * FROM "user" WHERE user_ID=$1 OR user_ID=$2',[data.userID,data.followerID],(err,result)=>{
       // console.log(result.rows);
        if(result.rows.length==2){
          pool.query(
            'INSERT into "following" (follower_ID, user_ID) VALUES($1, $2) RETURNING user_ID', 
            [data.followerID,data.userID], 
            function(err, result) {
                if (err) {
                    console.log(err);
                    callback();
                } else {
                    console.log('row inserted with id: ' + result.rows[0]);
                    //console.log(result.rows[0])
                    callback();
                }
            });  
           } else {
              callback();
            }
          })
        }});
  } else {
        callback();
  }
}
//wir haben uns entschieden dass die Beschreibung leer sein kann, url auch, location auch
let cleanDataFollowing = (data,callback)=>{
    if (data.followerID == '' || data.userID == '') {
     console.log("DATA NOT ACCEPTED:");
     delete data;
     //console.log(data);
     callback(data);
   } else {
     //console.log(data);
     //console.log(typeof(data.id));
     callback(data);
     return;
   }
}


let validateDataFollowing = (data,callback)=>{
     let proof = checkfunctions.validateSerial(data,'followerID');
     //console.log(proof);
     let proof1 = checkfunctions.validateSerial(data,'userID');
     Promise.all([proof,proof1]).then((values)=>{
         callback(data);
     });
}

module.exports = {
  wrapperFollowing
}