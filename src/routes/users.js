require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const {auth,admin,restaurant,customer} = require('../middleware')
const {detail,add,edit,dlt} = require('../model/users')

/* LOGIN*/
router.post('/login',(req,res)=>{
    const {username,password}=req.body
    const users = 'SELECT * FROM users WHERE username=?'
    mysql.execute(users,[username], (err,result,field)=>{
        console.log(result)
        if(result.length>0){
            if(bcrypt.compareSync(password,result[0].password)){
                const roles = result[0].id_role
                const id = result[0].id_user
                const auth = jwt.sign({username, id, roles},process.env.APP_KEY)
                const token = auth
                const is_revoked = 0
                const created_on = new Date()
                const updated_on = new Date()
                const revoked = `INSERT INTO revoked_token (token, is_revoked, created_on, updated_on) VALUES (?,?,?,?)`
                mysql.execute(revoked, [token,is_revoked,created_on,updated_on], (err, result, field)=>{
                    res.send({
                        success: true,
                        auth,
                    })
                })           
            }else{
                res.send({
                    success:false,
                    msg: "Incorrect password"
                })
            }
        }else{
            res.send({
                success:false,
                msg: "username not found"
            })
        }
    })
})

/* LOGOUT */
router.get('/logout', auth,(req, res)=>{
    const token = req.headers.auth_token
    // const is_revoked = 1
    const sql = 'UPDATE revoked_token SET is_revoked=1 where token=?'
    mysql.execute(sql, [ token], (err, result, field)=>{
        res.send({
            result,
            success:true,
            msg:req.headers.auth_token
        })

    })
})

/* GET DETAIL USER */
router.get('/:id',auth,(req, res)=>{
    const {id} = req.params
    mysql.execute(detail,[id],(err,result, field)=>{
        console.log(err)
        res.send({success:true,data:result})
    })
})

/* FORGOT PASWORD */
router.put('/forgotpassword', (req, res) => {
    const {username, password} = req.body
    const enc_pass = bcrypt.hashSync(password)
    const sql = `UPDATE users SET password = ? where username = ?`
    mysql.execute(sql, [enc_pass, username], (err, result, field) => {
        res.send({succcess: true, data: result})
    })
})

/* REGISTER USER #ADMIN ACCESS */
router.post('/',(req,res)=>{
    const {name,username,password,id_role} =req.body
    const enc_pass = bcrypt.hashSync(password)
    const created_on = new Date()
    const updated_on = new Date()
    const sql = `SELECT username from users WHERE username =?`
    mysql.execute(sql, [username], (err,result1, field)=>{
        if(result1 == ''){
            mysql.execute(add,
                [name,username,enc_pass,id_role,created_on,updated_on],
                (err,result,field)=>{
                res.send({success:true,msg:'Success'})
            })
        
        }else {
            res.send({success:false, msg:'Username Does Exist'})
        }
    })
})

/* REGISTER RESTAURANT */
router.post('/register/restaurant',(req,res)=>{
    const {name,username,password} =req.body
    const enc_pass = bcrypt.hashSync(password)
    const created_on = new Date()
    const updated_on = new Date()
    const sql = `SELECT username from users WHERE username =?`
    mysql.execute(sql, [username], (err,result1, field)=>{
        if(result1 == ''){
            mysql.execute(add,
                [name,username,enc_pass,'2',created_on,updated_on],
                (err,result,field)=>{
                res.send({success:true,msg:'Success'})
            })
        
        }else {
            res.send({success:false, msg:'Username Does Exist'})
        }
    })
})

/* REGISTER CUSTOMER */
router.post('/register/customer',(req,res)=>{
    const {name,username,password} =req.body
    const enc_pass = bcrypt.hashSync(password)
    const photo = 'https://image.flaticon.com/icons/png/512/145/145843.png'
    const created_on = new Date()
    const updated_on = new Date()
    const sql = `SELECT username from users WHERE username =?`
    mysql.execute(sql, [username], (err,result1, field)=>{
        if(result1 == ''){
            mysql.execute(add,
                [name,username,enc_pass, photo,'3',created_on,updated_on],
                (err,result,field)=>{
                res.send({success:true,msg:'Success'})
            })
        
        }else {
            res.send({success:false, msg:'Username Does Exist'})
        }
    })
})

/* EDIT DATA USER #ADMIN ACCESS */
router.put('/:id',auth,admin,(req,res)=>{
    const {name,username,password,id_role} = req.body
    const {id} = req.params
    const enc_pass = bcrypt.hashSync(password)
    const updated_on = new Date()
   
    mysql.execute(edit,
        [name,username,enc_pass,id_role,updated_on,id],
        (err,result,field)=>{
            res.send({success:true,data:result})
        })
})

/* EDIT DATA USER #RESTAURANT ACCESS */
router.put('/edit/restaurant/:id',auth,restaurant,(req,res)=>{
    const {name,username,password} =req.body
    const {id} = req.params
    const enc_pass = bcrypt.hashSync(password)
    const updated_on = new Date()

    const sql = `SELECT username from users WHERE username =?`
    mysql.execute(sql, [username], (err,result1, field)=>{
        if(result1 == ''){
            mysql.execute(edit,
                [name,username,enc_pass,'2',updated_on,id],
                (err,result,field)=>{
                res.send({success:true,msg:'Update Success'})
            })
        
        }else {
            res.send({success:false, msg:'Username Does Exist'})
        }
    })
})

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

/* EDIT DATA USER #CUSTOMER ACCESS */
router.put('/edit/customer/:id',auth,upload.single('photo'),(req,res)=>{
    const photo = process.env.APP_URI.concat('src/assets/'+req.file.filename)
    const {name,username,password} =req.body
    const {id} = req.params
    const updated_on = new Date()

    const sql = `SELECT username from users WHERE username =?`
    mysql.execute(sql, [username], (err,result1, field)=>{
        if(result1 == ''){
            mysql.execute(edit,
                [name,username,photo,updated_on,id],
                (err,result,field)=>{
                res.send({success:true,msg:'Update Success'})
            })
        
        }else {
            res.send({success:false, msg:'Username Does Exist'})
        }
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