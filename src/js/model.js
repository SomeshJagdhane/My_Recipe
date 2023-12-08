import { API_URL, RESULT_PER_PAGE } from "./config.js";
import { getJson } from "./helper.js";
export const state = {
  recipe: {},
  search: {
    query: ``,
    resultArr: [],
    currPage: 1,
    totalPages: 1,
  },
  // savedRecipes: [],
  savedRecipes: JSON.parse(localStorage.getItem(`savedRecipes`)) || [],
};
function persistSavedRecipes(){
  localStorage.setItem(`savedRecipes`,JSON.stringify(state.savedRecipes));
}
function createRecipe(recipe) {
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    publisher: recipe.publisher,
    saved:isRecipeSaved(recipe.id)
  };
}
export async function loadRecipe(id, saveToSavedList = false) {
  try {
    const recipeData = await getJson(`${API_URL}${id}`);
    if(!recipeData.data)return;
    const { recipe } = recipeData.data;

    if (saveToSavedList) return createRecipe(recipe); // only for saving the recipe 
    else state.recipe = createRecipe(recipe);
  } catch (error) {
    console.log(error);
    throw error(error);
  }
}
export async function loadSearchResult(query) {
  try {
    const data = await getJson(`${API_URL}?search=${query}`);
    const { recipes } = data.data;
    if (recipes.length === 0) throw new Error(`No result found for "${query}"`);
    state.search.query = query;
    state.search.resultArr = recipes.map(createRecipe);
  } catch (error) {
    throw error;
  }
}
export function getResultOnPage(pageNo = state.search.currPage) {
  const start = pageNo * RESULT_PER_PAGE - RESULT_PER_PAGE;
  const end = start + RESULT_PER_PAGE;
  state.search.currPage = pageNo;
  state.search.totalPages = Math.ceil(
    state.search.resultArr.length / RESULT_PER_PAGE
  );
  return state.search.resultArr.slice(start, end);
}

export async function updateSavedList(recipeId) {
  // Check if recipe is already saved
  if (isRecipeSaved(recipeId)) {
    // Delete the recipe from saved list
    const indexSavedRecipe = state.savedRecipes.findIndex(
      (recipe) => recipe.id === recipeId
    );
    state.savedRecipes.splice(indexSavedRecipe, 1);
  } else {
    // Add recipe to saved list
    const recipeToSave = await loadRecipe(recipeId, true);
    recipeToSave.saved=true;
    state.savedRecipes.push(recipeToSave);

  }
  
  // update the saved recipes in local storage
  persistSavedRecipes();
  console.log(state.savedRecipes);
}

export function updateServings(newServings){
  // update the quantity of each ingredient accordinglly with new servings
  state.recipe.ingredients.forEach(ing=>{
    ing.quantity = (ing.quantity * newServings)/state.recipe.servings;
  });
  
  state.recipe.servings = newServings;
}

function isRecipeSaved(recipeId) {
  return state.savedRecipes.some((recipe) => recipe.id === recipeId);
}
