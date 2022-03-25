import { Box, Button, Col, Row } from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import React from "react";
import String from '../../../libs/Prismic/components/String';
import currenciesJSON from '../../../assets/currencies.json';
import languagesJSON from '../../../assets/languages.json';

type Inputs = {
    currency: string,
    language: string
};

const currencies: {
    [key: string]: {
        symbol: string;
        name: string;
        symbol_native: string;
    };
} = currenciesJSON;

const languages: {
    [key: string]: {
        name: string;
        nativeName: string;
    };
} = languagesJSON;

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);

    const { control, register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            currency: auth?.user?.currency,
            language: auth?.user?.language
        }
    });
    const { isSubmitting } = useFormState({ control });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="currency">Currency</label>
            <br />
            <select id="currency" {...register("currency", { required: true })} style={{ border: '1px solid black' }}>
                <option>Select</option>
                { 
                    Object.entries(currencies).map(([key, value]) => { 
                        return <option key={key} value={key}>{value.name}</option>;
                    }) 
                }
            </select>
            <br />
            {errors.currency && <span>This field is required</span>}
            <br /><br />

            <label htmlFor="language">Language</label>
            <br />
            <select id="language" {...register("language", { required: true })} style={{ border: '1px solid black' }}>
                <option>Select</option>
                { 
                    Object.entries(languages).map(([key, value]) => { 
                        return <option key={key} value={key}>{value.name}</option>;
                    }) 
                }
            </select>
            <br />
            {errors.language && <span>This field is required</span>}
            <br /><br />
            
            <Box mt={1.5}>
                <Row>
                    <Col colSize={12} right>
                        <Button default isLoading={isSubmitting} type="submit">
                            Save changes
                        </Button>
                    </Col>
                </Row>
            </Box>
        </form>
    );
}

export default Form;