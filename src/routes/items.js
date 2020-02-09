require('dotenv').config()
const router = require('express').Router()
const mysql = require('../dbconfig')
const {auth,restaurant} = require('../middleware')
const {count,get,detail,detailcat,add,edit,dlt,showalllimit, showall} = require('../model/items')
const {name_item_asc,price_asc,rating_asc,updated_on_asc,name_item_desc
       ,price_desc,rating_desc,updated_on_desc}= require ('../model/items')
const url = process.env.APP_URI;

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

router.get('/', (req, res) => {
    const { query } = req;
    let where = '';
    let sort = '';
    let page = 'LIMIT 8 OFFSET 0';
    let fullUrl = '';
  
    if (query.search) {
      let count = 1;
      where += 'WHERE';
      Object.keys(query.search).forEach((key) => {
        if (Object.keys(query.search).length === 1) {
          where += ` items.${key} LIKE '%${query.search[key]}%'`;
          fullUrl += `search[${key}]=${query.search[key]}&`;
          count += 1;
        } else if (Object.keys(query.search).length === count) {
          where += ` items.${key} LIKE '%${query.search[key]}%'`;
          fullUrl += `search[${key}]=${query.search[key]}&`;
          count += 1;
        } else {
          where += ` items.${key} LIKE '%${query.search[key]}%' AND`;
          fullUrl += `search[${key}]=${query.search[key]}&`;
          count += 1;
        }
      });
    }
  
    if (query.sort) {
      if (Object.keys(query.sort).length === 1) {
        sort += 'ORDER BY';
        Object.keys(query.sort).forEach((key) => {
          sort += ` items.${key} ${query.sort[key]}`;
          fullUrl += `sort[${key}]=${query.sort[key]}&`;
        });
      }
    }
  
    if (query.page) {
      const offset = (Number(query.page) * 8) - 8;
      page = `LIMIT 8 OFFSET ${offset}`;
      fullUrl += `page=${query.page}&`;
    } else {
      query.page = 1;
    }
  
    const sql1 = `${count} ${where}`;
  
    const sql2 = `${get} ${where} ${sort} ${page}`;
  
    mysql.execute(sql1, (err, result) => {
      if (err) {
        res.send({
          status: 400,
          msg: err,
        });
      } else if (result.length === 0) {
        res.send({
          status: 400,
          msg: 'No data retrieved!',
        });
      } else {
        mysql.execute(sql2, (err2, res2) => {
          if (err2) {
            res.send({
              status: 400,
              msg: err2,
            });
          } else if (res2.length === 0) {
            res.send({
              status: 400,
              msg: 'No data retrieved!',
            });
          } else {
            let prev = '';
            let next = '';
  
            const noPage = fullUrl.replace(/page=[0-9\.]+&/g, '');
  
            prev = `${url}items?${noPage}page=${Number(query.page) - 1}`;
            next = `${url}items?${noPage}page=${Number(query.page) + 1}`;
  
            if (Number(query.page) === Math.ceil(Number(result[0].result) / 8)) {
              prev = `${url}items?${noPage}page=${Number(query.page) - 1}`;
              next = '';
              const regex = /page=0/g;
              if (prev.match(regex)) {
                prev = '';
                next = '';
              }
            } else if (query.page <= 1) {
              prev = '';
              next = `${url}items?${noPage}page=${Number(query.page) + 1}`;
            }
  
            res.send({
              
              status: 200,
              info: {
                count: result[0].result,
                pages: Math.ceil(Number(result[0].result) / 8),
                current: `${url}items?${fullUrl}`,
                next,
                previous: prev,
              },
              data: res2,
            });
          }
        });
      }
    });
  });
  
  // router.get('/:id', (req, res) => {
  //   const { id } = req.params;
  
  //   const sql = 'SELECT restaurants.name, items.name AS item, items.id, categories.name AS category, categories.id AS category_id, users.username AS created_by, items.price, items.description, items.total_ratings, items.images, items.date_created, items.date_updated FROM items INNER JOIN restaurants ON items.restaurant = restaurants.id INNER JOIN categories ON items.category = categories.id INNER JOIN users ON items.created_by = users.id WHERE items.id = ?';
  
  //   mysql.execute(
  //     sql, [id],
  //     (err1, result1) => {
  //       if (err1) {
  //         console.log(err1);
  //         res.send({
            
  //           status: 400,
  //           msg: err1,
  //         });
  //       } else if (result1.length === 0) {
  //         res.send({
            
  //           status: 400,
  //           msg: 'No data retrieved!',
  //         });
  //       } else {
  //         const related = result1[0].category_id;
  //         const recommended = `SELECT restaurants.name, items.name AS item, categories.name AS category, categories.id AS category_id, users.username AS created_by, items.price, items.description, items.total_ratings, items.images, items.date_created, items.date_updated 
  //                 FROM items INNER JOIN restaurants ON items.restaurant = restaurants.id INNER JOIN categories ON items.category = categories.id INNER JOIN users ON items.created_by = users.id 
  //                 WHERE category = ? ORDER BY total_ratings DESC LIMIT 3`;
  
  //         mysql.execute(recommended, [related], (err2, result2) => {
  //           if (err2) {
  //             console.log(err2);
  //             res.send({
                
  //               status: 400,
  //               msg: err2,
  //             });
  //           } else {
  //             const review = 'SELECT review.review, users.username, items.name, review.ratings FROM review INNER JOIN users ON review.user = users.id INNER JOIN items ON review.item = items.id WHERE item = ? ORDER BY review.updated_on DESC LIMIT 5';
  //             mysql.execute(review, [req.params.id], (err3, res3) => {
  //               if (err3) {
  //                 console.log(err2);
  //                 res.send({
                    
  //                   status: 400,
  //                   msg: err3,
  //                 });
  //               } else {
  //                 res.send({
                    
  //                   status: 200,
  //                   data: result1,
  //                   reviews: res3,
  //                   showcase: result2,
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     },
  //   );
  // });
  
// router.get('/', (req,res)=>{
//     mysql.execute(showall, [], (err, result, field)=>{
//         res.send({data:result})
//     })
// })

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
                res.send({success:true,
                    data:result1,
                    suggest:result})
            })
    })
})

/* ADD DATA ITEM */
router.post('/',upload.single('image'),(req,res)=>{
    const image = (req.file.filename)
    const {id_category,id_restaurant,name_item,price,desc_item} =req.body
    const rating = 0
    const created_on = new Date()
    const updated_on = new Date()
    mysql.execute(add,
        [id_category,id_restaurant,name_item,price,desc_item,image,rating, created_on,updated_on],
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