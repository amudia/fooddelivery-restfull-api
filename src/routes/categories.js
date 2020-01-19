require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,admin} = require('../middleware')
const {detail,add,edit,dlt} = require('../model/categories')

/*GET DETAIL DATA*/
router.get('/:id',auth,(req, res)=>{
    const {id} = req.params
    mysql.execute(detail,[id],(err,result, field)=>{
        console.log(err)
        res.send({succes:true,data:result})
    })
})

/*ADD DATA*/
router.post('/',auth,admin,(req,res)=>{
    const {name_category} =req.body
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add,
        [name_category, created_on,updated_on],
        (err,result,field)=>{
        res.send({succes:true,data:result})
    })
})

/*EDIT DATA */
router.put('/:id',auth,admin,(req,res)=>{
    const {name_category} = req.body
    const {id} = req.params
    const updated_on = new Date()
   
    mysql.execute(edit,
        [name_category,updated_on,id],
        (err,result,field)=>{
            res.send({succes:true,data:result})
        })
})

/*DELETE DATA */
router.delete('/:id',auth,admin,(req,res)=>{
    const {id} = req.params
    mysql.execute(dlt,
        [id],(err,result,field)=>{
            res.send({succes:true,data:result})
        })
})


module.exports =router