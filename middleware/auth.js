const jwt = require('jsonwebtoken');
// const getLatestUserToken = require("../config/usertoken.js").getLatestUserToken;

module.exports = (req, res, next) => {
  try {
//    console.log('req.headers.cookie',req.headers.cookie);
//    console.log('reqbody',req.body);
//    console.log('req.cookies',req.cookies);
    let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
    
    if (!token || token.includes('token=')) {
      let reqcookies = req.headers.cookie.split("; ");
      let cookiestoken = "";
      for (i=0; i<reqcookies.length; i++) {
        if (reqcookies[i].substring(0,5) == 'token') {
          cookiestoken = reqcookies[i].substring(6);
        }
      }
      token = cookiestoken;
    }
  
      if (!token) {
      token = req.headers.cookie;
    }

  if (token) {
    if (token.startsWith('token=')) {
      // Remove Bearer from string
      token = token.slice(6, token.length);
    }
    jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
      if (err) {
        if (req.url.startsWith('/api/')) {
          res.status(401).send(ERROR_INVALID_TOKEN);
        } else {
          res.redirect('/Login');
        }
      } 
      // else {
      //   let latestToken = getLatestUserToken(decoded.user.ID);
      //   latestToken.then((userToken) => {
      //       if (userToken.dataValues.token === token) {
      //         req.user = decoded.user;
      //         //console.log('isAuthenticated', `Logged in user data fetched from token.`, decoded);
      //         next();
      //       } else {
      //         if (req.url.startsWith('/api/')) {
      //           res.status(401).send(ERROR_INVALID_TOKEN);
      //         } else {
      //           res.redirect('/Login');
      //         }
      //       }
      //     }
      //   ).catch((error)=>{
      //     console.error("latest token error usertoken ", error);
      //   });
      // }
    });
  } else if (req.url.startsWith('/api/')) {
    res.status(401).send(ERROR_MISSING_TOKEN);
  } else {
    res.redirect('/Login');
  }
  } catch(err) {
      console.log('error',err);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};