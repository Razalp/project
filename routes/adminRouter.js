const express=require('express');
const adminRouter=express.Router();
const bcrypt=require('bcryptjs');
const User=require('../model/user');
const user = require('../model/user');




adminRouter.post('/', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(password)
    if(password.length<6){
      req.session.err="password atleast 6 digits"
      return res.redirect('/admin')
    }
    try {
      const userData = await User.findOne({ email: email });
  
      if (userData) {
        let checkPassword = await bcrypt.compare(password, userData.password); // Correct argument order
        if (checkPassword) {
            
            console.log(userData.is_admin);

          if(userData.is_admin){
  
              req.session.admin=email;

            res.redirect('/admin')//admin
          }else{
            req.session.err="You not admin"
            res.redirect('/admin')
          }
  
        //   req.session.user=email;
        //   res.redirect('/dashboard');
        } else {
          req.session.err = 'Invalid password';
          res.redirect('/admin');
        }
      } else {
        req.session.err = 'User not found'; // Handle case where user does not exist
        res.redirect('/admin');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'); // Handle other errors appropriately
    }
  });

adminRouter.get('/',(req,res)=>{
    if(req.session.admin){
    res.redirect('/admin/home')
    }else{
        const errmsg=req.session.err
        res.render('admin/adminlogin',{errmsg})
    }
})

adminRouter.get('/home',async(req,res)=>{
    if(req.session.admin){
        const user=await User.find({})
        res.render('admin/adminHome',{user})
    }else{
        res.redirect('/')
    }

})
adminRouter.get('/deleteuser/:id',async(req,res)=>{

    const userId =req.params.id;
    const user=await User.findOneAndDelete({_id:userId}) 
    console.log(user)
    res.redirect('/admin')
})
adminRouter.get('/logout',(req,res)=>{
  // req.session.destroy((err)=>{//section logout destroy or delect
  //       if(err){
  //         console.log(err)
  //       }else{
  //         res.redirect('/admin');
  //       }
  //   })
  req.session.destroy()
  res.redirect('/admin');
})
adminRouter.get('/edit/:id',async(req,res)=>{
  const userId=req.params.id;

  const user= await User.findOne({_id:userId})

  res.render('admin/edituser',{user})
})  
adminRouter.get('/adminCreate',(req,res)=>{
  res.render('admin/userCreateInAdmin')
})


adminRouter.post('/adminCreate',async (req,res)=>{
  const {email,name,password,mobile}=req.body
  if(password.length<6){
      req.session.err="password atleast 6 digits"
       return res.redirect('/admin/adminCreate')
     
  }
  if(mobile.length<10){
    req.session.err="moblie number atleast 10 digit"
    return res.redirect('/admin/adminCreate')
  }
  

  const exist= await User.findOne({email:email})
  if(exist){
      req.session.err="Email already exist"
     res.redirect("/admin/adminCreate")
  }else{
  const hashedPassword= bcrypt.hashSync(password,5)

  const admin=new User({
      email,
      name,
      password:hashedPassword,
      mobile,
      is_admin:true

  })
  await admin.save();
  
  res.redirect("/admin")
  
}
  
})
adminRouter.post('/edituser',async (req,res)=>{
  let hello = req.body
  
  // console.log(hello);
  // if(req.body.is_admin){

  // }

  const user=await User.findOneAndUpdate(req.body)
  res.redirect('/admin')
})
adminRouter.post('/deleteuser',async (req,res)=>{  
  const user=await User.findOneAndDelete(req.body)
  res.redirect('/admin')
})


module.exports=adminRouter;