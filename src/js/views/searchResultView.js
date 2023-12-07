import { View } from "./view.js";
import icons from "url:../../img/icons.svg";

class SearchResultView extends View{
    _parentElement = document.getElementById(`search-results`);
    _generateMarkup(data){

        const markup =`
        <ul class="recipe-list" id="recipe-list">
            ${data.map(this._generateRecipeInfo).join(``)}
        </ul>
        <section class="pagination" id="pagination">
        </section>
        `;
        return markup;
    }
    _generateRecipeInfo(data){
        return `
        <li class="recipe-info ${data.saved?"saved":""}" data-id="${data.id}">
        <a href="#${data.id}">
            <img src="${data.imageUrl}" alt="" class="recipe-info-img">
            <div class="recipe-info-content">
                <h3 class="recipe-info-title">${data.title}</h3>
                <p>published by <span class="recipe-info-publisher">${data.publisher}</span></p>
            </div>
            
        </a>
        <div class="btn-save-recipe" title="${data.saved ? "Remove from saved list":"Save this recipe"}">
            <svg>
                <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
        </div>
    </li>
        `
    }
    addHandlerSaveRecipe(handler){
        this._parentElement.addEventListener(`click`,e=>{
            const saveBtn = e.target.closest(`.btn-save-recipe`);
            if(!saveBtn)return;

            const recipeInfo = saveBtn.closest(`[data-id]`);
            const recipeId = recipeInfo.dataset.id;
            recipeInfo.classList.toggle(`saved`);
            handler(recipeId);
        });
    }

    
    
}
export default new SearchResultView();