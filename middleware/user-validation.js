const userServices =require('../services/user.services');

async function validationUser(req,res,next){
    const data = req.body
    const count = await userServices.validateUser({
        email_address: data.email_address
    })
    if(count == 0 || count == undefined || count == null){
        next();
    }
    else{
        res.status(409).json({
            message : `${data.email_address} already signed up`
        })
    }
}

module.exports = {
    validationUser
}