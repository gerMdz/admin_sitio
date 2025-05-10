<script setup>
import {ref, computed} from 'vue';
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const props = defineProps({
  members: Array
});

const membersData = computed(() => props.members || []);

function formatearFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">Últimas fichas agregadas</div>
    <DataTable
      :value="membersData"
      :rows="10"
      stripedRows
      tableStyle="min-width: 100%"
    >
      <Column field="lastname" header="Apellido" sortable/>
      <Column field="name" header="Nombre" sortable/>
      <Column field="dniDocument" header="DNI" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="email" header="Email" sortable/>
      <Column field="phone" header="Tel." sortable/>
      <Column header="Cumpleaños" sortable>
        <template #body="slotProps">
          {{ formatearFecha(slotProps.data.birthdate) }}
        </template>
      </Column>
      <Column header="Ver" style="width: 15%">
        <template #body="slotProps">
          <Button icon="pi pi-search" class="p-button-text" @click="$emit('ver-detalle', slotProps.data)"/>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
