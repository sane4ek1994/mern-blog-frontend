import { configureStore } from '@reduxjs/toolkit'
import { postsReducer } from './slice/posts'

const store = configureStore({
  reducer: {
    posts: postsReducer
  }
})

export default store
