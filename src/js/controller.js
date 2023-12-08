// https://forkify-api.herokuapp.com/api/v2/recipes

import * as model from "./model.js";
import searchView from "./views/searchView.js";
import searchResultView from "./views/searchResultView.js";
import paginationView from "./views/paginationView.js";
import recipeView from "./views/recipeView.js";
import savedRecipesView from "./views/savedRecipesView.js";

async function controlRecipe(recipeId = "5ed6604591c37cdc054bcd09") {
  // close search result view & open recipe view
  openRecipeView();
 
  recipeView.renderSpinner();
  try{
  //1. Load recipe data
  await model.loadRecipe(recipeId);

  //2. render recipe data
  recipeView.render(model.state.recipe);
  }catch(error){
    recipeView.render(error.message);
  }
}

async function controlSearchResult(query) {
  // close recipe view & open search result view
  openSearchResultView();

  searchResultView.renderSpinner();
  try {
    // 1. load search result
    await model.loadSearchResult(query);
    // 2. render search result & pagination
    controlPaginationSearchResult(1);
  } catch (error) {
    searchResultView.renderError(error.message);
  }
}
async function updateSearchResult() {
  try {
    // 1. re-load current search result
    await model.loadSearchResult(model.state.search.query);

    // 2. update search result view
    searchResultView.update(model.getResultOnPage());
  } catch (error) {
    searchResultView.renderError(error.message);
    console.error(error);
  }
}

async function updateRecipe() {
  try {
    // 1. re-load current recipe
    await model.loadRecipe(model.state.recipe.id);

    // 2. update recipe view
    recipeView.update(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error.message);
    console.error(error);
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

async function controlSavedRecipes(recipeId) {
  await model.updateSavedList(recipeId);
  const savedRecipesList = model.state.savedRecipes;
  if (Array.isArray(savedRecipesList) && savedRecipesList.length === 0)
    // if savedRecipeList is empty
    savedRecipesView.renderError(`No recipe is saved`);
  // if savedRecipeList is not empty
  else savedRecipesView.render(savedRecipesList);

  updateSearchResult();
  updateRecipe();
}
function controlServings(newServings) {
  // 1. update servings in state
  model.updateServings(newServings);

  // 2. update recipe view;
  recipeView.update(model.state.recipe);
}
function controlHashChange(){
  const recipeId = window.location.hash.slice(1);
  if(recipeId)
    controlRecipe(recipeId);
  else
    controlSearchResult(model.state.search.query);
}

function openRecipeView(){
  searchResultView.closeWindow();
  recipeView.openWindow();
  //In savedRecipeList mark the recipe which is currently opened in recipe view 
  savedRecipesView.render(model.state.savedRecipes);
}
function openSearchResultView(){
  history.replaceState(null, null, ' ');
  recipeView.closeWindow();
  searchResultView.openWindow();

  //In savedRecipeList unmark all the recipes 
  savedRecipesView.render(model.state.savedRecipes);
}
function init() {
  // Show default search results
  controlSearchResult("pizza");

  // show default recipe info
  controlRecipe();
  openSearchResultView();

  // initial render saved recipes list
 // savedRecipesView.render(model.state.savedRecipes);

  searchView.addHandlerSearch(controlSearchResult);

  searchResultView.addHandlerSaveRecipe(controlSavedRecipes);

  recipeView.addHandlerHashChange(controlHashChange);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerSaveRecipe(controlSavedRecipes);
  recipeView.addHandlerCloseWindow(openSearchResultView);

  savedRecipesView.addHandlerOpenClose();
  savedRecipesView.addHandlerDeleteRecipe(controlSavedRecipes);
}
init();
