import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFolders } from '../context/FolderContext'

const HomePage = () => {
  const { folders, addFolder } = useFolders()
  const [isAdding, setIsAdding] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const navigate = useNavigate()

  const handleAddFolderClick = () => {
    setIsAdding(true)
  }

  const handleSaveFolder = async () => {
    if (newFolderName) {
      await addFolder(newFolderName)
      setNewFolderName('')
      setIsAdding(false)
    }
  }

  const handleFolderClick = (folderName: string) => {
    navigate(`/attendance/${folderName}`)
  }

  const handleCancel = () => {
    setNewFolderName('')
    setIsAdding(false)
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl mb-6 font-bold">Folder Management</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {folders.map((folder) => (
          <div
            key={folder.name}
            onClick={() => handleFolderClick(folder.name)}
            className="p-6 bg-blue-800 rounded-lg shadow flex items-center justify-center text-lg font-medium cursor-pointer hover:bg-blue-600 truncate"
          >
            📁 {folder.name}
          </div>
        ))}

        {!isAdding ? (
          <div
            className="p-6 bg-blue-800 rounded-lg shadow cursor-pointer hover:bg-gray-400 flex items-center justify-center text-lg font-medium"
            onClick={handleAddFolderClick}
          >
            ➕ Add Folder
          </div>
        ) : (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={handleCancel}
          >
            <div
              className="bg-blue-800 p-8 rounded-lg shadow-lg w-80"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl mb-4 font-bold">Enter Folder Name</h2>
              <input
                type="text"
                className="w-full text-black p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <div className="flex justify-between space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleSaveFolder}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
