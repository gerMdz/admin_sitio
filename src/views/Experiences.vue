<template>
  <ConfirmDialog
      :draggable="false"
      :closable="false"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      class="p-confirm-dialog-custom"
  />


  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Experiencias Completadas</h2>
      <div class="flex align-items-center gap-2">
        <InputSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nueva Experiencia" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevaExperiencia"/>
      </div>
    </div>

    <DataTable :value="experienciasFiltradas" paginator rows="10" responsiveLayout="scroll">
      <Column field="name" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarExperiencia(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="eliminarExperiencia(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Experiencia" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="experienciaActual.name"/>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarExperiencia"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useStore} from 'vuex';
import {useToast} from 'primevue/usetoast';
import {useFiltrarActivos} from '@/composables/useFiltrarActivos';
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
    const experiencias = ref([]);
    const experienciaActual = ref({id: null, name: ''});
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();

    const auditId = store.state.user?.auditId || null;

    const experienciasFiltradas = useFiltrarActivos(experiencias, verTodos);

    const cargarExperiencias = async () => {
      try {
        const response = await api.get('/experiences');
        experiencias.value = response.data;
      } catch (error) {
        console.error('Error cargando experiencias', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al cargar experiencias.', life: 3000});
      }
    };

    const nuevaExperiencia = () => {
      experienciaActual.value = {id: null, name: ''};
      dialogVisible.value = true;
    };

    const editarExperiencia = (experiencia) => {
      experienciaActual.value = {...experiencia};
      dialogVisible.value = true;
    };

    const guardarExperiencia = async () => {
      if (!experienciaActual.value.name.trim()) {
        toast.add({severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000});
        return;
      }

      const payload = {
        name: experienciaActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: experienciaActual.value.id ? 'U' : 'I',
      };

      try {
        if (experienciaActual.value.id) {
          await api.put(`/experiences/${experienciaActual.value.id}`, payload);
          toast.add({severity: 'success', summary: 'Actualizado', detail: 'Experiencia actualizada.', life: 3000});
        } else {
          await api.post('/experiences', payload);
          toast.add({severity: 'success', summary: 'Creada', detail: 'Experiencia creada.', life: 3000});
        }

        dialogVisible.value = false;
        await cargarExperiencias();
      } catch (error) {
        console.error('Error guardando experiencia', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al guardar experiencia.', life: 3000});
      }
    };

    const confirm = useConfirm();
    const eliminarExperiencia = (experiencia) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar esta experiencia completada?',
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
            await api.delete(`/experiences/${experiencia.id}`, {data: payload});
            toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Experiencia eliminada correctamente.',
              life: 3000
            });
            await cargarExperiencias();
          } catch (error) {
            console.error('Error eliminando experiencia', error);
            toast.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar experiencia.', life: 3000});
          }
        },
        reject: () => {
          toast.add({severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000});
        }
      });
    }

    onMounted(async () => {
      await cargarExperiencias();
    });

    return {
      experiencias,
      experienciaActual,
      dialogVisible,
      verTodos,
      experienciasFiltradas,
      nuevaExperiencia,
      editarExperiencia,
      guardarExperiencia,
      eliminarExperiencia,
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