import { elements } from './base'

export const getInput = () => elements.searchInput.value

export const clearInput = () => { elements.searchInput.value = '' }

export const clearResults = () => { elements.searchResList.innerHTML = '' }

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

export const renderResults = recipes => {
  console.log(recipes)
  recipes.forEach(renderRecipe)
}