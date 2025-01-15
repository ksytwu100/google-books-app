const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '5h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      if (token) {
        const decoded = jwt.verify(token, secret);
        req.user = decoded.data;
      }
    } catch(err) {
      // console.error(err);
      console.log('Invalid token');
  
    }

    // send to next endpoint
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    const token=jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    return token;
  },
};
