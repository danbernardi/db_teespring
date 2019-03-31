/**
 * Changes the active breakpoint
 *
 * @param {string} breakpointName          String defining the active breakpoint
 * @param {number} breakpointSize          Number defining the active breakpoint
 * @return {Object} Action object
 */
export const setActiveBreakpoint = (breakpointName, breakpointSize) => ({
  type: 'SET_ACTIVE_BREAKPOINT',
  breakpointName,
  breakpointSize
});
