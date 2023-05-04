export function formatDate(date) {
    const dateObject = new Date(date)
    const formattedDate = dateObject.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' });
    const formattedTime = dateObject.toLocaleString('en-NZ', { hour: 'numeric', minute: 'numeric', hour12: true });
    return { formattedTime, formattedDate }
}