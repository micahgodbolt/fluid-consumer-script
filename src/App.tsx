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
  const setData = React.useCallback((key: string, value: any) => {
    dataObject?.set(key, value)
  }, [dataObject])

  return { data: state, setData };
}

const TimeStamp = React.memo((props: any) => {
  const handleClick = () => props.setData(props.name, Date.now().toString());
  return (
    <div>
      <button onClick={handleClick} > click </button>
      <span>{props.date}</span>
    </div>
  )
})


function App() {
  const { data, setData } = useKVPair();

  return (
    <div className="App">
      <TimeStamp setData={setData} name={'date'} date={data.date} />
      <TimeStamp setData={setData} name={'time'} date={data.time} />
    </div>
  )
}

export default App;
