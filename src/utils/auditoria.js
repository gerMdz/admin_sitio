export function auditoriaLabel(accion) {
    switch (accion) {
        case 'I':
            return 'Creación';
        case 'U':
            return 'Actualización';
        case 'D':
            return 'Eliminación ❌';
        case null:
        case undefined:
            return 'Creación';
        default:
            return 'No registrada';
    }
}
