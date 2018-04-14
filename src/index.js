import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';

import { App } from './App';
import registerServiceWorker from './registerServiceWorker';

// import { configure } from 'mobx';
// configure({ enforceActions: true });

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
