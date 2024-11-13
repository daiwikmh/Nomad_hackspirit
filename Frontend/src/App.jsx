import { useState } from 'react'
import './index.css'
import TravelExpensePool from '../src/compoenents/ui/group'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TravelExpensePool />
    </>
  )
}

export default App
