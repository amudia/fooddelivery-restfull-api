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
			mysql.execute('SELECT users.name,items.image, items.name_item, items.price, carts.total_item, items.rating, restaurants.name_rest FROM carts INNER JOIN items ON carts.id_item=items.id_item INNER JOIN restaurants ON items.id_restaurant=restaurants.id_restaurant  INNER JOIN users ON carts.id_user=users.id_user WHERE carts.id_user=?',[id],(err,result1,field)=>{
                res.send({success:true,data:result1, Subtotal: subtotal})
			})
		}) 
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
router.delete('/:id',auth,customer,(req,res)=>{
    const {id} = req.params
    mysql.execute(dlt,
        [id],(err,result,field)=>{
            res.send({succes:true,data:result})
        })
})

module.exports =router