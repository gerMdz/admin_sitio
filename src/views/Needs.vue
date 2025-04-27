<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Cuáles son tus necesidades?</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nueva Necesidad" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevaNecesidad" />
      </div>
    </div>

    <DataTable :value="needsFiltradas" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarNecesidad(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="eliminarNecesidad(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Necesidad" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="needActual.name" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarNecesidad" />
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
import needService from '@/services/need.service'; // ← usamos nuestro servicio propio
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
    const needs = ref([]);
    const needActual = ref({ id: null, name: '' });
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();
    const confirm = useConfirm();

    const auditId = store.state.user?.auditId || null;

    const needsFiltradas = useFiltrarActivos(needs, verTodos);

    const cargarNeeds = async () => {
      try {
        const response = await needService.listar();
        needs.value = response.data;
      } catch (error) {
        console.error('Error cargando necesidades', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar necesidades.', life: 3000 });
      }
    };

    const nuevaNecesidad = () => {
      needActual.value = { id: null, name: '' };
      dialogVisible.value = true;
    };

    const editarNecesidad = (need) => {
      needActual.value = { ...need };
      dialogVisible.value = true;
    };

    const guardarNecesidad = async () => {
      if (!needActual.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 });
        return;
      }

      const payload = {
        name: needActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: needActual.value.id ? 'U' : 'I',
      };

      try {
        if (needActual.value.id) {
          await needService.actualizar(needActual.value.id, payload);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Necesidad actualizada.', life: 3000 });
        } else {
          await needService.crear(payload);
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Necesidad creada.', life: 3000 });
        }

        dialogVisible.value = false;
        await cargarNeeds();
      } catch (error) {
        console.error('Error guardando necesidad', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar necesidad.', life: 3000 });
      }
    };

    const eliminarNecesidad = (need) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar esta necesidad?',
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
            await needService.eliminar(need.id, payload);
            toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Necesidad eliminada.', life: 3000 });
            await cargarNeeds();
          } catch (error) {
            console.error('Error eliminando necesidad', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar necesidad.', life: 3000 });
          }
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000 });
        }
      });
    };

    onMounted(async () => {
      await cargarNeeds();
    });

    return {
      needs,
      needActual,
      dialogVisible,
      verTodos,
      needsFiltradas,
      nuevaNecesidad,
      editarNecesidad,
      guardarNecesidad,
      eliminarNecesidad,
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
