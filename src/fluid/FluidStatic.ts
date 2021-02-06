/* eslint-disable no-restricted-globals */
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
  getObjectWithIdFromContainer,
  DataObjectFactory,
} from "@fluidframework/aqueduct";
import { Container } from "@fluidframework/container-loader";
import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";
import { getRuntimeFactory } from "./containerCode";

export class FluidDocument {
  constructor(
    private readonly container: Container,
    public readonly createNew: boolean
  ) {}

  public async createDataObject<T = any>(type: string, id: string) {
    await this.container.request({ url: `/create/${type}/${id}` });
    const dataObject = await this.getDataObject<T>(id);
    return dataObject;
  }

  public async getDataObject<T = any>(id: string) {
    const dataObject = await getObjectWithIdFromContainer<T>(
      id,
      this.container
    );
    return dataObject;
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Fluid {
  /**
   * CreateContainer w/ facotires & docId
   */
  public static async createContainer(
    docId: string,
    factories: any[]
  ): Promise<FluidDocument> {
    const container = await getTinyliciousContainer(
      docId,
      getRuntimeFactory(factories),
      true /* createNew */
    );
    const document = new FluidDocument(container, true /* createNew */);
    return document;
  }

  /**
   * getContainer with factories & docId
   */
  public static async getContainer(
    docId: string,
    factories: any[]
  ): Promise<FluidDocument> {
    const container = await getTinyliciousContainer(
      docId,
      getRuntimeFactory(factories),
      false /* createNew */
    );
    const document = new FluidDocument(container, false /* createNew */);
    return document;
  }

  /**
   * getDO by building factory from 1 DO, take in createNew flag
   * Limited to 1 DO, right now...
   */
  public static async getDataObject<T>(
    docId: string,
    dataObject: any,
    isNew: boolean
  ): Promise<T> {
    const factory = new DataObjectFactory(
      docId + "factory",
      dataObject,
      [],
      {}
    );
    const container = await getTinyliciousContainer(
      docId,
      getRuntimeFactory([factory]),
      isNew /* createNew */
    );

    const document = new FluidDocument(container, isNew /* createNew */);

    return isNew
      ? document.createDataObject(factory.type, docId + "dataObject")
      : document.getDataObject(docId + "dataObject");
  }
}

export const getContainerId = (): { containerId: string; isNew: boolean } => {
  let isNew = false;
  if (location.hash.length === 0) {
    isNew = true;
    location.hash = Date.now().toString();
  }
  const containerId = location.hash.substring(1);
  return { containerId, isNew };
};
