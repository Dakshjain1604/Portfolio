import './App.css'
import { AboutMe } from './pages/AboutPage'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import { HomePage } from './pages/HomePage'
import { Contact } from './pages/Contact'
import { ProjectPage } from './pages/ProjectPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/About" element={<AboutMe/>}></Route>
        <Route path="/Contacts" element={<Contact/>}></Route>
        {/* <Route path="/Projects" element={<ProjectPage/>}></Route> */}
      </Routes>
    </Router>
  )
}

export default App
