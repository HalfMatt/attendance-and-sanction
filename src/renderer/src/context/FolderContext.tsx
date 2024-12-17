// FolderContext.tsx
import { createContext, useContext, useState } from "react";

// Create context
interface FolderContextType {
    folders: string[];
    addFolder: (folderName: string) => void;
}

const FolderContext = createContext<FolderContextType>({
    folders: [],
    addFolder: () => {}
});

export const FolderProvider = ({ children }) => {
    const [folders, setFolders] = useState<string[]>([]);

    const addFolder = (folderName) => {
        setFolders((prev) => [...prev, folderName]);
    };

    return (
        <FolderContext.Provider value={{ folders, addFolder }}>
            {children}
        </FolderContext.Provider>
    );
};

export const useFolders = () => useContext(FolderContext);
