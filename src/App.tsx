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

  return { setData: objRef.current?.set, data: objRef.current?.getAll() };
}


function App() {
  const { setData, data } = useKVPair();

  if (setData === undefined) return <></>;

  const handleClick = () => { setData('date', Date.now().toString()) };
  return (
    <div className="App">
      <button onClick={handleClick} > click </button>
      <span>{data?.date}</span>
    </div>
  )
}

export default App;
