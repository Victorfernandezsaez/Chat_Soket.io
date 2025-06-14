const apiKey = 'd073835346a046d39325ba8f9a30b47f';

loadInitialRecipes();

let currentRecipes = [];
let isLoading = false;

async function loadInitialRecipes() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML =
    '<div style="text-align:center;"><span class="loader"></span></div>';
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?number=6&addRecipeInformation=true&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = `<p>We couldn't find any recipe.</p>`;
      return;
    }

    currentRecipes = data.results;
    displayRecipes(currentRecipes);
  } catch (error) {
    resultsDiv.innerHTML = 'Fail loading the recipes. Please try again.';
    console.error(error);
  }
}

async function moreRecipies() {
  if (isLoading) return;
  isLoading = true;

  const resultsDiv = document.getElementById('results');
  const loadMoreBtn = document.getElementById('load-more-btn');

  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?number=12&apiKey=${apiKey}`
    );

    const data = await response.json();
    currentRecipes = [...currentRecipes, ...data.recipes];
    appendNewRecipies(data.recipes);
  } catch (error) {
    resultsDiv.innerHTML = 'Error loading more recipes.';
    console.error(error);
  } finally {
    isLoading = false;
    if (loadMoreBtn) loadMoreBtn.disabled = false;
  }
}

function appendNewRecipies(recipes) {
  const resultsDiv = document.getElementById('results');
  const newRecipesHTML = recipes
    .map(
      (recipe) => `
    <div class="recipe" onclick="showRecipeDetails(${recipe.id})">
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" loading="lazy"/>
    </div>
  `
    )
    .join('');
  resultsDiv.insertAdjacentHTML('beforeend', newRecipesHTML);
}

async function searchRecipes() {
  const query = document.getElementById('search').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Results...';

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=6&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = 'Fail loading the recipes. Please try again.';
      return;
    }

    // Fetch detailed info for each result
    const detailedRecipes = await Promise.all(
      data.results.map(async (recipe) => {
        const detail = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${apiKey}`
        );
        return await detail.json();
      })
    );

    displayRecipes(detailedRecipes);
  } catch (error) {
    resultsDiv.innerHTML = 'Fail searching the recipes. Please try again.';
    console.error(error);
  }
}

function displayRecipes(recipes) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = recipes
    .map(
      (recipe) => `
    <div class="recipe" onclick="showRecipeDetails(${recipe.id})">
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" loading="lazy"/>
    </div>
  `
    )
    .join('');
}

async function showRecipeDetails(recipeId) {
  const detailsDiv = document.getElementById('recipe-details');
  detailsDiv.innerHTML =
    '<div style="text-align:center; padding: 2rem;"><span class="loader"></span></div>';

  try {
    // Fetch recipe information (includes ingredients)
    const infoResponse = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${apiKey}`
    );
    const recipeInfo = await infoResponse.json();

    // Fetch instructions
    const stepsResponse = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apiKey}`
    );
    const stepsData = await stepsResponse.json();
    const steps = stepsData[0]?.steps || [];

    // Ingredients
    const ingredientsHTML = recipeInfo.extendedIngredients
      .map((ing) => `<li>${ing.original}</li>`)
      .join('');

    // Instructions
    const stepsHTML =
      steps.length > 0
        ? steps.map((step) => `<li>${step.step}</li>`).join('')
        : '<li>Keine Zubereitungsschritte gefunden.</li>';

    detailsDiv.innerHTML = `
        <h2>${recipeInfo.title}</h2>
        <img src="${recipeInfo.image}" alt="${recipeInfo.title}" style="max-width:100%; border-radius: 8px;"/>
        <h3>Zutaten</h3>
        <ul>${ingredientsHTML}</ul>
        <h3>Zubereitung</h3>
        <ol>${stepsHTML}</ol>
      `;

    document.getElementById('modal').classList.remove('hidden');
  } catch (error) {
    console.error('Fehler beim Laden der Rezeptdetails:', error);
    detailsDiv.innerHTML = '<p>Fehler beim Laden der Rezeptdetails.</p>';
  }
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('recipe-details').innerHTML = '';
}

window.searchRecipes = searchRecipes;
window.moreRecipies = moreRecipies;
window.showRecipeDetails = showRecipeDetails;
window.closeModal = closeModal;
