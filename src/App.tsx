import React from 'react';
import { KeyValueDataObject } from "./kvpair"
import { Fluid, getContainerId } from './fluid';

function useKVPair() {
  const objRef = React.useRef<KeyValueDataObject>();
  const [invalidate, setInvalid] = React.useState<[]>([]);

  // Connect to container and data object
  React.useEffect(() => {
    const { containerId, isNew } = getContainerId();

    Fluid.getDataObject<KeyValueDataObject>(
      containerId,
      KeyValueDataObject,
      isNew
    ).then(obj => {
      objRef.current = obj;
      setInvalid([])
    })
  }, [])


  // set up sync from data object to local state
  React.useEffect(() => {
    const invalidateState = () => { setInvalid([]) };

    objRef.current?.on('changed', invalidateState);
    return () => { objRef.current?.off("changed", invalidateState) }
  }, [invalidate])

  return { kvpair: objRef.current };
}


function App() {
  const { kvpair } = useKVPair();

  if (kvpair === undefined) return <></>;

  const handleClick = () => { kvpair.set('date', Date.now().toString()) };
  const { date } = kvpair.getAll();
  return (
    <div className="App">
      <button onClick={handleClick} > click </button>
      <span>{date}</span>
    </div>
  )
}

export default App;
