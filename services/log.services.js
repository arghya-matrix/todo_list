const { Op } = require('sequelize');
const db = require('../models/index');

async function updateLog({todo_id, status}){
    // const status = 
    await db.Log.update({log_details:"status"},
    {
        where:{
            todo_id: todo_id,
            log_details: {
                [Op.eq]: status
            }
        }
    })
}

module.exports = {
    updateLog
}