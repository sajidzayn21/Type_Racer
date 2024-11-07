import { createSlice } from "@reduxjs/toolkit";
import TextLevel from "./TextLevel.json"

const initialState = {
    userInput: '',
    level:0,
    totalLevels : TextLevel.levels.length,
    originalInput: TextLevel.levels[0].texts[0],
    mistake: 0,
    timeLeft: TextLevel.levels[0].timeLimitSeconds,
    totalTime: TextLevel.levels[0].timeLimitSeconds,
    isTimeUp : false,
    results:[],
    totalWords:0,
}

console.log("initial state")
  console.log(initialState);
  console.log("original Input inside slice : ")
  console.log(initialState.originalInput);


export const TypingSlice = createSlice({
    name:"typingSpeed",
    initialState,
    reducers:{
        setInput : (state, action) => {
            const newInput = action.payload;
            const orgInput = state.originalInput.slice(0, newInput.length);
            const res = newInput.split('').map((char, index) => {
                return char === orgInput[index] ? 'correct' : 'incorrect';
            });
            const total = newInput.split(' ').filter(word => word !== '').length;
            state.totalWords = total;
            state.userInput = newInput;
            state.results = res;
            state.mistake = res.filter(result => result === 'incorrect').length;
        },

        timeUp : (state) => {
            state.isTimeUp = true;
        },

        decrementTime : (state) => {
            if(state.timeLeft > 0) {
                state.timeLeft -= 1;
            }
            else state.isTimeUp = true;
        },

        reset : (state, action) => {
            state.userInput = '';
            state.isTimeUp = false;
            state.mistake = 0;

            if(action.payload) {
                state.level= (state.level+1) % TextLevel.levels.length;
            }
            
            let x = state.level;
            state.timeLeft = TextLevel.levels[x].timeLimitSeconds;
            state.originalInput = TextLevel.levels[x].texts[0];
            state.results = [];
            state.totalTime = TextLevel.levels[x].timeLimitSeconds
            state.totalWords = 0;
        }

    }
})

export const {setInput, decrementTime, timeUp, reset} = TypingSlice.actions;
export default TypingSlice.reducer;