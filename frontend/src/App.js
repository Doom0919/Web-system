import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useState } from 'react';
import { createApi } from './api';
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
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
  });

  const api = createApi({
    getAccessToken: () => auth.accessToken,
    getRefreshToken: () => auth.refreshToken,
    setAuthTokens: (accessToken, refreshToken, expiresIn) =>
      setAuth({ accessToken, refreshToken, expiresIn }),
    onLogout: () => setAuth({ accessToken: null, refreshToken: null, expiresIn: null }),
  });

  return (
    <BrowserRouter>
      <Header authToken={auth.accessToken} setAuthToken={setAuth} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home api={api}/>} />
          <Route path='/authenticate/register/' element={<Register api={api} />} />
          <Route path='/authenticate/login/' element={<Login setAuthToken={setAuth} api={api} />} />
          <Route path='/:u_id/places/' element={<Place api={api} />} />
          <Route path='/addplace/' element={
            <ProtectedRoute authToken={auth.accessToken}>
              <AddPlace authToken={auth.accessToken} api={api} />
            </ProtectedRoute>
          } />
          <Route path='/placedetail/:u_id/:p_id' element={
            <ProtectedRoute authToken={auth.accessToken}>
              <PlaceDetail authToken={auth.accessToken} api={api} />
            </ProtectedRoute>
          } />
          <Route path='/editplace/:u_id/:p_id' element={
            <ProtectedRoute authToken={auth.accessToken}>
              <EditPlace authToken={auth.accessToken} api={api} />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
