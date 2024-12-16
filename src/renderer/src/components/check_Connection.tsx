import React, { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

export const CheckConnection: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', color: isOnline ? 'green' : 'red' }}>
      {isOnline ? <Wifi /> : <WifiOff />}
      <span style={{ marginLeft: '8px' }}>{isOnline ? 'Connected' : 'No connection'}</span>
    </div>
  )
}

export default CheckConnection
