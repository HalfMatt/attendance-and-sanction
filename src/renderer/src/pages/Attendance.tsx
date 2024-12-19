import { useState } from 'react'
import { useParams } from 'react-router-dom'

interface AttendanceRecord {
  idNumber: string
  name: string
  course: string
  year: string
  status: string // Tracks "Time-in", "Time-out", or "Excused"
}

const initialRecords: AttendanceRecord[] = [
  { idNumber: '2023001', name: 'John Doe', course: 'BSIT', year: '3', status: '' },
  { idNumber: '2023002', name: 'Jane Smith', course: 'BSECE', year: '2', status: '' },
  { idNumber: '2023003', name: 'Alice Johnson', course: 'BSCS', year: '1', status: '' }
]

const Attendance = () => {
  const { folderName } = useParams()
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalType, setModalType] = useState<'Time-in' | 'Time-out' | 'Excuse' | null>(null)
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null)
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')

  // Filter records for search
  const filteredRecords = records.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.idNumber.includes(searchTerm)
  )

  const openModal = (type: 'Time-in' | 'Time-out' | 'Excuse', record: AttendanceRecord) => {
    setModalType(type)
    setCurrentRecord(record)
    setTime('')
    setReason('') // Reset inputs
  }

  const closeModal = () => {
    setModalType(null)
    setCurrentRecord(null)
    setTime('')
    setReason('')
  }

  const handleSubmit = () => {
    if (!currentRecord) return

    const newStatus = modalType === 'Excuse' ? `Excused: ${reason}` : modalType || ''

    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.idNumber === currentRecord.idNumber ? { ...record, status: newStatus } : record
      )
    )

    alert(
      `${modalType} recorded for ${currentRecord.name}\n` +
        (modalType === 'Excuse' ? `Reason: ${reason}\n` : '') +
        `Time: ${time}`
    )

    closeModal()
  }

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

      {/* Action Buttons Aligned to the Right */}
      <div className="mb-4 flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => openModal('Time-in', filteredRecords[0])} // Example record
        >
          Time-in
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => openModal('Time-out', filteredRecords[0])} // Example record
        >
          Time-out
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => openModal('Excuse', filteredRecords[0])} // Example record
        >
          Excuse
        </button>
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
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record.idNumber}>
              <td className="py-2 px-4 border text-center">{record.idNumber}</td>
              <td className="py-2 px-4 border text-center">{record.name}</td>
              <td className="py-2 px-4 border text-center">{record.course}</td>
              <td className="py-2 px-4 border text-center">{record.year}</td>
              <td className="py-2 px-4 border text-center">{record.status || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Time-in, Time-out, and Excuse */}
      {modalType && currentRecord && (
        <div className="fixed inset-0 text-black bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{modalType}</h2>
            <div className="mb-4">
              <label className="block mb-2">ID Number:</label>
              <input
                type="text"
                value={currentRecord.idNumber}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            {modalType === 'Excuse' && (
              <div className="mb-4">
                <label className="block mb-2">Reason:</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-2">Time:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleSubmit}
              >
                Ok
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance
