var rec
var recording = false

function start() {
  recording = true
  rec = new DOMRecorder(document.body)
}

function stopRecording() {
  var data = rec.stop()
  console.log('data', data)
  browser.runtime.sendMessage({
    type: 'data_collected',
    data
  })
  recording = false
}

window.addEventListener('beforeunload', (event) => {
  if (recording) {
    event.preventDefault()
    stopRecording()
  }
})

browser.runtime.onMessage.addListener((message) => {
  if (message.command === "start_recording") {
    start()
  }
  if (message.command === "stop_recording") {
    stopRecording()
  }
})

function handleResponse(message) {
  console.log(`Message from the background script:  ${JSON.stringify(message)}`)
  if (message.command === "start_recording") {
    start()
  }
}

function handleError(error) {
  console.log(`Error: ${error}`)
}