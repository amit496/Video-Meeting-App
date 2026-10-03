import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { getCurrentUser } from '../../services/auth/auth.service'

import {
  createMeeting,
  joinMeeting,
} from '../../services/meeting/meeting.service'

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [meetingId, setMeetingId] = useState('')

  const [creatingMeeting, setCreatingMeeting] = useState(false)
  const [joiningMeeting, setJoiningMeeting] = useState(false)

  const [meetingError, setMeetingError] = useState('')

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

  const handleCreateMeeting = async () => {
    setMeetingError('')
    setCreatingMeeting(true)

    try {
      const data = await createMeeting()

      console.log('Created meeting:', data)

      const roomId = data.data?.roomId

      if (!roomId) {
        throw new Error('Meeting ID was not returned by the server')
      }

      navigate(`/meeting/${roomId}`)
    } catch (error) {
      console.error('Failed to create meeting:', error)

      setMeetingError(error.message || 'Failed to create meeting')
    } finally {
      setCreatingMeeting(false)
    }
  }

  const handleJoinMeeting = async (event) => {
    event.preventDefault()

    setMeetingError('')

    const roomId = meetingId.trim()

    if (!roomId) {
      setMeetingError('Please enter a Meeting ID.')
      return
    }

    setJoiningMeeting(true)

    try {
      const data = await joinMeeting(roomId)

      console.log('Joined meeting:', data)

      const joinedRoomId = data.data?.roomId

      if (!joinedRoomId) {
        throw new Error('Meeting ID was not returned by the server')
      }

      setMeetingId('')

      navigate(`/meeting/${joinedRoomId}`)
    } catch (error) {
      console.error('Failed to join meeting:', error)

      setMeetingError(error.message || 'Failed to join meeting')
    } finally {
      setJoiningMeeting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">
          Loading dashboard...
        </p>
      </div>
    )
  }

  if (error) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
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

        {/* Account Information */}
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

        {/* Meeting Actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Create Meeting */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">
              Create a Meeting
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Start a new video meeting and get a unique Meeting ID.
            </p>

            <button
              onClick={handleCreateMeeting}
              disabled={creatingMeeting || joiningMeeting}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creatingMeeting
                ? 'Creating Meeting...'
                : 'Create Meeting'}
            </button>
          </div>

          {/* Join Meeting */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">
              Join a Meeting
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Enter a Meeting ID to join an existing meeting.
            </p>

            <form
              onSubmit={handleJoinMeeting}
              className="mt-6"
            >
              <input
                type="text"
                value={meetingId}
                onChange={(event) =>
                  setMeetingId(event.target.value)
                }
                placeholder="Enter Meeting ID"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={creatingMeeting || joiningMeeting}
                className="mt-4 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {joiningMeeting
                  ? 'Joining Meeting...'
                  : 'Join Meeting'}
              </button>
            </form>
          </div>
        </div>

        {/* Error */}
        {meetingError && (
          <div className="mt-6 rounded-lg border border-red-800 bg-red-950/50 p-4 text-red-300">
            {meetingError}
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard

