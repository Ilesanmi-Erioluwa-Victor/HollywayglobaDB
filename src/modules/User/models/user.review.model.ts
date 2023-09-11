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
        product: { connect: { id: productId } },
      },
    });
    return review;
  }
}
