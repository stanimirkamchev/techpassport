/** @todo move to identifiable */
export interface Identifiable {
  _id: string;
}

export const selectIdentifiableId = <T extends Identifiable>(item: T) => item._id;
