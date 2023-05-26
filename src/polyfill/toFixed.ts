Number.prototype.toFixed = function (n: number) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  const number = this as number;
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof n === 'undefined' || n === 0) {
    return Math.round(number).toString();
  }

  let result = number.toString();
  const arr = result.split('.');

  // 整数的情况
  if (arr.length < 2) {
    result += '.';
    for (let i = 0; i < n; i ++) {
      result += '0';
    }
    return result;
  }

  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length === n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0, len = n - decimal.length; i < len; i++) {
      result += '0';
    }
    return result;
  }
  result = integer + '.' + decimal.slice(0, n);
  const last = decimal[n];

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, n);
    result = ((Math.round((parseFloat(result) * x)) + 1) / x).toFixed(n);
  }

  return result;
};