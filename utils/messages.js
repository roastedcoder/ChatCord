

const moment = require('moment');


function formatMessage(username, text, joinFlag) {
    return {
        username,
        text,
        joinFlag,
        time: moment().format('hh:mm:ss A')
    }
}


module.exports = formatMessage;