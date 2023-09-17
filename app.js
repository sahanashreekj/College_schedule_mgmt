const express=require('express');
const {engine}=require('express-handlebars');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const path=require('path');

require('dotenv').config();

const app=express();
const port=process.env.PORT||5000;

//parsing middleware
app.use(bodyParser.urlencoded({extended:false}));

//parse application\json
app.use(bodyParser.json());

//static files
app.use(express.static('public'));

//templating Engine
 app.engine('hbs',engine({extname:'.hbs',defaultLayout:'main'}));
 app.set('view engine','hbs')

//connection pool
const pool=mysql.createPool({
   connectionLimit:'100',
   host           :'127.0.0.1',
   database       :process.env.DB_NAME,
   user           :process.env.DB_USER,
   multipleStatements: true
   

})

//connecting to DB
pool.getConnection((err,connection)=>{
   if(err) throw err;
   console.log(`connected as ID ${connection.threadId}`);
   
})

 const routes=require('./server/routes/user')
 app.use('/',routes);

 





app.listen(port,()=>console.log(`listening on port ${port}`));