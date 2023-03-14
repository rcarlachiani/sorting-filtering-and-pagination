export const columns = [
    { accessor: 'name', label: 'Nombre' },
    { accessor: 'age', label: 'Edad' },
    { accessor: 'is_manager', label: 'Gerente', format: value => (value ? '✔️' : '✖️') },
    { accessor: 'start_date', label: 'Fecha de inicio' },
];