const bcrypt = require("bcryptjs");

const hashedPassword =  (pass, salt) => {
    const saltRound = bcrypt.genSaltSync(salt);
    return  bcrypt.hashSync(pass, saltRound)
}

const comparePassword= (pass, hash)=>{
    return  bcrypt.compareSync(
        pass,
        hash
      );
}

module.exports = {
    hashedPassword,
    comparePassword
}