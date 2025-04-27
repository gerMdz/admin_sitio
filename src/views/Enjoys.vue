<template>
  <ConfirmDialog
      :draggable="false"
      :closable="false"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      class="p-confirm-dialog-custom"
  />
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Disfrutes</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo Disfrute" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoEnjoy" />
      </div>
    </div>

    <DataTable :value="enjoysFiltrados" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarEnjoy(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="eliminarEnjoy(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Disfrute" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="enjoyActual.name" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarEnjoy" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { useFiltrarActivos } from '@/composables/useFiltrarActivos';
import api from '@/api/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
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
    ConfirmDialog
  },
  setup() {
    const enjoys = ref([]);
    const enjoyActual = ref({ id: null, name: '' });
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();

    const auditId = store.state.user?.auditId || null;

    const enjoysFiltrados = useFiltrarActivos(enjoys, verTodos);

    const cargarEnjoys = async () => {
      try {
        const response = await api.get('/enjoys');
        enjoys.value = response.data;
      } catch (error) {
        console.error('Error cargando disfrutes', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar disfrutes.', life: 3000 });
      }
    };

    const nuevoEnjoy = () => {
      enjoyActual.value = { id: null, name: '' };
      dialogVisible.value = true;
    };

    const editarEnjoy = (enjoy) => {
      enjoyActual.value = { ...enjoy };
      dialogVisible.value = true;
    };

    const guardarEnjoy = async () => {
      if (!enjoyActual.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 });
        return;
      }

      const payload = {
        name: enjoyActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: enjoyActual.value.id ? 'U' : 'I',
      };

      try {
        if (enjoyActual.value.id) {
          await api.put(`/enjoys/${enjoyActual.value.id}`, payload);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Disfrute actualizado.', life: 3000 });
        } else {
          await api.post('/enjoys', payload);
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Disfrute creado.', life: 3000 });
        }

        dialogVisible.value = false;
        await cargarEnjoys();
      } catch (error) {
        console.error('Error guardando disfrute', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar disfrute.', life: 3000 });
      }
    };

    const confirm = useConfirm();
    const eliminarEnjoy = (enjoy) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar este item?',
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
            await api.delete(`/enjoys/${enjoy.id}`, {data: payload});
            toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Item eliminado correctamente.',
              life: 3000
            });
            await cargarEnjoys();
          } catch (error) {
            console.error('Error eliminando item', error);
            toast.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar item.', life: 3000});
          }
        },
        reject: () => {
          toast.add({severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000});
        }
      });
    }

    onMounted(async () => {
      await cargarEnjoys();
    });

    return {
      enjoys,
      enjoyActual,
      dialogVisible,
      verTodos,
      enjoysFiltrados,
      nuevoEnjoy,
      editarEnjoy,
      guardarEnjoy,
      eliminarEnjoy,
    };
  },
};
</script>
