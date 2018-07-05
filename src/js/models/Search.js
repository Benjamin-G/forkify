import axios from "axios"

export default class Search {
  constructor(query){
    this.query = query
  }
  
  async getResults() {
    const key = "75d103387ce87f014da86a0e69e3fd1c"

    try {
      const res = await axios(`https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=${key}&q=${this.query}`)

      this.result = res.data.recipes

    } catch (err) {
      alert(err)
    }
  }  
}
