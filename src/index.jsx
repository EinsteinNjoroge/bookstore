import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import 'react-toastify/dist/ReactToastify.css';
import MainContainer from './containers';

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component {
  render() {
    return <MainContainer />;
  }
}

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('app'));
