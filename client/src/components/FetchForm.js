import React, { useState } from 'react';


const FetchForm = (props) => {

  const [count, setCount] = useState(9)
  const [error, setError] = useState(false)
  
  const handleInputChange = (e) => {
    e.preventDefault();
    var value = e.target.value;
    console.log(value)
    if (value < 1 || value > 20 || isNaN(parseInt(value))) {
      setError(true)
    } else {
      setError(false)
    }
    setCount(value)
    // console.log(e.target.value)
  }

  return (
    <div className="h-screen grid items-center place-items-center">
      <div className="grid mx-auto items-center place-items-center">
        {(error && count !== 0 && count !== "") && <span className="text-red-500 italic relative">Please enter a valid number between 1 and 20</span>}
        <div className="flex text-5xl font-bold tracking-wide text-gray-900 pb-6 flex-col sm:flex-row justify-center items-center">
          Give me
          <input
            className="appearance-none transition duration-400 ease-in-out block w-16 caret-transparent bg-gray-200 text-gray-700 border mx-2 rounded focus:bg-white focus:outline-none text-center"
            type="text"
            id="fname"
            value={count == 0 ? "" : count}
            onChange={handleInputChange}
            onFocus={() => setCount(0)}
          />
          sounds
        </div>
        <div className="flex text-xl text-white pb-2">
          <button
            className="font-bold bg-blue-500 transition duration-400 ease-in-out hover:bg-blue-400 py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={() => {
              (count => 1 && count <= 20) && props.fetch(count)
              setCount(0)
            }}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  )
}

export default FetchForm