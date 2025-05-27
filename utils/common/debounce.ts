const debounce = <P, R>(func: (args: P) => R, delay: number) => {
  let timer: NodeJS.Timeout;
  return (args: P) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, delay);
  };
};

export default debounce;
