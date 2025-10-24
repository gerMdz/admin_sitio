<script setup>
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

const props = defineProps({
  members: Array
});

const router = useRouter();

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

function verDetalle(id) {
  router.push({name: 'MemberShow', params: {id}});
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
      <Column field="phone" header="Tel." sortable/>
      <Column field="birthdate" header="Cumpleaños" sortable>
        <template #body="slotProps">
          {{ formatearFecha(slotProps.data.birthdate) }}
        </template>
      </Column>
      <Column header="Ver" style="width: 15%">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-text" @click="verDetalle(slotProps.data.id)"/>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
