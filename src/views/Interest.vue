<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Cuáles son tus áreas de interés?</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo Interés" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoInteres" />
      </div>
    </div>

    <DataTable :value="interesesFiltrados" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarInteres(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="eliminarInteres(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Área de Interés" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="interesActual.name" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarInteres" />
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
    const intereses = ref([]);
    const interesActual = ref({ id: null, name: '' });
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();
    const confirm = useConfirm();

    const auditId = store.state.user?.auditId || null;

    const interesesFiltrados = useFiltrarActivos(intereses, verTodos);

    const cargarIntereses = async () => {
      try {
        const response = await api.get('/interests');
        intereses.value = response.data;
      } catch (error) {
        console.error('Error cargando intereses', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar intereses.', life: 3000 });
      }
    };

    const nuevoInteres = () => {
      interesActual.value = { id: null, name: '' };
      dialogVisible.value = true;
    };

    const editarInteres = (interes) => {
      interesActual.value = { ...interes };
      dialogVisible.value = true;
    };

    const guardarInteres = async () => {
      if (!interesActual.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 });
        return;
      }

      const payload = {
        name: interesActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: interesActual.value.id ? 'U' : 'I',
      };

      try {
        if (interesActual.value.id) {
          await api.put(`/interests/${interesActual.value.id}`, payload);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Área de interés actualizada.', life: 3000 });
        } else {
          await api.post('/interests', payload);
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Área de interés creada.', life: 3000 });
        }

        dialogVisible.value = false;
        await cargarIntereses();
      } catch (error) {
        console.error('Error guardando interés', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar interés.', life: 3000 });
      }
    };

    const eliminarInteres = (interes) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar este interés?',
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
            await api.delete(`/interests/${interes.id}`, { data: payload });
            toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Área de interés eliminada.', life: 3000 });
            await cargarIntereses();
          } catch (error) {
            console.error('Error eliminando interés', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar interés.', life: 3000 });
          }
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000 });
        }
      });
    };

    onMounted(async () => {
      await cargarIntereses();
    });

    return {
      intereses,
      interesActual,
      dialogVisible,
      verTodos,
      interesesFiltrados,
      nuevoInteres,
      editarInteres,
      guardarInteres,
      eliminarInteres,
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
