import './App.css';
import { useEffect, useRef, useState } from 'react';
import { ForceGraph3D, ForceGraph2D } from 'react-force-graph';
import Force from './Force';

function App() {
  return (
    <div className="App">
      <Force />
    </div>
  );
}

export default App;
