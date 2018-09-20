import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';

import { App } from './app';
import registerServiceWorker from './registerServiceWorker';

// import { configure } from 'mobx';
// configure({ enforceActions: true });

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
