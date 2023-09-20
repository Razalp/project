const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User=require('../model/user')
//login user
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(password)
  if(password.length<6){
    req.session.err="password atleast 6 digits"
    return res.redirect('/')
  }
  try {
    const userData = await User.findOne({ email: email });
    if (userData) {
      let checkPassword = await bcrypt.compare(password, userData.password); // Correct argument order
     
 if (checkPassword) {
          if(userData.is_admin){
            req.session.err="THIS IS FOR USER LOGIN"
            return res.redirect('/')
          }

        req.session.user=email;
        res.redirect('/dashboard');
      } else {
        req.session.err = 'Invalid password';
        res.redirect('/');
      }
    } else {
      req.session.err = 'User not found'; // Handle case where user does not exist
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); // Handle other errors appropriately
  }
});

//
router.get('/',(req,res)=>{
    if(req.session.user){
        res.redirect('/dashboard');
    }else{   
        const errmsg= req.session.err
        res.render('user/base',{title:"LOGIN SYSTEM",errmsg});
    }
})

//route for dash board
router.get('/dashboard',(req,res)=>{
    if(req.session.user){
        
        res.render('user/dashboard',{user:req.session.user})
    }else{
        res.redirect('/');
    }
})
//route for logout;
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{//section logout destroy or delect
        if(err){
            console.log(err);
            res.send("Error");
        }else{
            res.redirect('/');
        }
    })
})
router.get('/signup',(req,res)=>{
    if(req.session.user){
        res.redirect('/dashboard')
    }else{
        const errmsg= req.session.err
        res.render('user/signPage',{error:"",errmsg})
    }
})

router.post('/signup',async (req,res)=>{
    const {email,name,password,mobile}=req.body
    if(password.length<6){
        req.session.err="password atleast 6 digits"
        return res.redirect('/signup')
    }

    const exist= await User.findOne({email:email})
    if(exist){
        req.session.err="Email already exist"
       res.redirect("/signup")
    }else{
    const hashedPassword= bcrypt.hashSync(password,5)

    const user=new User({
        email,
        name,
        password:hashedPassword,
        mobile
    })
    await user.save();
    req.session.user=email
    res.redirect("/dashboard")
    
}
    
})


module.exports=router;