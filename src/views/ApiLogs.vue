<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Registros del sistema (Logs API)</h2>

    <div class="mb-3 flex items-center gap-2">
      <Select
        v-model="filterType"
        :options="logTypes"
        optionLabel="label"
        optionValue="value"
        placeholder="Filtrar por tipo"
        class="w-60"
      />

      <Button label="Actualizar" icon="pi pi-refresh" @click="fetchLogs"/>
    </div>

    <DataTable
      :value="logs"
      stripedRows
      responsiveLayout="scroll"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
    >
      <Column field="id" header="ID" style="width: 80px"/>
      <Column field="type" header="Tipo" style="width: 150px"/>
      <Column field="message" header="Mensaje"/>
      <Column field="logged_at" header="Fecha" style="width: 180px"/>
      <Column header="Contexto">
        <template #body="slotProps">
          <div v-if="slotProps.data.context" class="text-xs whitespace-pre-wrap">
            <div v-for="(val, key) in slotProps.data.context" :key="key">
              <strong>{{ key }}:</strong> {{ val }}
            </div>
          </div>
          <div v-else class="text-muted text-xs italic">Sin datos</div>
        </template>
      </Column>
      <Column header="Ver">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-text text-primary"
            @click="showDetails(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Dialog
      header="Detalle del log"
      v-model:visible="showDialog"
      modal
      class="w-full md:w-2/3 lg:w-1/2"
    >
      <div class="space-y-2">
        <div>
          <strong>ID:</strong> {{ selectedLog?.id }}<br>
          <strong>Tipo:</strong> {{ selectedLog?.type }}<br>
          <strong>Mensaje:</strong> {{ selectedLog?.message }}<br>
          <strong>Fecha:</strong> {{ selectedLog?.logged_at }}
        </div>
        <div>
          <strong>Contexto:</strong>
          <pre class="text-sm whitespace-pre-wrap bg-gray-100 rounded p-2">
{{ formattedContext }}
          </pre>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {getApiLogs} from '@/services/system.service.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const allLogs = ref([]);
const logs = ref([]);
const filterType = ref(null);

const selectedLog = ref(null);
const showDialog = ref(false);

const logTypes = [
  {label: 'Todos', value: null},
  {label: 'Errores', value: 'error'},
  {label: 'Corrupción de datos', value: 'data_corruption'},
  {label: 'Warning', value: 'warning'},
];

const fetchLogs = async () => {
  const res = await getApiLogs();
  allLogs.value = res.data;
  applyFilter();
};

const applyFilter = () => {
  logs.value = filterType.value
    ? allLogs.value.filter(log => log.type === filterType.value)
    : allLogs.value;
};


const showDetails = (log) => {
  selectedLog.value = log;
  showDialog.value = true;
};

const formattedContext = computed(() =>
  selectedLog.value?.context
    ? JSON.stringify(selectedLog.value.context, null, 2)
    : 'Sin datos'
);

watch(filterType, applyFilter);


onMounted(fetchLogs);
</script>
