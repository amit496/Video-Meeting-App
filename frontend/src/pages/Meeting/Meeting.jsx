import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { socket } from '../../services/socket/socket.service.js'

const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
  ],
}

function Meeting() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const videoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const streamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const pendingCandidatesRef = useRef([])

  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true)
  const [mediaError, setMediaError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [remoteStream, setRemoteStream] = useState(null)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [microphoneLoading, setMicrophoneLoading] = useState(false)

  const createPeerConnection = useCallback(() => {
    if (
      peerConnectionRef.current &&
      peerConnectionRef.current.signalingState !== 'closed'
    ) {
      return peerConnectionRef.current
    }

    const peerConnection = new RTCPeerConnection(ICE_SERVERS)

    peerConnectionRef.current = peerConnection

    const localStream = streamRef.current

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket.connected) {
        socket.emit('webrtc-ice-candidate', {
          roomId,
          candidate: event.candidate,
        })
      }
    }

    peerConnection.ontrack = (event) => {
      let incomingStream = event.streams[0]

      if (!incomingStream) {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream()
        }

        incomingStream = remoteStreamRef.current

        const alreadyAdded = incomingStream
          .getTracks()
          .some((track) => track.id === event.track.id)

        if (!alreadyAdded) {
          incomingStream.addTrack(event.track)
        }
      } else {
        remoteStreamRef.current = incomingStream
      }

      setRemoteStream(incomingStream)
      setConnectionStatus('Participant connected')
    }

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState

      if (state === 'connected') {
        setConnectionStatus('Participant connected')
      } else if (state === 'connecting') {
        setConnectionStatus('Connecting media...')
      } else if (state === 'disconnected') {
        setConnectionStatus('Connection interrupted')
      } else if (state === 'failed') {
        setConnectionStatus(
          'Connection failed. Network or TURN configuration may be required.'
        )
      }
    }

    return peerConnection
  }, [roomId])

  const flushPendingCandidates = useCallback(async (peerConnection) => {
    if (!peerConnection.remoteDescription) {
      return
    }

    const candidates = pendingCandidatesRef.current.splice(0)

    for (const candidate of candidates) {
      try {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        )
      } catch (error) {
        console.error('Failed to add queued ICE candidate:', error)
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const handleRoomJoined = ({ roomId: joinedRoomId }) => {
      if (joinedRoomId !== roomId) {
        return
      }

      setConnectionStatus('Waiting for participant...')
    }

    const handleParticipantJoined = async ({ socketId }) => {
      if (!socketId || socketId === socket.id) {
        return
      }

      try {
        setConnectionStatus('Participant joined. Connecting...')

        // The participant already in the room initiates the offer.
        const peerConnection = createPeerConnection()

        if (peerConnection.signalingState !== 'stable') {
          return
        }

        const offer = await peerConnection.createOffer()

        await peerConnection.setLocalDescription(offer)

        socket.emit('webrtc-offer', {
          roomId,
          offer: peerConnection.localDescription,
        })
      } catch (error) {
        console.error('Failed to create WebRTC offer:', error)
        setMediaError('Unable to start the video connection.')
      }
    }

    const handleOffer = async ({ offer, socketId }) => {
      if (!offer || socketId === socket.id) {
        return
      }

      try {
        const peerConnection = createPeerConnection()

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        )

        await flushPendingCandidates(peerConnection)

        const answer = await peerConnection.createAnswer()

        await peerConnection.setLocalDescription(answer)

        socket.emit('webrtc-answer', {
          roomId,
          answer: peerConnection.localDescription,
        })

        setConnectionStatus('Answer sent. Connecting media...')
      } catch (error) {
        console.error('Failed to handle WebRTC offer:', error)
        setMediaError('Unable to establish the video connection.')
      }
    }

    const handleAnswer = async ({ answer, socketId }) => {
      if (!answer || socketId === socket.id) {
        return
      }

      try {
        const peerConnection = peerConnectionRef.current

        if (!peerConnection) {
          return
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        )

        await flushPendingCandidates(peerConnection)
      } catch (error) {
        console.error('Failed to handle WebRTC answer:', error)
        setMediaError('Unable to complete the video connection.')
      }
    }

    const handleIceCandidate = async ({ candidate, socketId }) => {
      if (!candidate || socketId === socket.id) {
        return
      }

      const peerConnection = peerConnectionRef.current

      if (!peerConnection || !peerConnection.remoteDescription) {
        pendingCandidatesRef.current.push(candidate)
        return
      }

      try {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        )
      } catch (error) {
        console.error('Failed to add ICE candidate:', error)
      }
    }

    const handleParticipantLeft = ({ socketId }) => {
      if (!socketId || socketId === socket.id) {
        return
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }

      pendingCandidatesRef.current = []
      remoteStreamRef.current = null
      setRemoteStream(null)
      setConnectionStatus('Participant left. Waiting for another participant...')
    }

    const handleSocketConnect = () => {
      setConnectionStatus('Joining meeting...')

      socket.emit('join-room', { roomId })
    }

    const handleSocketDisconnect = () => {
      setConnectionStatus('Signaling server disconnected')
    }

    const startMeeting = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera and microphone APIs are unavailable.')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        const savedCameraState = localStorage.getItem(
          'meetingCameraEnabled'
        )

        const savedMicrophoneState = localStorage.getItem(
          'meetingMicrophoneEnabled'
        )

        const shouldStartCamera = savedCameraState !== 'false'
        const shouldStartMicrophone = savedMicrophoneState !== 'false'

        const videoTrack = stream.getVideoTracks()[0]
        const audioTrack = stream.getAudioTracks()[0]

        if (videoTrack) {
          videoTrack.enabled = shouldStartCamera
        }

        if (audioTrack) {
          audioTrack.enabled = shouldStartMicrophone
        }

        streamRef.current = stream

        setCameraEnabled(Boolean(videoTrack) && shouldStartCamera)
        setMicrophoneEnabled(
          Boolean(audioTrack) && shouldStartMicrophone
        )

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Camera/microphone access error:', error)

        if (!cancelled) {
          setMediaError(
            'Camera or microphone access failed. Check browser permissions and try again.'
          )

          setCameraEnabled(false)
          setMicrophoneEnabled(false)
        }
      }

      if (cancelled) {
        return
      }

      socket.on('connect', handleSocketConnect)
      socket.on('disconnect', handleSocketDisconnect)
      socket.on('room-joined', handleRoomJoined)
      socket.on('participant-joined', handleParticipantJoined)
      socket.on('webrtc-offer', handleOffer)
      socket.on('webrtc-answer', handleAnswer)
      socket.on('webrtc-ice-candidate', handleIceCandidate)
      socket.on('participant-left', handleParticipantLeft)

      if (socket.connected) {
        handleSocketConnect()
      } else {
        socket.connect()
      }
    }

    startMeeting()

    return () => {
      cancelled = true

      if (socket.connected) {
        socket.emit('leave-room', { roomId })
      }

      socket.off('connect', handleSocketConnect)
      socket.off('disconnect', handleSocketDisconnect)
      socket.off('room-joined', handleRoomJoined)
      socket.off('participant-joined', handleParticipantJoined)
      socket.off('webrtc-offer', handleOffer)
      socket.off('webrtc-answer', handleAnswer)
      socket.off('webrtc-ice-candidate', handleIceCandidate)
      socket.off('participant-left', handleParticipantLeft)

      socket.disconnect()

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null
      }

      remoteStreamRef.current = null
      pendingCandidatesRef.current = []
    }
  }, [roomId, createPeerConnection, flushPendingCandidates])

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const handleToggleMicrophone = async () => {
    if (microphoneLoading) {
      return
    }

    const track = streamRef.current?.getAudioTracks()[0]

    if (!track) {
      setMediaError(
        'Microphone track is unavailable. Please leave and rejoin the meeting.'
      )
      return
    }

    const nextState = !microphoneEnabled

    track.enabled = nextState
    setMicrophoneEnabled(nextState)
    setMediaError('')

    localStorage.setItem(
      'meetingMicrophoneEnabled',
      String(nextState)
    )
  }

  const handleToggleCamera = async () => {
    if (cameraLoading) {
      return
    }

    const track = streamRef.current?.getVideoTracks()[0]

    if (!track) {
      setMediaError(
        'Camera track is unavailable. Please leave and rejoin the meeting.'
      )
      return
    }

    const nextState = !cameraEnabled

    track.enabled = nextState
    setCameraEnabled(nextState)
    setMediaError('')

    localStorage.setItem(
      'meetingCameraEnabled',
      String(nextState)
    )
  }

  const handleLeaveMeeting = () => {
    if (socket.connected) {
      socket.emit('leave-room', { roomId })
    }

    navigate('/dashboard')
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white">
      <div className="flex h-full flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Video Meeting</h1>
            <p className="mt-1 text-sm text-slate-400">
              Meeting ID: {roomId}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {connectionStatus}
            </p>
          </div>

          <button
            onClick={handleLeaveMeeting}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-500"
          >
            Leave Meeting
          </button>
        </header>

        <main className="flex min-h-0 flex-1 flex-col p-6">
          <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-2">
            <div className="relative min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover -scale-x-100 ${
                  cameraEnabled ? 'visible' : 'invisible'
                }`}
              />

              {!cameraEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-2xl font-bold">
                      You
                    </div>
                    <p className="mt-4 text-slate-400">Camera is off</p>
                  </div>
                </div>
              )}

              <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm">
                You
              </span>
            </div>

            <div className="relative min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`h-full w-full object-cover ${
                  remoteStream ? 'visible' : 'invisible'
                }`}
              />

              {!remoteStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-2xl font-bold">
                      ?
                    </div>
                    <p className="mt-4 text-slate-400">
                      Waiting for participant...
                    </p>
                  </div>
                </div>
              )}

              <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm">
                Remote participant
              </span>
            </div>
          </div>

          {mediaError && (
            <div className="mt-4 shrink-0 rounded-lg border border-red-800 bg-red-950/50 p-3 text-center text-red-300">
              {mediaError}
            </div>
          )}

          <div className="mt-4 flex shrink-0 items-center justify-center gap-4">
            <button
              onClick={handleToggleMicrophone}
              disabled={microphoneLoading}
              className={`rounded-full px-6 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                microphoneEnabled
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {microphoneLoading
                ? 'Starting Mic...'
                : microphoneEnabled
                  ? 'Mic On'
                  : 'Mic Off'}
            </button>

            <button
              onClick={handleToggleCamera}
              disabled={cameraLoading}
              className={`rounded-full px-6 py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                cameraEnabled
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              {cameraLoading
                ? 'Starting Camera...'
                : cameraEnabled
                  ? 'Camera On'
                  : 'Camera Off'}
            </button>

            <button
              onClick={handleLeaveMeeting}
              className="rounded-full bg-red-600 px-6 py-3 font-medium transition hover:bg-red-500"
            >
              Leave
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Meeting
