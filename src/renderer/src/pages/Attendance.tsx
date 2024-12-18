import { useState } from "react";
import { useParams } from "react-router-dom";

interface AttendanceRecord {
  idNumber: string;
  name: string;
  course: string;
  year: string;
  status: string; // Tracks "Time-in" or "Time-out"
}

const initialRecords: AttendanceRecord[] = [
  { idNumber: "2023001", name: "John Doe", course: "BSIT", year: "3", status: "" },
  { idNumber: "2023002", name: "Jane Smith", course: "BSECE", year: "2", status: "" },
  { idNumber: "2023003", name: "Alice Johnson", course: "BSCS", year: "1", status: "" },
];

const Attendance = () => {
  const { folderName } = useParams(); // Extract folder name dynamically
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search logic
  const filteredRecords = records.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.idNumber.includes(searchTerm)
  );

  // Handle Time-in button click
  const handleTimeIn = (idNumber: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.idNumber === idNumber ? { ...record, status: "Time-in" } : record
      )
    );
  };

  // Handle Time-out button click
  const handleTimeOut = (idNumber: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.idNumber === idNumber ? { ...record, status: "Time-out" } : record
      )
    );
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl mb-6 font-bold">Attendance for Folder: {folderName}</h1>

      {/* Search Bar */}
      <div className="mb-4 text-black">
        <input
          type="text"
          placeholder="Search by Name or ID"
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Attendance Table */}
      <table className="min-w-full text-black bg-white border rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID Number</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Course</th>
            <th className="py-2 px-4 border">Year</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.idNumber}>
              <td className="py-2 px-4 border text-center">{record.idNumber}</td>
              <td className="py-2 px-4 border text-center">{record.name}</td>
              <td className="py-2 px-4 border text-center">{record.course}</td>
              <td className="py-2 px-4 border text-center">{record.year}</td>
              <td className="py-2 px-4 border text-center">{record.status || "-"}</td>
              <td className="py-2 px-4 border text-center space-x-2">
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleTimeIn(record.idNumber)}
                >
                  Time-in
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleTimeOut(record.idNumber)}
                >
                  Time-out
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
