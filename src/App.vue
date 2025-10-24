<script setup>
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
</script>

<template>
  <Toast/>
  <ConfirmDialog
    :draggable="true"
    :closable="true"
    :dismissableMask="true"
    appendTo="body"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    class="p-confirm-dialog-custom"
  />

  <RouterView/>
</template>
