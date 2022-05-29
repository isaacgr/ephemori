const Reducer = (state, action) => {
  switch (action.type) {
    case "GET_IMPORTANT_DATES":
      return {
        ...state,
        importantDates: action.value
      };
    case "ADD_IMPORTANT_DATES":
      return {
        ...state,
        importantDates: [
          ...state.importantDates,
          ...action.value.map((date) => date.value)
        ]
      };
    case "REMOVE_IMPORTANT_DATES":
      const newImportantDates = action.value.map((date) => {
        return state.importantDates.filter((item) => item.id != date.value);
      });
      return {
        ...state,
        importantDates: [...newImportantDates[0]]
      };
    case "SET_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.value
        }
      };
    case "GOT_ERROR":
      return {
        ...state,
        error: action.value
      };
    case "GET_MAX_DATES":
      return {
        ...state,
        maxDates: action.value
      };
    default:
      return state;
  }
};

export default Reducer;
