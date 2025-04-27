<template>
  <ConfirmDialog
      :draggable="false"
      :closable="false"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      class="p-confirm-dialog-custom"
  />
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Estados Civiles</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo Estado Civil" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoEstadoCivil" />
      </div>
    </div>

    <DataTable :value="estadosFiltrados" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarEstadoCivil(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="eliminarEstadoCivil(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Estado Civil" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="estadoCivilActual.name" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarEstadoCivil" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import api from '@/api/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import { useFiltrarActivos } from '@/composables/useFiltrarActivos';
import ConfirmDialog from 'primevue/confirmdialog';
import {useConfirm} from 'primevue/useconfirm';


export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
    InputSwitch,
    ConfirmDialog,
  },
  setup() {
    const estadosCiviles = ref([]);
    const estadoCivilActual = ref({ id: null, name: '' });
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();
    const estadosFiltrados = useFiltrarActivos(estadosCiviles, verTodos);


    const auditId = store.state.user?.auditId || null;

    // const estadosFiltrados = computed(() => {
    //   if (verTodos.value) {
    //     return estadosCiviles.value;
    //   }
    //   return estadosCiviles.value.filter(e => e.audiAction !== 'D');
    // });

    const cargarEstadosCiviles = async () => {
      try {
        const response = await api.get('/civil_states');
        estadosCiviles.value = response.data;
      } catch (error) {
        console.error('Error cargando estados civiles', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar estados civiles.', life: 3000 });
      }
    };

    const nuevoEstadoCivil = () => {
      estadoCivilActual.value = { id: null, name: '' };
      dialogVisible.value = true;
    };

    const editarEstadoCivil = (estado) => {
      estadoCivilActual.value = { ...estado };
      dialogVisible.value = true;
    };

    const guardarEstadoCivil = async () => {
      if (!estadoCivilActual.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 });
        return;
      }

      const payload = {
        name: estadoCivilActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: estadoCivilActual.value.id ? 'U' : 'I',
      };

      try {
        if (estadoCivilActual.value.id) {
          await api.put(`/civil_states/${estadoCivilActual.value.id}`, payload);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Estado civil actualizado.', life: 3000 });
        } else {
          await api.post('/civil_states', payload);
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Estado civil creado.', life: 3000 });
        }

        dialogVisible.value = false;
        await cargarEstadosCiviles();
      } catch (error) {
        console.error('Error guardando estado civil', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar estado civil.', life: 3000 });
      }
    };

    const confirm = useConfirm();

    const eliminarEstadoCivil = (estadoCivil) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar estestado civil?',
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'No, cancelar',
        acceptClass: 'p-button-danger',
        rejectClass: 'p-button-secondary',
        accept: async () => {
          const payload = {
            audi_user: auditId,
            audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };

          try {
            await api.delete(`/civil_states/${estadoCivil.id}`, {data: payload});
            toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Estado civil eliminado correctamente.',
              life: 3000
            });
            await cargarEstadosCiviles();
          } catch (error) {
            console.error('Error eliminando estado civil', error);
            toast.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar estado civil.', life: 3000});
          }
        },
        reject: () => {
          toast.add({severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000});
        }
      });
    }

    onMounted(async () => {
      await cargarEstadosCiviles();
    });

    return {
      estadosCiviles,
      estadoCivilActual,
      dialogVisible,
      verTodos,
      estadosFiltrados,
      nuevoEstadoCivil,
      editarEstadoCivil,
      guardarEstadoCivil,
      eliminarEstadoCivil,
    };
  },
};
</script>
