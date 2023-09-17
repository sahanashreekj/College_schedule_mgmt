const mysql=require('mysql')


//connection pool
const pool=mysql.createPool({
    connectionLimit:'100',
    host           :'127.0.0.1',
    database       :process.env.DB_NAME,
    user           :process.env.DB_USER
    
 
 })


//ADMIN-HOME  --GET
exports.view=((req,res)=>{

pool.getConnection((err,connection)=>{
       connection.query('SELECT * FROM student ORDER BY USN ASC',(err,rows)=>{
        connection.release();
         if(!err){
            res.render('admin-home.hbs',{
               rows});
          
           }
       })
       
     });
    
 });




 
 exports.find=((req,res)=>{

   //connect to DB
   pool.getConnection((err,connection)=>{
       if(err) throw err;
       console.log(`connected as ID ${connection.threadId}`);
       let searchTerm=req.body.searchItem;
       connection.query('SELECT * FROM user WHERE last_name =?',[searchTerm],(err,rows)=>{
       
          connection.release();
          if(!err){
           res.render('home.hbs',{rows});
           console.log(rows);
          }
   
   
       });
       
    })
   
   
    });
   

   //ADD STUDENT--ADMIN --GET
    exports.form=((req,res)=>
    {
      res.render('add-student.hbs');
    })

    //GET LOGIN DETAILS
    exports.logins=((req,res)=>
    {pool.getConnection((err,connection)=>{
      connection.query('SELECT * FROM classlogin ORDER BY sem ASC',(err,rows)=>{
         connection.release();
         if(!err){

      res.render('login-controls.hbs',{rows});
       }
    });
   });
});


//ADD LOGIN DETAILS --ADMIN --GET

exports.logadd=((req,res)=>
    {
      res.render('add-logins.hbs');
    });

//SUBMIT STUDENT DETAILS
exports.submitstu=((req,res)=>{
   let usn=req.body.usn;
   let name=req.body.sname;
   let b=req.body.sbranch;
   let email=req.body.semail;
   let phone=req.body.sphone;
   pool.getConnection((err,connection)=>{
      if(err) throw err;
      console.log(`connected as ID ${connection.threadId}`);
      connection.query('INSERT INTO student SET name=?,usn=?,branch=?,email=?,phone=?',[name,usn,b,email,phone],(err,rows)=>{
          
      connection.release();
      if(!err){
      res.render('add-student.hbs',{
      alert:"Insertion successfull"
    });

    console.log(rows);
   }
})

});

});

//SUBMIT LOGIN CONTROLS
exports.logsubmit=((req,res)=>{
   let user=req.body.user;
   let brc=req.body.brc;
   let pas=req.body.pas;
   let s=req.body.sem;
   let cra=req.body.cra;
   let crb=req.body.crb;
   pool.getConnection((err,connection)=>{
      if(err) throw err;
      console.log(`connected as ID ${connection.threadId}`);
      connection.query('INSERT INTO classlogin SET user=?,password=?,sem=?,branch=?,cra=?,crb=?',[user,pas,s,brc,cra,crb],(err,rows)=>{
          
      connection.release();
      if(!err){
   res.render('add-logins.hbs',{
      alert:"Insertion successfull"});

}
   });
   })
})


// FACULTY LOGIN

    exports.faclog=(req,res)=>{
           
      console.log('no err');   
     res.render('faculty-login',{

  titled:"SchedXFAC"
  
});
}
// FACAULTY SCHEDULE PAGE
exports.facsched=((req,res)=>{
   let id=req.body.idf;
   pool.getConnection((err,connection)=>{
      connection.query('SELECT name FROM lecturer where lect_id=?',[id],(err,lectName)=>{
      connection.query('SELECT m.session,m.branch,s.sub_name FROM monday m,teaches t,subject s WHERE t.sub_id=m.day and t.sub_id=s.sub_id and t.lect_id=?',[id],(err,rowsa)=>{
      connection.query('SELECT m.session,m.branch,s.sub_name FROM tuesday m,teaches t,subject s WHERE t.sub_id=m.day and t.sub_id=s.sub_id and t.lect_id=?',[id],(err,rowsb)=>{
      connection.query('SELECT m.session,m.branch,s.sub_name FROM wednesday m,teaches t,subject s WHERE t.sub_id=m.day and t.sub_id=s.sub_id and t.lect_id=?',[id],(err,rowsc)=>{
      connection.query('SELECT m.session,m.branch,s.sub_name FROM thursday m,teaches t,subject s WHERE t.sub_id=m.day and t.sub_id=s.sub_id and t.lect_id=?',[id],(err,rowsd)=>{
      connection.query('SELECT m.session,m.branch,s.sub_name FROM friday m,teaches t,subject s WHERE t.sub_id=m.day and t.sub_id=s.sub_id and t.lect_id=?',[id],(err,rowse)=>{
         connection.release();
   
      if(!err){  
         res.render('fac-sched',{rowsa,rowsb,rowsc,rowsd,rowse,lectName,
         titled:'facschedX'})
      }
   });
});
      });
   });
});
});   
         
     })
});



//ADMIN LOGIN PAGE
exports.adminLog=((req,res)=>
    {
      res.render('admin-login.hbs');
    });


    
    exports.create=((req,res)=>{
      let first=req.body.first_name;
      let last=req.body.last_name;
      //connect to DB
      pool.getConnection((err,connection)=>{
          if(err) throw err;
          console.log(`connected as ID ${connection.threadId}`);
          connection.query('INSERT INTO user SET first_name = ?, last_name =?',[first,last],(err,rows)=>{
          
             connection.release();
             if(!err){
              res.render('add-student.hbs',{
               alert:'User added successfully'
              });
              console.log(rows);
             }
      
      
          });
          
       })
      
      
       });
      
       
       exports.edit=((req,res)=>
       {
         res.render('edit-user.hbs');
       })
       
        