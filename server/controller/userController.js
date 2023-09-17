const mysql=require('mysql')
const bodyParser=require('body-parser');
const express=require('express')
const app=express();
app.use(bodyParser.urlencoded({extended:false}));
const session = require('express-session');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));



//connection pool
const pool=mysql.createPool({
    connectionLimit:'100',
    host           :'127.0.0.1',
    database       :process.env.DB_NAME,
    user           :process.env.DB_USER,
    multipleStatements: true
    
 
 })


exports.view=(req,res)=>{
    res.render('home',{
        titled:"SchedXhome",
    
    });

}



       
    

 
exports.schedulespecific=(req,res)=>{

    pool.getConnection((err,connection)=>{
        if(err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        let branchname=req.body.branchName;
        console.log(branchname);
        connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.day=mon.sub_id and m.branch=? group by m.session asc ',[branchname],(err,rowsa)=>{
            connection.query('SELECT tue.sub_name as tue FROM tuesday t,subject tue where t.day=tue.sub_id and t.branch=? group by t.session asc ',[branchname],(err,rowsb)=>{
                connection.query('SELECT wed.sub_name as wed FROM wednesday w,subject wed where w.day=wed.sub_id and w.branch=? group by w.session asc',[branchname],(err,rowsc)=>{
                 connection.query('SELECT wed.sub_name as thu FROM thursday w,subject wed where w.day=wed.sub_id and w.branch=? group by w.session asc',[branchname],(err,rowsd)=>{
                 connection.query('SELECT wed.sub_name as fri FROM friday w,subject wed where w.day=wed.sub_id and w.branch=? group by w.session asc',[branchname],(err,rowse)=>{
                     connection.release();
                          if(!err){
                          console.log('no err');
                          res.render('schedule',{
                               shoot:'done',
                               rowsa,rowsb,rowsc,rowsd,rowse,
                               titled:"SchedXchart"
        
                        });
                      }

                   });
                });
                
                });

                });
              });
          });
}

   exports.schedulecall=(req,res)=>{
    res.render('schedule',{
   
        titled:"SchedXchart"
        
    });
           
        
    }
    exports.contactcall=(req,res)=>{
        res.render('contact',{
       
            titled:"SchedXcontact"
            
        });
               
            
        }
    
        exports.pinboardcall=(req,res)=>{
            pool.getConnection((err,connection)=>{
                branch=req.body.branchName;
                if(err) throw err;
                console.log(`connected as ID ${connection.threadId}`);
                connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id group by m.session asc',[branch],(err,rowsa)=>{
                    connection.query('SELECT t.session,tue.sub_name as tue FROM tuesday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsb)=>{
                        connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
                         connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
                         connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
                             connection.release();
                                  if(!err){
                                  console.log('no err');
                                  res.render('pinboard',{
                                       rowsa,rowsb,rowsc,rowsd,rowse,
                                       titled:"SchedXchart"
                
                                });
                              }
        
                           });
                        });
                        
                        });
        
                        });
                      });
                  });
        }
        
        exports.pinboardlog=(req,res)=>{
           
                    console.log('no err');   
                   res.render('LoginPage',{
           
                titled:"SchedXlog"
                
            });
        }
    


       //TO EDIT MONDAY--GET
        exports.editm=(req,res)=>{
            pool.getConnection((err,connection)=>{
                if(err) throw err;
            connection.query('SELECT mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
            connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
            connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
            connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
                connection.query('SELECT t.session,tue.sub_name as tue FROM tuesday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsb)=>{
                    connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
                     connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
                     connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
                    connection.release();
                if(!err){
                    console.log('no err');

                res.render('edit-monday.hbs',{
           
                titled:"SchedXmon",rows1,rows2,rows3,rows4,rowsb,rowsc,rowsd,rowse
                
                       });
                      }
                    });
                 });
               });
            });
        });
    });
});
});
});
        }



