import React from 'react';
import { KeyValueDataObject } from "@fluid-experimental/data-objects"
import { Fluid, getContainerId } from './fluid';

function useKVPair<T>(defaultData: T): [T, (data: T) => void] {
  const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();
  const [state, setState] = React.useState<T>(defaultData);
  const DATA_KEY = 'data';

  // Connect to container and data object
  React.useEffect(() => {
    const { containerId, isNew } = getContainerId();

    Fluid.getDataObject<KeyValueDataObject>(
      containerId,
      KeyValueDataObject,
      isNew
    ).then(returnedObject => {
      isNew && returnedObject?.set(DATA_KEY, defaultData);
      setDataObject(returnedObject);
    })
  }, [])

  // set up sync from data object to local state
  React.useEffect(() => {
    const syncState = () => dataObject && setState(dataObject.get(DATA_KEY));

    syncState();
    dataObject?.on('changed', syncState);
    return () => { dataObject?.off("change", syncState) }
  }, [dataObject])

  // Method to write to Fluid data. 
  const setData = (newData: T) => {
    dataObject?.set(DATA_KEY, newData)
  }

  return [state, setData];
}

function App() {
  const currentDate = Date.now().toString();
  const [data, setData] = useKVPair({ time: currentDate });

  return (
    <div className="App">
      <button onClick={() => setData({ time: currentDate })} > {data.time} </button>
    </div>
  )
}

export default App;
