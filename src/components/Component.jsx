import React, { useState } from 'react'

const Component = (props) => {
  const [number, setNumber] = useState(1);
 
  return (
    <div>
        <div> Number: {number}</div>
        <button onClick={() => {
            setNumber(number+1);
        }}>+1</button>
    </div>
  )
}

export default Component