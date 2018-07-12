// Global app controller
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List' 
import Likes from './models/Likes' 
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from './views/base'
import { windowWhen } from 'rxjs/operators';

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

  if(query){
    // add search object to state
    state.search = new Search(query)

    // prepare UI for results
    searchView.clearInput()
    searchView.clearResults()
    renderLoader(elements.searchResult)

    // search for recipes
    try{
      await state.search.getResults()

      // render results in UI
      clearLoader()
      searchView.renderResults(state.search.result)
    }catch (err) {
      alert('Something wrong with the search')
      clearLoader()
    }
    
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

const controlRecipe = async () => {
  //Get id from URL
  const id = window.location.hash.replace('#', '')
  
  if(id){
    //Prepare UI for changes
    recipeView.clearRecipe()
    renderLoader(elements.recipe)

    //Highlight selected search item
    if(state.search){
      searchView.highlightedSelected(id)
    }

    //Create new recipe object
    state.recipe = new Recipe(id)

    try {
      //Get recipe data
      await state.recipe.getRecipe()
      state.recipe.parseIngredients()
  
      //Calc servings and time
      state.recipe.calcTime()
      state.recipe.calcServings()
  
      //Render recipe
      clearLoader()
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
    }catch (err) {
      clearLoader()
      console.log('Error with recipe')
    }
  }
}

//when hash is changed and page is loaded(saved bookmark)
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe))

/**
 * List Controller
 */

const controlList = () => {
  //Create a new list if there is none
  if(!state.list) state.list = new List()
  
  //Add each ingredients to the list and user interface
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient)
    listView.renderItem(item)
  })
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid
  //Handle the delete 
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //remove from state and UI
    state.list.deleteItem(id)

    listView.deleteItem(id)

    //Handle the count update
  } else if(e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value)
    state.list.updateCount(id, val)
  }
})

/** 
 * Like Controller 
 */
//TESTING
 state.likes = new Likes()
 likesView.toggleLikeMenu(state.likes.getNumberOfLikes())

 const controlLike = () => {
  if(!state.likes) state.likes = new Likes()

  const currentId = state.recipe.id

  //Initial like on current recipe
  if(!state.likes.isLiked(currentId)){
    //add like to state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    )

    //toggle button
    likesView.toggleLikeBtn(true)

    //add to ui list
    likesView.renderLike(newLike)
    
  } else {
    //remove like to state
    state.likes.deleteLike(currentId)

    //toggle button
    likesView.toggleLikeBtn(false)

    //remove to ui list
    likesView.deleteLike(currentId)
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes())
 }

 // Restore liked recipes on page load
 window.addEventListener('load', _ => {
   state.likes = new Likes()

   //restore likes
   state.likes.readStorage()

   //toggle like menu button
   likesView.toggleLikeMenu(state.likes.getNumberOfLikes())

   //render existing likes
   state.likes.likes.forEach(like => likesView.renderLike(like))
 })


//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  //Handles increasing servings
  if(e.target.matches('.btn-decrease, .btn-decrease *') && state.recipe.servings > 1){
    state.recipe.updateServings('dec')
    recipeView.updateServingsIngredients(state.recipe)
  } else if(e.target.matches('.btn-increase, .btn-increase *')){
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe)
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    controlList()
  } else if(e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike()
  }
 

})

/**
 * window.(variable) great way to test API and etc
 * window.l = new List()
 */

