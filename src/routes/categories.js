require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,admin} = require('../middleware')
const {detail,add,edit,dlt, showall} = require('../model/categories')

/* UPLOAD FILE */
const multer = require ('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './src/assets/images/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})
const fileFilter = (req, file, cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

/*GET DETAIL DATA*/
router.get('/:id',(req, res)=>{
    const {id} = req.params
    mysql.execute(detail,[id],(err,result, field)=>{
        console.log(err)
        res.send({success:true,data:result})
    })
})

router.get('/',(req, res)=>{
    mysql.execute(showall,[],(err,result, field)=>{
        console.log(err)
        res.send({success:true,data:result})
    })
})

/*ADD DATA*/
router.post('/',upload.single('image'),(req,res)=>{
    const image = (req.file.filename)
    const {name_category} =req.body
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add,
        [name_category, image,created_on,updated_on],
        (err,result,field)=>{
        res.send({success:true,data:result})
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