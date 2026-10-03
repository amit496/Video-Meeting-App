import { useEffect, useRef, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

function Meeting() {
  const navigate = useNavigate()
  const { roomId } = useParams()

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true)

  const [mediaError, setMediaError] = useState('')

  const [cameraLoading, setCameraLoading] = useState(false)
  const [microphoneLoading, setMicrophoneLoading] =
    useState(false)

  useEffect(() => {
    const startMedia = async () => {
      try {
        setMediaError('')

        const savedCameraState =
          localStorage.getItem('meetingCameraEnabled')

        const savedMicrophoneState =
          localStorage.getItem('meetingMicrophoneEnabled')

        const shouldStartCamera =
          savedCameraState === null
            ? true
            : savedCameraState === 'true'

        const shouldStartMicrophone =
          savedMicrophoneState === null
            ? true
            : savedMicrophoneState === 'true'

        /*
         * Request only the devices that should be ON.
         *
         * Camera OFF + Mic ON:
         * video: false
         * audio: true
         *
         * Camera ON + Mic OFF:
         * video: true
         * audio: true
         * Then microphone track is stopped below.
         */
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: shouldStartCamera,
            audio: true,
          })

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        const videoTrack =
          stream.getVideoTracks()[0]

        const audioTrack =
          stream.getAudioTracks()[0]

        /*
         * Camera state
         */
        if (videoTrack) {
          setCameraEnabled(true)
        } else {
          setCameraEnabled(false)
        }

        /*
         * Microphone state
         */
        if (audioTrack) {
          if (shouldStartMicrophone) {
            audioTrack.enabled = true
            setMicrophoneEnabled(true)
          } else {
            audioTrack.stop()
            stream.removeTrack(audioTrack)

            setMicrophoneEnabled(false)
          }
        } else {
          setMicrophoneEnabled(false)
        }

        localStorage.setItem(
          'meetingCameraEnabled',
          String(Boolean(videoTrack))
        )

        localStorage.setItem(
          'meetingMicrophoneEnabled',
          String(
            Boolean(audioTrack) &&
              shouldStartMicrophone
          )
        )
      } catch (error) {
        console.error(
          'Failed to access camera and microphone:',
          error
        )

        setMediaError(
          'Camera and microphone access is required for the meeting.'
        )

        setCameraEnabled(false)
        setMicrophoneEnabled(false)
      }
    }

    startMedia()

    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop()
          })

        streamRef.current = null
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [])

  /*
   * ==============================
   * MICROPHONE TOGGLE
   * ==============================
   */
  const handleToggleMicrophone = async () => {
    if (microphoneLoading) {
      return
    }

    try {
      setMediaError('')

      /*
       * ==============================
       * MICROPHONE OFF
       * ==============================
       */
      if (microphoneEnabled) {
        if (streamRef.current) {
          const audioTracks =
            streamRef.current.getAudioTracks()

          audioTracks.forEach((track) => {
            track.stop()
            streamRef.current.removeTrack(track)
          })
        }

        setMicrophoneEnabled(false)

        localStorage.setItem(
          'meetingMicrophoneEnabled',
          'false'
        )

        return
      }

      /*
       * ==============================
       * MICROPHONE ON
       * ==============================
       */
      setMicrophoneLoading(true)

      const microphoneStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        })

      const newAudioTrack =
        microphoneStream.getAudioTracks()[0]

      if (!newAudioTrack) {
        throw new Error(
          'Microphone could not be started'
        )
      }

      if (!streamRef.current) {
        streamRef.current = new MediaStream()
      }

      streamRef.current.addTrack(newAudioTrack)

      setMicrophoneEnabled(true)

      localStorage.setItem(
        'meetingMicrophoneEnabled',
        'true'
      )
    } catch (error) {
      console.error(
        'Microphone toggle error:',
        error
      )

      setMicrophoneEnabled(false)

      localStorage.setItem(
        'meetingMicrophoneEnabled',
        'false'
      )

      setMediaError(
        'Unable to access the microphone. Please check microphone permission.'
      )
    } finally {
      setMicrophoneLoading(false)
    }
  }

  /*
   * ==============================
   * CAMERA TOGGLE
   * ==============================
   */
  const handleToggleCamera = async () => {
    if (cameraLoading) {
      return
    }

    try {
      setMediaError('')

      /*
       * ==============================
       * CAMERA OFF
       * ==============================
       */
      if (cameraEnabled) {
        if (streamRef.current) {
          const videoTracks =
            streamRef.current.getVideoTracks()

          videoTracks.forEach((track) => {
            track.stop()
            streamRef.current.removeTrack(track)
          })
        }

        if (videoRef.current) {
          videoRef.current.srcObject =
            streamRef.current
        }

        setCameraEnabled(false)

        localStorage.setItem(
          'meetingCameraEnabled',
          'false'
        )

        return
      }

      /*
       * ==============================
       * CAMERA ON
       * ==============================
       */
      setCameraLoading(true)

      const cameraStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        })

      const newVideoTrack =
        cameraStream.getVideoTracks()[0]

      if (!newVideoTrack) {
        throw new Error(
          'Camera could not be started'
        )
      }

      if (!streamRef.current) {
        streamRef.current = new MediaStream()
      }

      streamRef.current.addTrack(newVideoTrack)

      if (videoRef.current) {
        videoRef.current.srcObject =
          streamRef.current

        await videoRef.current
          .play()
          .catch(() => {})
      }

      setCameraEnabled(true)

      localStorage.setItem(
        'meetingCameraEnabled',
        'true'
      )
    } catch (error) {
      console.error(
        'Camera toggle error:',
        error
      )

      setCameraEnabled(false)

      localStorage.setItem(
        'meetingCameraEnabled',
        'false'
      )

      setMediaError(
        'Unable to access the camera. Please check camera permission.'
      )
    } finally {
      setCameraLoading(false)
    }
  }

  /*
   * ==============================
   * LEAVE MEETING
   * ==============================
   */
  const handleLeaveMeeting = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop()
        })

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    navigate('/dashboard')
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white">
      <div className="flex h-full flex-col">

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">
              Video Meeting
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Meeting ID: {roomId}
            </p>
          </div>

          <button
            onClick={handleLeaveMeeting}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-500"
          >
            Leave Meeting
          </button>
        </header>

        {/* Meeting Area */}
        <main className="flex min-h-0 flex-1 flex-col p-6">

          {/* Video Grid */}
          <div className="grid min-h-0 flex-1 gap-6 md:grid-cols-2">

            {/* Your Video */}
            <div className="relative min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover -scale-x-100 ${
                  cameraEnabled
                    ? 'visible'
                    : 'invisible'
                }`}
              />

              {!cameraEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-2xl font-bold">
                      You
                    </div>

                    <p className="mt-4 text-slate-400">
                      Camera is off
                    </p>

                  </div>
                </div>
              )}

              <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm">
                You
              </span>

            </div>

            {/* Remote Participant */}
            <div className="relative min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

              <div className="flex h-full items-center justify-center">
                <div className="text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-2xl font-bold">
                    ?
                  </div>

                  <p className="mt-4 text-slate-400">
                    Waiting for participant...
                  </p>

                </div>
              </div>

              <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm">
                Remote participant
              </span>

            </div>

          </div>

          {/* Media Error */}
          {mediaError && (
            <div className="mt-4 shrink-0 rounded-lg border border-red-800 bg-red-950/50 p-3 text-center text-red-300">
              {mediaError}
            </div>
          )}

          {/* Controls */}
          <div className="mt-4 flex shrink-0 items-center justify-center gap-4">

            {/* Microphone */}
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

            {/* Camera */}
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

            {/* Leave */}
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
