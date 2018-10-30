export type address = string;

export interface IHancockTransferSendRequest {
  from: address;
  to: address;
  value: string;
  data?: string;
}
