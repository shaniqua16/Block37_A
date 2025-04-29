const {prisma, bcrypt} = require('../common');

async function main() {
    console.log('Seeding started...');
//---deleting existin data
    await prisma.review.deleteMany();
    await prisma.item.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('Existing data cleared.');

    //--- creating users---

    const user1= await prisma.user.create({
        data:
            {
            username: 'Kev',
            password: await bcrypt.hash('password123', 10),
            }
        });
    const user2= await prisma.user.create({
        data:
            {   
            username: 'Harley',
            password: await bcrypt.hash('password1234', 10),
            }
            });
    const user3= await prisma.user.create({
        data:
            {   
                username: 'Harley sage',
                password: await bcrypt.hash('password456', 10),
                }
        
    });


    //--- creating items---
    const item1 = await prisma.item.create({
        data: 
            { name: 'Laptop Pro X', description: 'High-end laptop for professionals.' }
            });
    const item2 = await prisma.item.create({
        data: 
            { name: 'Coffee Mug', description: 'Keeps your coffee warm.' }
            });
    const item3 = await prisma.item.create({
        data: 
            { name: 'The Great Novel', description: 'A captivating story.' }
            });
    const item4 = await prisma.item.create({
        data: 
            { name: 'Local Cafe', description: 'Best coffee in town.' },
    });

    //---create reviews---
    review1 = await prisma.review.create({
        data: 
            { content: 'Great laptop, very fast!', rating: 5, userId: user1.id, itemId: item1.id }
            });
    review2 = await prisma.review.create({
        data: 
            { content: 'A bit expensive, but worth it.', rating: 4, userId: user2.id, itemId: item4.id }
            });
    review3 = await prisma.review.create({
        data: 
            { content: 'Solid mug, good size.', rating: 4, userId: user3.id, itemId: item2.id },
        
    });

    

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


     


