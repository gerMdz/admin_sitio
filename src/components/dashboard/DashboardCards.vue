<template>
  <div class="grid grid-cols-12 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="col-span-12 sm:col-span-6 xl:col-span-3"
    >
      <div class="card p-4 shadow-md">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">{{ card.label }}</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ card.value }}</div>
          </div>
          <div
            class="flex items-center justify-center rounded-border"
            :class="card.bg"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i :class="['pi', card.icon, card.color, '!text-xl']"></i>
          </div>
        </div>
        <span class="text-primary font-medium">{{ card.subtext }}</span>
        <span class="text-muted-color">{{ card.note }}</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'DashboardCards',
  props: {
    data: Object
  },
  computed: {
    cards() {
      return [
        {
          label: 'Fichas cargadas',
          value: this.data.totalMembers,
          icon: 'pi-users',
          color: 'text-cyan-500',
          bg: 'bg-cyan-100 dark:bg-cyan-400/10',
          subtext: '',
          note: ''
        },
        {
          label: 'Encuestas realizadas',
          value: this.data.completeSurveys,
          icon: 'pi-check-square',
          color: 'text-green-500',
          bg: 'bg-green-100 dark:bg-green-400/10',
          subtext: '',
          note: ''
        }
        // Agregá más si querés
      ];
    }
  }
};
</script>
