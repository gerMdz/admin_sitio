<template>
  <AccordionPanel :value="value" :class="panelClass">
    <AccordionHeader>
      <i :class="`pi ${icon} mr-2`"></i> {{ title }}
    </AccordionHeader>
    <AccordionContent>
      <div class="pl-4 space-y-1 text-gray-800">
        <div v-if="items.length === 0" class="text-gray-500">No tiene {{ emptyText || title.toLowerCase() }} registrados</div>
        <ul v-else class="mt-0">
          <li v-for="item in items" :key="item.id" class="pl-4 text-600">
            {{ getItemText(item) }}
            <span v-if="showAudit" class="text-xs text-gray-500 italic pl-2">
              Auditoría:
              ({{ formatearFecha(item.audi_date, 'es-AR') }}, {{ item.audi_user || '—' }})
            </span>
          </li>
        </ul>
      </div>
    </AccordionContent>
  </AccordionPanel>
</template>

<script setup>
import {formatearFecha} from '@/utils/date';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'pi-briefcase'
  },
  items: {
    type: Array,
    default: () => []
  },
  itemTextKey: {
    type: String,
    default: null
  },
  emptyText: {
    type: String,
    default: null
  },
  showAudit: {
    type: Boolean,
    default: true
  },
  panelClass: {
    type: String,
    default: 'panel-experiencias'
  }
});

const getItemText = (item) => {
  if (props.itemTextKey) {
    return item[props.itemTextKey];
  }

  // Try to find a common property that might contain the main text
  for (const key of ['name', 'title', 'description', 'text', 'value']) {
    if (item[key]) {
      return item[key];
    }
  }

  return JSON.stringify(item);
};
</script>
