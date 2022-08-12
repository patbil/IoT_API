const bcrypt = require('bcrypt');

exports.hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(pass, salt);  
}

exports.compare = (pass, passDB) => {
    return bcrypt.compareSync(pass, passDB, false);
}