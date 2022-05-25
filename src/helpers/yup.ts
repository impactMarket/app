import * as yup from 'yup';
import { useCallback } from "react";

yup.setLocale({
    number: {
        max: ({ max }) => ({ key: 'errorMaxNumber', value: max }),
        min: ({ min }) => ({ key: 'errorMinNumber', value: min })
    },
    string: {
        email: 'errorEmail',
        max: ({ max }) => ({ key: 'errorMaxString', value: max }),
        min: ({ min }) => ({ key: 'errorMinString', value: min })
    }
});

const useYupValidationResolver = (schema: any) =>
    useCallback(
        async (data: any) => {
            try {
                const values = await schema.validate(data, {
                    abortEarly: false
                });

                return {
                    errors: {} as any,
                    values
                };
            } catch (errors: any) {
                return {
                    errors: errors.inner.reduce(
                        (allErrors: any, currentError: any) => ({
                            ...allErrors,
                            [currentError.path]: {
                                message: currentError.message,
                                type: currentError.type ?? "validation"
                            }
                        }),
                        {}
                    ),
                    values: {}
                };
            }
        }, [schema]
    );

export { useYupValidationResolver, yup };
