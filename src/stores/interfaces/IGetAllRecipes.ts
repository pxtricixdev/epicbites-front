export interface IGetAllRecipes {
  id: number;
  name: string;
  description: string;
  meal: string;
  diet: string;
  flavour: string;
  time: number;
  calories: number;
  difficulty: string;
  image: string;
  userName: string;
  score: number;
  ingredientes: IIngredients[];
}

export interface IIngredients {
  ingredientId: number,
  ingredientName: string,
  quantity: number,
  unit: string
}
