export const formatChatTime = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
        // Today: show time only
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (date.toDateString() === yesterday.toDateString()) {
        // Yesterday
        return 'Yesterday';
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        // Within last week: show day name
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
        // Older: show date
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
};