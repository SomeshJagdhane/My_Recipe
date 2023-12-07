// https://forkify-api.herokuapp.com/api/v2/recipes

import * as model from "./model.js";
import searchView from "./views/searchView.js";
import searchResultView from "./views/searchResultView.js";
import paginationView from "./views/paginationView.js";
import recipeView from "./views/recipeView.js";
import savedRecipesView from "./views/savedRecipesView.js";

async function controlRecipe(){
  const recipeId = window.location.hash.slice(1);
  if(!recipeId){
    // render search result & pagination
    controlPaginationSearchResult();
    return;
  }
  recipeView.renderSpinner();

  //1. Load recipe data
  await model.loadRecipe(recipeId);

  //2. render recipe data
  recipeView.render(model.state.recipe);
}

async function controlSearchResult(query) {
 
    searchResultView.renderSpinner();
  try{
  // 1. load search result
  await model.loadSearchResult(query);
  // 2. render search result & pagination
  controlPaginationSearchResult(1);
  }catch(error){
    searchResultView.renderError(error.message);
  }
  
}
async function updateSearchResult(){
  try{
    // 1. re-load current search result
    await model.loadSearchResult(model.state.search.query);

    // 2. update search result view
    searchResultView.update(model.getResultOnPage());
      // recipeView.update(model.state.recipe);
  }catch(error){
    searchResultView.renderError(error.message);
    console.error(error)
  }

}


function controlPaginationSearchResult(pageNo) {
  
  //1. render search result
  const dataRendered = searchResultView.render(model.getResultOnPage(pageNo));

  //2. Render pagination
  if (dataRendered) {
    paginationView.render(model.state.search);

    // Make the pagination working
    paginationView.addHandlerPagination(controlPaginationSearchResult);
  }
}

async function controlSavedRecipes(recipeId){
  await model.updateSavedList(recipeId);
  const savedRecipesList = model.state.savedRecipes;
  if(Array.isArray(savedRecipesList) && savedRecipesList.length===0)
    // if savedRecipeList is empty
    savedRecipesView.renderError(`No recipe is saved`);
  else
  // if savedRecipeList is not empty
    savedRecipesView.render(savedRecipesList);
    
    await updateSearchResult();
    
}
function controlServings(newServings){
  // 1. update servings in state
  model.updateServings(newServings);

  // 2. update recipe view;
  recipeView.update(model.state.recipe);
}
function init() {
  // Show default search results
  controlSearchResult("pizza");
  
  searchView.addHandlerSearch(controlSearchResult);

  searchResultView.addHandlerSaveRecipe(controlSavedRecipes);

  recipeView.addHandlerHashChange(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);

  savedRecipesView.addHandlerOpenClose();
  savedRecipesView.addHandlerDeleteRecipe(controlSavedRecipes);
}
init();
