<template>
  <div class="scholarly-steps">
    <div 
      v-for="(step, index) in props.steps" 
      :key="index" 
      class="step-item"
      :class="{ 'step-active': props.activeStep === index + 1 }"
    >
      <div class="step-number">{{ index + 1 }}</div>
      <div class="step-content">
        <div class="step-title" v-if="step.title">{{ step.title }}</div>
        <div class="step-description" v-if="step.description">{{ step.description }}</div>
      </div>
      <div class="step-connector" v-if="index < props.steps.length - 1"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  title?: string
  description?: string
}

const props = withDefaults(defineProps<{
  /** Array of step objects with title and description */
  steps?: Step[]
  /** Currently active step (1-based) */
  activeStep?: number
}>(), {
  steps: () => []
})
</script>

<style scoped>
.scholarly-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}

.step-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-bottom: 1.5rem;
}

.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--scholarly-content-surface-muted, #e5e7eb);
  color: var(--scholarly-content-fg-muted, #6b7280);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.step-active .step-number {
  background: var(--slidev-theme-primary, #5d8392);
  color: var(--scholarly-content-on-primary, white);
  box-shadow: 0 0 0 4px rgba(93, 131, 146, 0.2);
}

.step-content {
  margin-left: 1rem;
  flex: 1;
}

.step-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--scholarly-content-fg, #374151);
  margin-bottom: 0.25rem;
}

.step-active .step-title {
  color: var(--scholarly-content-accent-fg, var(--slidev-theme-primary, #5d8392));
}

.step-description {
  font-size: 0.95rem;
  color: var(--scholarly-content-fg-muted, #6b7280);
  line-height: 1.5;
}

.step-connector {
  position: absolute;
  left: 1.25rem;
  top: 2.5rem;
  bottom: 0;
  width: 2px;
  background: var(--scholarly-content-border, #e5e7eb);
  transform: translateX(-50%);
}

.step-active + .step-item .step-connector,
.step-active .step-connector {
  background: linear-gradient(to bottom, var(--slidev-theme-primary, #5d8392), var(--scholarly-content-border, #e5e7eb));
}
</style>
