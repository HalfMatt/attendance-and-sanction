import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/components_Sidebar'
import Home from './pages/Home'
import Records from './pages/Records'
import Sanctions from './pages/Sanctions'
import Attendance from './pages/Attendance' // Import Attendance component
import CheckConnection from './components/check_Connection'
import { FolderProvider } from './context/FolderContext'

const App: React.FC = () => {
  return (
    <FolderProvider>
      <Router>
        <div className="flex h-screen bg-slate-900 relative">
          <Sidebar />
          <div className="flex-1 p-8 overflow-auto select-none">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/records" element={<Records />} />
              <Route path="/sanctions" element={<Sanctions />} />
              <Route path="/attendance/:folderName" element={<Attendance />} />
            </Routes>
          </div>
          <div className="absolute top-5 right-5">
            <CheckConnection />
          </div>
        </div>
      </Router>
    </FolderProvider>
  )
}

export default App
