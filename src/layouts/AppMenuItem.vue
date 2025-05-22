<script setup>
import { useLayout } from '@/composables/layout';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const route = useRoute();

const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();

// Track collapsed state for root menu items
const collapsed = ref({});

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);

    const activeItem = layoutState.activeMenuItem;

    isActiveMenu.value = activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false;

    // Initialize collapsed state for root menu items (default to false - expanded)
    if (props.root) {
        collapsed.value[props.index] = false;
    }
});

watch(
    () => layoutState.activeMenuItem,
    (newVal) => {
        isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
    }
);

function itemClick(event, item) {
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
        toggleMenu();
    }

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;

    setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item) {
    return route.path === item.to;
}

function toggleCollapse(index) {
    collapsed.value[index] = !collapsed.value[index];
}
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text" @click="toggleCollapse(index)" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            {{ item.label }}
            <i class="pi pi-fw" :class="collapsed[index] ? 'pi-angle-right' : 'pi-angle-down'"></i>
        </div>
        <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
            <!-- PrimeIcons -->
            <i v-if="!item.iconType && typeof item.icon === 'string'" :class="item.icon" class="layout-menuitem-icon"></i>
            <!-- FontAwesome icons -->
            <font-awesome-icon v-else-if="item.iconType === 'fa'" :icon="item.icon" class="layout-menuitem-icon" />
            <!-- Component-based icons (Tabler, Lucide) -->
            <component v-else-if="item.iconType === 'component'" :is="item.icon" class="layout-menuitem-icon" style="transform: scale(0.8);" />
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </a>
        <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0" :to="item.to">
            <!-- PrimeIcons -->
            <i v-if="!item.iconType && typeof item.icon === 'string'" :class="item.icon" class="layout-menuitem-icon"></i>
            <!-- FontAwesome icons -->
            <font-awesome-icon v-else-if="item.iconType === 'fa'" :icon="item.icon" class="layout-menuitem-icon" />
            <!-- Component-based icons (Tabler, Lucide) -->
            <component v-else-if="item.iconType === 'component'" :is="item.icon" class="layout-menuitem-icon" style="transform: scale(0.8);" />
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </router-link>
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? !collapsed[index] : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
.layout-menuitem-icon {
  &.svg-inline--fa {
    width: 1em;
    height: 1em;
    transform: scale(0.8);
  }
}
</style>
