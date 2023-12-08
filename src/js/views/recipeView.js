import { View } from "./view.js";
import icons from "url:../../img/icons.svg";
import { Fraction } from "fractional";

class RecipeView extends View {
  _parentElement = document.getElementById(`recipe-view`);

  _generateMarkup(data) {
    const markup = `
      <div class="btn-close-window" id="btn-close-window">
        <svg>
          <use href="${icons}#icon-close"></use>
        </svg>
      </div>
        <section class="recipe ${data.saved ? "saved" : ""}" data-id="${
      data.id
    }">
        <img
          src="${data.imageUrl}"
          alt="recipe-img"
          class="recipe-img"
        />
        <div class="recipe-desc">
          <h2 class="recipe-title" id="recipe-title">${data.title}</h2>
          <div class="recipe-top">
            <div class="recipe-top-left">
              <div class="cooking-time" id="cooking-time">
                <svg>
                  <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="minuts">${data.cookingTime} min</span>
              </div>
              <div class="recipe-servings">
                <svg>
                  <use href="${icons}#icon-users"></use>
                </svg>
                <span class="people">${data.servings}</span>
                <svg class="btn-update-servings" data-new-serving=${
                  data.servings - 1
                }>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
                <svg class="btn-update-servings" data-new-serving=${
                  data.servings + 1
                }>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </div>
            </div>
            <div class="recipe-top-right">
              <div class="btn-save-recipe"  title="${
                data.saved ? "Remove from saved list" : "Save this recipe"
              }">
                <svg>
                 <use href="${icons}#icon-bookmark-fill"></use>
                </svg>
              </div>
              
            </div>
          </div>

          <div class="recipe-ing">
            <h3>Ingredients</h3>
            <ul class="ing-list">
              
              ${this._generateIngMarkup(data)}
              
            </ul>
          </div>
          <p>Published by <span class="recipe-publisher">${
            data.publisher
          }</span></p>
          <a class="btn-get-direction" id="btn-get-direction" href="${
            data.sourceUrl
          }" target="_blank">
            Get Direction
          </a>
        </div>
      </section>
        `;
    return markup;
  }

  _generateIngMarkup(data) {
    return data.ingredients
      .map((ing) => {
        return `
        <li class="ing-item">
        <svg>
          <use href="${icons}#icon-check"></use>
        </svg>
        <span class="ing-qty">${
          ing.quantity ? new Fraction(ing.quantity).toString() : ""
        }</span>
        <span class="ing-unit">${ing.unit || ""}</span>
        <span class="ing">${ing.description}</span>
      </li>
        `;
      })
      .join(``);
  }

  addHandlerHashChange(handler) {
    window.addEventListener(`hashchange`, handler);
  }
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener(`click`, (event) => {
      const btnUpdateServings = event.target.closest(`.btn-update-servings`);
      if (!btnUpdateServings) return;
      const newServings = +btnUpdateServings.dataset.newServing;
      if (newServings > 0) handler(newServings);
    });
  }
  _bindCloseWindow(event) {
    const btnCloseWindow = event.target.closest(`.btn-close-window`);
  }
  addHandlerCloseWindow(handler) {
    this._parentElement.addEventListener(`click`, (event) => {
      const btnCloseWindow = event.target.closest(`.btn-close-window`);
      if(!btnCloseWindow)return;
      handler();
    });
  }
}
export default new RecipeView();
