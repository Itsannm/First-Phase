const searchBtn = document.getElementById('search-btn');
const searchInput = document.querySelector('input[type="text"]');
const recipeContainer = document.getElementById('recipe-container');
const perPage = 3; // Number of recipes to display per page
let currentPage = 1; // Current page of results

// Add event listener to search button
searchBtn.addEventListener('click', searchRecipes);

// Function to search for recipes
function searchRecipes() {
  const userInput = searchInput.value;
  const apiKey = 'd40b55e0b55f4099b859b04b2533d17a';
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${userInput}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const recipes = data.results.slice(startIndex, endIndex);
      displayRecipes(recipes);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Function to display the recipe results on the page
function displayRecipes(recipes) {
  recipeContainer.innerHTML = '';

  for (let i = 0; i < recipes.length; i++) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.innerHTML = `
      <img src="${recipes[i].image}" alt="${recipes[i].title}" />
      <h3>${recipes[i].title}</h3>
      
    `;

    recipeCard.addEventListener('click', () => {
      showRecipeDetails(recipes[i].id);
    });

    recipeContainer.appendChild(recipeCard);
  }
}

// Function to show recipe details
function showRecipeDetails(recipeId) {
  const apiKey = 'd40b55e0b55f4099b859b04b2533d17a';
  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const recipeImage = document.createElement('img');
      recipeImage.src = data.image;
      recipeImage.alt = data.title;

      const recipeTitle = document.createElement('h3');
      recipeTitle.textContent = data.title;

      const recipeDetails = document.createElement('div');
      recipeDetails.innerHTML = `
        <h4>Ready in ${data.readyInMinutes} minutes</h4>
        <p>Servings: ${data.servings}</p>
        <h4>Ingredients:</h4>
        <ul>
          ${data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
        </ul>
        <h4>Method:</h4>
        <ol>
          ${data.analyzedInstructions[0].steps.map(step => `<li>${step.step}</li>`).join('')}
        </ol>
        <button class="download-btn">Download</button>
      `;

      const downloadButton = recipeDetails.querySelector('.download-btn');
      downloadButton.addEventListener('click', () => {
        downloadRecipe(data);
      });

      recipeContainer.innerHTML = '';
      recipeContainer.appendChild(recipeImage);
      recipeContainer.appendChild(recipeTitle);
      recipeContainer.appendChild(recipeDetails);
    })
    .catch(error => {
      console.log('Error:', error);
});
}

// Function to handle pagination navigation
function goToPage(page) {
  currentPage = page;
  searchRecipes();
}

// Function to save a recipe
function saveRecipe(recipe) {
  const savedRecipes = getSavedRecipes();
  savedRecipes.push(recipe);
  saveRecipesLocally(savedRecipes);
  console.log('Recipe saved:', recipe);
}

// Function to get saved recipes from local storage
function getSavedRecipes() {
  const savedRecipesData = localStorage.getItem('savedRecipes');
  if (savedRecipesData) {
    return JSON.parse(savedRecipesData);
  }
  return [];
}

// Function to save recipes to local storage
function saveRecipesLocally(savedRecipes) {
  localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
}

// Function to download a recipe as a JSON file
function downloadRecipe(recipe) {
  const recipeData = JSON.stringify(recipe);
  const blob = new Blob([recipeData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${recipe.title}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Call the function to load saved recipes on page load
loadSavedRecipes();

const recipeForm = document.getElementById('recipe-form');

// Add event listener to recipe form
recipeForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission

  // Get user input from the form inputs
  const recipeInput = document.getElementById('recipe-input');
  const instructionsInput = document.getElementById('instructions-input');
  const title = titleInput.value;
  const instructions = instructionsInput.value;

  // Call the createRecipe function
  createRecipe(title, instructions);
});

// Function to create a recipe
function createRecipe(title, instructions) {
  const apiKey = 'd40b55e0b55f4099b859b04b2533d17a'; 

  const apiUrl = 'https://api.spoonacular.com/recipes/visualizeRecipe';
  const formData = new FormData();
  formData.append('title', title);
  formData.append('instructions', instructions);
  formData.append('apiKey', apiKey);

  // Send a POST request to the API
  fetch(apiUrl, {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log('Recipe created:', data);
      // Handle the response and perform any necessary actions
    })
    .catch(error => {
      console.log('Error:', error);
      // Handle the error
    });
}


    