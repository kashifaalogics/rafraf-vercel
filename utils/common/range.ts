const range = ({ s = 0, e }: { s?: number; e: number }) =>
  new Array(e - s > 0 ? e - s : 0).fill(0).map((v, i) => i + s);

export default range;
