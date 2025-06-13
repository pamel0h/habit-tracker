import axios from 'axios';
import { HabitService } from '../../services/habit.service';
import { ApiView, IApiPresenter, Recipe } from './ApiInterfaces';

export class ApiPresenter implements IApiPresenter {
  private view: ApiView;

  constructor(view: ApiView) {
    this.view = view;
  }

  async onSearchRecipes(query: string): Promise<void> {
    if (!query.trim()) {
      this.view.setError('Введите название блюда');
      return;
    }

    this.view.setIsLoading(true);
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const meals = response.data.meals || [];
      const formattedRecipes = meals.map((meal: any) => {
        const ingredients: { ingredient: string; measure: string }[] = [];
        for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
            ingredients.push({
              ingredient: meal[`strIngredient${i}`],
              measure: meal[`strMeasure${i}`] || '',
            });
          }
        }
        return {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strInstructions: meal.strInstructions,
          strMealThumb: meal.strMealThumb,
          ingredients,
        };
      });
      this.view.setRecipes(formattedRecipes);
      this.view.setError(null);
      this.view.setExpandedInstructions([]);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      this.view.setError('Ошибка загрузки рецептов');
    } finally {
      this.view.setIsLoading(false);
    }
  }

  onToggleInstructions(idMeal: string): void {
    this.view.setExpandedInstructions((prev: string[]) =>
      prev.includes(idMeal) ? prev.filter(id => id !== idMeal) : [...prev, idMeal]
    );
  }

  async onAddHabit(recipeName: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      await HabitService.addHabit(today, `Приготовить ${recipeName}`);
      this.view.showError('Привычка добавлена!');
    } catch (error) {
      console.error('Error adding habit:', error);
      this.view.showError('Ошибка при добавлении привычки');
    }
  }
}