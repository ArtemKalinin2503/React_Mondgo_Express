import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'; //Подключаем React-Redux
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'; //Для роутинга
import createStore from './store'; //Подключаем хранилище
import MainComponent from './components/MainComponent';

//Создадим store (хранилище)
const store = createStore;

class App extends Component {
  render() {
    return (
        <div className="wrapper-main">
            <header className="App-header">
                <h1>Шаблон для работы с React-Redux-MongoDB-Express</h1>
            </header>
            <nav>
                <Link to="/MainComponent">MainComponent</Link>
                <Route path="/MainComponent" component={MainComponent}></Route> 
            </nav>
        </div>
    );
  }
}

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter >
        <Switch>
            <App />
        </Switch>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
