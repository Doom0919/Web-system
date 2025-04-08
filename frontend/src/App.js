import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import Header from './Component/Header/Header.js';
import Home from './Pages/Home/Home.js';
import Register from './Pages/Authenticate/Register/Register.js'
import Login from './Pages/Authenticate/Login/Login.js'
import Place from './Pages/Place/Place.js';
import AddPlace from './Pages/AddPlace/AddPlace.js'
import PlaceDetail from './Pages/PlaceDetail/PlaceDetail.js'
import EditPlace from './Pages/EditPlace/EditPlace.js'
function App() {
  return (
  <BrowserRouter>
     <Header/>
     <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/authenticate/register/' element = {<Register/>}/>
        <Route path='/authenticate/login/' element = {<Login/>}/>
        <Route path="/:u_id/places/" element={<Place/>} />
        <Route path='/addplace/' element = {<AddPlace/>}/>
        <Route path="/placedetail/:u_id/:p_id" element={<PlaceDetail/>}/>
        <Route path='/editplace/:u_id/:p_id' element = {<EditPlace/>}/>
     </Routes>
  </BrowserRouter>
  );
}

export default App;
