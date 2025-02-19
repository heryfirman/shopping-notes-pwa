import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Wellcome from './pages/Wellcome'
import Notes from './pages/Notes'
import Create from './pages/Create'

function App() {
  return (
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  )
}

const Content = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");


  useEffect(() => {
    if (location !== displayLocation) setTransitionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <div
      className={transitionStage}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setDisplayLocation(location);
          setTransitionStage("fadeIn");
        }
      }}
    >
      <Routes location={displayLocation}>
        <Route path='/' element={<Wellcome />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/note/create' element={<Create />} />
      </Routes>
    </div>
  )
}

export default App
