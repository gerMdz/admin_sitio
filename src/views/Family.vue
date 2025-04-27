<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Con quién vives?</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo Grupo Familiar" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoGrupo" />
      </div>
    </div>

    <DataTable :value="familiasFiltradas" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="description" header="Descripción" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarGrupo(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="eliminarGrupo(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Grupo Familiar" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="grupoActual.name" />
        </div>
        <div class="field">
          <label>Descripción</label>
          <InputText v-model="grupoActual.description" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarGrupo" />
      </template>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useFiltrarActivos } from '@/composables/useFiltrarActivos';
import api from '@/api/axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import ConfirmDialog from 'primevue/confirmdialog';

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
    const familias = ref([]);
    const grupoActual = ref({ id: null, name: '', description: '' });
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();
    const confirm = useConfirm();

    const auditId = store.state.user?.auditId || null;

    const familiasFiltradas = useFiltrarActivos(familias, verTodos);

    const cargarFamilias = async () => {
      try {
        const response = await api.get('/family');
        familias.value = response.data;
      } catch (error) {
        console.error('Error cargando familias', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar familias.', life: 3000 });
      }
    };

    const nuevoGrupo = () => {
      grupoActual.value = { id: null, name: '', description: '' };
      dialogVisible.value = true;
    };

    const editarGrupo = (grupo) => {
      grupoActual.value = { ...grupo };
      dialogVisible.value = true;
    };

    const guardarGrupo = async () => {
      if (!grupoActual.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 });
        return;
      }

      const payload = {
        name: grupoActual.value.name,
        description: grupoActual.value.description,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: grupoActual.value.id ? 'U' : 'I',
      };

      try {
        if (grupoActual.value.id) {
          await api.put(`/family/${grupoActual.value.id}`, payload);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Grupo familiar actualizado.', life: 3000 });
        } else {
          await api.post('/family', payload);
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Grupo familiar creado.', life: 3000 });
        }

        dialogVisible.value = false;
        await cargarFamilias();
      } catch (error) {
        console.error('Error guardando grupo', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar grupo.', life: 3000 });
      }
    };

    const eliminarGrupo = (grupo) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar este grupo familiar?',
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
            await api.delete(`/family/${grupo.id}`, { data: payload });
            toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Grupo familiar eliminado.', life: 3000 });
            await cargarFamilias();
          } catch (error) {
            console.error('Error eliminando grupo', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar grupo.', life: 3000 });
          }
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000 });
        }
      });
    };

    onMounted(async () => {
      await cargarFamilias();
    });

    return {
      familias,
      grupoActual,
      dialogVisible,
      verTodos,
      familiasFiltradas,
      nuevoGrupo,
      editarGrupo,
      guardarGrupo,
      eliminarGrupo,
    };
  },
};
</script>

<style scoped>
.p-confirm-dialog-custom {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
