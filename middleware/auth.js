const jwt = require('jsonwebtoken');
const getLatestUserToken = require("../config/usertoken.js").getLatestUserToken;
const userModel = require("../models/mvc_User.js");

module.exports = (req, res, next) => {
  try {
    console.log('req.headers.cookie', req.headers.cookie);
    console.log('reqbody', req.body);
    console.log('req.cookies', req.cookies);
    let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase

    if (!token || token.includes('token=')) {
      let reqcookies = req.headers.cookie.split("; ");
      let cookiestoken = "";
      for (i = 0; i < reqcookies.length; i++) {
        if (reqcookies[i].substring(0, 5) == 'token') {
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
      jwt.verify(token, 'RANDOM_TOKEN_SECRET', async (err, decoded) => {
        if (err) {
          if (req.url.startsWith('/api/')) {
            res.status(401).send(ERROR_INVALID_TOKEN);
          } else {
            res.redirect(`${process.env.BASE_URL}/Login`);
          }
        }
        else {
          try {
            var userId;
            if (!decoded.user) {
              const userDetail = await userModel.getALLUserbyQuery({ where: { primaryEmail: decoded.email } })
              userId = userDetail[0].dataValues.id;
            } else {
              userId = decoded.user.id;
            }
            let latestToken = await getLatestUserToken(userId);
            if (latestToken.dataValues.token === token) {
              req.user = decoded.user ? decoded.user : decoded.email;
              //console.log('isAuthenticated', `Logged in user data fetched from token.`, decoded);
              next();
            } else {
              if (req.url.startsWith('/api/')) {
                res.status(401).send(ERROR_INVALID_TOKEN);
              } else {
                res.redirect(`${process.env.BASE_URL}/Login`);
              }
            }
          } catch (error) {
            console.error("latest token error usertoken ", error);
          }

        }
      });
    } else if (req.url.startsWith('/api/')) {
      res.status(401).send(ERROR_MISSING_TOKEN);
    } else {
      res.redirect(`${process.env.BASE_URL}/Login`);
    }
  } catch (err) {
    console.log('error', err);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};