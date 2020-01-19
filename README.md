<h1 align="center">ExpressJS - Food Delivery App RESTfull API</h1>



Food Delivery App is a simple note application specially for backend only. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js)
## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name 'restaurantapp', and Import file [restaurantapp.sql](restaurantapp.sql) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:8080/items)
8. You can see all the end point [here](#end-point)

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :
```
APP_PORT=8080
APP_URI=http://localhost:8080/
APP_KEY=
                                                     
DB_SERVER=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=restaurantapp
```                            

## End Point Admin Access
**1. GET**
* `/carts/:id` (Get carts by id_users)
* `/categories/:id`(Get categories by id)
* `/items/:id` (Get items by id)
* `/items/search?name_item=chicken` 
* `/items/asc?name_item=chicken`
* `/items/page?page=1&limits=5`
* `/items/showall`
* `/restaurants/:id` (Get categories by id)
* `/restaurants/menu/richeese factory`
* `/users/:id` (Get categories by id)

**2. POST**
* `/categories`
* `/items`
* `/restaurants`
* `/riviews`
* `/users`

**3. PUT**
* `/categories/:id`(Get categories by id)
* `/items/:id`(Get categories by id)
* `/restaurants/:id`(Get categories by id)
* `/riviews/:id`(Get categories by id)
* `/users/:id`(Get categories by id)

**4. DELETE**
* `/categories/:id`(Get categories by id)
* `/items/:id`(Get categories by id)
* `/restaurants/:id`(Get categories by id)
* `/users/:id`(Get categories by id)



## End Point Customers Access
**1. GET**
* `/categories/:id`(Get categories by id)
* `/items/:id` (Get items by id)
* `/items/search?name_item=chicken` 
* `/items/asc?name_item=chicken`
* `/items/page?page=1&limits=5`
* `/items/showall`
* `/restaurants/:id` (Get categories by id)
* `/restaurants/menu/richeese factory`

**2. POST**
* `/items`
* `/restaurants`
* `/users`

**3. PUT**
* `/items/:id`(Get categories by id)
* `/restaurants/:id`(Get categories by id)
* `/users/:id`(Get categories by id)

**4. DELETE**
* `/items/:id`(Get categories by id)
* `/restaurants/:id`(Get categories by id)
* `/users/:id`(Get categories by id)

## End Point Restaurants Access
**1. GET**
* `/categories/:id`(Get categories by id)
* `/items/:id` (Get items by id)
* `/items/search?name_item=chicken` 
* `/items/asc?name_item=chicken`
* `/items/page?page=1&limits=5`
* `/items/showall`
* `/restaurants/:id` (Get categories by id)
* `/restaurants/menu/richeese factory`
* `/carts/:id`

**2. POST**
* `/items`
* `/carts`
* `/users`

**3. PUT**
* `/items/:id`(Get categories by id)
* `/carts/:id`(Get categories by id)
* `/riviews/:id`(Get categories by id)
* `/users/:id`(Get categories by id)

**4. DELETE**
* `/items/:id`(Get categories by id)
* `/carts/:id`(Get categories by id)
* `/users/:id`(Get categories by id)
