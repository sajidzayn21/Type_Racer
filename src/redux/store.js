import { configureStore } from '@reduxjs/toolkit'
import  TypingSlice  from './slices/TypingSlice'


export default configureStore({
  reducer: {
    typingSpeed: TypingSlice,
  }
})