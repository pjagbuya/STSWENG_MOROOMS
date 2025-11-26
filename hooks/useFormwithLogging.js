import validationLogger from '@/lib/validationLogger';
import { useState } from 'react';

export function useFormWithLogging(formName, validate) {
  const [errors, setErrors] = useState({});

  const validateAndLog = values => {
    const validationErrors = validate(values);

    if (Object.keys(validationErrors).length > 0) {
      validationLogger.logErrors(formName, validationErrors);
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return { errors, validateAndLog, setErrors };
}
