import { View } from "./view.js";
import icons from "url:../../img/icons.svg";
class PaginationView extends View{

    _generateMarkup(data){
        this._parentElement = document.getElementById(`pagination`);
        if(!this._parentElement)return;

        const {currPage,totalPages}=data;
        if(currPage!==1 && currPage<totalPages){
            // at middle of the pages
            return`
            <button class="btn-prev page-btn" id="btn-prev" data-goto="${currPage-1}">
                <svg>
                    <use href="${icons}#icon-arrow-left"></use>
                 </svg>
                <span class="page-no">${currPage-1}</span>
            </button>

            <button class="btn-next page-btn" id="btn-next" data-goto="${currPage+1}">
                <span class="page-no">${currPage+1}</span>
                <svg>
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`
        }else if(currPage==1 && totalPages>currPage){
            // at first page & there are more pages
            return `
            <button class="btn-next page-btn" id="btn-next" data-goto="${currPage+1}">
                <span class="page-no">${currPage+1}</span>
                <svg>
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;

        }else if(currPage === totalPages && totalPages>1){
            // at last page & there are more pages
            return `
            <button class="btn-prev page-btn" id="btn-prev" data-goto="${currPage-1}">
                <svg>
                    <use href="${icons}#icon-arrow-left"></use>
                 </svg>
                <span class="page-no">${currPage-1}</span>
            </button>
            `;
        }else{
            // if there is only one page
            return ` `;
        }
        
    }
    addHandlerPagination(handler){
        this._parentElement.addEventListener(`click`,e=>{
            
            const pageBtn = e.target.closest(`.page-btn`);
            if(!pageBtn)return;
            handler(+pageBtn.dataset.goto);
        });
    }
    
}
export default new PaginationView();