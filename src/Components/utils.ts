/**
 * Debounces a function, delaying its execution until after a specified wait time
 * has elapsed since the last time it was invoked.
 *
 * The debounce function comes with a feature where if the time elapsed since `startTime`
 * is less than `wait` and a `timer` is active, it clears the existing timer.
 * A new timer is then set to execute the function after the `wait` period.
 * `startTime` is reset to the current time with each invocation.
 *
 * @template T - A generic type that extends a function taking any number of arguments and returning any type.
 * @param {T} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {(...args: Parameters<T>) => void} A new function that debounces the execution of `func`.
 * The returned function takes the same arguments as `func` but does not return its result (implicitly `void`).
 */
export const debounce = function<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void { // Explicit return type for clarity
  let startTime = Date.now();
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => { // Explicit return type for inner function
    if (Date.now() - startTime < wait && timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, wait);
    startTime = Date.now();
  };
};