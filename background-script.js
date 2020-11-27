var collectedData = []

browser.runtime.onMessage.addListener(notify)

function notify(message, sender, sendResponse) {
    console.log('incoming message background script')

    if (message.type === 'data_collected') {
        collectedData = collectedData.concat(message.data)
    }
}
