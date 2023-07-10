// Global variables
const apiKey = 'd40b55e0b55f4099b859b04b2533d17a';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recipeResults = document.getElementById('recipe-results');
const favoritesContainer = document.getElementById('favorites-container');
let recipeData = []; // Array to store recipe data
let favoriteRecipes = []; // Array to store favorite recipes

// Event listeners
document.addEventListener('DOMContentLoaded', loadRecipes);
searchForm.addEventListener('submit', searchRecipes);
recipeResults.addEventListener('click', handleRecipeClick);

// Load recipes from Spoonacular API on page load
function loadRecipes() {
  const url = `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      recipeData = data.recipes;
      displayRecipes(recipeData);
    })
    .catch((error) => console.log('Error:', error));
}

// Display recipes
function displayRecipes(recipes) {
  recipeResults.innerHTML = '';
  recipes.forEach((recipe) => {
    const recipeCard = `
      <div class="recipe-card">
        <img src="${recipe.image}" alt="${recipe.title}" />
        <h3>${recipe.title}</h3>
        <button class="favorite-btn" data-id="${recipe.id}">Favorite</button>
      </div>
    `;
    recipeResults.innerHTML += recipeCard;
  });
}

// Search recipes based on user input
function searchRecipes(event) {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') return;

  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&apiKey=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      recipeData = data.results;
      displayRecipes(recipeData);
    })
    .catch((error) => console.log('Error:', error));

  searchForm.reset();
}

// Handle click on a recipe card
function handleRecipeClick(event) {
  if (event.target.classList.contains('favorite-btn')) {
    const recipeId = event.target.dataset.id;
    const recipe = recipeData.find((recipe) => recipe.id === +recipeId);
    toggleFavorite(recipe);
  }
}

// Toggle favorite status of a recipe
function toggleFavorite(recipe) {
  const index = favoriteRecipes.findIndex((r) => r.id === recipe.id);

  if (index === -1) {
    favoriteRecipes.push(recipe);
  } else {
    favoriteRecipes.splice(index, 1);
  }

  updateFavoritesUI();
}

// Update favorites UI
function updateFavoritesUI() {
  favoritesContainer.innerHTML = '';

  if (favoriteRecipes.length === 0) {
    favoritesContainer.innerHTML = '<p>No favorite recipes yet.</p>';
    return;
  }

  favoriteRecipes.forEach((recipe) => {
    const favoriteCard = `
      <div class="favorite-card">
        <img src="${recipe.image}" alt="${recipe.title}" />
        <h3>${recipe.title}</h3>
      </div>
    `;
    favoritesContainer.innerHTML += favoriteCard;
  });
}
