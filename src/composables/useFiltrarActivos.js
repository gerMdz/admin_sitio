import { computed } from 'vue';

export function useFiltrarActivos(lista, verTodos) {
    return computed(() => {
        if (verTodos.value) {
            return lista.value;
        }
        return lista.value.filter(item => item.audiAction !== 'D');
    });
}
