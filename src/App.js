import React, { useState, useEffect, Component } from 'react';
import Navbar from './Navbar';
import Home from "./pages/Home"
import Marketplace from "./pages/Marketplace"
import Solutions from "./pages/Solutions"
import ChatbotUI from './pages/chatbot';
import PaymentForm from './pages/paymentform';
import SongPlayer from './pages/songplayer';
import Login from './pages/login';
import Analysis from './pages/audioanalysis';
import Test from './pages/Test';

function App() {
  let Component
  switch (window.location.pathname) {
    case "/home":
      Component = <Home />
      break
    case "/solutions":
      Component = <Solutions />
      break
    case "/marketplace":
      Component = <Marketplace />
      break
    case "/askAI":
      Component = <ChatbotUI />
      break
    case "/payment":
      Component = <PaymentForm />
      break
    case "/songplayer":
      Component = <SongPlayer />
      break
    case "/login":
      Component = <Login />
      break
    case "/audioanalysis":
      Component = <Analysis />
      break
    case "/test":
      Component = <Test />
      break
  }
  return (
    <div>
      <Navbar />
      {Component}
    </div>

  );
}

export default App;