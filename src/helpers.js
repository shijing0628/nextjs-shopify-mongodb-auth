export const removeProperties = (target, keys) => {
  const result = Object.keys(target).reduce((acc, key) => {
    if (!keys.includes(key)) {
      acc[key] = target[key];
    }
    return acc;
  }, {});
  return result;
};
