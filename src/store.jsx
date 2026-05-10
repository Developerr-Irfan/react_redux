import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";

const initialState = {
    tasks: []
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return {
                ...state,
                tasks: [...state.tasks, action.payload]
            }
            break;
        case 'DELETE_TASK':
            const updateTask = state.tasks.filter((ele) => ele.id !== action.payload);
            return {
                ...state,
                tasks: updateTask
            }
            break;
        case 'FETCH_TASK':
            const newUpdateTask = [...state.tasks, ...action.payload]
            console.log(newUpdateTask); 
            return {
                ...state,
                tasks: newUpdateTask
            }
            break;


        default: state
    }
}


const store = createStore(taskReducer, composeWithDevTools(applyMiddleware(
    thunk
)));

console.log(store);
console.log(store.initialState);



export const addTask = (data) => {
    return {
        type: "ADD_TASK",
        payload: data
    }
}

export const deleteTask = (id) => {
    return {
        type: "DELETE_TASK",
        payload: id
    }
}

export const fetchTask = () => {
    return async (dispatch) => { // Redux Thunk
        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
            const newTask = await res.json();
            console.log(newTask);
            dispatch({
                type: "FETCH_TASK",
                payload: newTask.map((ele,index) => {
                    return { id: Date.now() + index, text: ele.title, completed: false, priority: "medium" }
                })
            });
        } catch (error) {
            console.log(error);
        }
    }
}


store.dispatch(addTask({ id: 1, text: "Design the new landing page", completed: true, priority: "high" }));
store.dispatch(addTask({ id: 2, text: "Review pull requests", completed: false, priority: "medium" }));
store.dispatch(addTask({ id: 3, text: "Write unit tests for auth module", completed: false, priority: "high" }));
store.dispatch(addTask({ id: 4, text: "Update dependencies", completed: false, priority: "low" }));
store.dispatch(addTask({ id: 5, text: "Deploy staging environment", completed: true, priority: "medium" }));

console.log(store.getState());

export default store;