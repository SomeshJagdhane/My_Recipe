import { View } from "./view.js";
import icons from "url:../../img/icons.svg";

class SavedRecipesView extends View{
    _savedRecipesPanel = document.getElementById(`saved-recipes`);
    _showRecipeListBtn = document.getElementById(`btn-saved-recipe`);
    _parentElement= document.getElementById(`saved-recipes-list`);
    _generateMarkup(data){
        
        const markup = data.map(this._generateRecipeInfo).join(``);
        return markup;
    }
    _generateRecipeInfo(data){
        if(Array.isArray(data) && data.length===0){
            // if saved recipe list is empty
            console.log(`Saved list is empty`);
            return `
            <li class="saved-recipe">
                <p>No recipe is saved</p>  
            </li>
            `;
            
        }
        const hash = window.location.hash.slice(1);
        return `
        <li class="saved-recipe ${hash===data.id ? 'active-saved-recipe' : ''}" data-id="${data.id}">
            <div class="btn-delete" title="Delete this saved recipe">
                <svg>
                    <use href="${icons}#icon-close"></use>
                </svg>
            </div>
            <a href="#${data.id}">
        
            
            <img
              src="${data.imageUrl}"
              alt=""
              class="saved-recipe-img"
            />
            <div class="saved-recipe-info">
              <h4 class="saved-recipe-title">${data.title}</h4>
              <p>
                Published by
                <span class="saved-recipe-publisher">${data.publisher}</span>
              </p>
         </div>
      
        </a>
     </li>
    `;
    }

    
    _closeSavedRecipes(event){
        const closeBtn = event.target.closest(`#btn-close-saved-list`);
        if(!closeBtn)return;
        this._savedRecipesPanel.classList.toggle(`opened`);
    }
    _showSavedRecipes(){
        this._savedRecipesPanel.classList.toggle(`opened`);
    }
    addHandlerOpenClose(){
        this._savedRecipesPanel.addEventListener(`click`,this._closeSavedRecipes.bind(this));
        
        this._showRecipeListBtn.addEventListener(`click`,this._showSavedRecipes.bind(this));
    }
    addHandlerDeleteRecipe(handler){
        this._parentElement.addEventListener(`click`,event=>{
            const deleteBtn = event.target.closest(`.btn-delete`);
            if(!deleteBtn)return;
            const recipeToDelete = deleteBtn.closest(`.saved-recipe`);
            const idToDelete = recipeToDelete.dataset.id;
            handler(idToDelete);
        });
    }
}
export default new SavedRecipesView();