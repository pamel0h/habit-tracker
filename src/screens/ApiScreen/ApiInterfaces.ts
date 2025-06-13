export interface ApiView {
  setRecipes(recipes: Recipe[]): void;
  setSearchQuery(query: string): void;
  setIsLoading(loading: boolean): void;
  setError(error: string | null): void;
  setExpandedInstructions(ids: string[] | ((prev: string[]) => string[])): void;
  showError(error: string): void;
}

export interface IApiPresenter {
  onSearchRecipes(query: string): void;
  onToggleInstructions(idMeal: string): void;
  onAddHabit(recipeName: string): void;
}

export type Recipe = {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  ingredients: { ingredient: string; measure: string }[];
};