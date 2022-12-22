import axios from 'axios'

const instanse = axios.create({
  baseURL: 'http://localhost:4444/'
})

export default instanse
