
const {bcrypt,prisma, jwt} =require('../common');

const login = async (req, res) => {
    console.log(req.body)
 const {username, password} = req.body;
const user = await prisma.user.findFirst({
    where:{
        username
    },
});
const match = await bcrypt.compare(password, user?.password);
   if (match){
    const token = jwt.sign(
        {
        username
    },
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
);
const obj = {
    user,
    token
};
res.send (obj);
   }
   else {
    res.send('Wrong username or password')
   }
};

const removeUser= async (req, res) => {
const id = Number(req.params.id);
const deleteUser = await prisma.user.delete({
    where: {
        id
    },
})
res.send(deleteUser);
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
            username
        },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );
    const obj = {
        registerUser,
        token
    };
    res.json(obj)
    }
    else{
        res.send('User already exists')
    }
};

const allUsers = async (req, res) => {
    const users = await prisma.user.findMany();
    if (users) {
      res.send(users);
    } else {
      res.send("Table is empty");
    }
  };

  const getUser = async (req, res) => {
    const id = Number(req.params.id);
    const user = await prisma.user.findFirst({
        where: {
            id
        },
    });
    if(user){
        res.send(user);
    }    
};


const user = async (req, res, next) => {
try{
const userId = await prisma.user.findUnique({
    where: {id: req.user.id},
    select: {
        id: true,
        username: true,
    }
});
if (!userId){
    return res.status(404).send({ message: 'User not found.' });
}
res.send(userId);
}
catch(error){
    next(error);
}
}
  module.exports= {login, removeUser, register, allUsers, getUser, user};

  
