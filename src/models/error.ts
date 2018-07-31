export interface IHancockError extends Error {
  internalCode: string;
  httpCode: number;
  message: string;
  extendedMessage: string;
  errorStack: HancockError[];
}

export interface IHancockErrorResponse {
  error: number;
  internalError: string;
  message: string;
  extendedMessage?: string;
}

export class HancockError extends Error implements IHancockError {

  private static prefix: string = 'HKWH';

  public name: string = 'HancockError';
  public errorStack: HancockError[] = [];

  constructor(
    public internalCode: string,
    public httpCode: number,
    public message: string,
    public extendedError?: HancockError | Error) {

    super();
    this.internalCode = `${HancockError.prefix}${internalCode}`;

  }

  get extendedMessage(): string {
    return this.extendedError ? (`${this.extendedError.name}: ${this.extendedError.message}`) : '';
  }

}

export const hancockDefaultError = new HancockError('50000', 500, 'Internal error');
export const hancockDbError = new HancockError('50001', 500, 'Error fetching from database');
export const hancockBadRequestError = new HancockError('40000', 400, 'Bad request');
export const hancockDltError = new HancockError('50300', 503, 'Service Unavailable');
export const hancockNotFoundError = new HancockError('40400', 404, 'Not Found');
export const hancockProviderError = new HancockError('50300', 503, 'Service Unavailable');
