import App from './app'

async function exportWord(dom, config) {
  const installApp = new App(dom, config)
  await installApp.init()
  installApp.exportWord()
}

export default exportWord

