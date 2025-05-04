<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Necesidades de los Miembros</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"
                     v-tooltip="'Alternar entre activos y todos los registros eliminados o modificados'"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
      </div>
    </div>

    <div class="flex gap-2 mb-3">
      <MultiSelect
          v-model="filtroMiembros"
          :options="miembros"
          optionLabel="label"
          optionValue="id"
          placeholder="Filtrar por miembro(s)"
          display="chip"
          filter
          @filter="onBuscarMiembros"
          :loading="cargandoMiembros"
          class="w-40rem"
          v-tooltip="'Buscar y seleccionar uno o más miembros para filtrar'"
      />

      <Dropdown
          v-model="filtroNecesidad"
          :options="necesidades"
          optionLabel="label"
          optionValue="id"
          placeholder="Filtrar por necesidad"
          showClear
          filter
          v-tooltip="'Filtrar los resultados según la necesidad asociada'"
      />


    </div>

    <DataTable :value="filtrados" responsiveLayout="scroll">
      <Column header="Miembro">
        <template #body="slotProps">
          {{ nombreConDni(slotProps.data.member) }}
        </template>
      </Column>

      <Column field="need.nombre" header="Necesidades"/>
      <Column header="Estado">
        <template #body="slotProps">
          {{ slotProps.data.audiAction === 'D' ? '❌' : '✔️' }}
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="slotProps">
          <Button
              icon="pi pi-eye"
              class="p-button-text"
              v-tooltip.top.delay="300"
              v-tooltip="'Ver detalle'"
              @click="verDetalle(slotProps.data)"
          />
          <Button
              icon="pi pi-pencil"
              class="p-button-text"
              v-tooltip.top.delay="300"
              v-tooltip="'Editar'"
              @click="editar(slotProps.data)"
          />
          <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              v-tooltip.top.delay="300"
              v-tooltip="'Eliminar'"
              @click="confirmarEliminacion(slotProps.data)"
          />

        </template>
      </Column>
    </DataTable>

    <Dialog
        v-model:visible="mostrarForm"
        modal
        dismissableMask
        header="Editar Necesidad"
        :style="{ width: '40vw' }"
    >
      <FormMemberNeed :registro="registroSeleccionado" @cerrar="cerrarForm" @guardado="cargarDatos"/>
    </Dialog>

    <Dialog
        v-model:visible="mostrarDetalle"
        modal
        dismissableMask
        header="Detalle de la necesidad"
        :style="{ width: '500px' }"
    >
      <div class="mb-2">
        <h6 class="mb-0">Miembro</h6>
        <h4 class="mt-0">{{ nombreConDni(registroSeleccionado?.member) }}</h4>
      </div>

      <div class="mb-2">
        <h6 class="mb-0">Necesidad</h6>
        <h4 class="mt-0">{{ registroSeleccionado?.need?.nombre }}</h4>
      </div>

      <hr class="my-3 border-gray-300"/>

      <div class="mb-2">
        <h6 class="mt-3 mb-2">Datos internos</h6>
        <p><strong>Usuario:</strong> {{ registroSeleccionado?.audiUser ?? 'No registrado' }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(registroSeleccionado?.audiDate) }}</p>
        <p><strong>Acción:</strong> {{ auditoriaLabel(registroSeleccionado?.audiAction) }}</p>

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
import MultiSelect from "primevue/multiselect";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import {useConfirm} from 'primevue/useconfirm';
import debounce from 'lodash/debounce';
import {onBeforeUnmount} from 'vue';
import {deleteMemberNeed, getMemberNeeds} from '@/services/memberNeed.service.js';
import {getComboNeeds, getComboMembers} from '@/services/combo.service';
import FormMemberNeed from '@/components/FormMemberNeed.vue';
import {nombreConDni, formatearFecha, auditoriaLabel} from '@/utils';


const filtroMiembros = ref([]); // reemplaza a filtroMiembro
const miembros = ref([]);
const cargandoMiembros = ref(false);
const onBuscarMiembros = async (event) => {
  cargandoMiembros.value = true;
  const texto = event?.value || '';
  miembros.value = await getComboMembers(texto);
  cargandoMiembros.value = false;
};

const datos = ref([]);
const mostrarForm = ref(false);
const mostrarDetalle = ref(false);
const verTodos = ref(false);
const necesidades = ref([]);

const filtroNecesidad = ref(null);
const registroSeleccionado = ref(null);
const confirm = useConfirm();

const cargarDatos = async () => {
  datos.value = await getMemberNeeds(verTodos.value);
};

const cargarCombos = async () => {
  miembros.value = await getComboMembers();
  necesidades.value = await getComboNeeds();
};

const filtrados = computed(() => {
  return datos.value.filter(d =>
      (filtroMiembros.value.length === 0 || filtroMiembros.value.includes(d.member?.id)) &&
      (!filtroNecesidad.value || d.need?.id === filtroNecesidad.value)
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
    message: `¿Seguro que deseas eliminar la necesidad "${item.need.nombre}" de ${nombreConDni(item.member)}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí, eliminar',
    rejectLabel: 'No, cancelar',
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary',
    accept: async () => {
      await deleteMemberNeed(item.id);
      await cargarDatos();
    }
  });
};

const cargarDatosDebounced = debounce(() => {
  cargarDatos();
}, 200);

onBeforeUnmount(() => {
  cargarDatosDebounced.cancel();
});

onMounted(async () => {
  await cargarCombos();
  await cargarDatos(verTodos.value);
  await onBuscarMiembros({value: ''});
  await onBuscarMiembros({value: ''});
});


watch(verTodos, () => {
  cargarDatosDebounced();
});

watch([filtroNecesidad, necesidades], () => {
  console.log('Filtro Necesidad:', filtroNecesidad.value);
  console.log('Necesidades:', necesidades.value);
});

</script>
