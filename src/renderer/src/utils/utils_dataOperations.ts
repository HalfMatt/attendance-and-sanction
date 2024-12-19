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

/**
 * Imports data from a database and updates the state with the imported records.
 * The data is also saved to IndexedDB.
 *
 * @param folderName - The name of the folder where the data will be saved in IndexedDB.
 * @param setRecords - A React state setter function to update the records state.
 *
 * The function makes an API call to fetch the data from the database.
 * The data is then saved to IndexedDB and the state is updated with the fetched data.
 *
 * An alert is shown to the user upon successful import and save.
 */

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

/**
 * Imports data from an Excel file and updates the state with the imported records.
 * The data is also saved to IndexedDB.
 *
 * @param folderName - The name of the folder where the data will be saved in IndexedDB.
 * @param setRecords - A React state setter function to update the records state.
 *
 * The function creates an input element to select an Excel file (.xlsx or .xls).
 * When a file is selected, it reads the file, converts the data to JSON, formats it,
 * updates the state with the formatted data, and saves the data to IndexedDB.
 *
 * The expected structure of the Excel file should have columns that can be mapped to:
 * - id (or ID, or ID Number)
 * - first_name (or First Name)
 * - last_name (or Last Name)
 * - course_id (or Course ID)
 * - year_level (or Year Level)
 * - status (or Status)
 *
 * An alert is shown to the user upon successful import and save.
 */
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

/**
 * Exports the records to an Excel file.
 *
 * @param records - The records to be exported to an Excel file.
 *
 * The function creates an Excel worksheet from the records data,
 * appends the worksheet to a new workbook, and writes the workbook to a file.
 *
 * The file is saved with a timestamp in the filename to avoid overwriting previous exports.
 */
export const exportToExcel = (records: AttendanceRecord[]) => {
  const worksheet = XLSX.utils.json_to_sheet(records)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')
  const date = new Date()
  const dateString = date.toISOString().slice(0, 19).replace(/:/g, '-')
  const fileName = `attendance_export_${dateString}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

/**
 * Loads data from IndexedDB for a specific folder.
 *
 * @param folderName - The name of the folder to load data from.
 * @returns A promise that resolves to the data loaded from IndexedDB.
 */
export const loadDataFromIndexedDB = async (folderName: string): Promise<AttendanceRecord[]> => {
  const folders = await getFolders()
  const folder = folders.find((f) => f.name === folderName)
  if (folder && folder.data) {
    return JSON.parse(folder.data)
  }
  return []
}

/**
 * Saves data to IndexedDB for a specific folder.
 *
 * @param folderName - The name of the folder to save data to.
 * @param data - The data to save to IndexedDB.
 */
export const saveDataToIndexedDB = async (folderName: string, data: AttendanceRecord[]) => {
  await updateFolderData(folderName, JSON.stringify(data))
}
