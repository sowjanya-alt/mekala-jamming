import React from 'react';
import ReactDOM from 'react-dom';
import './Components/App/App.css';
import App from './Components/App/App';
import * as serviceWorker from './reportWebVitals';

ReactDOM.render(<App />, document.getElementById('root'));


serviceWorker.unregister();
