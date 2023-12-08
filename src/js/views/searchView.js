class SearchView {
  _searchForm = document.getElementById(`search-form`);
  

  addHandlerSearch(handler) {
    this._searchForm.addEventListener(`submit`, e => {
      e.preventDefault();
      const searchInput = document.getElementById(`search-input`);
      const inputText = searchInput.value;
      if(!inputText)return;
      searchInput.blur();
      handler(inputText);
    });
  }

  addHandlerGoHome(handler){
    document.getElementById(`logo`).addEventListener(`click`,handler);
  }
  
  
}

export default new SearchView();
