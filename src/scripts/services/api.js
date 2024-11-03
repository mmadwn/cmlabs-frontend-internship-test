import $ from 'jquery';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

const MealService = {
  getCategories: () => {
    return $.get(`${API_URL}/categories.php`);
  },

  getMealsByCategory: (category) => {
    return $.get(`${API_URL}/filter.php?c=${category}`);
  },

  getMealDetails: (id) => {
    return $.get(`${API_URL}/lookup.php?i=${id}`);
  }
};

export default MealService;
