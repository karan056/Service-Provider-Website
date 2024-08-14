const express=require("express");
const app=express();
const mysql2=require("mysql2");

app.listen(3004, function(){});

const fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.static("public"));

const congObj={
    host:"127.0.0.1",
    user:"root",
    password:"karan@1409",
    database:"pro",
    dateStrings:true
};

const mysql=mysql2.createConnection(congObj);

app.use(express.static("public"));

mysql.connect(function(err){
    if(err==null)
        console.log("connected to database");
    else
        console.log(err.message);
});

app.get("/", function(req, resp){
    let filePath=process.cwd()+"/public/ind.html";
    resp.sendFile(filePath);
})
app.use(express.urlencoded({extended:true}));
app.post("/signup" ,function(req,resp){
    const email=req.body.floatingInput;
    const pwd=req.body.signupPassword;
    const member=req.body.utype;
    const status=1;
    
    // resp.send(req.body);
     
  //  create table users (emailid varchar(30) primary key, pwd varchar(30), memtype varchar(30), dos date, status int );


    mysql.query("insert into users values(?, ?, ?,current_date(),?)", [email, pwd, member,status], function(err){
        if(err==null)
            resp.send("successfully singed up");
        else
            resp.send(err.message);
    });
}) ;
app.get("/check-email" ,function(req,resp)
{
    mysql.query("select * from users where emailid=? ", [req.query.kuchEmail], function(err,resultJsonary)
    {
       
        if(resultJsonary.length==1)
        resp.send("Email already exists");
     else
     resp.send("Yes Available"); 
    })
    
        


})

app.get("/checkk-email" ,function(req,resp)
{
    mysql.query("select * from users where emailid=? ", [req.query.kuchEmail], function(err,resultJsonary)
    {
       
        if(resultJsonary.length!=1)
        resp.send("Account doesn't exist"); 
        
     
    
    })
    
        


})

app.post("/log", function(req, resp) {

    const txtEmail = req.body.email;
    const logPas = req.body.password;

    mysql.query("select * from users where emailid = ? and pwd = ?", [txtEmail, logPas], function(err, resultJsonary) {

        if (err) {
            resp.send(err.message);
            return;
        }

        if (resultJsonary.length == 1) {
            if (resultJsonary[0].status == 1) {
                const userType = resultJsonary[0].usertype;
                resp.send(userType);
            } else {
                resp.send("UR ACCOUNT IS BLOCKED!! CONTACT ADMIN.......");
            }
        } else {
            resp.send("Invalid email or password");
        }
    });
});






// ----------------------------custprof------------------


