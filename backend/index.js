const test = require('./config/database/database').connectAndCreateDB;
const validateData = require('./utilities/validateData').validateData;

test((pool)=>{
  try{
    validateData(pool);
    //todo originalUserId
    //relationship
    //hobbies
  } catch(e){
    //console.log(e);
  }
})
