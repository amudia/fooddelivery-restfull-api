require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,restaurant,admin} = require('../middleware')
const {detail,add,edit,dlt,menu,showall} = require('../model/restaurants')

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

/* MENU RESTAURANT */
router.get('/menu/:id', (req,res)=>{
    const {id} = req.params
    mysql.execute(menu, [id], (err, result, field)=>{
        res.send({succes:true,
            data:result})
    })
})

/* GET DATA */
router.get('/:id',(req, res)=>{
    const {id} = req.params
    mysql.execute(detail,[id],(err,result, field)=>{
        res.send({succes:true,data:result})
    })
})

router.get('/',(req, res)=>{
    const {id} = req.params
    mysql.execute(showall,[],(err,result, field)=>{
        res.send({succes:true,data:result})
    })
})

/*ADD DATA*/
router.post('/',upload.single('logo'),(req,res)=>{
    const logo = (req.file.filename)
    const {name_rest,lat,longt,desc_rest} =req.body
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add,
        [name_rest,logo,lat,longt,desc_rest,created_on,updated_on],
        (err,result,field)=>{
        res.send({succes:true,data:result})
    })
}) 

/* EDIT DATA */
router.put('/:id',auth,restaurant,upload.single('logo'),(req,res)=>{
    const logo = (req.file.filename)
    const {name_rest,lat,longt,desc_rest} = req.body
    const {id} = req.params
    const updated_on = new Date()
   
    mysql.execute(edit,
        [name_rest,logo,lat,longt,desc_rest,updated_on,id],
        (err,result,field)=>{
            res.send({succes:true,data:result})
        })
})

/* DELETE DATA */
router.delete('/:id',auth,restaurant,(req,res)=>{
    const {id} = req.params
    mysql.execute(dlt,
        [id],(err,result,field)=>{
            res.send({succes:true,data:result})
        })
})


module.exports =router