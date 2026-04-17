import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import { useAuthStore } from './store/authStore'

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 500,
            borderRadius: '16px',
            border: '1.5px solid #ffc2ef',
            boxShadow: '0 4px 24px rgba(255,29,176,0.15)',
          },
          success: {
            iconTheme: { primary: '#ff1db0', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </>
  )
}
