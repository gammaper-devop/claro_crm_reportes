export const UTILS = {
  /**
   * Utility that encode an object sent as parameter
   */
  encodeObject: (object: any): string => {
    const encodedValue = Object.keys(object)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
      })
      .join('&');

    return encodedValue;
  },
  /**
   * Validate expires time value of a Token
   * @param expiresIn date string, unix time and number of seconds
   * @return True if it is an invalid value
   */
  isInvalidExpiresTime(expiresIn: any): boolean {
    if (!expiresIn) {
      return false;
    }
    const invalidFormat =
      typeof expiresIn !== 'string' && typeof expiresIn !== 'number';
    const invalidDate =
      String(expiresIn).length >= 10 &&
      new Date(String(expiresIn)).getTime() <= new Date().getTime();
    const invalidNumber =
      String(expiresIn).length < 10 && isNaN(Number(expiresIn));

    return invalidFormat || invalidDate || invalidNumber;
  },
};
