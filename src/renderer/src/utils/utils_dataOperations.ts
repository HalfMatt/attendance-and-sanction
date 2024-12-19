import * as XLSX from 'xlsx'
import { updateFolderData, getFolders } from './IndexedDB'

export interface AttendanceRecord {
  id: number
  first_name: string
  last_name: string
  course_id: number
  year_level: number
  status?: string
}

const baseURL = 'http://localhost:3000'

export const importFromDatabase = async (
  folderName: string,
  setRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>
) => {
  try {
    // This is a placeholder for actual database import logic
    // In a real application, you would make an API call to your backend
    const response = await fetch(`${baseURL}/getStudents`)
    const data: AttendanceRecord[] = await response.json()
    setRecords(data)

    // Save to IndexedDB
    await updateFolderData(folderName, JSON.stringify(data))

    alert('Data imported from database and saved successfully!')
  } catch (error) {
    console.error('Error importing from database:', error)
    alert('Failed to import data from database.')
  }
}

export const importFromExcel = async (
  folderName: string,
  setRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>
) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx, .xls'
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        const formattedData: AttendanceRecord[] = jsonData.map((item: any) => ({
          id: item.id || item.ID || item['ID Number'],
          first_name: item.first_name || item['First Name'],
          last_name: item.last_name || item['Last Name'],
          course_id: item.course_id || item['Course ID'],
          year_level: item.year_level || item['Year Level'],
          status: item.status || item.Status || ''
        }))
        setRecords(formattedData)

        // Save to IndexedDB
        await updateFolderData(folderName, JSON.stringify(formattedData))

        alert('Data imported from Excel and saved successfully!')
      }
      reader.readAsArrayBuffer(file)
    }
  }
  input.click()
}

export const exportToExcel = (records: AttendanceRecord[]) => {
  const worksheet = XLSX.utils.json_to_sheet(records)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')
  XLSX.writeFile(workbook, 'attendance_export.xlsx')
}

export const loadDataFromIndexedDB = async (folderName: string): Promise<AttendanceRecord[]> => {
  const folders = await getFolders()
  const folder = folders.find((f) => f.name === folderName)
  if (folder && folder.data) {
    return JSON.parse(folder.data)
  }
  return []
}

export const saveDataToIndexedDB = async (folderName: string, data: AttendanceRecord[]) => {
  await updateFolderData(folderName, JSON.stringify(data))
}
