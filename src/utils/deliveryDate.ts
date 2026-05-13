// deliveryDate utility function
// Returns the next Monday ahead only if the window from today to that Monday is more than six days; otherwise, returns the following Monday.

function getDeliveryDate(currentDate) {
  const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  let daysUntilNextMonday = (8 - dayOfWeek) % 7;
  if (daysUntilNextMonday === 0) daysUntilNextMonday = 7; // If today is Monday, next Monday

  // If the window to next Monday is 6 days or less, set to the Monday after that
  if (daysUntilNextMonday <= 5) {
    daysUntilNextMonday += 7;
  }

  const deliveryDate = new Date(currentDate);
  deliveryDate.setDate(currentDate.getDate() + daysUntilNextMonday);
  return deliveryDate.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export { getDeliveryDate };