app.get("/CP", function(req, resp){
    let filePath=process.cwd()+"/public/profile-customer.html";
    resp.sendFile(filePath);
})



    // data : {name : name ,contact : cont , address : addre , state :state , city : city , ppic : pic},
    // (emailid varchar(30) primary key , FName varchar(30) ,  contact varchar(15) , address varchar(100) ,  city varchar(30) , state varchar(50) , ppic varchar(300) );
   
      
    app.post("/savecustprof", function(req,resp){

        
    
        if(req.body.check === "checked") {
        
        const email= req.body.email;
        const name =req.body.name;
        const cont =req.body.cont;
        const add =req.body.adrs;
        const state =req.body.state;
        const city =req.body.city;
        
    
    
        let filename;
        if(req.files==null)//when no pic selecetd
            filename="nopic.png";
        else// when pic is selected by users
           {
            filename=req.files.ppic.name;
            let path=process.cwd()+"/public/uploads/"+filename;
            req.files.ppic.mv(path);//to store pic in uploads folder
           }
    
        req.body.ppic=filename;
        
        
          mysql.query("insert into cuprofile values(?,?,?,?,?,?,?)", [email,name,cont,add,city,state,filename], function(err)
          {
            if(err==null)
           {console.log("profile saved succesfully.....");
            resp.send("profile saved succesfully.....");
          }
        else
        {
            console.log(err.message);
              resp.send("error saving profile");
        }
          })
        }
    
    
    
        else
        {
            console.log("please agree to terms and conditions...");
            resp.send("please agree to terms and conditions...");
        }
    
    })     

    app.get("/search", function(req,resp){
        const email=req.query.email;

        mysql.query("select * from cuprofile where emailid=?", [email],function (err,ary){

            resp.send(ary);
            console.log(ary);
        })
    })


    app.post("/update", function(req,resp){

        
    
        if(req.body.check === "checked") {
        
        const email= req.body.email;
        const name =req.body.name;
        const cont =req.body.cont;
        const add =req.body.adrs;
        const state =req.body.state;
        const city =req.body.city;
        
    
    
        let filename;
        if(req.files==null)//when no pic selecetd
            filename=req.body.hdn;
        else// when pic is selected by users
           {
            filename=req.files.ppic.name;
            let path=process.cwd()+"/public/uploads/"+filename;
            req.files.ppic.mv(path);//to store pic in uploads folder
           }
    
        req.body.ppic=filename;
        
        console.log(filename);
          mysql.query("update  cuprofile set FName=? , contact=? , address=? , city=? , state=? , ppic=? where emailid=? ", [name,cont,add,city,state,filename,email], function(err)
          {
            if(err==null)
           {console.log("profile update succesfully.....");
            resp.send("profile update succesfully.....");
          }
        else
        {
            console.log(err.message);
              resp.send("error updating profile");
        }
          })
        }
    
    
    
        else
        {
            console.log("please agree to terms and conditions...");
            resp.send("please agree to terms and conditions...");
        }
    
    })     
  

    // -------------------------------customer-dash-----------------------------------------------


    app.get("/custdash", function(req,resp){
        let filePath=process.cwd()+"/public/customer-dash.html";
        resp.sendFile(filePath);
    })


    app.get("/getadd",function(req,resp){
        const email=req.query.email;

        mysql.query("select * from cuprofile where emailid=?",[email],function(err,arry){

            if(err){
                resp.send(err.message);
            }
            else
            {
                resp.send(arry);
            }
        })
    })

    // create table task (rid int primary key auto_increment, emailid varchar(30), cateogory varchar(30) , subcateogory varchar(30), address varchar(30), state varchar(30), city varchar(30), taskdone varchar(100),  upto date );
  
    app.post("/postjob",function(req,resp){
        const rid =0;
        const email= req.body.postemail;
        const sc= req.body.sc;
        const stc= req.body.stc;
        const ad= req.body.ad;
        const state= req.body.state;
        const city= req.body.city;
        const date= req.body.date;
        const td= req.body.td;

        mysql.query("insert into task values(?,?,?,?,?,?,?,?,?)", [ rid,email, sc, stc,ad,state,city,td,date], function(err){
            if(err==null)
                resp.send("successfully Posted");
            else
                resp.send(err.message);
    })
})




app.get("/check-pemail" ,function(req,resp)
{
    mysql.query("select * from task where emailid=? ", [req.query.pemail], function(err,resultJsonary)
    {
       
        if(resultJsonary.length==1)
        resp.send("Email already exists");
     else
     resp.send("Yes Available"); 
    })
})


/////////////////////////////////////// ---service profile--////////////////////////////////////////////////

app.get("/servicedash", function(req,resp){
    let filePath=process.cwd()+"/public/service-provider-dash.html";
    resp.sendFile(filePath);
})





app.get("/serviceprofile", function(req,resp){
    let filePath=process.cwd()+"/public/service-profile.html";
    resp.sendFile(filePath);
})


