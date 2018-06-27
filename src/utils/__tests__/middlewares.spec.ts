import 'jest';
import * as utilsMiddlewares from '../middlewares';

describe('utilsMiddlewares', () => {

  global.console = {
    error: jest.fn(),
  } as any;

  describe('::jsonSchemaValidation', () => {

    const rightValidator = 'mockedErrorName';

    const errorMock = {
      message: 'mockedErrorMessage',
      name: rightValidator,
      validations: 'mockedErrorValidations',
    };

    const responseMock = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    const requestMock = {};

    const nextMock = jest.fn();

    it('should return the middleware configured with the given validator', () => {

      const validatorName: string = 'mockedValidatorName';
      const middlewareFn: any = utilsMiddlewares.jsonSchemaValidation(validatorName);

      expect(typeof middlewareFn).toEqual('function');

    });

    it('the returned middleware should intercept jsonSchemaValidation errors and response with 400 Bad Request and error description', () => {

      const validatorName: string = rightValidator;
      const middlewareFn: any = utilsMiddlewares.jsonSchemaValidation(validatorName);

      middlewareFn(errorMock, requestMock, responseMock, nextMock);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(responseMock.json).toHaveBeenCalledWith({
        result: {
          code: 400,
          description: 'Bad Request',
          info: 'mockedErrorValidations',
        },
      });

    });

    it('the returned middleware should call next if the error is not of kind jsonSchemaValidation error', () => {

      const validatorName: string = 'wrongMockedErrorName';
      const middlewareFn: any = utilsMiddlewares.jsonSchemaValidation(validatorName);

      middlewareFn(errorMock, requestMock, responseMock, nextMock);

      expect(nextMock).toHaveBeenCalled();

    });

  });

});
