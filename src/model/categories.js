const detail = 'SELECT * FROM categories where id_category=?'
const add = 'INSERT INTO categories (name_category, created_on,updated_on) VALUES (?,?,?)'
const edit = `UPDATE categories SET name_category=?, updated_on=? WHERE id_category=?`
const dlt = 'DELETE FROM categories where id_category=?'

module.exports = {detail,add,edit,dlt}
