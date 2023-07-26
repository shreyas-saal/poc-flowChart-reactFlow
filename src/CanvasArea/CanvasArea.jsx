import * as React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
  addEdge,
} from 'reactflow';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import 'reactflow/dist/style.css';
import './CanvasArea.css';
import { Checkbox, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import SimpleFloatingEdge from './SimpleFloatingEdge';
import CustomNode from './CustomNode';

const nodeTypes = {
    custom: CustomNode,
};
  
const edgeTypes = {
    floating: SimpleFloatingEdge,
};

const initialNodes = [
//   { id: 'start', position: { x: 0, y: 10 }, data: { label: 'Start' }, type: 'custom', className: 'circleCustom green' },
//   { id: 'submit', position: { x: 100, y: 20 }, className: 'rectCustom yellow', data: { label: <div className='labelParent'><span>Submit</span><span className='circleCustomIcon'>i</span></div> }, type: 'custom' },
//   { id: 'draft',  position: { x: 300, y: 22 }, className: 'rectCustom blue', data: { label: 'Draft' }, type: 'custom' },
//   { id: 'publish', position: { x: 400, y: 300 }, className: 'rectCustom blue', data: { label: 'Publish' }, type: 'custom', },
//   { id: 'end', position: { x: 445, y: 400 }, data: { label: 'End' }, type: 'custom', className: 'circleCustom circleRed' },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const initialEdges = [
    // { id: 'estart-submit', source: 'start', target: 'submit', type: 'floating', markerEnd: {type: MarkerType.ArrowClosed, color: 'black'}},
    // { id: 'esubmit-draft', source: 'submit', target: 'draft', type: 'floating', markerEnd: {type: MarkerType.ArrowClosed, color: 'black'}},
];

function CanvasArea() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [openTransitionModal, setOpenTransitionModal] = React.useState(false);
  const [openStateModal, setOpenStateModal] = React.useState(false);
  const [transitionProps, setTransitionProps] = React.useState({
    transitionFrom: '',
    transitionTo: '',
  });
  const [stateProps, setStateProps] = React.useState({
    stateName: '',
    stateType: '',
    stateColor: 'default',
  });
  const [checkboxes, setCheckboxes] = React.useState({
    start: false,
    end: false,
  });

  const handleCheckboxChange = (event) => {
    setCheckboxes({
      ...checkboxes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCloseState = () => {
    setOpenStateModal(false);
  };

  const handleOpenState = () => {
    setOpenStateModal(true);
  };
 
  const calculateY = () => {
    if (((nodes.length) % 5 === 0) || ((nodes.length) % 5 === 5)) {
        return nodes[nodes.length - 1].position.y + 100;
    } else {
        return nodes[nodes.length - 1].position.y;
    }
  }

  const calculateX = () => {
    const number = nodes.length;
    if (number === 5 || number === 10 || number === 15) {
        return nodes[nodes.length - 1].position.x;
    } else if ((number >= 1 && number < 5) || (number > 10 && number < 15)) {
        return nodes[nodes.length - 1].position.x + 100;
    } else {
        return nodes[nodes.length - 1].position.x - 100;
    }
  }
  
  const handleApplyState = () => {
    setNodes([
        ...nodes,
        {
            id: stateProps.stateName,
            position: {
                x: nodes.length ? calculateX() : 0,
                y: nodes.length ? calculateY() : 10,
            },
            // ...checkboxes.start && {sourcePosition: 'right'},
            data: { label: stateProps.stateName },
            className: checkboxes.start ? 'circleCustom green' : checkboxes.end ? 'circleCustom circleRed' : stateProps.stateColor,
            type: 'custom',
        }
    ])
    setOpenStateModal(false);
    setTimeout(() => {
        document.getElementsByClassName('react-flow__controls-fitview')[0].click({ force: true });
    }, 100);
  };
 
  const handleApplyTransitions = () => {
      setEdges([
        ...edges,
        {
            id: 'e' + transitionProps.transitionFrom + '-' + transitionProps.transitionTo,
            source: '' + transitionProps.transitionFrom,
            target: '' + transitionProps.transitionTo,
            type: 'floating',
            markerEnd: { type: MarkerType.ArrowClosed, color: 'black' },
        }
    ]);
    setOpenTransitionModal(false);
  };

  const handleCloseTransition = () => {
    setOpenTransitionModal(false);
  };

  const handleOpenTransition = () => {
    setOpenTransitionModal(true);
  };
//   const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = (e, node) => {
    alert(`You Clicked ${node.data.label}`);
  }

  const applyDisabled = nodes.filter(node => (stateProps.stateName.toLowerCase() === node.data?.label?.toLowerCase?.()) || (stateProps.stateName.toLowerCase?.() === node.data.label?.props?.children[0]?.props?.children.toLowerCase())).length ? true : false;

  return (
    <>
        <div id="canvasParent">
            <div id="btnParent">
                <button className="btn btnState" onClick={() => handleOpenState()}>State</button>
                <button className="btn btnTransitions" onClick={() => handleOpenTransition()}>Transitions</button>
            </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    edgeTypes={edgeTypes}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={1}
                    maxZoom={4}
                    connectionMode={ConnectionMode.Loose}
                    nodesConnectable={false}
                    zoomOnDoubleClick={false}
                    nodesFocusable={false}
                    edgesFocusable={false}
                    elementsSelectable={false}
                    onNodesChange={onNodesChange}
                    onNodeClick={onNodeClick}
                    onEdgesChange={onEdgesChange}
                >
                    {/* <MiniMap /> */}
                    <Controls />
                    <Background />
                </ReactFlow>
        </div>
        <div>
            <Modal
                open={openStateModal}
                onClose={handleCloseState}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        State Options
                    </Typography><p></p>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="state-name">State Name</InputLabel>
                        <Input value={stateProps.stateName} onChange={(event) => setStateProps({ ...stateProps, stateName: event.target.value })}/>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="state-color">State Color</InputLabel>
                        <Select
                            value={(checkboxes.start || checkboxes.end) ? '' : stateProps.stateColor}
                            label="State Color"
                            disabled={checkboxes.start || checkboxes.end}
                            onChange={(event) => {
                                setStateProps({ ...stateProps, stateColor: event.target.value });
                            }}
                        >
                            <MenuItem value={'blue'}>Default</MenuItem>
                            <MenuItem value={'green'}>Green</MenuItem>
                            <MenuItem value={'yellow'}>Yellow</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="state-type">Type</InputLabel>
                        <Select
                            value={(checkboxes.start || checkboxes.end) ? '' : stateProps.stateType}
                            label="Type"
                            disabled={checkboxes.start || checkboxes.end}
                            onChange={(event) => {
                                setStateProps({ ...stateProps, stateType: event.target.value });
                            }}
                        >
                            <MenuItem value={'input'}>Input</MenuItem>
                            <MenuItem value={'output'}>Output</MenuItem>
                            <MenuItem value={'default'}>Both</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, p: 1, minWidth: 50 }}>
                        <FormControlLabel
                            control={
                                <Checkbox disabled={checkboxes.end} checked={checkboxes.start} onChange={handleCheckboxChange} name="start" />
                            }
                            label="Start"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, p: 1, minWidth: 50 }}>
                        <FormControlLabel
                            control={
                                <Checkbox disabled={checkboxes.start} checked={checkboxes.end} onChange={handleCheckboxChange} name="end" />
                            }
                            label="End"
                        />
                    </FormControl>
                    <p></p>
                    <button 
                        disabled={applyDisabled}
                        className={`btn ${applyDisabled ? 'btnDisabled' : ''}`}
                        onClick={() => handleApplyState()}
                    >Apply</button>
                </Box>
            </Modal>
            <Modal
                open={openTransitionModal}
                onClose={handleCloseTransition}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Transition Options
                    </Typography><p></p>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="transition-from">From</InputLabel>
                        <Select
                            labelId="transition-from"
                            value={transitionProps.transitionFrom}
                            label="From"
                            onChange={(event) => {
                                setTransitionProps({ ...transitionProps, transitionFrom: event.target.value });
                            }}
                        >
                            {nodes.map((elem) => {
                                return <MenuItem key={elem.id} value={elem.id}>{elem.data.label}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel id="transition-to">To</InputLabel>
                        <Select
                            value={transitionProps.transitionTo}
                            label="To"
                            onChange={(event) => {
                                setTransitionProps({ ...transitionProps, transitionTo: event.target.value });
                            }}
                        >
                            {nodes.map((elem) => {
                                return <MenuItem key={elem.id} value={elem.id}>{elem.data.label}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <p></p>
                    <button className="btn" onClick={() => handleApplyTransitions()}>Apply</button>
                </Box>
            </Modal>
        </div>
    </>
  );
}

export default CanvasArea;