//MONDAY UPDATED --POST
    exports.editedm=(req,res)=>{
    

        const{sone,stwo,sthree,sfour}=req.body;
        console.log(req.body);
        pool.getConnection((err,connection)=>{
        if(err) throw err;
        let x=branch;
        connection.query('UPDATE monday SET day=(SELECT sub_id FROM subject s where s.sub_name=? and s.branch=? ) where session=1 and branch=?',[sone,x,x],(err,rows)=>{
        connection.query('UPDATE monday SET day=(SELECT sub_id FROM subject s where s.sub_name=? and s.branch=? ) where session=2 and branch=?',[stwo,x,x],(err,rows)=>{
        connection.query('UPDATE monday SET day=(SELECT sub_id FROM subject s where s.sub_name=? and s.branch=? ) where session=3 and branch=?',[sthree,x,x],(err,rows)=>{
        connection.query('UPDATE monday SET day=(SELECT sub_id FROM subject s where s.sub_name=? and s.branch=? ) where session=4 and branch=?',[sfour,x,x],(err,rows)=>{
        
        
            if(!err){

                console.log('no err');
                connection.query('SELECT mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
                connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
                connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
                connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
                    connection.query('SELECT t.session,tue.sub_name as tue FROM tuesday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsb)=>{
                        connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
                         connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
                         connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
                          connection.release();
                        if(!err){
                                if(err) throw err;
                            console.log('no err');
        
                        res.render('edit-monday.hbs',{
                   
                        titled:"SchedXmon",
                        alert:"Schedule updated successfully",
                        rows1,rows2,rows3,rows4,rowsb,rowsc,rowsd,rowse
                        
                               });
                              }
                            });
                         });
                       });
                    });
                  });
                });
                });
                });
                }
              });
            });
          });
         });
       });
    }


      //TO EDIT TUESDAY--GET
    exports.edittu=(req,res)=>{
        pool.getConnection((err,connection)=>{
            if(err) throw err;
        connection.query('SELECT mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
        connection.query('SELECT m.session,mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
        connection.query('SELECT m.session,mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
        connection.query('SELECT m.session,mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
            connection.query('SELECT t.session,tue.sub_name as mon FROM monday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsa)=>{
                connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
                 connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
                 connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
                connection.release();
            if(!err){
                console.log('no err');

            res.render('edit-tuesday.hbs',{
       
            titled:"SchedXtue",rows1,rows2,rows3,rows4,rowsa,rowsc,rowsd,rowse
            
                   });
                  }
                });
             });
           });
        });
    });
});
});
});
});
    }




        //TUESDAY UPDATED--POST
        exports.editedtu=(req,res)=>{
            const{sone,stwo,sthree,sfour}=req.body;
            console.log(req.body);
            pool.getConnection((err,connection)=>{
            if(err) throw err;
            connection.query('UPDATE tuesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=1 and branch=?',[sone,branch,branch],(err,rows)=>{
            connection.query('UPDATE tuesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=2 and branch=?',[stwo,branch,branch],(err,rows)=>{
            connection.query('UPDATE tuesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=3 and branch=?',[sthree,branch,branch],(err,rows)=>{
            connection.query('UPDATE tuesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=4 and branch=?',[sfour,branch,branch],(err,rows)=>{
            
            
                if(!err){
    
                    console.log('no err');
                    connection.query('SELECT mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
                    connection.query('SELECT mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
                    connection.query('SELECT mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
                    connection.query('SELECT mon.sub_name as tue FROM tuesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
                        connection.query('SELECT t.session,tue.sub_name as mon FROM monday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsa)=>{
                            connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
                             connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
                             connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
                              connection.release();
                            if(!err){
                                    if(err) throw err;
                                console.log('no err');
            
                            res.render('edit-tuesday.hbs',{
                       
                            titled:"SchedXtue",
                            alert:"Schedule updated successfully",
                            rows1,rows2,rows3,rows4,rowsa,rowsc,rowsd,rowse
                            
                                   });
                                  }
                                });
                             });
                           });
                        });
                      });
                    });
                    });
                    });
                    }
                  });
                });
              });
             });
           });
        }

