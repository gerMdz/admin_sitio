<template>
  <div class="w-full">
    <div v-for="card in cards" :key="card.label" class="mb-4">
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-2">{{ card.label }}</span>
            <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">
              {{ card.value }}
            </div>
          </div>
          <div
            class="flex items-center justify-center rounded-full"
            :class="[card.bg]"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i :class="['pi', card.icon, card.color, '!text-xl']"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardCards',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    cards() {
      return [
        {
          label: 'Total de Miembros',
          value: this.data.totalMembers || 0,
          icon: 'pi-users',
          color: 'text-cyan-500',
          bg: 'bg-cyan-100 dark:bg-cyan-400/10',
          detail: this.data.newMembers || 0,
          subdetail: 'nuevos miembros'
        },
        {
          label: 'Encuestas Realizadas',
          value: this.data.completeSurveys || 0,
          icon: 'pi-check-square',
          color: 'text-blue-500',
          bg: 'bg-blue-100 dark:bg-blue-400/10',
          detail: this.data.newSurveys || 0,
          subdetail: 'encuestas nuevas'
        }
      ];
    }
  }
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>


