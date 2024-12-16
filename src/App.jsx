import "./App.css"
import Categories from './pages/Categories/Categories'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Category from './pages/Category/Category'
import Home from './pages/Home/Home'
import Meal from './pages/SingleMeal/Meal'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      
      <Route path='/' element={<Home/>}/>
      <Route path='/explore' element={<Categories/>}/>
      <Route path='category/:category' element={<Category/>}/>
      <Route path='meal/:id' element={<Meal/>}/>
    </Routes>  
    </BrowserRouter>
  )
}

export default App