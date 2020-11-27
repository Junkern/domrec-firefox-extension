const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const downloadButton = document.getElementById('download')

startButton.addEventListener('click', () => {
  startRecording()
})
stopButton.addEventListener('click', () => {
  stopRecording()
})
downloadButton.addEventListener('click', () => {
  downloadData()
})

async function startRecording() {
  startButton.disabled = true
  stopButton.disabled = false
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true
  })
  browser.tabs.sendMessage(tabs[0].id, {
    command: "start_recording",
  })
}

let collectedData

async function stopRecording() {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true
  })
  await browser.tabs.sendMessage(tabs[0].id, {
    command: "stop_recording",
  })
  var page = browser.extension.getBackgroundPage()
  console.log(`${page.collectedData[0].actions.length}`)
  collectedData = page.collectedData
  analyseData(page.collectedData)
  startButton.disabled = false
  stopButton.disabled = true
  downloadButton.disabled = false
}

function analyseData(collectedData) {
  const stringified = JSON.stringify(collectedData)
  const sizeInMB = Number(stringified.length / 1024 / 1024)
  const dataInformationElement = document.getElementById('data-information')
  dataInformationElement.innerText = `Approx. size: ${sizeInMB.toFixed(2)} MB`
}

async function downloadData() {
  const blob = new Blob([JSON.stringify(collectedData, null, 2)], {type : 'application/json'});
  const objectURL = URL.createObjectURL(blob)
  await browser.downloads.download({url: objectURL, fileName: 'DOMRecording.json'})
}