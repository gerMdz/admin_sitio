export function getFotoMiembro(id) {
  return id ? `/media/fotos/miembros/${id}.jpg` : null;
}
