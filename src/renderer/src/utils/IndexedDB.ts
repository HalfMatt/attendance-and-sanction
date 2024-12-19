import { openDB, DBSchema } from 'idb'

interface MyDB extends DBSchema {
  folders: {
    key: string
    value: {
      name: string
      data: string // JSON or CSV data as a string
    }
  }
}

const dbPromise = openDB<MyDB>('FolderStorage', 1, {
  upgrade(db) {
    db.createObjectStore('folders', { keyPath: 'name' })
  }
})

export async function getFolders() {
  const db = await dbPromise
  return db.getAll('folders')
}

export async function addFolder(name: string) {
  const db = await dbPromise
  await db.add('folders', { name, data: '' })
}

export async function updateFolderData(name: string, data: string) {
  const db = await dbPromise
  await db.put('folders', { name, data })
}

export async function deleteFolder(name: string) {
  const db = await dbPromise
  await db.delete('folders', name)
}
