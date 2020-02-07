const detail = 'SELECT * FROM users where id_user=?'
const add = 'INSERT INTO users (name,username,password,photo,id_role, created_on,updated_on) VALUES(?,?,?,?,?,?,?)'
const edit = `UPDATE users SET name=?, username=?, photo=?,updated_on=? WHERE id_user=?`
const dlt = 'DELETE FROM users where id_user=?'

module.exports = {detail,add,edit,dlt} 