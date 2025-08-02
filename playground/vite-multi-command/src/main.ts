// Multi-Command Version Mark Demo

// Display version information from global variables
function displayVersionInfo() {
  const examples = [
    {
      id: 'simple-version',
      globalVar: '__MULTI_COMMAND_SIMPLE_VERSION__',
      description: 'Simple multi-command with default separator',
    },
    {
      id: 'advanced-version', 
      globalVar: '__MULTI_COMMAND_ADVANCED_VERSION__',
      description: 'Advanced multi-command with custom format',
    },
    {
      id: 'error-demo-version',
      globalVar: '__MULTI_COMMAND_ERROR_DEMO_VERSION__',
      description: 'Error handling demonstration',
    },
    {
      id: 'separator-version',
      globalVar: '__MULTI_COMMAND_SEPARATOR_VERSION__',
      description: 'Custom separator example',
    },
  ]

  examples.forEach(example => {
    const element = document.getElementById(example.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const version = (window as any)[example.globalVar]
    
    if (element) {
      if (version) {
        element.innerHTML = `
          <div class="success">✅ ${version}</div>
          <small>Global variable: <code>window.${example.globalVar}</code></small>
        `
      } else {
        element.innerHTML = `
          <div class="error">❌ Version not found</div>
          <small>Expected global variable: <code>window.${example.globalVar}</code></small>
        `
      }
    }
  })
}

// Log all available version variables
function logVersionVariables() {
  console.group('🚀 Multi-Command Version Information')
  
  const versionVars = Object.keys(window).filter(key => 
    key.includes('VERSION') && key.startsWith('__'),
  )
  
  if (versionVars.length > 0) {
    console.log('Available version variables:')
    versionVars.forEach(varName => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(`  ${varName}: ${(window as any)[varName]}`)
    })
  } else {
    console.warn('No version variables found. Make sure the plugin is configured correctly.')
  }
  
  console.groupEnd()
}

// Display meta tag information
function logMetaTags() {
  console.group('📋 Meta Tags Information')
  
  const metaTags = document.querySelectorAll('meta[name="application-name"]')
  if (metaTags.length > 0) {
    console.log('Found version meta tags:')
    metaTags.forEach((tag, index) => {
      console.log(`  Meta ${index + 1}: ${tag.getAttribute('content')}`)
    })
  } else {
    console.warn('No version meta tags found.')
  }
  
  console.groupEnd()
}

// Initialize demo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎉 Multi-Command Version Mark Demo Loaded!')
  
  // Display version information
  displayVersionInfo()
  
  // Log debug information
  logVersionVariables()
  logMetaTags()
  
  // Add some interactive features
  console.log('💡 Try these commands in the console:')
  console.log('  - Object.keys(window).filter(k => k.includes("VERSION"))')
  console.log('  - document.querySelectorAll(\'meta[name="application-name"]\')')
});

// Export for console access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).demoUtils = {
  displayVersionInfo,
  logVersionVariables,
  logMetaTags,
}
