<template>
  <ConfirmDialog
      :draggable="false"
      :closable="false"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      class="p-confirm-dialog-custom"
  />

  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>¿Participaste en algún voluntariado?</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos" />
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo Voluntariado" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoVoluntary" />
      </div>
    </div>

    <DataTable :value="voluntariesFiltrados" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarVoluntary(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="eliminarVoluntary(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Voluntariado" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="voluntaryActual.name" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarVoluntary" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
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
import { useConfirm } from 'primevue/useconfirm';

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
    const voluntaries = ref([]);
    const voluntaryActual = ref({ id: null, name: '' });
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();

    const auditId = store.state.user?.auditId || null;
    const voluntariesFiltrados = useFiltrarActivos(voluntaries, verTodos);

    const cargarVoluntaries = async () => {
      try {
        const response = await api.get('/voluntary');
        voluntaries.value = response.data;
      } catch (error) {
        console.error('Error cargando voluntariados', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar voluntariados.', life: 3000 });
      }
    };

    const nuevoVoluntary = () => {
      voluntaryActual.value = { id: null, name: '' };
      dialogVisible.value = true;
    };

    const editarVoluntary = (voluntary) => {
      voluntaryActual.value = { ...voluntary };
      dialogVisible.value = true;
    };

    const guardarVoluntary = async () => {
      if (!voluntaryActual.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000 });
        return;
      }

      const payload = {
        name: voluntaryActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: voluntaryActual.value.id ? 'U' : 'I',
      };

      try {
        if (voluntaryActual.value.id) {
          await api.put(`/voluntary/${voluntaryActual.value.id}`, payload);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Voluntariado actualizado.', life: 3000 });
        } else {
          await api.post('/voluntary', payload);
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Voluntariado creado.', life: 3000 });
        }

        dialogVisible.value = false;
        await cargarVoluntaries();
      } catch (error) {
        console.error('Error guardando voluntariado', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar voluntariado.', life: 3000 });
      }
    };

    const confirm = useConfirm();
    const eliminarVoluntary = (voluntary) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar este voluntariado?',
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
            await api.delete(`/voluntary/${voluntary.id}`, { data: payload });
            toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Voluntariado eliminado correctamente.',
              life: 3000
            });
            await cargarVoluntaries();
          } catch (error) {
            console.error('Error eliminando voluntariado', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar voluntariado.', life: 3000 });
          }
        },
        reject: () => {
          toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000 });
        }
      });
    };

    onMounted(async () => {
      await cargarVoluntaries();
    });

    return {
      voluntaries,
      voluntaryActual,
      dialogVisible,
      verTodos,
      voluntariesFiltrados,
      nuevoVoluntary,
      editarVoluntary,
      guardarVoluntary,
      eliminarVoluntary,
      confirm,
    };
  },
};
</script>

<style scoped>
.p-confirm-dialog-custom {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
