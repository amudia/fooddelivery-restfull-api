const detailcust = 'SELECT restaurants.name_rest, items.name_item, items.price, carts.total_item FROM carts INNER JOIN users ON users.id_user=carts.id_user INNER JOIN items ON items.id_item=carts.id_item INNER JOIN restaurants ON restaurants.id_restaurant=items.id_restaurant where carts.id_user=?'
const add = 'INSERT INTO carts (id_item, id_user, total_item, created_on,updated_on) VALUES (?,?,?,?,?)'
const edit = `UPDATE carts SET id_item=?, id_user=?, total_item=?, updated_on=? WHERE id_cart=?`
const dlt = 'DELETE FROM carts where id_cart=?'

module.exports = {detailcust,add,edit,dlt}