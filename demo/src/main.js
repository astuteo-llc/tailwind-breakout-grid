import './style.css'
import Alpine from 'alpinejs'

// Load visualizer (always load in demo)
import('../../breakout-grid-visualizer.js').then(() => {
  Alpine.start()
})

window.Alpine = Alpine
