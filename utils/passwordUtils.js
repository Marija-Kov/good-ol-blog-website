const bcrypt = require("bcrypt");

async function genPassword(password){
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
   return {
    salt: salt,
    hash: hash
   }
}

async function verifyPassword(password, hash, salt){
  return hash === await bcrypt.hash(password, salt);
}

module.exports = {
    genPassword,
    verifyPassword
}