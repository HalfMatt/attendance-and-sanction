import { createContext, useContext, useState, useEffect } from 'react'
import * as idb from '../utils/IndexedDB'

interface Folder {
  name: string
  data: string
}

interface FolderContextType {
  folders: Folder[]
  addFolder: (folderName: string) => Promise<void>
  updateFolderData: (folderName: string, data: string) => Promise<void>
  deleteFolder: (folderName: string) => Promise<void>
}

const FolderContext = createContext<FolderContextType>({
  folders: [],
  addFolder: async () => {},
  updateFolderData: async () => {},
  deleteFolder: async () => {}
})

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    // Load folders from IndexedDB when component mounts
    idb.getFolders().then(setFolders)
  }, [])

  const addFolder = async (folderName: string) => {
    if (!folderName) return
    if (folderName.length > 15) {
      alert('Folder name must be less than 15 characters')
      return
    }
    try {
      await idb.addFolder(folderName)
    } catch (error) {
      alert('A folder with this name already exists')
      return
    }
    setFolders(await idb.getFolders())
  }

  const updateFolderData = async (folderName: string, data: string) => {
    await idb.updateFolderData(folderName, data)
    setFolders(await idb.getFolders())
  }

  const deleteFolder = async (folderName: string) => {
    await idb.deleteFolder(folderName)
    setFolders(await idb.getFolders())
  }

  return (
    <FolderContext.Provider value={{ folders, addFolder, updateFolderData, deleteFolder }}>
      {children}
    </FolderContext.Provider>
  )
}

export const useFolders = () => useContext(FolderContext)
