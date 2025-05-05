import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useState } from 'react';
import './App.css';
import Header from './Component/Header/Header.js';

// Lazy load components for better performance
const Home = lazy(() => import('./Pages/Home/Home.js'));
const Register = lazy(() => import('./Pages/Authenticate/Register/Register.js'));
const Login = lazy(() => import('./Pages/Authenticate/Login/Login.js'));
const Place = lazy(() => import('./Pages/Place/Place.js'));
const AddPlace = lazy(() => import('./Pages/AddPlace/AddPlace.js'));
const PlaceDetail = lazy(() => import('./Pages/PlaceDetail/PlaceDetail.js'));
const EditPlace = lazy(() => import('./Pages/EditPlace/EditPlace.js'));

// Route guard for protected routes
function ProtectedRoute({ authToken, children }) {
  if (!authToken) {
    return <Navigate to='/authenticate/login/' replace />;
  }
  return children;
}

function App() {
  const [authToken, setAuthToken] = useState(null);
  return (
    <BrowserRouter>
      <Header authToken={authToken} setAuthToken={setAuthToken} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Home Page */}
          <Route path='/' element={<Home />} />

          {/* Authentication Routes */}
          <Route path='/authenticate/register/' element={<Register />} />
          <Route path='/authenticate/login/' element={<Login setAuthToken={setAuthToken} />} />

          {/* User Places */}
          <Route path='/:u_id/places/' element={<Place />} />

          {/* Add Place */}
          <Route path='/addplace/' element={
            <ProtectedRoute authToken={authToken}>
              <AddPlace authToken={authToken} />
            </ProtectedRoute>
          } />

          {/* Place Details */}
          <Route path='/placedetail/:u_id/:p_id' element={
            <ProtectedRoute authToken={authToken}>
              <PlaceDetail authToken={authToken} />
            </ProtectedRoute>
          } />

          {/* Edit Place */}
          <Route path='/editplace/:u_id/:p_id' element={
            <ProtectedRoute authToken={authToken}>
              <EditPlace authToken={authToken} />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
