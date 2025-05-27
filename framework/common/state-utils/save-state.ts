export type MapToSavable<T> = (state: T) => T;

export const saveState = <T>(
  key: string,
  initalState: T,
  mapToSaveble: MapToSavable<T> = (state) => state
) => {
  if (typeof window === "undefined") return () => {};
  if (localStorage) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(mapToSaveble(initalState)));
    }
  }
  return (value: T) => {
    if (!localStorage) return;

    localStorage.setItem(
      key,
      JSON.stringify(mapToSaveble(value))
    );
  };
};

export const getSavedState =
  <T>(key: string) =>
  (): T | undefined => {
    if (typeof window === "undefined") return;
    if (!localStorage) return;
    return JSON.parse(String(localStorage.getItem(key))) as T;
  };
