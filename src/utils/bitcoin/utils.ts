export const addressPattern = new RegExp(/^(1|3|m|n|2)([a-zA-Z0-9]{25,34})$/i);
export const mainetPattern = new RegExp(/^(1|3)([a-zA-Z0-9]{25,34})$/i);
export const tesnetPattern = new RegExp(/^(m|n|2)([a-zA-Z0-9]{25,34})$/i);

export function getScQueryByAddressOrAlias(addressOrAlias: string): {} {

  return addressPattern.test(addressOrAlias)
    ? { address: addressOrAlias }
    : { alias: addressOrAlias };

}
