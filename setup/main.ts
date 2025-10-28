import { defineAppSetup } from '@slidev/types'
import Theorem from '../components/Theorem.vue'
import { resetTheoremCounters } from '../utils/theorem'

export default defineAppSetup(({ app, router }) => {
  // Register Theorem component globally
  app.component('Theorem', Theorem)
  
  // Reset theorem counters when navigating to first slide or reloading
  router.afterEach((to) => {
    if (to.path === '/1' || to.path === '/') {
      resetTheoremCounters()
    }
  })
})
