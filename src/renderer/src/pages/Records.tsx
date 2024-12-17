import { useFolders } from "../context/FolderContext"

const RecordsPage = () => {
  const folders = useFolders().folders.map((folder: string) => ({ name: folder })); // Access the global folders array

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-2xl mb-6 font-bold">Folder Records</h1>
      {folders.length > 0 ? (
        <ul className="space-y-2">
          {folders.map((folder, index) => (
            <li key={index} className="p-4 bg-blue-800 rounded-lg shadow">
              📁 {folder.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No folders created yet.</p>
      )}
    </div>
  );
};

export default RecordsPage;
