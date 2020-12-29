export default function capitalize(str: string) {
  if (!str) {
    return '';
  } else if (str.length === 1) {
    return str.toUpperCase();
  }
  let first = str.charAt(0);
  let last = str.slice(1, str.length);

  return first.toUpperCase() + last;
}
