import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}
export default function getValidationErrors(err: ValidationError): Errors {
  const validationErros: Errors = {};
  console.log(err);
  err.inner.forEach(error => {
    validationErros[error.path] = error.message;
  });

  return validationErros;
}
