import type { IIngredients } from './IGetAllRecipes'

export interface IPostRecipe {
  name: string
  description: string
  meal: 'Desayuno' | 'Almuerzo' | 'Comida' | 'Merienda' | 'Cena'
  diet:
    | 'Vegetariana'
    | 'Vegana'
    | 'Omnivoro'
    | 'SinGluten'
    | 'Mediterranea'
    | 'SinLactosa'
    | 'Proteina'
  flavour: 'Dulce' | 'Salado' | 'Amargo' | 'Acido' | 'Picante'
  calories: number
  time: number
  difficulty: 'Facil' | 'Media' | 'Dificil'
  image: string
  steps: string
  ingredients: IIngredients[]
}
