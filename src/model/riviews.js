const add = 'INSERT INTO riviews (id_item, id_user,riview, rating, created_on,updated_on) VALUES (?,?,?,?,?,?)'
const edit = `UPDATE riviews SET id_item=?,id_user=?,riview=?,rating=?, updated_on=? WHERE id_riview=?`
const dlt = 'DELETE FROM riviews where id_riview=?'
const detail = 'SELECT riviews.id_item,riviews.updated_on, riviews.id_riview, users.name, users.id_user, riviews.riview, riviews.rating FROM riviews INNER JOIN users ON users.id_user=riviews.id_user WHERE riviews.id_item=17 ORDER BY updated_on DESC LIMIT 5'

module.exports = {add,edit,dlt, detail}
