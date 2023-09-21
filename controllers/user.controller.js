const userServices = require('../services/user.services');
const generateNumber = require('../services/generate-random-number');
const jwtServices = require('../services/jwt.services');
const userProfileServices = require('../services/userprofile')
const sessionServices = require('../services/sessions.services')

async function signUp(req, res) {
    const data = req.body;
    const stringWithSpaces = data.Name.toLowerCase();
    const userName = stringWithSpaces.replace(/\s/g, "");

    const number = generateNumber();
    const user = await userServices.addUser({
        email_address: data.email_address,
        Name: data.Name,
        password: data.password,
        user_name: userName.concat(number)
    })
    // console.log(user);
    res.json({
        message: `You are Signed Up....`,
        user: user
    })

}

async function updateUser(req, res) {
    const userData = req.userdata
    const data = req.body
    const user = await userServices.updateUser({
        Name: data.Name,
        email_address: userData.email_address
    })
    res.json({
        data: user
    })
}

async function deleteUser(req, res) {
    const userData = req.userdata;
    const userDelete = await userServices.deleteUser({
        email_address: userData.email_address
    })
    res.json({
        message: userDelete
    })
}

async function getUser(req, res) {
    const data = req.body;
    const user = await userServices.getUser({
        user_id: data.user_id
    })
    res.json({
        message: user
    })
}

async function signIn(req, res) {
    const data = req.body;
    const user = await userServices.signIn({
        email_address: data.email_address
    });

    const dbUser = user[0];
    // console.log(dbUser);
    // console.log(data);

    if (dbUser == undefined) {
        res.json({
            message: `!!!!You are not Signed Up!!!!`
        })
    }
    else if (data.email_address == dbUser.email_address && data.password == dbUser.password) {

        const sessions = await sessionServices.createSession({
            user_id: dbUser.user_id
          })
    
          const jwt = jwtServices.createToken({
            sessions_id: sessions.id,
            user_id: dbUser.user_id,
            email_address: dbUser.email_address,
            user_name: dbUser.user_name,
            type: dbUser.user_type,
          });
    
          // console.log(jwt, "<---- Created jwt token");
    
          const authData = jwtServices.verifyToken(jwt);
    
          // console.log(authData, "<---- Auth data");
          const expDate = new Date(authData.exp * 1000);
          const iatDate = new Date(authData.iat * 1000);
    
          const sessionUpdate = await sessionServices.updateSession({
            expiry_date: expDate,
            login_date: iatDate,
            sessions_id: authData.sessions_id
          })
        
        const userdata = user[0];
        delete userdata.password;
        delete userdata.user_id;
        res.json({
            message: "Logged In",
            Profile: userdata,
            JWTtoken: jwt
        })
    }
    else {
        res.json({
            message: "Invalid Combination"
        })
    }
}

async function logOut(req, res) {
    try {
        const jwt = req.headers["authorization"]
        const authData = jwtServices.verifyToken(jwt)
        const sessions_id = authData.sessions_id;
        const date = new Date();
        const logOut = await sessionServices.logoutSession({
            date: date,
            sessions_id: sessions_id
        })
        if (logOut.numUpdatedRows > 0) {
            res.json({
                message: `${authData.user_name} Logged out`
            })
        }
        else {
            res.json({
                message: `Log in to log out`
            })
        }
    } catch (error) {
        console.log(error,"<----gadbad");
        res.status(500).json({
            message: `Kuch toh gadbad haiiiii !!!!!`,
            err: error,
        });
    }
}

async function userProfile(req, res) {
    const data = req.userdata;
    // console.log(data);
    const userData = await userProfileServices.userProfile({
        user_id: data.user_id
    })
    res.json({
        data: userData
    })
}

module.exports = {
    signUp,
    updateUser,
    deleteUser,
    getUser,
    signIn,
    logOut,
    userProfile
}