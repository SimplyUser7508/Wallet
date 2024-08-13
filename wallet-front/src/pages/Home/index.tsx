import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import Home from './Home';

const container = document.getElementById('app-container');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<Home />);