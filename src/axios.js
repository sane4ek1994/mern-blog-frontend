import axios from 'axios'

const instanse = axios.create({
  baseURL: 'http://localhost:4444/'
})

instanse.interceptors.request.use(config => {
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})

export default instanse
