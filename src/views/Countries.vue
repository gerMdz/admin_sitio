<template>
  <ConfirmDialog
    :draggable="false"
    :closable="false"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    class="p-confirm-dialog-custom"
  />


  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Paises</h2>
      <div class="flex align-items-center gap-2">
        <ToggleSwitch v-model="verTodos"/>
        <span>{{ verTodos ? 'Mostrar todos' : 'Mostrar activos' }}</span>
        <Button label="Nuevo País" icon="pi pi-plus" class="p-button-success ml-3" @click="nuevoPais"/>
      </div>
    </div>

    <DataTable :value="paisesFiltrados"
               paginator
               :rows="10"
               :rowsPerPageOptions="[10, 20, 50]"
               responsiveLayout="scroll"
    >
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="audiAction" header="Estado">
        <template #body="slotProps">
          <span v-if="slotProps.data.audiAction === 'D'" class="text-red-500 font-semibold">Eliminado</span>
          <span v-else>Activo</span>
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarPais(slotProps.data)"/>
          <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger"
                  @click="eliminarPais(slotProps.data)"/>
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="País" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="paisActual.name"/>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarPais"/>
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
import ToggleSwitch from 'primevue/toggleswitch';
import ConfirmDialog from 'primevue/confirmdialog';
import {useConfirm} from 'primevue/useconfirm';


export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
    ToggleSwitch,
    ConfirmDialog
  },
  setup() {
    const paises = ref([]);
    const paisActual = ref({id: null, name: ''});
    const dialogVisible = ref(false);
    const verTodos = ref(false);
    const store = useStore();
    const toast = useToast();

    const auditId = store.state.user?.auditId || null;

    const paisesFiltrados = useFiltrarActivos(paises, verTodos);

    const cargarPaises = async () => {
      try {
        const response = await api.get('/countries');
        paises.value = response.data;
      } catch (error) {
        console.error('Error cargando paises', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al cargar paises.', life: 3000});
      }
    };

    const nuevoPais = () => {
      paisActual.value = {id: null, name: ''};
      dialogVisible.value = true;
    };

    const editarPais = (pais) => {
      paisActual.value = {...pais};
      dialogVisible.value = true;
    };

    const guardarPais = async () => {
      if (!paisActual.value.name.trim()) {
        toast.add({severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000});
        return;
      }

      const payload = {
        name: paisActual.value.name,
        audi_user: auditId,
        audi_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        audi_action: paisActual.value.id ? 'U' : 'I',
      };

      try {
        if (paisActual.value.id) {
          await api.put(`/countries/${paisActual.value.id}`, payload);
          toast.add({severity: 'success', summary: 'Actualizado', detail: 'País actualizada.', life: 3000});
        } else {
          await api.post('/countries', payload);
          toast.add({severity: 'success', summary: 'Creada', detail: 'País creada.', life: 3000});
        }

        dialogVisible.value = false;
        await cargarPaises();
      } catch (error) {
        console.error('Error guardando pais', error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al guardar país.', life: 3000});
      }
    };

    const confirm = useConfirm();
    const eliminarPais = (pais) => {
      confirm.require({
        message: '¿Está seguro que desea eliminar este país?',
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
            await api.delete(`/countries/${pais.id}`, {data: payload});
            toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'País eliminada correctamente.',
              life: 3000
            });
            await cargarPaises();
          } catch (error) {
            console.error('Error eliminando país', error);
            toast.add({severity: 'error', summary: 'Error', detail: 'Error al eliminar país.', life: 3000});
          }
        },
        reject: () => {
          toast.add({severity: 'info', summary: 'Cancelado', detail: 'Eliminación cancelada.', life: 3000});
        }
      });
    }

    onMounted(async () => {
      await cargarPaises();
    });

    return {
      paises,
      paisActual,
      dialogVisible,
      verTodos,
      paisesFiltrados,
      nuevoPais,
      editarPais,
      guardarPais,
      eliminarPais,
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
