console.log(module);

const getDate = function () {
  const today = new Date();
  const day = today.toLocaleDateString("en-EN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return day;
};

module.exports = {
  day: getDate(),
};
