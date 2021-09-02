export const UTILS = {
  /**
   * Check if user is using IE
   * @return True if it is any version of IE
   */
  isIExplorer(): boolean {
    return !!(
      navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.userAgent.match(/Trident\//) ||
      navigator.userAgent.match(/Edge\//)
    );
  },
  /**
   * Get current timestamp
   * @return The current datetime in ISO format
   */
  getTimestamp(): string {
    return new Date().toISOString();
  },
};
