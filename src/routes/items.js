require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,restaurant} = require('../middleware')
const {detail,detailcat,add,edit,dlt,showalllimit, showall} = require('../model/items')
const {name_item_asc,price_asc,rating_asc,updated_on_asc,name_item_desc
       ,price_desc,rating_desc,updated_on_desc}= require ('../model/items')


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

/*=================================================================================================================================================*/
/* PAGINATION */
router.get('/page',(req, res)=>{
    const {page, limits} = req.query
    if (page == 1){
        const initial = page - 1
        const sql = `SELECT name_item, price, image, name_rest 
                     FROM items INNER JOIN restaurants ON restaurants.id_restaurant=items.id_restaurant
                     ORDER BY name_item ASC LIMIT ${initial}, ${limits}`
        mysql.execute(sql, [], (err, result, field)=>{
            res.send(result)
        })
    }else if (page >= 2){
        const initial = page * limits - limits
        const sql = `SELECT name_item, price, image, name_rest 
                     FROM items INNER JOIN restaurants ON restaurants.id_restaurant=items.id_restaurant
                     ORDER BY name_item ASC LIMIT ${initial}, ${limits}`
        mysql.execute(sql,[], (err, result, field)=>{
            res.send(result)
        })
    } 
})

/* SEARCH */
router.get('/search',(req, res)=>{
    const {name_item, price, rating} =req.query
    if(name_item){
        const sql = `SELECT items.name_item,categories.name_category ,restaurants.name_rest,  
        items.rating, items.image, items.price, items.desc_item, items.created_on FROM items 
        INNER JOIN restaurants ON items.id_restaurant=restaurants.id_restaurant 
        INNER JOIN categories ON items.id_category=categories.id_category 
        WHERE name_item LIKE '%${name_item}%'`
        mysql.execute(sql, [], (err, result, field)=>{
            res.send(result)
        })
    } else if (price){
        const sql = `SELECT * FROM items WHERE price = ${price}`
        mysql.execute(sql, [],(err, result, field)=>{
            res.send(result)
        })
    } else if (rating){
        const sql = `SELECT * FROM items WHERE rating >= ${rating}`
        mysql.execute(sql,[], (err,result, field)=>{
            res.send(result)
        })
    } else {
        mysql.execute( item.items,[], (err, result, field)=>{
            res.send(result)
        })
    }

})

/* SORT */
router.get('/asc',(req,res)=>{
    const {name_item,price,rating, updated_on} = req.query
    if(name_item){
        mysql.execute(name_item_asc, [], (err, result, field)=>{
            res.send({succes:true,data:result})
        })
    }else if(price){
        mysql.execute(price_asc, [], (err, result, field)=>{
            res.send({succes:true, data:result})
        })
    }else if(rating){
        mysql.execute(rating_asc,[],(err, result, field)=>{
            res.send({succes:true, data:result})
        })
    }else if(updated_on){
        mysql.execute(updated_on_asc,[],(err, result, field)=>{
            res.send({succes:true, data:result})
        })
    }else{
        res.send({succes:false, msg: 'Empty'})
    }
})
router.get('/desc',(req,res)=>{
    const {name_item,price,rating, updated_on} = req.query
    if(name_item){
        mysql.execute(name_item_desc, [], (err, result, field)=>{
            res.send({succes:true,data:result})
        })
    }else if(price){
        mysql.execute(price_desc, [], (err, result, field)=>{
            res.send({succes:true, data:result})
        })
    }else if(rating){
        mysql.execute(rating_desc,[],(err, result, field)=>{
            res.send({succes:true, data:result})
        })
    }else if(updated_on){
        mysql.execute(updated_on_desc,[],(err, result, field)=>{
            res.send({succes:true, data:result})
        })
    }else{
        res.send({succes:false, msg: 'Empty'})
    }
})

/*=================================================================================================================================================*/

/* SHOW ALL ITEM */
router.get('/showalllimit', (req,res)=>{
    mysql.execute(showalllimit, [], (err, result, field)=>{
        res.send({data:result})
    })
})
router.get('/', (req,res)=>{
    mysql.execute(showall, [], (err, result, field)=>{
        res.send({data:result})
    })
})

router.get('/category/:id',(req, res)=>{
    const {id} = req.params
    mysql.execute(detailcat,[id],(err,result, field)=>{
        console.log(err)
        res.send({succes:true,data:result})
    })
})

/* GET DETAIL ITEM */
router.get('/:id',(req, res)=>{
      const {id} = req.params
        mysql.execute(detail,[id],(err,result1, field)=>{
            const name_category = result1[0].name_category
            const sql = `SELECT items.id_item, items.name_item,categories.name_category ,restaurants.name_rest,  
            items.rating, items.image, items.price, items.desc_item, items.created_on FROM items 
            INNER JOIN restaurants ON items.id_restaurant=restaurants.id_restaurant 
            INNER JOIN categories ON items.id_category=categories.id_category 
            WHERE name_category LIKE ? ORDER BY rating DESC`
            mysql.execute(sql, ['%'+name_category+'%'],(err,result, field)=>{
                res.send({succes:true,
                    data:result1,
                    suggest:result})
            })
    })
})

/* ADD DATA ITEM */
router.post('/',upload.single('image'),(req,res)=>{
    const image = (req.file.filename)
    const {id_category,id_restaurant,name_item,price,desc_item} =req.body
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add,
        [id_category,id_restaurant,name_item,price,desc_item,image, created_on,updated_on],
        (err,result,field)=>{
        res.send({succes:true,data:result})
    })
})

/* EDIT DATA ITEM */
router.put('/:id',auth,restaurant,upload.single('image'),(req,res)=>{
    const image = (req.file.filename)
    const {id_category,id_restaurant,name_item,price,desc_item} = req.body
    const {id} = req.params
    const updated_on = new Date()
    mysql.execute(edit,
        [id_category,id_restaurant,name_item,price,desc_item,image,updated_on,id],
        (err,result,field)=>{
            res.send({succes:true,data:result})
        })
})

/* DELETE DATA ITEM */
router.delete('/:id',auth,restaurant,(req,res)=>{
    const {id} = req.params
    mysql.execute(dlt,
        [id],(err,result,field)=>{
            res.send({succes:true,data:result})
        })
})


module.exports =router