const userServices = require('../services/user.services');
const generateNumber = require('../services/generate-random-number');
const jwtServices = require('../services/jwt.services');
const userProfileServices = require('../services/userprofile')

async function signUp(req,res){
    const data = req.body;
    const stringWithSpaces = data.Name.toLowerCase();
    const userName = stringWithSpaces.replace(/\s/g, "");

    const number = generateNumber();
    const user = await userServices.addUser({
        email_address:data.email_address,
        Name:data.Name,
        password:data.password,
        user_name: userName.concat(number)
    })
    // console.log(user);
    res.json({
        message:`You are Signed Up....`,
        user:user
    })

}

async function updateUser(req,res){
    const userData = req.userdata
    const data = req.body
    const user = await userServices.updateUser({
        Name: data.Name,
        email_address: userData.email_address
    })
    res.json({
        data:user
    })
}

async function deleteUser(req,res){
    const userData = req.userdata;
    const userDelete = await userServices.deleteUser({
        email_address:userData.email_address
    })
    res.json({
        message : userDelete
    })
}

async function getUser(req,res){
    const data = req.body;
    const user = await userServices.getUser({
        user_id:data.user_id
    })
    res.json({
        message : user
    })
}

async function signIn (req,res){
    const data = req.body;
    const user = await userServices.signIn({
        email_address: data.email_address
    });
    const dbUser = user[0];
    // console.log(dbUser);
    // console.log(data);

    if(dbUser == undefined){
        res.json({
            message: `!!!!You are not Signed Up!!!!`
        })
    }
    else if(data.email_address == dbUser.email_address && data.password == dbUser.password)
    {
        const jwt = jwtServices.createToken({
            user_id: dbUser.user_id,
            email_address: dbUser.email_address,
            user_name: dbUser.user_name
        })
        const userdata = user[0];
        delete userdata.password;
        delete userdata.user_id;
        res.json({
            message : "Logged In", 
            Profile : userdata,
            JWTtoken: jwt
        })
    }
    else {
        res.json({
            message : "Invalid Combination"
        })
    }
}

async function logOut(req,res){
    const data = req.headers['authorization']
    if(data){
        const user = await userServices.logOut({
            jwt: data
        })
        res.json({
            message : `user logged out`
        })
    }
    else{
        res.json({
            message: `To LogOut, LogIn fitst `
        })
    }
}

async function userProfile(req,res){
    const data = req.userdata;
    // console.log(data);
    const userData = await userProfileServices.userProfile({
        user_id : data.user_id
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