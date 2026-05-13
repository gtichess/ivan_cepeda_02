/**
 * Returns the delivery message for vacuum-packed food orders based on the current date.
 * Handles special case for June 2nd, 2025.
 */
export function getDeliveryMessage(today: Date = new Date()): string {
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    let deliveryMessage;

    if (dayOfWeek === 1) { // Monday
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + 7);
        if (nextMonday.toDateString() === new Date(2025, 5, 2).toDateString()) { // June 2nd, 2025
            nextMonday.setDate(nextMonday.getDate() + 1); // Move to Tuesday, June 3rd, 2025
        }
        deliveryMessage = `Si haces tu pedido hoy de *comida al vacío*, se entregará el *${nextMonday.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las 10:00 AM.*`;
    } else if (dayOfWeek === 6 || dayOfWeek === 0) { // Saturday or Sunday
        const twoMondaysAhead = new Date(today);
        twoMondaysAhead.setDate(today.getDate() + ((8 - dayOfWeek) % 7) + 7);
        if (twoMondaysAhead.toDateString() === new Date(2025, 5, 2).toDateString()) { // June 2nd, 2025
            twoMondaysAhead.setDate(twoMondaysAhead.getDate() + 1); // Move to Tuesday, June 3rd, 2025
        }
        deliveryMessage = `Si haces tu pedido hoy de *comida al vacío*, se entregará el *${twoMondaysAhead.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} cerca de las 10:00 AM.*`;
    } else {
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + ((8 - dayOfWeek) % 7));
        deliveryMessage = `Si haces tu pedido hoy de *comida al vacío*, se entregará el *${nextMonday.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} cerca de las 10:00 AM.*`;
    }
    return deliveryMessage;
}
