require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,customer} = require('../middleware')
const {detailcust,add,edit,dlt} = require('../model/carts')

/*GET DETAIL DATA*/
// router.get('/:id',auth,customer,(req, res)=>{
//     const {id} = req.params
//     mysql.execute(detailcust,[id],(err,result, field)=>{
//         res.send({succes:true,data:result})
//     })
// })

router.get('/:id',auth,(req,res)=>{
	const {id} = req.params
	mysql.execute('SELECT items.price, carts.total_item FROM carts INNER JOIN items on carts.id_item=items.id_item WHERE id_user=?',[id],(err,result1,field)=>{
		mysql.query('SELECT COUNT(items.price) AS count FROM carts INNER JOIN items on carts.id_item=items.id_item WHERE id_user=?',[id],(err,result,field)=>{
			const count = result[0].count
				var subtotal = 0
			for(i=0;i < count;i++){
				var total = result1[i].price * result1[i].total_item
				subtotal += total;
			}
			mysql.execute('SELECT carts.id_cart, users.name,items.image,items.id_item, items.name_item, items.price, carts.total_item, items.rating, restaurants.name_rest FROM carts INNER JOIN items ON carts.id_item=items.id_item INNER JOIN restaurants ON items.id_restaurant=restaurants.id_restaurant  INNER JOIN users ON carts.id_user=users.id_user WHERE carts.id_user=?',[id],(err,result1,field)=>{
                res.send({success:true,data:result1, Subtotal: subtotal})
			})
		}) 
	})
	
})

/* CHECKOUT */
router.put('/checkout/:id',(req,res)=>{
    const {id} = req.params
    const is_checkout = 1
    const updated_on = new Date()
    const sql = `UPDATE carts set is_checkout=?, updated_on=? WHERE id=?`
    mysql.execute(sql,[is_checkout,updated_on,id_cart],(err,result,field)=>{
        if (err) {
            console.log(err)
        } else {
            res.send({ success: true, data: result, msg: "Check Out Successfull", })
        }
    })
})


/*ADD CART*/
router.post('/',auth,(req,res)=>{
    const {id_item,id_user,total_item} =req.body
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add,
        [id_item,id_user,total_item, created_on,updated_on],
        (err,result,field)=>{
            console.log(err)
        res.send({success:true,data:result})
    })
})

/*EDIT DATA */
router.put('/:id',auth,customer,(req,res)=>{
    const {id_item,id_user,total_item} = req.body
    const {id} = req.params
    const updated_on = new Date()
    mysql.execute(edit,
        [id_item,id_user,total_item,updated_on,id],
        (err,result,field)=>{
            console.log(err)
            res.send({succes:true,data:result})
        })
})

/*DELETE DATA */
router.delete('/:id',auth,(req,res)=>{
    const {id} = req.params
    mysql.execute(dlt,
        [id],(err,result,field)=>{
            res.send({success:true,data:result})
        })
})

router.delete('/delete/',(req, res)=>{
    const {id_item, id_user} = req.body
    console.log(id_user,id_item)
    const sql = `DELETE from carts WHERE id_item = ? AND id_user = ?`
    mysql.execute(sql, [id_item, id_user], (err, result, field)=>{
        res.send(result)
    })
})


module.exports =router