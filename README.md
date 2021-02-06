# Fluid Consumer Script

### 1. Install CRA

```bash
npx create-react-app my-app --template typescript
```

### 2. Install Fluid and Fluid Data Objects

```bash
cd my-app-name
npm install @fluid-experimental/fluid @fluid-experimental/data-objects
```

### 3. Import KVpair and Fluid

```js
import {
  KeyValueDataObject,
  KeyValueInstantiationFactory,
} from "@fluid-experimental/data-objects";
import { Fluid } from "./fluid";
```

## Questions

1. should we just switch to resolve for Containers? Commonly requested
2. Does having just a getDataObject oversimplify things? Is depth there?
3. Could you run getDataObject (w/ createnew) 2x w/ diff DO's on the same container?
4. How do we simplify the useKVPair export to have more keyvalue semantics?

---

1. Does the useKVPair method need to be performant?
2. Can the useKvPair.Get require O(N) work?
3. Can the UsekvPair.Set always trigger an entire dom refresh?
4. Can you ugprade to a new syntax once our limtied perf runs out?
5. How far does this need to scale with this syntax?
6. If our funnel (CRA getting started app) is really simple, does the eventual use case need to follow the same syntax?

## Things to Solve

- We have to store all the data in one key value pair
  - All of the data currently needs to be updated at once (you can't sepeartely collaborate on different parts)
- As currently written, it appears that we'd need to translate the Map object into a JS native object
- How do we have multiple KV pairs in this example? (May be optional)

## Notes

- Ideally values are sub 1KB

## Options

1. Redux model... getter/setter per key on the keyvalue
   1. then we don't have all of our data in one key/value pair
2. Pass the MapKernal.data Map() into setState (is this possible?)
