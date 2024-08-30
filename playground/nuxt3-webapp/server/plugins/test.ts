export default defineNitroPlugin((nitroApp) => {
  // console.log('-----------------')
  nitroApp.hooks.hook('render:html', (html) => {
    // console.log('render:html', html)
    html.bodyAppend.push('<hr>Appended by custom plugin')
  })
})
