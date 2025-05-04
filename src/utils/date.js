export function formatearFecha(fecha, locale = 'es-AR') {
    if (!fecha) return 'No registrada';

    const date = new Date(fecha);
    return date.toLocaleString(locale, {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}
