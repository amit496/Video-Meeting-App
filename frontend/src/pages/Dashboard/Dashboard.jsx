import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../../services/auth/auth.service'

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser()

        console.log('Current user:', data)

        setUser(data.user || data)
      } catch (error) {
        console.error('Failed to fetch current user:', error)

        localStorage.removeItem('token')
        setError(error.message || 'Session expired')

        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Welcome to your Video Meeting Dashboard.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        {user && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">
              Account Information
            </h2>

            <div className="mt-5 space-y-3">
              <p className="text-slate-300">
                <span className="font-medium text-slate-400">
                  Name:
                </span>{' '}
                {user.name}
              </p>

              <p className="text-slate-300">
                <span className="font-medium text-slate-400">
                  Email:
                </span>{' '}
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard