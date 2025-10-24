<template>
  <div class="stats-page min-w-full max-w-none px-4 py-6">

    <div class="flex flex-wrap -mx-2">
      <div
        v-for="card in cards"
        :key="card.label"
        class="w-full sm:w-1/2 xl:w-1/4 px-2 mb-4"
      >
        <div class="card p-4 shadow-md bg-white h-full">
          <!-- contenido -->
        </div>
      </div>
    </div>

    <div class="card mt-6 p-4 shadow-md bg-white">
      <h2 class="text-lg font-semibold mb-4">Últimos miembros</h2>
      <ul>
        <li
          v-for="member in latestMembers"
          :key="member.id"
          class="flex justify-between py-2 border-b"
        >
          <span>{{ member.name }} <small class="text-gray-500">({{ member.dni }})</small></span>
          <Button icon="pi pi-eye" class="p-button-text"/>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import Button from 'primevue/button';

export default {
  name: 'TestStats',
  components: {Button},
  data() {
    return {
      cards: [
        {
          label: 'Ichas cargadasssss',
          value: 1234,
          icon: 'pi-users',
          color: 'text-cyan-500',
          bg: 'bg-cyan-100 dark:bg-cyan-400/10',
          subtext: '',
          note: ''
        },
        {
          label: 'Encuestas realizadas',
          value: 456,
          icon: 'pi-check-square',
          color: 'text-green-500',
          bg: 'bg-green-100 dark:bg-green-400/10',
          subtext: '',
          note: ''
        },
        {
          label: 'Viven solos',
          value: 89,
          icon: 'pi-user-minus',
          color: 'text-orange-500',
          bg: 'bg-orange-100 dark:bg-orange-400/10',
          subtext: '',
          note: ''
        },
        {
          label: 'Convivencias',
          value: 300,
          icon: 'pi-home',
          color: 'text-blue-500',
          bg: 'bg-blue-100 dark:bg-blue-400/10',
          subtext: '',
          note: ''
        }
      ],
      latestMembers: [
        {id: 1, name: 'Juan Pérez', dni: '12345678'},
        {id: 2, name: 'María López', dni: '23456789'},
        {id: 3, name: 'Carlos García', dni: '34567890'}
      ]
    };
  },
  methods: {
    verDetalle(member) {
      console.log('Ver detalle de', member);
    }
  }
};
</script>
<style>
/* Fuerza el área que contiene tus tarjetas a usar todo el ancho real */
.stats-page {
  width: 100% !important;
  max-width: none !important;
  min-width: 100vw !important;
  flex-grow: 1 !important;
  flex-shrink: 0 !important;
}

.stats-page > .flex {
  width: 100% !important;
  max-width: 100% !important;
}

</style>



