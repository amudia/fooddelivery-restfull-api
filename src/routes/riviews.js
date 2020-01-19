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

/* ADD DATA */
router.post('/',auth,customer,(req,res)=>{
    const {id_item,id_user,riview,rating} =req.body
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add, [id_item,id_user,riview,rating,created_on,updated_on], (err,result,field)=>{
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