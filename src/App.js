import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'

import Home from './components/pages/Home';
import Company from './components/pages/Company';
import Contact from './components/pages/Contact';
import NewProject from './components/pages/NewProject';
import Projects from './components/pages/Projects';

import Container from './components/Layout/Container';
import NavBar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Project from './components/pages/Project';

function App() {
  return (
    <BrowserRouter>

      <NavBar/>

      <Container customClass='minHeight'>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/projects' element={<Projects />}/>
          <Route path='/company' element={<Company />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='/newproject' element={<NewProject/>}/>
          <Route path='/project/:id' element={<Project/>}/>
        </Routes>
      </Container>

      <Footer/>

    </BrowserRouter>
  );
}

export default App;
