const { v1: uuidv1 } = require('uuid');

const getCookies = (req) => {
  //sessionId=fbbba6f0-26d9-11eb-bba8-93a31b714cee; junkcookie=helloworld
  let cookies = req.headers.cookie;
  if (!cookies) {
    return {};
  }
  
  cookies = cookies.split('; '); 
  const parsedCookies = {};
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    parsedCookies[key] = value
  }

  return parsedCookies;
};

const sessions = {};

const sessionHandler = (req, res, next) => {
  let sessionId = getCookies(req, res).sessionId;
  if (!sessionId || !sessions[sessionId]) {
    sessionId = uuidv1();
    const csrfToken = uuidv1();
    sessions[sessionId] = { sessionId: sessionId, csrfToken: csrfToken }    

    res.clearCookie('sessionId');
    const oneHourMillis = 60 * 60 * 1000;
    res.cookie('sessionId', sessionId,  { maxAge: oneHourMillis });
  }

  req.session = sessions[sessionId];

  next();
};

module.exports = sessionHandler;

