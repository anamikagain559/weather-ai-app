import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Header />
      <Outlet />
    </>
  );
}

export default App;
