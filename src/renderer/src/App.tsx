import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Sidebar from './components/components_Sidebar'
import Home from './pages/Home'
import Records from './pages/Records'
import Excusal from './pages/Excusal'
import Sanctions from './pages/Sanctions'
import CheckConnection from './components/check_Connection'

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-slate-900 relative">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto select-none">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/records" element={<Records />} />
            <Route path="/excusal" element={<Excusal />} />
            <Route path="/sanctions" element={<Sanctions />} />
          </Routes>
        </div>
        <div className="absolute top-4 right-4">
          <CheckConnection />
        </div>
      </div>
    </Router>
  )
}

export default App
