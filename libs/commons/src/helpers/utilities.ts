import { FormGroup } from '@angular/forms';
import { EInputValidation } from '../enums';

export const UTILS = {
  /**
   * Clean all form fields and error messages
   * @param form - form object with the form controls group
   */
  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.controls[key].setErrors(null);
    });
  },
  /**
   * Randomly sort an array
   * @param array - array of elements to shuffle
   */
  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  /**
   * Encode an object into url parameters
   * @param object object to transform into query string
   */
  encodeObject(object: any): string {
    const encodedValue = Object.keys(object)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
      })
      .join('&');
    return encodedValue;
  },
  /**
   * Device detector
   * @return Returns true if the navigator is a mobile
   */
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  },
  /**
   * Check if user is using IE
   * @return True if it is any version of IE
   */
  isIE(): boolean {​​​​​
    return !!(
      navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.userAgent.match(/Trident\//)
    );
  }​​​​​,
  /**
   * Get a random number between a given range
   * @param min - minimum range
   * @param max - maximum range
   */
  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  /**
   * Get a UUID (Universally Unique Identifier) v4 according to RFC 4122
   */
  uuid(): string {
    const cryptoObj = window.crypto || (window as any).msCrypto;
    /* tslint:disable:no-bitwise */
    return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(
      /[018]/g,
      (c: any) =>
        (
          c ^
          (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16),
    );
  },
  /* tslint:enable:no-bitwise */
  /**
   * Input validation on keypress event: number, alpha, alphanumeric
   * @return Returns true if the character entered is a valid format
   */
  inputValidation(
    event: KeyboardEvent,
    type: EInputValidation = EInputValidation.Alphanumeric,
  ): boolean {
    if (event.key === 'Enter') {
      return true;
    }
    if (type === EInputValidation.Number) {
      return /^[0-9]+$/.test(event.key);
    } else if (type === EInputValidation.Alpha) {
      return /^[A-Za-zÑÁÉÍÓÚñáéíóú]+$/.test(event.key);
    } else if (type === EInputValidation.Text) {
      return /^[A-Za-zÑÁÉÍÓÚñáéíóú ]+$/.test(event.key);
    } else {
      return /^[A-Za-zÑÁÉÍÓÚñáéíóú0-9]+$/.test(event.key);
    }
  },
  /**
   * Transform a Date string / object into formatted date string dd/mm/yyyy
   */
  formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      if (date.length <= 12 || isNaN(Date.parse(String(date)))) {
        return date;
      }
      date = new Date(date);
    }
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
      .map(n => (n < 10 ? '0' + n : n))
      .join('/');
  },
  /**
   * Transform a Date object into ISO formatted date string
   * By default return the format: YYYY-MM-DDTHH:mm:ss.sssZ
   * When extended is true, it returns the format: YYYY-MM-DDTHH:mm:ssZ-HH:mm
   */
  formatISODate(date = new Date(), extended = false): string {
    if (!extended) {
      const timezone = date.getTimezoneOffset();
      const localTime = timezone * 60000;
      const ISO = new Date(date.getTime() - localTime).toISOString();
      const UTC = String(Math.abs(timezone) / 60).padStart(2, '0');
      const Z = (timezone > 0 ? '-' : '+') + UTC + ':00';
      return ISO.replace('Z', Z);
    }
    return [
      date.getFullYear(),
      '-',
      date.getMonth() + 1,
      '-',
      date.getDate(),
      'T',
      date.getHours(),
      ':',
      date.getMinutes(),
      ':',
      date.getSeconds(),
      'Z-',
      date.getHours(),
      ':',
      date.getMinutes(),
    ]
      .map(n => (n < 10 ? `0${n}` : `${n}`))
      .join('');
  },
  /**
   * Create an input format from prefix and separator
   * @param value - current input value from keypress event
   * @param lastValue - last value before keypress event
   * @param prefix - default initial characters
   * @param separator - character separator
   * @param position - numeric position for the separator
   * @return Returns a new value with the input mask
   */
  inputMask(
    value: string,
    lastValue: string,
    prefix?: string,
    separator?: string,
    position?: number,
  ): string {
    if (
      (position === 0 && !prefix) ||
      (position > 0 &&
        separator &&
        value.length > position + prefix.length + separator.length - 1)
    ) {
      return value;
    }

    let newValue =
      value.length === 1 && lastValue === '' ? prefix + value : value;

    const inputSize = newValue.length;
    let first =
      position > 0 && position > prefix.length && separator
        ? newValue.substring(0, position - 1)
        : newValue;
    let last =
      position > 0 && position > prefix.length && separator
        ? newValue.substring(position - 1)
        : '';

    first = inputSize === prefix.length ? '' : first;
    last =
      inputSize === position &&
      position > prefix.length &&
      separator !== newValue.substr(separator.length * -1)
        ? separator + last
        : separator !== newValue.substr(separator.length * -1)
        ? last
        : '';
    first = first === prefix && last === '' ? '' : first;

    newValue = first + last;

    return newValue;
  },
  hexToBase64(value: string): string {
    return btoa(
      String.fromCharCode.apply(
        null,
        value
          .replace(/\r|\n/g, '')
          .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
          .replace(/ +$/, '')
          .split(' '),
      ),
    );
  },
  base64ToHex(value: string): string {
    const bin = atob(value.replace(/[ \r\n]+$/, ''));
    const hex = [];
    let tmp = '';
    for (let i = 0; i < bin.length; ++i) {
      tmp = bin.charCodeAt(i).toString(16);
      hex[hex.length] = tmp.padStart(2, '0');
    }
    return hex.join(' ');
  },
};
