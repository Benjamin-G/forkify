// Global app controller
import Search from './models/Search'

/** Global state of the app
 * -search object
 * -current recipe object
 * -shopping list object
 * -liked recipes
 */

const state = {}

const controlSearch = async () => {
  // get query TODO
  const query = 'pasta'

  if(query){
    // add search object to state
    state.search = new Search(query)

    // prepare UI for results

    // search for recipes
    await state.search.getResults()

    // render results in UI
    console.log(state.search.result)
  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault()
  controlSearch()
})

