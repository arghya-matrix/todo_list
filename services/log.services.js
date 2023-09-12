const { Op } = require('sequelize');
const db = require('../models/index');

async function updateLog({todo_id, status}){
    console.log(status);
    const logDetails = typeof status === 'string' ? status : status.toString();
    console.log(logDetails);
    await db.Log.update({log_details:logDetails},
    {
        where: {
            todo_id: todo_id,
            log_details: { [Op.in]: [status] }, 
        },
    })
}
 
module.exports = {
    updateLog
}