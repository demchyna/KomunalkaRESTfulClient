
export function changeDateFormat(date) {
  if (date) {
    const myDate  = new Date(date);
    return myDate.toLocaleDateString('uk-UA');
  }
  return null;
}
