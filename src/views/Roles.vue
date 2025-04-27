<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Roles</h2>
      <Button label="Nuevo Rol" icon="pi pi-plus" class="p-button-success" @click="nuevoRol" />
    </div>

    <DataTable :value="roles" paginator rows="10" responsiveLayout="scroll">
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="slug" header="Slug" sortable></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarRol(slotProps.data)" />
        </template>
      </Column>

    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Rol" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="rolActual.nombre" />
        </div>
        <div class="field">
          <label>Slug</label>
          <InputText v-model="rolActual.slug" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false" />
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarRol" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Button,
  },
  setup() {
    const roles = ref([]);
    const rolActual = ref({ id: null, nombre: '', slug: '' });
    const dialogVisible = ref(false);
    const toast = useToast();

    onMounted(async () => {
      await cargarRoles();
    });

    const cargarRoles = async () => {
      try {
        const response = await api.get('/roles');
        roles.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const nuevoRol = () => {
      rolActual.value = { id: null, nombre: '', slug: '' };
      dialogVisible.value = true;
    };

    const editarRol = (rowData) => {
      rolActual.value = { id: rowData.id, nombre: rowData.nombre, slug: rowData.slug };
      dialogVisible.value = true;
    };

    const guardarRol = async () => {
      try {
        if (rolActual.value.id) {
          // Editar
          await api.put(`/roles/${rolActual.value.id}`, {
            nombre: rolActual.value.nombre,
            slug: rolActual.value.slug,
          });
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Rol actualizado correctamente', life: 3000 });
        } else {
          // Crear
          await api.post('/roles', {
            nombre: rolActual.value.nombre,
            slug: rolActual.value.slug,
          });
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Rol creado correctamente', life: 3000 });
        }
        dialogVisible.value = false;
        await cargarRoles();
      } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el rol', life: 3000 });
      }
    };

    const accionesTemplate = (rowData) => {
      return (
          `<button class="p-button p-component p-button-text" onclick="editarRol('${rowData.id}')">✏️</button>`
      );
    };

    // Para enganchar el botón manualmente (rápido para ahora)
    window.editarRol = (id) => {
      const role = roles.value.find(r => r.id === id);
      if (role) {
        editarRol(role);
      }
    };

    return { roles, rolActual, dialogVisible, nuevoRol, guardarRol, accionesTemplate, editarRol };
  },
};
</script>
