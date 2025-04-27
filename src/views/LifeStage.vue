<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Con cuál etapa de vida te identificas?</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nueva Etapa" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevaEtapa" />
      </div>
    </div>

    <DataTable :value="etapasFiltradas" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="slug" header="Slug" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarEtapa(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="eliminarEtapa(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Etapa de Vida" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="etapaActual.name" />
        </div>
        <div class="field">
          <label>Slug</label>
          <InputText v-model="etapaActual.slug" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarEtapa" />
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
    const etapas = ref([]);
    const etapaActual = ref({ id: null, name: '', slug: '' });
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();
    const confirm = useConfirm();

    const auditId = store.state.user?.auditId || null;

    const etapasFiltradas = useFiltrarActivos(etapas, verTodos);

    const cargarEtapas = async () => {
      try {
        const response = await api.get('/lifestages');
        etapas.value = response.data;
      } catch (error) {
        console.error('Error cargando etapas', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar etapas.', life: 3000 });
      }
    };

    const nuevaEtapa = () => {
      etapaActual.value = { id: null, name: '', slug: '' };
      dialogVisible.value = true;
    };

    const editarEtapa = (etapa) => {
      etapaActual.value = { ...etapa };
      dialogVisible.value = true;
    };

    const guardarEtapa = async () => {
      if (!etapaActual.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 });
        return;
      }
      if (!etapaActual.value.slug.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El slug es obligatorio.', life: 3000 });
        return;
      }

      const payload = {
        name: etapaActual.value.name,
        slug: etapaActual.value.slug,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: etapaActual.value.id ? 'U' : 'I',
      };

      try {
        if (etapaActual.value.id) {
          await api.put(`/lifestages/${etapaActual.value.id}`, payload);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Etapa actualizada.', life: 3000 });
        } else {
          await api.post('/lifestages', payload);
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Etapa creada.', life: 3000 });
        }

        dialogVisible.value = false;
        await cargarEtapas();
      } catch (error) {
        console.error('Error guardando etapa', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar etapa.', life: 3000 });
      }
    };

    const eliminarEtapa = (etapa) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar esta etapa?',
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
            await api.delete(`/lifestages/${etapa.id}`, { data: payload });
            toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Etapa eliminada.', life: 3000 });
            await cargarEtapas();
          } catch (error) {
            console.error('Error eliminando etapa', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar etapa.', life: 3000 });
          }
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000 });
        }
      });
    };

    onMounted(async () => {
      await cargarEtapas();
    });

    return {
      etapas,
      etapaActual,
      dialogVisible,
      verTodos,
      etapasFiltradas,
      nuevaEtapa,
      editarEtapa,
      guardarEtapa,
      eliminarEtapa,
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
