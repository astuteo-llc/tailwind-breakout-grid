import './style-lite.css'
import Alpine from 'alpinejs'

// Load lite visualizer (read-only, no config editing)
import('../../src/visualizer/index-lite.js').then(() => {
  Alpine.start()
})

window.Alpine = Alpine
