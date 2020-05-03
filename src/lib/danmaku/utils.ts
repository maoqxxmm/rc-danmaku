export const measureDmWidth = (text: string) => {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) {
    console.log(`init canvas failed: ${text}`);
    return 0;
  }
  ctx!.font = getComputedStyle(document.body).getPropertyValue("font");
  return ctx!.measureText(text).width;
};
