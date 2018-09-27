export const addressPattern: RegExp = new RegExp(/^0x[a-fA-F0-9]{40}$/i);

export function getScQueryByAddressOrAlias(addressOrAlias: string): {} {

  return addressPattern.test(addressOrAlias)
    ? { address: addressOrAlias }
    : { alias: addressOrAlias };

}
