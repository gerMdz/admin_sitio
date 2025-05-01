<template>
  <Dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      modal
      header="Detalles del miembro"
      :style="{ width: '500px' }"
  >

  <div v-if="datos">
      <p><strong>Nombre:</strong> {{ datos.name }}</p>
      <p><strong>Apellido:</strong> {{ datos.lastname }}</p>
      <p><strong>Fecha de nacimiento:</strong> {{ formatearFecha(datos.birthdate) }}</p>
      <p><strong>DNI:</strong> {{ datos.dni_document }}</p>
      <p><strong>Email:</strong> {{ datos.email }}</p>
      <p><strong>Teléfono:</strong> {{ datos.phone }}</p>
      <p><strong>Dirección:</strong> {{ datos.address }}</p>
      <p><strong>Estado civil:</strong> {{ datos.civilState }}</p>
      <p><strong>Género:</strong> {{ datos.gender }}</p>

      <Divider />
      <p><strong>Acción:</strong> {{ datos.audi_action }}</p>
      <p><strong>Fecha de auditoría:</strong> {{ formatearFechaHora(datos.audi_date) }}</p>
      <p v-if="datos.audi_user">
        <strong>Usuario:</strong> {{ datos.audi_user.nombre }} ({{ datos.audi_user.email }})
      </p>
    </div>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';

export default {
  name: 'ModalVerDetallesMember',
  components: { Dialog, Divider },
  props: {
    visible: Boolean,
    datos: Object,
  },
  emits: ['update:visible'],
  methods: {
    formatearFecha(fechaIso) {
      if (!fechaIso) return '';
      const date = new Date(fechaIso);
      return date.toLocaleDateString('es-AR');
    },
    formatearFechaHora(fechaIso) {
      if (!fechaIso) return '';
      const date = new Date(fechaIso);
      return date.toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    },
  },
};
</script>
