import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  importFromDatabase,
  importFromExcel,
  exportToExcel,
  loadDataFromIndexedDB,
  saveDataToIndexedDB,
  AttendanceRecord
} from '../utils/utils_dataOperations'

const initialRecords: AttendanceRecord[] = []

const Attendance = () => {
  const { folderName } = useParams()
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalType, setModalType] = useState<'Time-in' | 'Time-out' | 'Excuse' | null>(null)
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null)
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    const loadData = async () => {
      if (folderName) {
        const loadedRecords = await loadDataFromIndexedDB(folderName)
        setRecords(loadedRecords)
      }
    }
    loadData()
  }, [folderName])

  // Filter records for search
  const filteredRecords = records.filter(
    (record) =>
      `${record.first_name} ${record.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toString().includes(searchTerm)
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

  const handleSubmit = async () => {
    if (!currentRecord || !folderName) return

    const newStatus = modalType === 'Excuse' ? `Excused: ${reason}` : modalType || ''

    const updatedRecords = records.map((record) =>
      record.id === currentRecord.id ? { ...record, status: newStatus } : record
    )

    setRecords(updatedRecords)
    await saveDataToIndexedDB(folderName, updatedRecords)

    alert(
      `${modalType} recorded for ${currentRecord.first_name} ${currentRecord.last_name}\n` +
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
          onClick={() => records.length > 0 && openModal('Time-in', records[0])}
        >
          Time-in
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => records.length > 0 && openModal('Time-out', records[0])}
        >
          Time-out
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => records.length > 0 && openModal('Excuse', records[0])}
        >
          Excuse
        </button>
      </div>

      {/* Added Import/Export Buttons */}
      <div className="mb-4 flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => folderName && importFromDatabase(folderName, setRecords)}
        >
          Import from Database
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={() => folderName && importFromExcel(folderName, setRecords)}
        >
          Import from Excel
        </button>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          onClick={() => exportToExcel(records)}
        >
          Export to Excel
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
            <tr key={record.id}>
              <td className="py-2 px-4 border text-center">{record.id}</td>
              <td className="py-2 px-4 border text-center">{`${record.first_name} ${record.last_name}`}</td>
              <td className="py-2 px-4 border text-center">{`Course ${record.course_id}`}</td>
              {/* <td className="py-2 px-4 border text-center">{record.year_level}</td> */}
              <td className="py-2 px-4 border text-center">
                {record.year_level}
                {(() => {
                  const j = record.year_level % 10,
                    k = record.year_level % 100
                  if (j === 1 && k !== 11) {
                    return 'st'
                  }
                  if (j === 2 && k !== 12) {
                    return 'nd'
                  }
                  if (j === 3 && k !== 13) {
                    return 'rd'
                  }
                  return 'th'
                })()}
              </td>
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
                value={currentRecord.id.toString()}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                value={`${currentRecord.first_name} ${currentRecord.last_name}`}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Course:</label>
              <input
                type="text"
                value={`Course ${currentRecord.course_id}`}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Year Level:</label>
              <input
                type="text"
                value={currentRecord.year_level.toString()}
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
