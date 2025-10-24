export const nombreConDni = (miembro) => {
    if (!miembro) return '';

    // Caso actual: viene como string completo
    if (typeof miembro.nombre === 'string') {
        return miembro.nombre;
    }

    // Caso estructurado: viene dividido en nombre y apellido
    const nombre = miembro?.nombre?.name ?? miembro?.name ?? '';
    const apellido = miembro?.nombre?.lastname ?? miembro?.lastname ?? '';
    const dni = miembro?.dni ?? miembro?.dniDocument ?? '';

    return `${nombre} ${apellido} (${dni})`.trim();
};
