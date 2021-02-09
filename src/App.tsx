import React from 'react';
import { KeyValueDataObject } from "./kvpair"
import { Fluid, getContainerId } from './fluid';

function useKVPair() {
  const [dataObject, setDataObject] = React.useState<KeyValueDataObject>();
  const [state, setInternalState] = React.useState<{ [key: string]: any }>({});

  // Connect to container and data object
  React.useEffect(() => {
    const { containerId, isNew } = getContainerId();

    Fluid.getDataObject<KeyValueDataObject>(
      containerId,
      KeyValueDataObject,
      isNew
    ).then(obj => {
      setDataObject(obj);
      !isNew && setInternalState(obj.getAll())
    })
  }, [])


  // set up sync from data object to local state
  React.useEffect(() => {
    if (dataObject) {
      const updateState = ({ key }: any) => {
        const updatedItem = { [key]: dataObject.get(key) }
        setInternalState((s) => ({ ...s, ...updatedItem }))
      }
      dataObject?.on('changed', updateState);
      return () => { dataObject?.off("change", updateState) }
    }

  }, [dataObject])

  // Method to write to Fluid data. 
  const setState = (key: string, value: any) => {
    dataObject?.set(key, value)
  }

  return { state, setState };
}

function App() {
  const getCurrentDate = () => Date.now().toString();
  const { state, setState } = useKVPair();

  return (
    <div className="App">
      <button onClick={() => setState('date', getCurrentDate())} > click </button>
      {state && <span>{state.date}</span>}
    </div>
  )
}

export default App;
