import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Corrected 'react-router' to 'react-router-dom'
import Sidebar from './components/components_Sidebar';
import Home from './pages/Home';
import Records from './pages/Records';
import Sanctions from './pages/Sanctions';
import CheckConnection from './components/check_Connection';
import { FolderProvider } from '././context/FolderContext';

const App: React.FC = () => {
  return (
    <FolderProvider>  {/* Wrap your app with FolderProvider */}
      <Router>
        <div className="flex h-screen bg-slate-900 relative">
          <Sidebar />
          <div className="flex-1 p-8 overflow-auto select-none">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/records" element={<Records />} />
              <Route path="/sanctions" element={<Sanctions />} />
            </Routes>
          </div>
          <div className="absolute top-4 right-4">
            <CheckConnection />
          </div>
        </div>
      </Router>
    </FolderProvider>
  );
};

export default App;
