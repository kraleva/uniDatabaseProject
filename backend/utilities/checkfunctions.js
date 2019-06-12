const bigInt = require('big-integer');
var url = require("url");
var ping = require ("net-ping");



let validateSerial = (data,arg)=>{
  return new Promise((res,rej)=>{
    try{
      if(data ==null){
        delete data;
        res();
      } else if(isNaN(data[arg])){
        delete data;
        res();
      } else{
         let id  = data[arg];
         try{
           data[arg] = bigInt(data[arg]).value;
         } catch(err){
           delete data;
           console.log("FIXED");
           res();
         }
            //console.log(typeof(data[arg])=='string');
           if(data[arg].value < 0n){
             delete data;
              res();
           } else {
             res();
           }
      }
    }
    catch(e){
      delete data;
      res();
    }
  })
}

let checkurl = (data)=>{
  return new Promise((res,rej)=>{
    if(data ==null){
      delete data;
      res();
    } else{
      if(typeof(data['url']=='undefined')){
        delete data;
        res();
      }
        if(data.url == 'None'){
        res();
      } else {
        try{
          var result = url.parse(data.url);
        } catch (err){
          delete data;
          //console.log("Fixes");
          res();
        }
        if (result.hostname==null){
          //console.log(data);
          console.log ("not a url");
          delete data;
          res();
        }
        else{
           //console.log (result.hostname + ": Alive");
           res();
        } 
    }
    

    }
  })
}

let checkBoolean = (data,arg)=>{
  return new Promise((res,rej)=>{
    if(data ==null){
      delete data;
      res();
    } else {
      if(data[arg]=='True'){
        res();
      } else if (data[arg]='False'){
        res();
      } else {
        delete data;
        res();
      }
    }
    
  })
  
}

let validateInteger = (data,arg)=>{
  return new Promise((res,rej)=>{
    try{
    if(data ==null){
      res();
    }else if(isNaN(data[arg])){
        delete data;
        res();
    }else if (data=='undefined'){
      delete data;
      res();
    } else {
      try{
        data[arg] = parseInt(data[arg]);
        if(data[arg]<0){
          delete data;
          res();
        } else {
          res();
      }
      } catch(err){
        delete data;
        res();
      }
      }} catch(e){
        console.log("Deleted");
        delete data;
        res();
      }
  })
  
}

let validateDate = async(data,arg)=>{
  return new Promise(async(res,rej)=>{
    try{
      if(data ==null){
      delete data;
      res();
    } else {
      let helper  = data[arg].split(" ");;
      //console.log(helper);
      let helper1 = helper[0].split("-");
      let element = helper1[0];
      helper1[0] = helper1[2];
      helper1[2] = element;
      //helper1 = await flipTheDay(helper1);
      if (helper1[1]==-1){
        delete data;
        res();
      }
      if (helper1[0]>31){
        delete data;
        res();
      }
      if (helper1[2]>2019){
        delete data;
        res();
      }
        let dateToParse = helper1[0] + "-" + helper1[1] + "-" + helper1[2] + " " + helper[1];
        data[arg]=dateToParse;
      }
      
     // console.log(dateToParse);
      /*let timestamp =new Date(dateToParse);
      data[arg] = timestamp;*/
      //console.log(data[arg]);
      res();
    } catch(e){
      //console.log(e);
      res();
    }
  })
}

let flipTheDay = (helper)=>{
  return new Promise((res,rej)=>{
    let element = helper[0];
    helper[0] = helper[2];
    helper[2] = element;
    console.log(helper);
    switch(helper[1]){
        case "01":
          helper[1] = "Jan";
          res(helper);
          break;
       case "02":
          helper[1] = "Feb";
          res(helper);
          break;
       case "03":
          helper[1] = "Mar";
          res(helper);
          break;
       case "04":
          helper[1] = "Apr";
          res(helper);
          break;
       case "05":
          helper[1] = "May";
          res(helper);
          break;
       case "06":
          helper[1] = "Jun";
          res(helper);
          break;
       case "07":
          helper[1] = "Jul";
          res(helper);
          break;
       case "08":
          helper[1] = "Aug";
          res(helper);
          break;
       case "09":
          helper[1] = "Sep";
          res(helper);
          break;
       case "10":
          helper[1] = "Oct";
          res(helper);
          break;
       case "11":
          helper[1] = "Nov";
          res(helper);
          break;
       case "12":
          helper[1] = "Dec";
          res(helper);
          break;
       default: 
          helper[1]=-1;
          res(helper);
    }
  })
}

let deleteifwrong = (data,proof)=>{
  return new Promise((res,rej)=>{
    if(proof == 0){
      res();
    } else {
      delete data;
      res();
    }
  })
}

let validateVarchar = (data,arg,size)=>{
  return new Promise((res,rej)=>{
    if(data==null){
      delete data;
      res();
    } else {
      if(data[arg]>size){
        delete data;
        res();
      } else {
        res();
      }
    }
    
  })
}

module.exports = {
  validateSerial,
  validateVarchar,
  deleteifwrong,
  checkurl,
  checkBoolean,
  validateInteger,
  validateDate
}