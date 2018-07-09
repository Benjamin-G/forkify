import { elements } from './base'
import { elementAt } from 'rxjs/operators';

export const getInput = () => elements.searchInput.value

export const clearInput = () => { elements.searchInput.value = '' }

export const clearResults = () => { 
  elements.searchResList.innerHTML = '' 
  elements.serachResPages.innerHTML = ''
}

//Reduce the title length to a single line
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = []

  if(title.length > limit){
    title
    .split(' ')
    .reduce((acc, ele) => {
      if(acc + ele.length <= limit){
        newTitle.push(ele)
      }
      return acc + ele.length
    }, 0)

    return `${newTitle.join(' ')}...`
  }
  return title
}

//Renders individual recipes
const renderRecipe = recipe => {
  const markup = `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
  </li>`

  elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

//Buttons (type === 'prev' || 'next')
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage)
  let button
  if(page === 1){
    //only button to go to next page
    button = createButton(page, 'next')
  }else if(page < pages){
    //both buttons
    button = `
      ${createButton(page, 'next')}
      ${createButton(page, 'prev')}
    `
  }else if(page === pages){
    //only button to go to previous page
    button = createButton(page, 'prev')
  }

  elements.serachResPages.insertAdjacentHTML('afterbegin', button)
}

//Renders recipe as a list with pagination 
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage
  const end = page * resPerPage

  recipes.slice(start, end).forEach(renderRecipe)

  // Pagination buttons
  renderButtons(page, recipes.length, resPerPage)
}