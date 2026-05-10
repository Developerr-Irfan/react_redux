import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import store from './store'
import Todo from './componets/Todo'


function App() {
  const [count, setCount] = useState(0)
  return <Todo />;
}

export default App
