import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://api.beta.mysimplaq.com/api/web-app/v1'
})

export default axiosClient