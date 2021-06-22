
  
  const INITIAL_STATE = {
    listTypeGrid: true,
  };
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "productGridList":
        return { ...state, listTypeGrid: action.payload };
      default:
        return state;
    }
  };
  