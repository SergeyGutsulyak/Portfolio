import { combineReducers } from 'redux';
import usersReducer from "./usersReducer";
import groupsReducer from "./groupsReducer";

let combinedReducer=combineReducers({
    // редьюсер countersReducer отвечает за раздел state под именем counters
    users: usersReducer,
    groups:groupsReducer,
    // + другие редьюсеры
});

export default combinedReducer;
