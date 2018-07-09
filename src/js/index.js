// Global app controller
import Search from './models/Search'
import * as searchView from './views/searchView'
import { elements } from './views/base'

/** Global state of the app
 * -search object
 * -current recipe object
 * -shopping list object
 * -liked recipes
 */

const state = {}

const controlSearch = async () => {
  // get query TODO
  const query = searchView.getInput()
  console.log(query)

  if(query){
    // add search object to state
    state.search = new Search(query)

    // prepare UI for results
    searchView.clearInput()
    searchView.clearResults()

    // search for recipes
    await state.search.getResults()

    // render results in UI
    searchView.renderResults(state.search.result)
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault()
  controlSearch()
})

