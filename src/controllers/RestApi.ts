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

  public static getNews() {
    return this.axios.get('/api/web-app/v1/news')
  }
  public static getNewsById(id: number) {
    return this.axios.get(`/api/web-app/v1/news/${id}`)
  }

  public static getEvents() {
    return this.axios.get('/api/web-app/v1/events')
  }

  public static getAmentities() {
    return this.axios.get('/api/web-app/v1/amenities')
  }

  public static getRewards() {
    return this.axios.get("/api/web-app/v1/rewards")
  }

  public static getAmenities() {
    return this.axios.get("/api/web-app/v1/floorplan/entities")
  }
}