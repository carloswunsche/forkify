/* -------------------- IMPORTS -------------------- */
// Import all variables as "model" from model.js
import * as model from './model';

// Configs
import { MODAL_CLOSE_SEC } from './config';

// Importing Views
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

// This one is for polyfilling async/await
import 'regenerator-runtime/runtime';
// This one is for polyfilling everything else
import 'core-js/stable';

// Parcel necessary stuff ?
// if (module.hot) {
//   module.hot.accept();
// }

/* ------------------ CONTROLLERS ------------------ */

const controlRecipes = async function () {
  try {
    /* ------ 1) GETTING ID AND RENDERING SPINNER ------ */
    // Get the id from the url hash (remove hash character using .slice)
    const id = window.location.hash.slice(1);
    // Guard close if there's no id
    if (!id) return;
    // Render spinner before start loading
    recipeView.renderSpinner();

    /* --------- 2) UPDATE RESULTS VIEW TO MARK -------- */
    /* ----------------- SEARCH RESULT ----------------- */
    resultsView.update(model.getSearchResultsPage());

    /* ---------- 3) UPDATING BOOKMARKS VIEW ----------- */
    bookmarksView.update(model.state.bookmarks);

    /* --------------- 4) LOADING RECIPE --------------- */
    /** loadrecipe returns a promise, so that's actually great to
     * block execution by await that promise (possible because we
     * are inside an async funtion)
     */
    const res = await model.loadRecipe(id);

    /* -------------- 5) RENDERING RECIPE --------------- */
    recipeView.render(model.state.recipe);

    /* -------------- 6) HANDLING ERRORS ---------------- */
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Getting query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Sending query to the model to load results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in the state)
  model.udpateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
    //
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

/* ------------------ INITIALIZE ------------------ */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
