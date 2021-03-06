import axios from "axios"
import { key } from "../config"

export default class Search {
  constructor(query){
    this.query = query
  }
  
  async getResults() {
    try {
      const res = await axios(`https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=${key}&q=${this.query}`)

      this.result = res.data.recipes

    } catch (err) {
      alert(err)
    }
  }  
}
