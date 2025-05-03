<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Etapas de Vida de los Miembros</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
      </div>
    </div>

    <div class="flex gap-2 mb-3">
      <Dropdown
          v-model="filtroMiembro"
          :options="miembros"
          optionLabel="label"
          optionValue="id"
          placeholder="Filtrar por miembro"
          showClear
          filter
      />

      <Dropdown
          v-model="filtroEtapa"
          :options="etapas"
          optionLabel="label"
          optionValue="id"
          placeholder="Filtrar por etapa"
          showClear
          filter
      />


    </div>

    <DataTable :value="filtrados" responsiveLayout="scroll">
      <Column header="Miembro">
        <template #body="slotProps">
          {{ nombreConDni(slotProps.data.member) }}
        </template>
      </Column>

      <Column field="lifeStage.nombre" header="Etapa de Vida"/>

      <Column header="Estado">
        <template #body="slotProps">
          {{ slotProps.data.audiAction === 'D' ? '❌' : '✔️' }}
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-text" @click="verDetalle(slotProps.data)"/>
          <Button icon="pi pi-pencil" class="p-button-text" @click="editar(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="confirmarEliminacion(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog
        v-model:visible="mostrarForm"
        modal
        dismissableMask
        header="Editar Etapa de Vida"
        :style="{ width: '40vw' }"
    >
      <FormMemberLifeStage :registro="registroSeleccionado" @cerrar="cerrarForm" @guardado="cargarDatos"/>
    </Dialog>

    <Dialog
        v-model:visible="mostrarDetalle"
        modal
        dismissableMask
        header="Detalle de la etapa de vida"
        :style="{ width: '500px' }"
    >
      <div class="mb-2">
        <h6 class="mb-0">Miembro</h6>
        <h4 class="mt-0">{{ nombreConDni(registroSeleccionado?.member) }}</h4>
      </div>

      <div class="mb-2">
        <h6 class="mb-0">Etapa de Vida</h6>
        <h4 class="mt-0">{{ registroSeleccionado?.lifeStage?.nombre }}</h4>
      </div>

      <hr class="my-3 border-gray-300"/>

      <div class="mb-2">
        <h6 class="mt-3 mb-2">Datos internos</h6>
        <p><strong>Usuario:</strong> {{ registroSeleccionado?.audiUser ?? 'No registrado' }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(registroSeleccionado?.audiDate) }}</p>
        <p><strong>Acción:</strong>
          {{
            registroSeleccionado?.audiAction === 'I' ? 'Creación' :
                registroSeleccionado?.audiAction === 'U' ? 'Actualización' :
                    registroSeleccionado?.audiAction === 'D' ? 'Eliminación ❌' :
                        'No registrada'
          }}
        </p>
      </div>

      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="mostrarDetalle = false"/>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import {useConfirm} from 'primevue/useconfirm';
import debounce from 'lodash/debounce';
import {onBeforeUnmount} from 'vue';

import {deleteMemberLifeStage, getMemberLifeStages} from '@/services/memberLifeStage.service.js';
import {getComboLifeStages, getComboMembers} from '@/services/combo.service';
import FormMemberLifeStage from '@/components/FormMemberLifeStage.vue';

const datos = ref([]);
const mostrarForm = ref(false);
const mostrarDetalle = ref(false);
const verTodos = ref(false);
const miembros = ref([]);
const etapas = ref([]);

const filtroMiembro = ref(null);
const filtroEtapa = ref(null);
const registroSeleccionado = ref(null);
const confirm = useConfirm();

const cargarDatos = async () => {
  datos.value = await getMemberLifeStages(verTodos.value);
};

const cargarCombos = async () => {
  miembros.value = await getComboMembers(); // ya devuelve array
  etapas.value = await getComboLifeStages(); // ya devuelve array
};

const filtrados = computed(() => {
  return datos.value.filter(d =>
      (!filtroMiembro.value || d.member?.id === filtroMiembro.value) &&
      (!filtroEtapa.value || d.lifeStage?.id === filtroEtapa.value)
  );
});

const editar = (registro) => {
  registroSeleccionado.value = registro;
  mostrarForm.value = true;
};

const verDetalle = (registro) => {
  registroSeleccionado.value = registro;
  mostrarDetalle.value = true;
};

const cerrarForm = () => {
  mostrarForm.value = false;
  registroSeleccionado.value = null;
};

const confirmarEliminacion = (item) => {
  confirm.require({
    message: `¿Seguro que deseas eliminar la etapa "${item.lifeStage.nombre}" de ${nombreConDni(item.member)}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'No, cancelar',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await deleteMemberLifeStage(item.id);
      await cargarDatos();
    }
  });
};

const cargarDatosDebounced = debounce(() => {
  cargarDatos();
}, 300);

function nombreConDni(miembro) {
  if (!miembro?.nombre) return '';
  return `${miembro.nombre.name} ${miembro.nombre.lastname} (${miembro.dni})`;
}

function formatearFecha(fecha) {
  if (!fecha) return 'No registrada';
  return new Date(fecha).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

onBeforeUnmount(() => {
  cargarDatosDebounced.cancel();
});

onMounted(async () => {
  await cargarCombos();
  await cargarDatos(verTodos.value);
});


watch(verTodos, () => {
  cargarDatosDebounced();
});

watch([filtroEtapa, etapas], () => {
  console.log('Filtro Etapa:', filtroEtapa.value);
  console.log('Etapas:', etapas.value);
});

</script>
