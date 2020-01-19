const detail = 'SELECT * FROM categories where id_category=?'
const showall = 'SELECT * FROM categories'
const add = 'INSERT INTO categories (name_category, image, created_on,updated_on) VALUES (?,?,?,?)'
const edit = `UPDATE categories SET name_category=?, updated_on=? WHERE id_category=?`
const dlt = 'DELETE FROM categories where id_category=?'

module.exports = {detail,add,edit,dlt,showall}