app.post("/saveservice", function(req,resp){

        
    
    if(req.body.check === "checked") {
    
    const email= req.body.email;
    const name =req.body.name;
    const cont =req.body.cont;
    const since =req.body.since;
    const sc =req.body.sc;
    const stc =req.body.stc;
    const adrs =req.body.adrs;
    const web =req.body.web;
    const id =req.body.id;
    const sp =req.body.sp;
    


    let filename;
    if(req.files==null)//when no pic selecetd
        filename="nopic.png";
    else// when pic is selected by users
       {
        filename=req.files.ppic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic.mv(path);//to store pic in uploads folder
       }

    req.body.ppic=filename;
    
    
      mysql.query("insert into provider values(?,?,?,?,?,?,?,?,?,?,?)", [email,cont,name,since,sc,stc,adrs,web,id,filename,sp], function(err)
      {
        if(err==null)
       {console.log("Data Upload succesfully.....");
        resp.send("Data Upload succesfully.....");
      }
    else
    {
        console.log(err.message);
          resp.send("error saving data.......");
    }
      })
    }



    else
    {
        console.log("please agree to terms and conditions...");
        resp.send("please agree to terms and conditions...");
    }

})     


app.post("/updateservice", function(req,resp){

        
    
    if(req.body.check === "checked") {
    
    const email= req.body.email;
    const name =req.body.name;
    const cont =req.body.cont;
    const since =req.body.since;
    const sc =req.body.sc;
    const stc =req.body.stc;
    const adrs =req.body.adrs;
    const web =req.body.web;
    const id =req.body.id;
    const sp =req.body.sp;
    


    let filename;
    if(req.files==null)//when no pic selecetd
        filename="nopic.png";
    else// when pic is selected by users
       {
        filename=req.files.ppic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.ppic.mv(path);//to store pic in uploads folder
       }

    req.body.ppic=filename;
    
    
      mysql.query("update provider set contact=?, fname=?, since=?, service=?, subservice=?, firm=?, website=?, id=?, idpic=?, special=? where email=? ", [email,cont,name,since,sc,stc,adrs,web,id,filename,sp], function(err)
      {
        if(err==null)
       {console.log("Data Updated succesfully.....");
        resp.send("Data Updated succesfully.....");
      }
    else
    {
        console.log(err.message);
          resp.send("error updating data.......");
    }
      })
    }



    else
    {
        console.log("please agree to terms and conditions...");
        resp.send("please agree to terms and conditions...");
    }

})     

app.get("/searchservice", function(req,resp){
    const email=req.query.email;

    mysql.query("select * from provider where email=?", [email],function (err,ary){

        resp.send(ary);
        console.log(ary);
    })
})
////////////////////////////////////////////providers record///////////////////////////////////////////////////////////////////////////////

app.get("/prorec", function(req,resp){
    let filePath=process.cwd()+"/public/all-providers.html";
    resp.sendFile(filePath);
})

app.get("/angular-fetch-all-providers",function(req,resp){
    mysql.query("select * from provider",function(err,jsonRecordsAry){
            resp.send(jsonRecordsAry);
    })
})

/////////////////////////////////////////////customer records////////////////////////////////////////////////////////////////////////////////

app.get("/custrec", function(req,resp){
    let filePath=process.cwd()+"/public/all-customers.html";
    resp.sendFile(filePath);
})
app.get("/angular-fetch-all-customers",function(req,resp){
    mysql.query("select * from cuprofile",function(err,jsonRecordsAry){
            resp.send(jsonRecordsAry);
    })
})

///////////////////////////////////////////////////////user manager//////////////////////////////////////////////////////////////////////////

app.get("/users", function(req,resp){
    let filePath=process.cwd()+"/public/user-manager.html";
    resp.sendFile(filePath);
})

app.get("/angular-fetch-all-users",function(req,resp){
    mysql.query("select * from users",function(err,jsonRecordsAry){
            resp.send(jsonRecordsAry);
    })
}) 
///////////////////////////////////////////////////////cards find job//////////////////////////////////////////////////////////////////
app.get("/findjobs", function(req,resp){
    let filePath=process.cwd()+"/public/find-jobs.html";
    resp.sendFile(filePath);
})
app.get("/angular-fetch-all-jobs",function(req,resp){
    mysql.query("select * from task",function(err,jsonRecordsAry){
            resp.send(jsonRecordsAry);
            // console.log(jsonRecordsAry);
    })
}) 


