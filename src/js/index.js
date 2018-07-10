// Global app controller
import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app
 * -search object
 * -current recipe object
 * -shopping list object
 * -liked recipes
 */

const state = {}

/** 
 * Search Controller 
 */
const controlSearch = async () => {
  const query = searchView.getInput()
  console.log(query)

  if(query){
    // add search object to state
    state.search = new Search(query)

    // prepare UI for results
    searchView.clearInput()
    searchView.clearResults()
    renderLoader(elements.searchResult)

    // search for recipes
    await state.search.getResults()

    // render results in UI
    clearLoader()
    searchView.renderResults(state.search.result)
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault()
  controlSearch()
})

//Control pagination button
elements.serachResPages.addEventListener('click', e => {
  //Handles click anywhere on target button
  const btn = e.target.closest('.btn-inline')
  if(btn) {
    // <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    const goToPage = parseInt(btn.dataset.goto, 10) 
    searchView.clearResults()
    searchView.renderResults(state.search.result, goToPage)
  }
})



/** 
 * Recipe Controller 
 * grabs the hash(id) then uses that information for an async call to the API
 */
const controlRecipe = () => {
  const id = window.location.hash
  console.log(id)
}

window.addEventListener('hashchange', controlRecipe)