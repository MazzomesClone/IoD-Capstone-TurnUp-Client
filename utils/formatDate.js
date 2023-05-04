export function formatDate(date) {
    const dateObject = new Date(date)
    const formattedDate = dateObject.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' });
    const formattedTime = dateObject.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return { formattedTime, formattedDate }
}