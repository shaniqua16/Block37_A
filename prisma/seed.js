
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const { prisma } = require("../common");

async function main() {
    console.log('Seeding started...');
    await prisma.item.createMany({
        data: [
            { name: 'Laptop Pro X', description: 'High-end laptop for professionals.' },
            { name: 'Coffee Mug', description: 'Keeps your coffee warm.' },
            { name: 'The Great Novel', description: 'A captivating story.' },
            { name: 'Local Cafe', description: 'Best coffee in town.' },

        ],
        skipDuplicates: true, // Don't throw error if item already exists
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

