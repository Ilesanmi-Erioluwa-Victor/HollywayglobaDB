import { prisma } from '../../../configurations/db';

import { review } from '../user.interface';

export class reviewQueries {
  static async createReviewM(
    reviewData: review,
    userId: string,
    productId: string
  ) {
    const review = await prisma.review.create({
      data: {
        text: reviewData.text,
        rating: reviewData.rating,
        user: { connect: { id: userId } },
        product: {
          connect: { id: productId },
        },
      },
    });
    return review;
  }

  static async getReviewM(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            createdAt: false,
            updatedAt: false,
            accountVerificationTokenExpires: false,
            accountVerificationToken: false,
            isAccountVerified: false,
            mobile: false,
            active: false,
            role: false,
            id: false,
            isBlocked: false,
            password: false,
            v: false,
          },
        },
        product: {
          select: {
            id: false,
            title: true,
            brand: true,
            description: false,
            price: false,
            quantity: false,
            images: false,
            stock: false,
            adminId: false,
            colors: false,
            categoryId: false,
            createdAt: false,
            updatedAt: false,
          },
        },
      },
    });
    return review;
  }
}
