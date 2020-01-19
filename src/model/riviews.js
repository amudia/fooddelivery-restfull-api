const add = 'INSERT INTO riviews (id_item, id_user,riview, rating, created_on,updated_on) VALUES (?,?,?,?,?,?)'
const edit = `UPDATE riviews SET id_item=?,id_user=?,riview=?,rating=?, updated_on=? WHERE id_riview=?`
const dlt = 'DELETE FROM riviews where id_riview=?'

module.exports = {add,edit,dlt}
