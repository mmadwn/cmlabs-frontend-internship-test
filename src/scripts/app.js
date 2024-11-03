import $ from 'jquery';
import MealService from './services/api';

$(document).ready(function() {
  initializeApp();
});

function initializeApp() {
  loadCategories();
  handleCategoryClick();
  handleMobileMenu();
}

function loadCategories() {
  const $categoriesContainer = $('#categories-container');
  
  // Show loading state
  $categoriesContainer.html('<div class="text-center py-8">Loading categories...</div>');

  MealService.getCategories()
    .then(response => {
      if (response.categories && response.categories.length) {
        const categoriesHTML = response.categories.map(category => `
          <div class="category-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer" 
               data-category="${category.strCategory}">
            <div class="relative">
              <img src="${category.strCategoryThumb}" alt="${category.strCategory}" 
                   class="w-full h-48 object-cover">
              <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition duration-300">
                <div class="flex items-center justify-center h-full">
                  <span class="text-white text-lg font-medium">View Recipes</span>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800">${category.strCategory}</h3>
              <p class="text-gray-600 mt-2">${category.strCategoryDescription ? 
                category.strCategoryDescription.substring(0, 100) + "..." : 
                "No description available"}</p>
            </div>
          </div>
        `).join('');
        
        $categoriesContainer.html(categoriesHTML);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      $categoriesContainer.html(`
        <div class="text-center py-8">
          <p class="text-red-500 mb-4">Error loading categories</p>
          <button onclick="window.location.reload()" 
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Try Again
          </button>
        </div>
      `);
    });
}

function handleCategoryClick() {
  $(document).on('click', '.category-card', function() {
    const category = $(this).data('category');
    showCategoryDetails(category);
  });
}

function showCategoryDetails(category) {
  const $mainContent = $('main');
  
  // Show loading state
  $mainContent.html('<div class="container mx-auto px-4 mt-20"><div class="text-center py-8">Loading meals...</div></div>');

  MealService.getMealsByCategory(category)
    .then(response => {
      if (response.meals && response.meals.length) {
        const mealsHTML = `
          <div class="container mx-auto px-4 mt-20">
            <div class="mb-8">
              <button class="text-blue-600 hover:text-blue-800" onclick="window.location.reload()">
                ← Back to Categories
              </button>
              <h2 class="text-3xl font-bold text-gray-800 mt-4">${category} Recipes</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${response.meals.map(meal => `
                <div class="meal-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer" 
                     data-meal-id="${meal.idMeal}">
                  <div class="relative">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
                         class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition duration-300">
                      <div class="absolute bottom-0 left-0 right-0 p-6">
                        <span class="text-white text-lg font-medium">View Recipe</span>
                      </div>
                    </div>
                  </div>
                  <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800">${meal.strMeal}</h3>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        
        $mainContent.html(mealsHTML);
        
        // Add click handler for meals
        handleMealClick();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      $mainContent.html(`
        <div class="container mx-auto px-4 mt-20">
          <div class="text-center py-8">
            <p class="text-red-500 mb-4">Error loading meals</p>
            <button onclick="window.location.reload()" 
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Try Again
            </button>
          </div>
        </div>
      `);
    });
}

function handleMealClick() {
  $(document).on('click', '.meal-card', function() {
    const mealId = $(this).data('meal-id');
    showMealDetails(mealId);
  });
}

function showMealDetails(mealId) {
  const $mainContent = $('main');
  
  // Show loading state
  $mainContent.html('<div class="container mx-auto px-4 mt-20"><div class="text-center py-8">Loading recipe details...</div></div>');

  MealService.getMealDetails(mealId)
    .then(response => {
      if (response.meals && response.meals.length) {
        const meal = response.meals[0];
        const ingredients = [];
        
        // Get all ingredients and measurements
        for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim()) {
            ingredients.push({
              ingredient: meal[`strIngredient${i}`],
              measure: meal[`strMeasure${i}`] || ''
            });
          }
        }

        const mealDetailsHTML = `
          <div class="container mx-auto px-4 mt-20">
            <div class="mb-8">
              <button class="text-blue-600 hover:text-blue-800" onclick="window.history.back()">
                ← Back to Recipes
              </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="md:flex">
                <div class="md:w-1/2">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" 
                       class="w-full h-[400px] object-cover">
                </div>
                <div class="p-8 md:w-1/2">
                  <h1 class="text-4xl font-bold text-gray-800 mb-4">${meal.strMeal}</h1>
                  <div class="mb-6">
                    <span class="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                      ${meal.strCategory}
                    </span>
                    ${meal.strArea ? `
                      <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full ml-2">
                        ${meal.strArea} Cuisine
                      </span>
                    ` : ''}
                  </div>
                  
                  <h2 class="text-xl font-semibold text-gray-800 mb-2">Ingredients</h2>
                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    ${ingredients.map(item => `
                      <li class="flex items-center text-gray-600">
                        <svg class="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        ${item.measure} ${item.ingredient}
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
              
              <div class="p-8 border-t">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
                <div class="prose max-w-none text-gray-600">
                  ${meal.strInstructions.split('\n').map(instruction => 
                    instruction.trim() ? `<p class="mb-4">${instruction}</p>` : ''
                  ).join('')}
                </div>
                
                ${meal.strYoutube ? `
                  <div class="mt-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Video Tutorial</h2>
                    <div class="aspect-w-16 aspect-h-9">
                      <iframe 
                        src="https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        class="w-full h-[400px] rounded-xl"
                      ></iframe>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
        
        $mainContent.html(mealDetailsHTML);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      $mainContent.html(`
        <div class="container mx-auto px-4 mt-20">
          <div class="text-center py-8">
            <p class="text-red-500 mb-4">Error loading recipe details</p>
            <button onclick="window.history.back()" 
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Go Back
            </button>
          </div>
        </div>
      `);
    });
}


