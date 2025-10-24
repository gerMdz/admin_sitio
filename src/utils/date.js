export function formatearFecha(fecha, locale = 'es-AR', excluirHora = false) {
  if (!fecha) return 'No registrada';

  const date = new Date(fecha);

  if (excluirHora) {
    return date.toLocaleDateString(locale, {
      dateStyle: 'short'
    });
  }

  return date.toLocaleString(locale, {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}
