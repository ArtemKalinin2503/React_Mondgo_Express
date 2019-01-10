import { combineReducers } from 'redux';
import * as _ from "lodash";
import axios from 'axios'; //Axios вместо fetch для сетевого запроса
//Action для put запроса
export const actionIsUpdating= (isUpdating)=>{return {type: "Request_Updating", payload: isUpdating}};
//Actions для post запроса
export const actionStartPost = (isRequestSent)=>{return {type: "Request_Sending", payload: isRequestSent}};
export const actionEndPost = (postResult)=>{return {type:"Request_Result", payload: postResult}};
//Actions для get запроса
export const fetchStarted = (isFetched)=>{return {type: "Is_Fetched", payload: isFetched}};
export const fetchResult = (result)=>{return {type: "Get_Result", payload: result}};
export const fetchError = (error)=>{return {type: "Get_Error", payload: error}};

//Создадим состояния с помощью метода initState (в каждое состояние передан тип данных которое мы ожидаем записать в каждое состояние)
export const initState = {
    //Состояние для сетевого запроса
    requestSending:false,
    requestSuccess: null,
    isFetching: false,
    fetchResult: [],
    fetchError: null,
    isUpdate: false    
};

//Создадим редьюсер в котором опишем, что должен делать каждый action
const mainReducer = (state = initState, action) => {
    //С помощью конструкции switch case опишем каждый action
    switch(action.type) {
        case "Request_Sending":
            return {
                ...state,
                requestSending: action.payload
            };
        case "Request_Result":
            return {
                ...state,
                requestSucceed: action.payload
            };
        case "Is_Fetched":
            return {
                ...state,
                isFetching: action.payload
            };
        case "Get_Result":
            return {
                ...state,
                fetchResult: action.payload
            };
        case "Request_Updating":
            return {
                ...state,
                isUpdating: action.payload
            };    
        case "Get_Error": 
            return {
                ...state,
                fetchError: action.payload
            };            
        default:
            return state;    
    }
};

//Thunk компонент postData для Post запроса 
export const postData = (post) => {
    return (dispatch, getState) => {
        if(post && post.title && post.description) { //Проверка на заполнение полей
            dispatch(actionStartPost(true));    
            axios.post("http://localhost:3012/notes", post) //Обращаемся по адресу БД (notes имя БД)
                .then(result => {
                if (result.status === 200) {
                    dispatch(actionEndPost(true));
                    let arr = (getState()).mainReducer.fetchResult; //Разобрать ?
                    arr.push(result.data);
                    dispatch(fetchResult([...arr]));
                } else {
                    dispatch(actionEndPost(false));
                }
            })
        }
    }
}

//Thunk компонент getData для Get запроса 
export const getData = () => {
    return (dispatch) => {
        dispatch(fetchStarted(true));
        //С помощью axios будем получать данные из БД
        var api = axios.create({
            baseURL: 'http://localhost:3012' //адрес по которому доступна БД
        })
        api.get("/notes") //'notes' - имя БД к которой обращаемся 
        .then(result => {
            dispatch(fetchResult(result.data));
        },
        err => {
            dispatch(fetchError(err.status));
        });
    }
}

//Thunk компонент getPut для изменения записей в БД
export const getPut = (id, item) => {
    return (dispatch, getState) => {
        dispatch(actionIsUpdating(true));
        var api = axios.create({
            baseURL: 'http://localhost:3012' //адрес по которому доступна БД
        });
        return api.put(`/notes/${id}`, item).then(response => {
            const noteList = (getState()).mainReducer.fetchResult;
            const index= _.findIndex(noteList,{_id: id});
            let updatedItem = {...response.data};
            noteList.splice(index, 1, updatedItem);
            dispatch(fetchResult([...noteList]));
            dispatch(actionIsUpdating(false));
        }, err=> (dispatch(actionIsUpdating(false))));
    }
}

//Thunk компонент deleteData для удаления записей из БД
export const deleteData = (id) => {
    return (dispatch, getState) => {
        var api = axios.create({
            baseURL: 'http://localhost:3012'
        });
        return api.delete(`/notes/${id}`).then(response => {
            const noteList = (getState()).mainReducer.fetchResult;
            _.remove(noteList, {_id: id});
            dispatch(fetchResult([...noteList]));
        })
    }
}

//Передаим созданный редьюсер mainReducer в расширение combineReducers
const todoApp = combineReducers ({
    mainReducer
});
  
export default todoApp;  