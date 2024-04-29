const redisClient = require("../utils/redisClient");

const getOrSetCache = (cb, key) => {
    const promise = new Promise((resolve, reject) => {
        const REDIS_EXPIRE_KEY = process.env.REDIS_EXPIRE_KEY || 3600;

        key = key || 'users';

        redisClient.get(key, (err, data) => {
            if (err) reject(err);

            if (data) {
                console.log('Cache hit');
                return resolve(JSON.parse(data))
            }

            cb().then((data) => {
                console.log('cache set');
                redisClient.setex(key, REDIS_EXPIRE_KEY, JSON.stringify(data))
                resolve(data)
            })
            .catch((err)=>{
                reject(err)
            })
        })

    })
    return promise;
}

module.exports= getOrSetCache;