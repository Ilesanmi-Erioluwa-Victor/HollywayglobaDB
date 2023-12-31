import { prisma } from '../../../configurations/db';

import { review } from '../user.interface';

export class reviewQuery {
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

  static async findReviewIdM(id: string) {
    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });
    return review;
  }

  static async getReviewWithUserDetailsM(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },

      select: {
        text: true,
        rating: true,
        id: true,
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
            description: true,
            price: true,
            quantity: false,
            images: true,
            adminId: false,
            categoryId: false,
            createdAt: false,
            updatedAt: false,
          },
        },
      },
    });
    return review;
  }

  static async updateReviewM(reviewId: string, data: review) {
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: data,
    });

    return updatedReview;
  }

  static async getReviewsM(userId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        product: {
          select: {
            title: true,
            price: true,
          },
        },
        id: true,
        text: true,
        rating: true,
        createdAt: false,
        updatedAt: false,
        productId: false,
        userId: false,
      },
    });

    return reviews;
  }

  static async deleteReviewIdM(id: string) {
    const review = await prisma.review.delete({
      where: {
        id,
      },
    });
    return review;
  }
}
