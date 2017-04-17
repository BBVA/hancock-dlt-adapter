'use strict';

exports.jsonSchemaValidation = (validatorName) => {
  return (error, req, res, next) => {
    if (error.name === validatorName) {
      
      console.error(error.message);
      
      res.status(400).json({
        result: {
          // code: codes.CODE400.statusCode,
          // description: codes.CODE400.statusText,
          code: 400,
          description: 'Bad Request',
          info: error.validations
        }
      });
      
    } else {
      next(error);
    }
  }
};
