export function nombreConDni(member) {
    if (!member?.nombre && !member?.name) return '';

    const nombre = member.nombre?.name || member.name || '';
    const apellido = member.nombre?.lastname || member.lastname || '';
    const dni = member.dni || '';

    return `${nombre} ${apellido} (${dni})`.trim();
}
