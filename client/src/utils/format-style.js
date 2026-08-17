// Age from a birthdate string
export const getAge = (birthday) => {
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) return '—';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};

// Color mapping for status pills — adjust keys to match your actual enum values
export const statusStyles = (status) => {
    const map = {
        Pending: 'bg-amber-50 text-amber-700',
        Interview: 'bg-blue-50 text-blue-700',
        Orientation: 'bg-purple-50 text-purple-700',
        Hired: 'bg-emerald-50 text-emerald-700',
        Rejected: 'bg-red-50 text-red-700',
        Scheduled: 'bg-blue-50 text-blue-700',
        Completed: 'bg-emerald-50 text-emerald-700',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
};