// Utility functions for theorem numbering

/**
 * Reset all theorem counters to zero
 * Useful when reloading or restarting the presentation
 */
export function resetTheoremCounters() {
    if (typeof window !== 'undefined') {
        (window as any).__theoremCounters = {
            theorem: 0,
            lemma: 0,
            proposition: 0,
            corollary: 0,
            definition: 0,
            example: 0,
            remark: 0
        }
    }
}

/**
 * Reset a specific type of theorem counter
 */
export function resetTheoremCounter(type: string) {
    if (typeof window !== 'undefined') {
        const counters = (window as any).__theoremCounters
        if (counters && counters[type] !== undefined) {
            counters[type] = 0
        }
    }
}

/**
 * Get current counter value for a specific type
 */
export function getTheoremCounter(type: string): number {
    if (typeof window !== 'undefined') {
        const counters = (window as any).__theoremCounters
        return counters?.[type] || 0
    }
    return 0
}
