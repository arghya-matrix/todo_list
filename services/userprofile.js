const db = require('../models/index');

async function userProfile({user_id}){
    const userData = await db.User.findAll({
        attributes : ['user_name'],
        include:[
            {
                model: db.Todo,
                attributes: ['title','todo_type','todo_status','todo_date'],
                include: [
                    {
                        model: db.Log,
                        attributes: ['log_details', 'createdAt']
                    }
                ]
            },
        ],
        where:{
            user_id: user_id
        }
    })
    return userData;
}

module.exports = {
    userProfile
}