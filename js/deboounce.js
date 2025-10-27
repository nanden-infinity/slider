export default function debounce(callback, delay) {
  let timer;
  return (...arg) => {
    if (timer) clearTimeout(timer);
    setTimeout(() => {
      callback(...arg);
    }, delay);
  };
}
