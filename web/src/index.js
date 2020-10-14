import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import EnnobleX from './App';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<EnnobleX />, document.getElementById('ennoble-x-root'));

serviceWorker.unregister();
