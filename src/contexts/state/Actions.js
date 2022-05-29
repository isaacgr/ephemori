export const actions = {
  getImportantDates: (state) => ({
    type: "GET_IMPORTANT_DATES",
    value: state
  }),
  getMaxDates: (state) => ({
    type: "GET_MAX_DATES",
    value: state
  }),
  addImportantDate: (state) => ({
    type: "ADD_IMPORTANT_DATES",
    value: state
  }),
  removeImportantDate: (state) => ({
    type: "REMOVE_IMPORTANT_DATES",
    value: state
  }),
  setUser: (state) => ({ type: "SET_USER", value: state }),
  gotError: (state) => ({
    type: "GOT_ERROR",
    value: state
  })
};
