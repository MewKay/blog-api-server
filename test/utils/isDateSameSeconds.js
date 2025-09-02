const isDateSameSeconds = (firstDate, secondDate) => {
  const dateDifference = Math.abs(new Date(secondDate) - new Date(firstDate));
  const oneSecond = 1000;

  return dateDifference < oneSecond;
};

module.exports = isDateSameSeconds;
