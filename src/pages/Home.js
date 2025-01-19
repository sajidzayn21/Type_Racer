import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInput, decrementTime, timeUp, reset } from '../redux/slices/TypingSlice';
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export default function Home() {
  
  const { originalInput,totalWords, totalTime, userInput, timeLeft, isTimeUp, level, mistake, results, minSpeed } = useSelector((state) => state.typingSpeed);
  
  const dispatch = useDispatch();
  const[typingStarted, setTypingStarted] = useState(false);
  const[showResult, setShowResult] = useState(false);

  const { width, height } = useWindowSize()

  // console.log("original Input  : ")
  // console.log(originalInput);
  


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

      dispatch(setInput(e.target.value));
      
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

  function passed() {
    return calculateSpeed() >= minSpeed;
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
          <p className='bg-gray-800 max-w-[1300px]  text-white text-xl opacity-80 tracking-wider leading-relaxed p-4 rounded-lg shadow-md' >
              
              <input
                type='text'
                value={userInput}
                onChange={changeHandler}
                disabled={isTimeUp}
                className= 'sr-only '
            
              />
              
              {
                originalInput.split('').map((char, index) => {
                  return <span key={index} 
                          className={`
                            ${index < userInput.length ? 
                              results[index] === 'correct' ? 
                              'text-gray-400' : 'text-red-500' 
                              : 'text-white  '
                            } 
                            ${index === userInput.length && typingStarted ? 'blink-underline' : ''}
                          `}
                  >
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
                  <div className='text-start'>
                      <h2 className='mb-2 mt-1 text-yellow-500 underline text-center '>Time's up!</h2>
                      {
                        passed() &&
                        <p className="text-center text-green-400">
                          Congrats! <span className="text-sky-400">You leveled up!</span>
                        </p>

                      }
                      <p className='mb-1 text-sky-400'>Your Typing Speed: <span className='text-white text-opacity-80'>{calculateSpeed()}</span><span className='ml-1 font-bold leading-3 tracking-wider text-white text-opacity-80'>WPM</span></p>
                      <p className='mb-4 text-sky-400'>Your Total Mistakes: <span className='text-white text-opacity-80'>{mistake}</span></p>
                      {
                        !passed() && 
                        <p className="text-sky-400">
                            Minimum speed required: <span className='text-white text-opacity-80'>{minSpeed}</span>
                                                    
                            <span className='ml-1 font-bold leading-3 tracking-wider text-white text-opacity-80 '>WPM</span> to advance to the next level. </p>
                      }

                      <div className='flex justify-evenly m-2 space-x-2'>
                          <button onClick={handleReset} className={` w-32 h-10 px-2 py-1 text-[#fdfcfc] bg-green-600 rounded-md text-sm  ${passed() ? `` : `mx-auto` } `}>
                              Restart Test
                          </button>
                          {
                            passed() &&
                            <button onClick={nextLevelBtn} className='w-32 h-10 px-2 py-1 text-[#fdfcfc] bg-green-600 rounded-md text-sm  '>
                              Next Level
                            </button>
                          }
                      </div>
                  
                  </div>
              </div>
          }

      </div>
 
      </div>

      {    
        passed() && showResult &&
        <Confetti
          width={width}
          height={height}
        /> 
      }

    </div>
  )
}
