export interface IGetRecipe {
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
    userName?: string; 
    ingredients: Ingredient[]; 
}

export interface Ingredient {
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unit: string;
}
