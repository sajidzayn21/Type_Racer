import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInput, decrementTime, timeUp, reset } from '../redux/slices/TypingSlice';

export default function Home() {
  
  const { originalInput,totalWords, totalTime, userInput, timeLeft, isTimeUp, level, mistake, results } = useSelector((state) => state.typingSpeed);
  
  const dispatch = useDispatch();
  const[typingStarted, setTypingStarted] = useState(false);
  const[showResult, setShowResult] = useState(false);

  console.log("original Input  : ")
  console.log(originalInput);
  

  useEffect(() => {
    let timer;
    if (typingStarted && timeLeft > 0) {
        timer = setInterval(() => {
            dispatch(decrementTime());
        }, 1000);
    } else if (timeLeft === 0) {
        dispatch(timeUp());
        setShowResult(true);
        clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [typingStarted, timeLeft, dispatch]);

  

  function changeHandler(e)  {
      if(!typingStarted) setTypingStarted(true);
      if(isTimeUp) return;

      dispatch(setInput(e.target.value))
  }

  function handleReset() {
    dispatch(reset())
    setTypingStarted(false);
    setShowResult(false);
  }
  function nextLevelBtn() {
    dispatch(reset({ payload: true }));
    setTypingStarted(false);
    setShowResult(false);
  }

  function calculateSpeed() {
    const wpm = (totalWords / totalTime) * 60;
    return Math.round(wpm);
  }

  return (
    <div className='flex flex-col h-screen relative bg-[#161D29] ' >
      
      <div className='bg-[#161D29] min-h-screen' >

      <div className='flex justify-center items-center flex-col text-yellow-500 mt-2 text-lg ' >
          <h1>Speed Test Level : {level+1} </h1>
          <div>Time {typingStarted ? `left` : ''} : {timeLeft}s </div>
      </div>

      <label className="flex flex-col items-center justify-center space-y-4 p-4 bg-[#161D29]  ">
          {/* <span className='flex' >{timeLeft}s </span> */}
          <p className='bg-gray-800 max-w-[1300px]  text-white text-xl opacity-70 tracking-wider leading-relaxed p-4 rounded-lg shadow-md' >
              
              <input
                type='text'
                value={userInput}
                onChange={changeHandler}
                disabled={isTimeUp}
                className= 'sr-only '
            
              />
              
              {
                originalInput.split('').map((char, index) => {
                  return <span key={index} className={index < userInput.length ? 
                    results[index] === 'correct' ? 'text-gray-500' : 'text-red-500'
                    : 'text-white' } >
                    {char}
                  </span>
                })
              }

    
          </p>
      </label>
    

      <div className={`bg-[#161D29] min-h-screen flex items-center justify-center ${showResult?``:'hidden'}  `}>
          {
              showResult &&
              <div className='px-4 bg-[#2C333F] text-[1.2rem] text-white text-opacity-80 flex flex-col items-center justify-center 
                  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] 
                  h-[40%] sm:h-[50%] md:h-[45%] lg:h-[40%] 
                  mx-auto rounded-md'>
                  <div className='text-center'>
                      <h2 className='mb-2 mt-5'>Time's up!</h2>
                      <p className='mb-2'>Your Typing Speed: {calculateSpeed()}<span className='ml-1 font-bold leading-3 tracking-wider'>WPM</span></p>
                      <p className='mb-2'>Your Total Mistakes: {mistake}</p>

                      <div className='flex justify-evenly m-2 space-x-2'>
                          <button onClick={handleReset} className='w-32 h-10 px-2 py-1 text-[#fdfcfc] bg-green-600 rounded-md text-sm '>
                              Restart Test
                          </button>
                          <button onClick={nextLevelBtn} className='w-32 h-10 px-2 py-1 text-[#fdfcfc] bg-green-600 rounded-md text-sm  '>
                              Next Level
                          </button>
                      </div>
                  </div>
              </div>
          }
      </div>

      
      </div>

    </div>
  )
}