//TO EDIT WEDNESDAY--GET
exports.editw=(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
    connection.query('SELECT mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
    connection.query('SELECT m.session,mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
    connection.query('SELECT m.session,mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
    connection.query('SELECT m.session,mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
        connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id group by m.session asc',[branch],(err,rowsa)=>{
            connection.query('SELECT t.session,tue.sub_name as tue FROM tuesday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsb)=>{
            connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
             connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
            connection.release();
        if(!err){
            console.log('no err');

        res.render('edit-wednesday.hbs',{
   
        titled:"SchedXwed",rows1,rows2,rows3,rows4,rowsa,rowsb,rowsd,rowse
        
               });
              }
            });
         });
       });
    });
});
});
});
});
});
}


//WEDNESDAY UPDATED--POST
exports.editedw=(req,res)=>{
    const{sone,stwo,sthree,sfour}=req.body;
    console.log(req.body);
    pool.getConnection((err,connection)=>{
    if(err) throw err;
    connection.query('UPDATE  wednesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=1 and branch=?',[sone,branch,branch],(err,rows)=>{
    connection.query('UPDATE wednesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=2 and branch=?',[stwo,branch,branch],(err,rows)=>{
    connection.query('UPDATE wednesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=3 and branch=?',[sthree,branch,branch],(err,rows)=>{
    connection.query('UPDATE wednesday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=4 and branch=?',[sfour,branch,branch],(err,rows)=>{
    
    
        if(!err){

            console.log('no err');
            connection.query('SELECT mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
            connection.query('SELECT mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
            connection.query('SELECT mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
            connection.query('SELECT mon.sub_name as wed FROM wednesday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
                connection.query('SELECT t.session,tue.sub_name as mon FROM monday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsa)=>{
                    connection.query('SELECT w.session,wed.sub_name as tue FROM tuesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsb)=>{
                     connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
                     connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
                      connection.release();
                    if(!err){
                            if(err) throw err;
                        console.log('no err');
    
                    res.render('edit-wednesday.hbs',{
               
                    titled:"SchedXwed",
                    alert:"Schedule updated successfully",
                    rows1,rows2,rows3,rows4,rowsa,rowsb,rowsd,rowse
                    
                           });
                          }
                        });
                     });
                   });
                });
              });
            });
            });
            });
            }
          });
        });
      });
     });
   });
}




//TO EDIT THURSDAY--GET
exports.editth=(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
    connection.query('SELECT mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
    connection.query('SELECT m.session,mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
    connection.query('SELECT m.session,mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
    connection.query('SELECT m.session,mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
        connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id group by m.session asc',[branch],(err,rowsa)=>{
            connection.query('SELECT t.session,tue.sub_name as tue FROM tuesday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsb)=>{
            connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
             connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
            connection.release();
        if(!err){
            console.log('no err');

        res.render('edit-thursday.hbs',{
   
        titled:"SchedXthu",rows1,rows2,rows3,rows4,rowsa,rowsb,rowsc,rowse
        
               });
              }
            });
         });
       });
    });
});
});
});
});
});
}
   

//THURSDAY UPDATED--POST
exports.editedth=(req,res)=>{
    const{sone,stwo,sthree,sfour}=req.body;
    console.log(req.body);
    pool.getConnection((err,connection)=>{
    if(err) throw err;
    connection.query('UPDATE  thursday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=1 and branch=?',[sone,branch,branch],(err,rows)=>{
    connection.query('UPDATE thursday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=2 and branch=?',[stwo,branch,branch],(err,rows)=>{
    connection.query('UPDATE thursday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=3 and branch=?',[sthree,branch,branch],(err,rows)=>{
    connection.query('UPDATE thursday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=4 and branch=?',[sfour,branch,branch],(err,rows)=>{
    
    
        if(!err){

            console.log('no err');
            connection.query('SELECT mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
            connection.query('SELECT mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
            connection.query('SELECT mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
            connection.query('SELECT mon.sub_name as thu FROM thursday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
                connection.query('SELECT t.session,tue.sub_name as mon FROM monday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsa)=>{
                    connection.query('SELECT w.session,wed.sub_name as tue FROM tuesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsb)=>{
                     connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
                     connection.query('SELECT w.session,wed.sub_name as fri FROM friday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowse)=>{
                      connection.release();
                    if(!err){
                            if(err) throw err;
                        console.log('no err');
    
                    res.render('edit-thursday.hbs',{
               
                    titled:"SchedXthu",
                    alert:"Schedule updated successfully",
                    rows1,rows2,rows3,rows4,rowsa,rowsb,rowsc,rowse
                    
                           });
                          }
                        });
                     });
                   });
                });
              });
            });
            });
            });
            }
          });
        });
      });
     });
   });
}


