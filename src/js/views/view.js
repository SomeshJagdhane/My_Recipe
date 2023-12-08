import icons from "url:../../img/icons.svg";
export class View {
  _data = ``;
  _parentElement = ``;

  renderSpinner() {
    const markup = `
        <svg class="spinner" id="spinner">
            <use href="${icons}#icon-loader"></use>
        </svg>
        `;
    this._clear(this._parentElement);
    this._parentElement.insertAdjacentHTML(`afterBegin`, markup);
  }

  render(data = this._data, renderSavedRecipes = false) {
    this._data = data;
    if (!renderSavedRecipes) {
      // if renderSavedRecipes is true then skip this if block
      if (!data || (Array.isArray(data) && data.length === 0)) return;
    }

    const markup = this._generateMarkup(data);
    this._clear(this._parentElement);
    this._parentElement.insertAdjacentHTML(`afterBegin`, markup);
    const dataRendered = true;
    return dataRendered;
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(data);
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDom.querySelectorAll(`*`);
    const currElements = this._parentElement.querySelectorAll(`*`);

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];

      if (!newEl.isEqualNode(currEl) && currEl.firstChild) {
        // Replace the text content
        currEl.firstChild.nodeValue = newEl.firstChild.nodeValue;
      }
      if (!newEl.isEqualNode(currEl)) {
        // Replace the attributes
        [...newEl.attributes].forEach((attribute) => {
          currEl.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }

  _clear(element) {
    element.innerHTML = ``;
  }
  renderError(error) {
    const errorMarkup = `
    <div class="error" id="error">
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
      <p class="error-msg" id="error-msg">${error}</p>
    </div>
        `;
    this._clear(this._parentElement);

    this._parentElement.insertAdjacentHTML(`afterBegin`, errorMarkup);
  }
  closeWindow(){
    this._parentElement.classList.add(`hidden`);
  }
  openWindow(){
    this._parentElement.classList.remove(`hidden`);
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
