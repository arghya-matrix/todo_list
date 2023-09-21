const {sign, verify} = require('jsonwebtoken');

const createToken = function ({user_name, user_id, email_address, sessions_id}){
    const accessToken = sign({
        user_name, email_address,user_id, sessions_id
    }, "createJwtToken", {expiresIn : "1d"})
    return accessToken;
};

const verifyToken = function(data){
    console.log(data, "<====data");
    const authData = verify(data, "createJwtToken", (err, authData) => {
        if (err) {
          return err;
        } else {
            console.log(authData,"Verified data");  
          return authData;
        }
      });
      return authData;
}


module.exports = {
    createToken,
    verifyToken
}