import React from 'react';
import { KeyValueDataObject } from "./kvpair"
import { Fluid, getContainerId } from './fluid';

function useKVPair() {
  const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();
  const [state, setState] = React.useState<{ [key: string]: any }>({});

  // Connect to container and data object
  React.useEffect(() => {
    const { containerId, isNew } = getContainerId();

    Fluid.getDataObject<KeyValueDataObject>(
      containerId,
      KeyValueDataObject,
      isNew
    ).then(obj => {
      setDataObject(obj);
      !isNew && setState(obj.getAll())
    })
  }, [])


  // set up sync from data object to local state
  React.useEffect(() => {
    if (dataObject) {
      const updateState = (change: any) => {
        const { key } = change;
        const updatedItem = { [key]: dataObject.get(key) }
        setState((s) => ({ ...s, ...updatedItem }))
      }
      dataObject.on('changed', updateState);
      return () => { dataObject.off("change", updateState) }
    }
  }, [dataObject])

  // Method to write to Fluid data. 
  const setData = (key: string, value: any) => {
    dataObject?.set(key, value)
  }

  return { data: state, setData };
}

function App() {
  const { data, setData } = useKVPair();

  return (
    <div className="App">
      <button onClick={() => setData('date', Date.now().toString())} > click </button>
      {data && <span>{data.date}</span>}
    </div>
  )
}

export default App;
