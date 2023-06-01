export const getDate = function () {
  const today = new Date();
  const date = today.toLocaleDateString("en-EN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return date;
};
