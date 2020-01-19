require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,customer} = require('../middleware')
const {detailcust,add,edit,dlt} = require('../model/carts')

/*GET DETAIL DATA*/
router.get('/:id',auth,customer,(req, res)=>{
    const {id} = req.params
    mysql.execute(detailcust,[id],(err,result, field)=>{
        res.send({succes:true,data:result})
    })
})

/*ADD CART*/
router.post('/',auth,customer,(req,res)=>{
    const {id_item,id_user,total_item} =req.body
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add,
        [id_item,id_user,total_item, created_on,updated_on],
        (err,result,field)=>{
            console.log(err)
        res.send({succes:true,data:result})
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