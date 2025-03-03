export interface IGetReviewByRecipe {
  recipeId: number
  reviewDate : Date
  reviewId: number
  reviewScore: number
  reviewText: string
  userName: string
}
