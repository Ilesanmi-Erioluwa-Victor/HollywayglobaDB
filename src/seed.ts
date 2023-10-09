import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Seed Admin
    const admin = await prisma.admin.create({
      data: {
        name: 'Admin Name',
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'MODERATOR',
        isAccountVerified: true,
      },
    });

    // Seed Categories
    const category1 = await prisma.category.create({
      data: {
        name: 'Category 1',
        adminId: admin.id,
      },
    });

    const category2 = await prisma.category.create({
      data: {
        name: 'Category 2',
        adminId: admin.id,
      },
    });

    // Seed Products
    const product1 = await prisma.product.create({
      data: {
        title: 'Product 1',
        description: 'Description for Product 1',
        price: 2000,
        quantity: 50,
        images: ['image1.jpg', 'image2.jpg'],
        stock: 2,
        isAvailable: true,
        colors: 'white',
        categoryId: category1.id,
        adminId: admin.id,
      },
    });

    const product2 = await prisma.product.create({
      data: {
        title: 'Product 2',
        description: 'Description for Product 2',
        price: 1800,
        quantity: 75,
        images: ['image3.jpg', 'image4.jpg'],
        stock: 3,
        isAvailable: true,
        colors: 'black',
        categoryId: category2.id,
        adminId: admin.id,
      },
    });

    // Seed Reviews
    const review1 = await prisma.review.create({
      data: {
        text: 'Great product!',
        rating: 5,
        productId: product1.id,
        userId: admin.id, // Assuming admin is the user for the review
      },
    });

    console.log('Data seeded successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database when done
  }
}

// Call the seedData function to initiate the seeding
seedData();
