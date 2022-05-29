module.exports = (n) => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var token = "";
  for (var i = 0; i < n; i++) {
    const method = ceilOrFloor(0, 1); // add a bit of randomness by going higher or lower at random
    token += chars[method(Math.random() * chars.length)];
  }
  return token;
};

const ceilOrFloor = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const options = [Math.floor, Math.ceil];
  return options[Math.floor(Math.random() * (max - min) + min)];
};
