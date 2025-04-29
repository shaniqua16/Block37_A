
const {bcrypt,prisma, jwt} =require('../common');

const login = async (req, res) => {
    console.log(req.body)
 const {username, password} = req.body;
const user = await prisma.user.findUnique({
    where:{
        username
    },
});
if (!user) {
    return res.status(401).send({ message: 'Invalid credentials.' }); // 401 Unauthorized
}

const match = await bcrypt.compare(password, user?.password);
   if (match){
    const token = jwt.sign(
        {
            userId: user.id,
        username: user.username
    },
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
);
const obj = {
    message: "Login successful!", 
    token: token,
    user: {
        id: user.id,
        username: user.username
    }
};
res.send (obj);
   }
   else {
    res.send('Wrong username or password')
   }
};

const register= async (req, res) => {
    const {username, password}=req.body; 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const registerUser= await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        }
    });
    if (registerUser){
        const token = jwt.sign(
            {
                userId: registerUser.id,
            username: registerUser.username
        },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );
    const obj = {
        message: "Registration successful!", 
     token: token,
     user: { 
         id: registerUser.id,
         username: registerUser.username}
    };
    res.json(obj)
    }
    else{
        res.send('User already exists')
    }
};


const user = async (req, res, next) => {
try{
const loggedInUser = await prisma.user.findUnique({
    where: {id: req.user.id},
    select: {
        id: true,
        username: true,
    }
});
if (!loggedInUser){
    return res.status(404).send({ message: 'User not found.' });
}
res.send(userId);
}
catch(error){
    next(error);
}
}
  module.exports= {login, register, user};

  
