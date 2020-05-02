export const measureDmWidth = (text: string) => {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) {
    console.log(`init canvas failed: ${text}`);
  }
  return ctx?.measureText(text).width;
};
