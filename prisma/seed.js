const { empty } = require("@prisma/client/runtime/library");
const bcrypt = require('bcrypt');
const { prisma } = require("./common");

async function main() {
    console.log('Seeding started...');

     // --- Create Users ---
    const saltRounds = 10;
    const password = 'password123'; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hashed Password:', hashedPassword);

  const user1 = await prisma.user.create({
    data:{
        email: 'Kev@emai.com',
        password: hashedPassword,
        name: 'Kev',
    profile: {
        create: {
            bio: 'Loves to code'
            },
        },
    },
    });
}

