import './style.css'
import typescriptLogo from './typescript.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <span>version: ${__LIB_VERSION__}</span>
    </div>
    <p class="read-the-docs">
      You can also type <i>__LIB_VERSION__</i> into the console to get the version number.
    </p>
  </div>
`
