require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,customer} = require('../middleware')
const {add,edit, detail} = require('../model/riviews')

router.get('/:id',(req, res)=>{
    const {id} = req.params
    mysql.execute(detail,[id],(err,result, field)=>{
        res.send({succes:true,data:result})
    })
})

router.post('/input',(req, res)=>{
    const {id_item,id_user,riview,rating} = req.body
    const created_on = new Date()
    const updated_on = new Date()
    const sql = `INSERT INTO riviews (id_item,id_user,riview,rating, created_on, updated_on) VALUES (?,?,?,?,?,?)`
    mysql.execute(sql, [id_item,id_user,riview,rating, created_on, updated_on], (err, resuld, field)=>{
        // var id_user = resuld[0].id_user
        if(err == null){
            const sql = `SELECT AVG(rating) AS rate from riviews WHERE id_item = ${id_item}`
            mysql.execute(sql, [], (err, result, field)=>{
                var rating = result[0].rate
                if(err == null){
                    const sql = `UPDATE items set rating = ${result[0].rate} WHERE id_item = ${id_item} `
                    mysql.execute(sql, [rating], (err, result1, field)=>{
                        if(err == null){
                            const sql = `DELETE from carts WHERE id_item = ${id_item} AND id_user = ${id_user}`
                            mysql.execute(sql, [id_item, id_user], (err, result2, field) =>{
                                res.send({success: true, result2})
                            } )
                        }
                        
                    })
                }
            })
        } 
    })
})
// router.post('/inpuy',(req,res)=>{
//     const {id_item,id_user,riview,rating} = req.body
//     const created_on = new Date()
//     const updated_on = new Date()
//     const sql = `INSERT INTO riviews (id_item, id_user,riview, rating, created_on,updated_on) VALUES (?,?,?,?,?,?)`
//     mysql.execute(sql, [id_item,id_user,riview,rating,created_on,updated_on], (err, result0, field)=>{
//         // res.send({success: true, data: result0})
//         console.log(err)
//         if(err == null){
//             const sql = `SELECT AVG(rating) AS rate from riviews WHERE id_item = ${id_item}`
//             mysql.execute(sql, [], (err1, result, field)=>{
//                 var rating = result[0].rate
//                 console.log(id_user)
//                 console.log(err1)
//                 if(err1 == null){
//                     const sql = `UPDATE items set rating = ${result[0].rate} WHERE id_item = ${id_item} `
//                     mysql.execute(sql, [rating], (err2, result1, field)=>{
//                         console.log(err2)
//                         if(err2 == null){
//                             const sql = `DELETE from carts WHERE id_item = ${id_item} AND id_user = ${id_user}`
//                             mysql.execute(sql, [id_item, id_user], (err, result2, field) =>{
//                                 res.send({success: true, result2})
//                             } )
//                         }
                        
//                     })
//                 }
//             })
//         } 
//     })
// })


/* EDIT DATA */
router.put('/:id',auth,customer,(req,res)=>{
    const {id_item,id_user,riview,rating} =req.body
    const {id} = req.params
    const updated_on = new Date()
    mysql.execute(edit, [id_item,id_user,riview,rating,updated_on,id], (err,result,field)=>{
        if(err) {
            res.send(err)
        }else{
            const avgrate ='SELECT AVG(rating) AS rate FROM riviews WHERE id_item=?'
            mysql.execute(avgrate,[id_item],(err0,result0,field0)=>{
                if(err0){
                    res.send({data:err0, msg: 'error 1'})
                }else{
                    const ratingavg = `UPDATE items SET rating=? WHERE id_item=?`
                    mysql.execute(ratingavg, [result0[0].rate, id_item],(err2,res2,field2)=>{
                        if(err){
                            res.send({data:err2, msg: 'error 2'})
                        }else{
                            res.send({data:result0[0].rate, msg:'Succes'})
                        }
                    })
                }
            })
        }
    })
})

module.exports =router