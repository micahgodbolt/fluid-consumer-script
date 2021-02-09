/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import { DataObject } from "@fluidframework/aqueduct";
import { IDirectoryValueChanged, IValueChanged } from "@fluidframework/map";

/**
 * IKeyValueDataObject describes the public API surface for our KeyValue DataObject.
 */
export interface IKeyValueDataObject extends EventEmitter {
  /**
   * Get value at Key
   */
  get: (key: string) => any;

  /**
   * Set Value at Key
   */
  set: (key: string, value: any) => void;

  /**
   * Event on value change
   */
  on(event: "changed", listener: (args: IDirectoryValueChanged) => void): this;
}

/**
 * The KeyValueDataObject is our data object that implements the IKeyValueDataObject interface.
 */
export class KeyValueDataObject
  extends DataObject
  implements IKeyValueDataObject {
  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes in data.
   */
  protected async hasInitialized() {
    this.root.on("valueChanged", (changed: IValueChanged) => {
      this.emit("changed", changed);
    });
  }

  public set = (key: string, value: any) => {
    this.root.set(key, value);
  };

  public get = (key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.root.get(key);
  };

  public keys = (): string[] => {
    return Array.from(this.root.keys());
  };

  public getAll = () => {
    const obj: { [key: string]: any } = {};
    this.keys().forEach((key) => {
      obj[key] = this.get(key);
    });
    return obj;
  };
}
