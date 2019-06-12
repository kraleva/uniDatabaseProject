var bigInt = require("big-integer");
//and originalTweetID all from the tweet table


/*let wrapperAdditional = (pool)=>{
  return new Promise((res,rej)=>{
    parseOriginalTweetId(pool,async(result,pool1)=>{
      console.log(result);
      iterateOverTweets(result,pool1,async(data)=>{
        res(data);
      });
    
  })
  })
}*/
let iterator = (pool)=>{
  pool.query('SELECT * FROM "tweet"',async(err,result)=>{
    console.log(result.rows);
    for(i=0;i<result.rows.length;i++){
      let result1 = await wrapper(result.rows[i],pool);
      console.log(result1);
    }
  })
}


let wrapper=async(tweet,pool,callback)=>{
    //console.log(tweet);
    let regex = new RegExp('^RT .*$');
    let isItARetweet = regex.test(tweet['tweet']);
    if(isItARetweet){
      let regex = new RegExp('@([\w\d]*)','g');
      let user = regex.exec(tweet['tweet']);
      user.index = user.index + 1;
      let arrayTweet = await getuserAndTweet(user.index,tweet['tweet']);
      let result = await getUserID(arrayTweet,pool);
      result[0] = tweet['userID'].toString();
      console.log(result);
      arrayTweet = await insertRelationshipDB(result,pool);
     // let originalID = await getOriginalID(arrayTweet,pool); 
      callback(arrayTweet);
    }
    callback("nothing");
   
}

let insertRelationshipDB = (array,pool)=>{
  return new Promise((res,rej)=>{
     let whohasretweeted = array[0].toString();
     let whoThePostIsTo = array[2];
     pool.query('SELECT * FROM "relationship" WHERE (user1_ID=$1 AND user2_ID=$2) OR (user1_ID=$2 AND user2_ID=$1);',[whohasretweeted,whoThePostIsTo],(err,resu)=>{
       console.log(resu.rows);     
       if(resu.rows.length == 0){
         pool.query('INSERT into "relationship" (user1_ID, user2_ID, user1_retweetTimes,user2_retweetTimes,typeOfRelationship) VALUES($1, $2, $3, $4, $5) RETURNING user1_ID;',[whohasretweeted,whoThePostIsTo,1,0,'Single'],(err,result)=>{
           if(err){
             console.log(err + "\nHEAHFWHDFCAW");
             rej();
           } else {
             console.log('relationship inserted with id: ' + result);
           }
         });
       } else if (resu.rows.length==1){
         console.log(resu.rows)
         let art = resu.rows[0]['typeofrelationship'];
         let user1retweet = resu.rows[0]['user1_retweettimes'];
         let user2retweet = resu.rows[0]['user2_retweettimes'];
         let user1 = resu.rows[0]['user1_id'];
         let user2 = resu.rows[0]['user2_id'];
         //if 1 and 0 it can be only the first,because i programmed it so
         if(whohasretweeted == user2 && user1retweet==1 && user2retweet==0){
           pool.query('UPDATE "relationship" SET (user1_retweetTimes,user2_retweetTimes,typeOfRelationship) = ($3,$4,$5) WHERE user1_ID=$1 AND user2_ID=$2;',[user1,user2,user1retweet,user2retweet+1,'Date'],(err,result1)=>{
             console.log("Updated Relationship status to date");
           });
         } else if (whohasretweeted==user1 && user1retweet==1 && user2retweet==2){
           pool.query('UPDATE "relationship" SET (user1_retweetTimes,user2_retweetTimes,typeOfRelationship) = ($3,$4,$5) WHERE user1_ID=$1 AND user2_ID=$2;',[user1,user2,user1retweet+1,user2retweet,'Married'],(err,result1)=>{
             console.log(err);
             console.log("Updated Relationship status to date");
           });
         } else if (whohasretweeted==user2 && user1retweet==2 && user2retweet==1){
           pool.query('UPDATE "relationship" SET (user1_retweetTimes,user2_retweetTimes,typeOfRelationship) = ($3,$4,$5) WHERE user1_ID=$1 AND user2_ID=$2;',[user1,user2,user1retweet,user2retweet+1,'Married'],(err,result1)=>{
             console.log(err);
             console.log("Updated Relationship status to date");
           });
         } else {
             if(whohasretweeted=user2){
               user1retweet += 1;
               console.log(user1retweet);
              pool.query('UPDATE "relationship" SET (user1_retweetTimes,user2_retweetTimes,typeOfRelationship) = ($3,$4,$5) WHERE user1_ID=$1 AND user2_ID=$2;',[user1,user2,user1retweet+1,user2retweet,art],(err,result1)=>{
                console.log(result1);
               });
              } else {
               user2retweet += 1;
               pool.query('UPDATE "relationship" SET (user1_retweetTimes,user2_retweetTimes,typeOfRelationship) = ($3,$4,$5) WHERE user1_ID=$1 AND user2_ID=$2;',[user1,user2,user1retweet,user2retweet,art],(err,result1)=>{
                console.log(result1);
                //console.log(whohasretweeted)
             });
             }
         }
         res(array);
       } else {
         rej("Cannot be two");
       }
     })
  });
}

let updateTable = (user1,user2,number1,number2,relation)=>{
  pool.query('UPDATE "relationship" SET (user1_retweetTimes,user2_retweetTimew,typeOfRelationship) = ($1,$2,$3) WHERE user1_ID=$4,user2_ID=$5',[]);
}

let getUserID = (array,pool)=>{
    //array[0] = username
    return new Promise((res,rej)=>{
      pool.query('SELECT user_ID FROM "user" WHERE screenName=$1',[array[0]],(err,resu)=>{
        //username on pos 2
        array.push(resu.rows[0]['user_id']);
        res(array);
      })
    })
}

//returns array with [username,tweetdata] when a tweet is retweeted
let getuserAndTweet = (index,tweet)=>{
  return new Promise((res,rej)=>{
    let userName = '';
    let tweetData = '';
    while(tweet[index]!=':'){
      userName += tweet[index];
      index += 1;
    }
    index +=2;
    tweetData = tweet.substring(index,tweet.length);
    let result = [userName,tweetData];
    res(result);
  })
}

let iterateOverTweets = async(tweet,pool,callback)=>{
  let mytweet = await tweetgetOriginalID(tweet[0],pool);
  return mytweet;
 /* for(i=0,i<tweet.length,i++){
    
  }*/
  callback(mytweet);
}

//get originalTweetId
let parseOriginalTweetId=(pool,callback)=>{
    pool.query('SELECT * FROM "tweet"',(err,resu)=>{
      //console.log(err);
      console.log(resu.rows);
      callback(resu.rows,pool)
    }); 
}

//increment values of array
//go over all the tweets of an user,find the hobbys - hashtags and count them in a json data,at the end,find the two hobbies that occur the most
//another idea would be to do that with the original tweetid and then we can iterate only once --- but because of our er modell probably not the best option
let parseHobbies = (data,callback)=>{

}

let createRelationshipEntity = (data)=>{

}
//

module.exports = {
  wrapper,
  iterator
}