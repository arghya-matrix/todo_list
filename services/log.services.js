const { Op } = require('sequelize');
const db = require('../models/index');

async function updateLog({todo_id, status}){
    // const status = 
    await db.Log.update({log_details:"Not Done"},
    {
        where:{
            todo_id: todo_id,
            log_details:
        }
    })
}

module.exports = {
    updateLog
}