//TO EDIT FRIDAY--GET
exports.editf=(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err;
    connection.query('SELECT mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
    connection.query('SELECT m.session,mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
    connection.query('SELECT m.session,mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
    connection.query('SELECT m.session,mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
        connection.query('SELECT m.session,mon.sub_name as mon FROM monday m,subject mon where m.branch=? and m.day=mon.sub_id group by m.session asc',[branch],(err,rowsa)=>{
            connection.query('SELECT t.session,tue.sub_name as tue FROM tuesday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsb)=>{
            connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
             connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
            connection.release();
        if(!err){
            console.log('no err');

        res.render('edit-friday.hbs',{
   
        titled:"SchedXfri",rows1,rows2,rows3,rows4,rowsa,rowsb,rowsc,rowsd
        
               });
              }
            });
         });
       });
    });
});
});
});
});
});
}
   

//FRIDAY UPDATED--POST
exports.editedf=(req,res)=>{
    const{sone,stwo,sthree,sfour}=req.body;
    console.log(req.body);
    pool.getConnection((err,connection)=>{
    if(err) throw err;
    connection.query('UPDATE friday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=1 and branch=?',[sone,branch,branch],(err,rows)=>{
    connection.query('UPDATE friday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=2 and branch=?',[stwo,branch,branch],(err,rows)=>{
    connection.query('UPDATE friday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=3 and branch=?',[sthree,branch,branch],(err,rows)=>{
    connection.query('UPDATE friday SET day=(SELECT sub_id FROM subject where sub_name=? and branch=? ) where session=4 and branch=?',[sfour,branch,branch],(err,rows)=>{
    
    
        if(!err){

            console.log('no err');
            connection.query('SELECT mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=1',[branch],(err,rows1)=>{
            connection.query('SELECT mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=2',[branch],(err,rows2)=>{
            connection.query('SELECT mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=3',[branch],(err,rows3)=>{
            connection.query('SELECT mon.sub_name as fri FROM friday m,subject mon where m.branch=? and m.day=mon.sub_id and m.session=4',[branch],(err,rows4)=>{
                connection.query('SELECT t.session,tue.sub_name as mon FROM monday t,subject tue where t.branch=? and t.day=tue.sub_id group by t.session asc',[branch],(err,rowsa)=>{
                    connection.query('SELECT w.session,wed.sub_name as tue FROM tuesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsb)=>{
                     connection.query('SELECT w.session,wed.sub_name as wed FROM wednesday w,subject wed where w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsc)=>{
                     connection.query('SELECT w.session,wed.sub_name as thu FROM thursday w,subject wed where  w.branch=? and w.day=wed.sub_id group by w.session asc',[branch],(err,rowsd)=>{
                      connection.release();
                    if(!err){
                            if(err) throw err;
                        console.log('no err');
    
                    res.render('edit-friday.hbs',{
               
                    titled:"SchedXfri",
                    alert:"Schedule updated successfully",
                    rows1,rows2,rows3,rows4,rowsa,rowsb,rowsc,rowsd
                    
                           });
                          }
                        });
                     });
                   });
                });
              });
            });
            });
            });
            }
          });
        });
      });
     });
   });
}
