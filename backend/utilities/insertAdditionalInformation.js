var bigInt = require("big-integer");
//and originalTweetID all from the tweet table


let wrapperAdditional = (pool)=>{
  return new Promise((res,rej)=>{
    parseOriginalTweetId(pool,async(result,pool1)=>{
      console.log(result);
      iterateOverTweets(result,pool1,async(data)=>{
        res(data);
      });
    
  })
  })
}

let tweetgetOriginalID=(tweet,pool)=>{
  return new Promise(async(res,rej)=>{
    //console.log(tweet);
    let regex = new RegExp('^RT .*$');
    let isItARetweet = regex.test(tweet['tweet']);
    if(isItARetweet){
      let regex = new RegExp('@([\w\d]*)','g');
      let user = regex.exec(tweet['tweet']);
      user.index = user.index + 1;
      let arrayTweet = await getuserAndTweet(user.index,tweet['tweet']);
      let result = await getUserID(arrayTweet,pool);
     // arrayTweet = await 
      //console.log(arrayTweet);
     // let originalID = await getOriginalID(arrayTweet,pool); 
      res(result);
    }
  })
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
  wrapperAdditional,
  tweetgetOriginalID
}