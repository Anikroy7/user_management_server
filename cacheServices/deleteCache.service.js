const redisClient = require("../utils/redisClient");

const deletePattern = (pattern) => {
    redisClient.scanStream({
        match: pattern,
        count: 1000,
    }).on('data', (keys) => {
        if (keys.length > 0) {
            redisClient.del(...keys)
        }
    }).on('end', () => {
        console.log('Cache data deleted')
    })
}


const deleteCache = ({pattern, keys}) => {
    try {
        if (pattern) {
            deletePattern(pattern);
        }
        if(keys?.length){
            redisClient.del(...keys)
        }
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = deleteCache;