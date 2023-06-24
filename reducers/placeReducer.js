export const INITAL_STATE = {
    userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
    placeName:"",
    cat:"",
    cover:"",
    images:[],
    desc:"",
    address:"",
    country:"",
    city:"",
    logo:"",
    priceRange:0, 
    refund_time:3,
}
export const placeReducer = (state,action)=> {
    switch (action.type) {
        case "CHANGE_INPUT":
            return {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        case "ADD_IMAGES":
            return {
                ...state,
                cover:action.payload.cover,
                images:action.payload.images,
            };
        case "ADD_FEATURE":
            return {
                ...state,
                features: [...state.feature, action.payload]
            };
        case "REMOVE_FEATURE":
            return {
                ...state,
                features: state.features.filter(
                    (feature) => feature !== action.payload
                ),
            };
        default:
            return state;
    }
}