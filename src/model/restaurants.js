const detail = 'SELECT * FROM restaurants where id_restaurant=?'
const showall = 'SELECT * FROM restaurants'
const add = 'INSERT INTO restaurants (name_rest, logo, lat, longt, desc_rest, created_on,updated_on) VALUES (?,?,?,?,?,?,?)'
const edit = `UPDATE restaurants SET name_rest=?, logo=?, lat=?, longt=?, desc_rest=?,updated_on=? WHERE id_restaurant=?`
const dlt = 'DELETE FROM restaurants where id_restaurant=?'
const menu = 'SELECT items.id_item,items.name_item, items.price, items.image, items.rating FROM items INNER JOIN restaurants ON items.id_restaurant=restaurants.id_restaurant WHERE restaurants.id_restaurant=?'


module.exports = {detail,add,edit,dlt,menu,showall}