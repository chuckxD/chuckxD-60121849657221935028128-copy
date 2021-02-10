const utils = {}

utils.getRandomArrayElement = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

module.exports = {
  ...utils,
}
