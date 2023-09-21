import Axios from 'axios'

export class RestApi {
  public static axios = Axios.create({
    baseURL: '',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  })

  public static getEntities(params: { format: string; forEditor: boolean }) {
    return this.axios.get('/api/entities', { params })
  }

  public static getCompanyCategories() {
    return this.axios.get('/api/company-cats?per_page=100')
  }

  public static getAllCategories() {
    return this.axios.get('/api/company-cats?per_page=1000')
  }

  public static getEvents() {
    return this.axios.get('/api/web-app/v1/events') 
  }

  public static getNews() {
    return this.axios.get('/api/web-app/v1/news')
  }
}
