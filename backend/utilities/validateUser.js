var bigInt = require("big-integer");
var checkfunctions = require('./checkfunctions');

let wrapperUser = function(data,pool){
  const poolhelper = pool;
  //console.log(pool);
  return new Promise(async(res,rej)=>{
     cleanDataUser(data,async function(data1){
        validateDataUser(data1,async function(data2){
          //console.log(pool);
          insertDataUser(data2,poolhelper,async()=>{
            res(poolhelper);
            return;
          })
        })
       });
  });
}


let insertDataUser = (data,pool,callback) =>{
  if(!data){
    callback();
    return;
  } else {
    pool.query('SELECT user_ID FROM "user" WHERE user_ID=$1',[data.id],(err,resu)=>{
      if(typeof(resu)==='undefined'||resu.rows.length==0){
        pool.query(
            'INSERT into "user" (user_ID, name, screenName , location, url, description, protected, verified, followers, friends, listed, favourites, statuses, createdAt, defaultAcc, hobby1 , hobby2, isBrillenTrager) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING user_ID', 
            [data.id, data.name, data.screenName, data.location,data.url,data.description,data.protected,data.verified,data.followers,data.friends,data.listed, data.favorites, data.statuses, data.createdAt, data.defaultAcc,null,null,data.verified], 
            function(err, result) {
                if (err) {
                    //console.log(data.tweetID);
                    return;
                } else {
                    console.log('row inserted with id: ' + result.rows[0]);
                    callback();
                }
            });  
      } else {
        callback();
      }
  })
  }
}
//wir haben uns entschieden dass die Beschreibung leer sein kann, url auch, location auch
let cleanDataUser = (data,callback)=>{
    if (data.id == '' || data.name == '' || data.screenName == '' || data.followers == '' || data.friends=='' || data.listed == '' || data.favourites == '' || data.statuses=='' || data.createdAt == '' || data.defaultAcc == ''||data.protected==''||data.verified=='') {
     console.log("DATA NOT ACCEPTED:");
     delete data;
     callback(data);
     return;
     //console.log(data);
   } else {
     //console.log(data);
     //console.log(typeof(data.id));
     callback(data);
   }
}


let validateDataUser = (data,callback)=>{
     let proof1 =  checkfunctions.validateSerial(data,'id');
     //console.log(proof);
     let proof2 =  checkfunctions.validateVarchar(data,'name',32);
     let proof3 = checkfunctions.validateVarchar(data,'screenName',32);
     let proof4 = checkfunctions.validateVarchar(data,'location',50);
     let proof5 = checkfunctions.checkurl(data);
     let proof6 = checkfunctions.checkBoolean(data,'protected');
     let proof7 = checkfunctions.checkBoolean(data,'verified');
     let proof8 = checkfunctions.validateInteger(data,'followers');
     let proof9 = checkfunctions.validateInteger(data,'friends');
     let proof10 = checkfunctions.validateInteger(data,'listed');
     let proof11 = checkfunctions.validateInteger(data,'favorites');
     let proof12 = checkfunctions.validateInteger(data,'statuses');
     let proof13 = checkfunctions.validateDate(data,'createdAt');
     let proof14 = checkfunctions.validateVarchar(data,'defaultAcc');
     let proof15 = checkfunctions.checkBoolean(data,'verified');
     //console.log(proof);
     Promise.all([proof1,proof2,proof3,proof4,proof5,proof6,proof7,proof8,proof9,proof10,proof11,proof12,proof13,proof14,proof15]).then((values)=>{
         callback(data);
     });
}
module.exports = {
  wrapperUser
}