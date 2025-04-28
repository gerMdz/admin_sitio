<template>
  <Dialog
      :visible="visible"
      :closable="true"
      :dismissableMask="true"
      modal
      header="Detalles del Registro"
      :style="{ width: '450px' }"
      @update:visible="cerrar"
  >
    <div v-if="datos">
      <div class="p-fluid">

        <div class="field">
          <label>Nombre del Registro</label>
          <p>{{ datos.name }}</p>
        </div>

        <div v-if="datos.audi_user">
          <div class="field">
            <label>Usuario que actuó</label>
            <p>{{ datos.audi_user.nombre }}</p>
          </div>

          <div class="field">
            <label>Email del Usuario</label>
            <p>{{ datos.audi_user.email }}</p>
          </div>
        </div>

        <div class="field">
          <label>Fecha de Auditoría</label>
          <p>{{ datos.audi_date }}</p>
        </div>

        <div class="field">
          <label>Acción</label>
          <p>{{ getAccionTexto(datos.audi_action) }}</p>
        </div>

      </div>
    </div>

    <template #footer>
      <Button label="Cerrar" icon="pi pi-times" class="p-button-text" @click="cerrar(false)"/>
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
  name: 'ModalVerDetalles',
  components: {Dialog, Button},
  props: {
    visible: {type: Boolean, required: true},
    datos: {type: Object, default: null},
  },
  emits: ['update:visible'],
  methods: {
    cerrar(nuevoValor) {
      console.log('cerrar llamado', nuevoValor);
      this.$emit('update:visible', nuevoValor);
    },
    getAccionTexto(codigo) {
      switch (codigo) {
        case 'I':
          return 'Creado';
        case 'U':
          return 'Actualizado';
        case 'D':
          return 'Eliminado';
        default:
          return 'Desconocido';
      }
    }
  },
};
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
</style>
