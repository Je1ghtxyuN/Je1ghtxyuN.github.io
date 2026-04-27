function writeAscii(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index))
  }
}

function createSilentWavDataUri(durationSeconds = 1) {
  const sampleRate = 8000
  const frameCount = Math.max(1, Math.floor(durationSeconds * sampleRate))
  const dataSize = frameCount
  const buffer = new Uint8Array(44 + dataSize)
  const view = new DataView(buffer.buffer)

  writeAscii(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeAscii(view, 8, 'WAVE')
  writeAscii(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate, true)
  view.setUint16(32, 1, true)
  view.setUint16(34, 8, true)
  writeAscii(view, 36, 'data')
  view.setUint32(40, dataSize, true)
  buffer.fill(128, 44)

  let binary = ''
  buffer.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return `data:audio/wav;base64,${window.btoa(binary)}`
}

const silentLoopSource = createSilentWavDataUri()

export const AMBIENT_TRACKS = Object.freeze([
  {
    id: 'deep-focus-placeholder',
    title: 'Deep Focus Placeholder',
    src: silentLoopSource,
    note: 'Silent local placeholder used to exercise the audio controller.',
  },
  {
    id: 'late-night-placeholder',
    title: 'Late Night Placeholder',
    src: silentLoopSource,
    note: 'Future local bundled ambience slot for packaged Study Room audio.',
  },
])
