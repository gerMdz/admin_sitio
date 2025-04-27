<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-3">
      <h2>Usuarios</h2>
      <Button label="Nuevo Usuario" icon="pi pi-plus" class="p-button-success" @click="nuevoUsuario"/>
    </div>

    <DataTable :value="usuarios" paginator rows="10" responsiveLayout="scroll">
      <Column field="nombre" header="Nombre" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="roles" header="Roles" :body="rolesTemplate"></Column>
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editarUsuario(slotProps.data)"/>
        </template>
      </Column>

    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Usuario" :style="{ width: '400px' }">
      <div class="p-fluid">
        <div class="field">
          <label>Nombre</label>
          <InputText v-model="usuarioActual.nombre"/>
        </div>
        <div class="field">
          <label>Email</label>
          <InputText v-model="usuarioActual.email"/>
        </div>
        <div class="field">
          <label>Password</label>
          <Password v-model="usuarioActual.password" toggleMask/>
        </div>
        <div class="field">
          <label>Roles</label>
          <MultiSelect
              v-model="usuarioActual.rolesSeleccionados"
              :options="rolesDisponibles"
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione roles"
              display="chip"
              filter
              class="w-full"
          />

        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogVisible = false"/>
        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="guardarUsuario"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import api from '@/api/axios';
import {useToast} from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    InputText,
    Password,
    Button,
    Dropdown,
    MultiSelect,
  },
  setup() {
    const usuarios = ref([]);
    const rolesDisponibles = ref([]);
    const usuarioActual = ref({id: null, email: '', password: '', rolesSeleccionados: []});
    const dialogVisible = ref(false);
    const toast = useToast();

    onMounted(async () => {
      await cargarUsuarios();
      await cargarRoles();
    });

    const cargarUsuarios = async () => {
      console.log('')
      try {
        const response = await api.get('/usuarios');
        usuarios.value = response.data;
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const cargarRoles = async () => {
      try {
        const response = await api.get('/roles');
        rolesDisponibles.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    const rolesTemplate = (rowData) => {
      return rowData.roles.join(', ');
    };

    const nuevoUsuario = () => {
      usuarioActual.value = {id: null, email: '', password: '', rolesSeleccionados: []};
      dialogVisible.value = true;
    };

    const editarUsuario = (usuario) => {
      usuarioActual.value = {
        id: usuario.id,
        email: usuario.email,
        password: '',
        rolesSeleccionados: [],
      };
      dialogVisible.value = true;
    };


    const guardarUsuario = async () => {
      if (!usuarioActual.value.nombre.trim()) {
        toast.add({severity: 'warn', summary: 'Campo requerido', detail: 'El nombre es obligatorio.', life: 3000});
        return;
      }
      if (!usuarioActual.value.email.trim()) {
        toast.add({severity: 'warn', summary: 'Campo requerido', detail: 'El email es obligatorio.', life: 3000});
        return;
      }

      if (!usuarioActual.value.password.trim() && !usuarioActual.value.id) {
        toast.add({
          severity: 'warn',
          summary: 'Campo requerido',
          detail: 'La contraseña es obligatoria al crear un usuario.',
          life: 3000
        });
        return;
      }

      if (!usuarioActual.value.rolesSeleccionados.length) {
        toast.add({
          severity: 'warn',
          summary: 'Campo requerido',
          detail: 'Debe seleccionar al menos un rol.',
          life: 3000
        });
        return;
      }

      try {
        if (usuarioActual.value.id) {
          // Editar usuario
          await api.put(`/usuarios/${usuarioActual.value.id}`, {
            nombre: usuarioActual.value.nombre,
            email: usuarioActual.value.email,
            password: usuarioActual.value.password,
            roles: usuarioActual.value.rolesSeleccionados,
          });
          toast.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Usuario actualizado correctamente',
            life: 3000
          });
        } else {
          // Crear nuevo usuario
          await api.post('/usuarios', {
            nombre: usuarioActual.value.nombre,
            email: usuarioActual.value.email,
            password: usuarioActual.value.password,
            roles: usuarioActual.value.rolesSeleccionados,
          });
          toast.add({severity: 'success', summary: 'Creado', detail: 'Usuario creado correctamente', life: 3000});
        }
        dialogVisible.value = false;
        await cargarUsuarios();
      } catch (error) {
        console.error(error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Error al guardar el usuario.', life: 3000});
      }
    };


    // window.editarUsuario = (id) => editarUsuario(id);

    return {
      usuarios,
      rolesDisponibles,
      usuarioActual,
      dialogVisible,
      rolesTemplate,
      nuevoUsuario,
      guardarUsuario,
      editarUsuario
    };
  },
};
</script>