///////////////////////////////////////////////////providers ///////////////////////////////////////////////////////////////////////////////
app.get("/findproviders", function(req,resp){
    let filePath=process.cwd()+"/public/service-provider.html";
    resp.sendFile(filePath);
})
app.get("/fetch-all-provider",function(req,resp){
    mysql.query("select * from provider",function(err,jsonRecordsAry){
            resp.send(jsonRecordsAry);
            // console.log(jsonRecordsAry);
    })
}) 
  
//////////////////////////////////////////////////Admin path//////////////////////////////////////////////////////////////////////////////
app.get("/admin", function(req,resp){
    let filePath=process.cwd()+"/public/Admin.html";
    resp.sendFile(filePath);
})

/////////////////////////////////////////////////////block resume///////////////////////////////////////////////////////////////////////////////

app.get("/angular-fetch-all", function (req, resp) {
    mysql.query("select * from users", function (err, result) {
      if (err) {
        resp.send(err.message);
        return;
      } else resp.send(result);
    });
  });
  
  app.get("/block", function (req, resp) {
    const email = req.query.floatingInput;
    const status = 0;
    // console.log(req.query.email);
  
    mysql.query(
      "select * from users where emailid=?",
      [email],
      function (err, result) {
        if (err) {
          resp.send(err.message);
  
          return;
        } else {
          const currentStatus = result[0].status;
  
          if (currentStatus === 0) {
            resp.send("ALREADY BLOCKED");
            // console.log("ALREADY BLOCKED");
            return;
          } else {
            mysql.query(
              "update users set status=? where emailid=? ",
              [status, email],
              function (errr) {
                if (errr) resp.send(errr.message);
                else resp.send("User status updated successfully.");
              }
            );
          }
        }
      }
    );
  });



  app.get("/resume", function (req, resp) {
    const email = req.query.floatingInput;
    const status = 1;
    // console.log(req.query.email);
  
    mysql.query(
      "select * from users where emailid=?",
      [email],
      function (err, result) {
        if (err) {
          resp.send(err.message);
  
          return;
        } else {
          const currentStatus = result[0].status;
  
          if (currentStatus === 1) {
            resp.send("ALREADY STATUS='1'");
  
            return;
          } else {
            mysql.query(
              "update users set status=? where emailid=? ",
              [status, email],
              function (errr) {
                if (errr) resp.send(errr.message);
                else resp.send("User status updated successfully.");
              }
            );
          }
        }
      }
    );
  });
  
  
///////////////////////////////////////////////////update password/////////////////////////////////////////////////////////////////////////////////

app.post("/updatepass", function(req,resp){
  const emailid=req.body.logemailid
  const oldpass=req.body.logOLDPassword
  const newpass=req.body.logNEWPassword

  mysql.query("update users set pwd=? where emailid=?",[emailid,oldpass,newpass],function(err)
  {
    if(err==null)
    {console.log("Password Updated succesfully.....");
     resp.send("Password Updated succesfully.....");
  }
  else
    {
        console.log(err.message);
          resp.send("error updating password.......");
    }
  })
})


//////////////////////////////////////////////////////update pass//////////////////////////////////////////////////////////////////////////////

app.post("/updtpass", function(req,resp){
  const emailid=req.body.logemailid
  const oldpass=req.body.logOLDPassword
  const newpass=req.body.logNEWPassword

  mysql.query("update users set pwd=? where emailid=?",[emailid,oldpass,newpass],function(err)
  {
    if(err==null)
    {console.log("Password Updated succesfully.....");
     resp.send("Password Updated succesfully.....");
  }
  else
    {
        console.log(err.message);
          resp.send("error updating password.......");
    }
  })
})