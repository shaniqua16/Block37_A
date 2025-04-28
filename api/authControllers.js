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

  const userGet = async (req, res) => {
    const id = Number(req.params.id);
    const user = await prisma.user.findFirst({
        where: {
            id
        },
    });
    res.send(user);    
};

  const update = async (req, res) => {
    const id = Number(req.params.id);
    const {username, password}= req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updateUser = await prisma.user.findFirst({
        where: {
            id
        },
    });
    try {
        if (updateUser){
            const updateProfile = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    username,
                    password: hashedPassword
                },
            });
            if (updateProfile){
                res.send(updateProfile);
                return;
            }
            else {
                res.send('User did not update');
                return;
            }
        }
        
    } catch (e) {
       res.send(e); 
       return;
    }
    res.send(updateUser);
  };

  module.exports= {login, removeUser, register, allUsers, userGet, update};

  
