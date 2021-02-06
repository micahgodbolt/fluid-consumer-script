import React from 'react';
import { KeyValueDataObject } from "@fluid-experimental/data-objects"
import { Fluid, getContainerId } from './fluid';

function useKVPair<T>(key: string, defaultData: T): [T, (data: T) => void] {
  const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();
  const [state, setState] = React.useState<T>(defaultData);

  // Connect to container and data object
  React.useEffect(() => {
    const { containerId, isNew } = getContainerId();

    Fluid.getDataObject<KeyValueDataObject>(
      containerId,
      KeyValueDataObject,
      isNew
    ).then(returnedObject => {
      isNew && returnedObject?.set(key, defaultData);
      setDataObject(returnedObject);
    })
  }, [])

  // set up sync from data object to local state
  React.useEffect(() => {
    const syncState = () => dataObject && setState(dataObject.get(key));

    syncState();
    dataObject?.on('changed', syncState);
    return () => { dataObject?.off("change", syncState) }
  }, [dataObject])

  // Method to write to Fluid data. 
  const setData = (newData: T) => {
    dataObject?.set(key, newData)
  }

  return [state, setData];
}

function App() {
  const currentDate = Date.now().toString();
  const [time, setTime] = useKVPair('time', currentDate);

  return (
    <div className="App">
      <button onClick={() => setTime(currentDate)} > {time} </button>
    </div>
  )
}

export default App;



