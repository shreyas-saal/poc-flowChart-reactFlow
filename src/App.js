import './App.css';
import CanvasArea from './CanvasArea/CanvasArea';
import {ReactFlowProvider} from 'reactflow';

function App() {
  return (
    <div className="App">
    <ReactFlowProvider>
      <CanvasArea />
    </ReactFlowProvider>
    </div>
  );
}

export default App;
