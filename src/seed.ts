import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    const category = await prisma.category.findMany();

    const products = [
      {
        title: 'Tomatoes',
        description:
          'Tomato plants are generally much branched, spreading 60–180 cm (24–72 inches) and somewhat trailing when fruiting, but a few forms are compact and upright',
        slug: ['fruit', 'vegetables', 'fresh product'],
        price: 549,
        quantity: 94,
        // category: 'Fruits/Vegetables',
        categoryId: '65242655e3be35788e97c8fb',
        adminId: '652424a9e3be35788e97c8f3',
        isOrganic: true,
        images: [
          'https://foodies.ng/images/product/ZariaTomatoCrate.png',
          'https://foodies.ng/images/product/TomatoesGhanaBigBasket.png',
          'https://foodies.ng/images/product/TomatoesGhanaCrates.png',
          'https://foodies.ng/images/product/TomatoesGhanaCrates.png',
        ],
      },

      {
        title: 'Pepper',
        description:
          'Tomato plants are generally much branched, spreading 60–180 cm (24–72 inches) and somewhat trailing when fruiting, but a few forms are compact and upright',
        slug: ['fruit', 'vegetables', 'fresh product'],
        price: 5000,
        quantity: 94,
        // category: 'Fruits/Vegetables',
        categoryId: '652425f3e3be35788e97c8f6',
        adminId: '652424a9e3be35788e97c8f3',
        isOrganic: true,
        images: [
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperHalfBag.png',
          'https://foodies.ng/images/product/PepperQuarterBag.png',
        ],
      },
      {
        title: 'Pepper',
        description:
          'Tomato plants are generally much branched, spreading 60–180 cm (24–72 inches) and somewhat trailing when fruiting, but a few forms are compact and upright',
        slug: ['fruit'],
        price: 5000,
        quantity: 94,
        // category: 'Fruits/Vegetables',
        categoryId: '652425f3e3be35788e97c8f6',
        adminId: '652424a9e3be35788e97c8f3',
        isOrganic: true,
        images: [
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperHalfBag.png',
          'https://foodies.ng/images/product/PepperQuarterBag.png',
        ],
      },

      {
        title: 'Pepper',
        description:
          'Tomato plants are generally much branched, spreading 60–180 cm (24–72 inches) and somewhat trailing when fruiting, but a few forms are compact and upright',
        slug: [ 'fresh product'],
        price: 5000,
        quantity: 94,
        // category: 'Fruits/Vegetables',
        categoryId: '652425f3e3be35788e97c8f6',
        adminId: '652424a9e3be35788e97c8f3',
        isOrganic: true,
        images: [
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperHalfBag.png',
          'https://foodies.ng/images/product/PepperQuarterBag.png',
        ],
      },

      {
        title: 'Pepper',
        description:
          'Tomato plants are generally much branched, spreading 60–180 cm (24–72 inches) and somewhat trailing when fruiting, but a few forms are compact and upright',
        slug: [ 'vegetables'],
        price: 5000,
        quantity: 94,
        // category: 'Fruits/Vegetables',
        categoryId: '65242616e3be35788e97c8f8',
        adminId: '652424a9e3be35788e97c8f3',
        isOrganic: true,
        images: [
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperHalfBag.png',
          'https://foodies.ng/images/product/PepperQuarterBag.png',
        ],
      },

      {
        title: 'Pepper',
        description:
          'Tomato plants are generally much branched, spreading 60–180 cm (24–72 inches) and somewhat trailing when fruiting, but a few forms are compact and upright',
        slug: ['fruit', 'vegetables', 'fresh product'],
        price: 5000,
        quantity: 94,
        // category: 'Fruits/Vegetables',
        categoryId: '65242604e3be35788e97c8f7',
        adminId: '652424a9e3be35788e97c8f3',
        isOrganic: true,
        images: [
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperBigBag.png',
          'https://foodies.ng/images/product/PepperHalfBag.png',
          'https://foodies.ng/images/product/PepperQuarterBag.png',
        ],
      },
    ];
    await prisma.product.createMany({
      data : products
    })
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database when done
  }
}

seedData();
