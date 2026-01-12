import './style.css'
import Alpine from 'alpinejs'
import { injectSharedBlocks } from './shared-blocks.js'

// Inject shared blocks before Alpine starts
injectSharedBlocks()

// Load visualizer (always load in demo)
import('../../breakout-grid-visualizer.js').then(() => {
  Alpine.start()
})

window.Alpine = Alpine
