const { sign, verify } = require("jsonwebtoken");
const userServices = require("../services/user.services");
const sessionServices = require('../services/sessions.services');

async function userProfile(req, res, next) {
  const data = req.headers["authorization"];
  const blockedToken = userServices.blockedToken;

  if (data) {
    if (blockedToken.includes(data)) {
      res.status(401).json({
        message: "You are not logged in!!!!...",
      });
      return;
    } else {
      verify(data, "createJwtToken", async (err, authData) => {
        if (err) {
          res.status(401).json({ 
            message: "Unauthorized",
          });
          return;
        } else {
          const session = await sessionServices.findSession({
            sessions_id: authData.sessions_id
          })
          if (session.logout_date == null) {
            req.userdata = authData;
            console.log(req.userdata);
            next();
          } else {
            return res.status(403).json({
              message: `log in to access data`
            })
          }
        }
      });
    }
  } else {
    res.json({
      message: `You are not logged in yet`,
    });
    return;
  }
}

module.exports = {
  userProfile,
};
