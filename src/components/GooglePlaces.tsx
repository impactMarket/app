import { Controller } from "react-hook-form";
import { Text, colors } from '@impact-market/ui';
import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete';
import React from 'react';
import config from '../../config';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

type InputProps = {
    control?: any;
    disabled?: boolean;
    hint?: string;
    label?: string;
    name?: string;
    rules?: any;
    withError?: boolean;
};

const GooglePlaces: React.FC<InputProps> = props => {
    const { control, disabled, hint, label, name, rules, withError, ...forwardProps } = props;
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const onChange = async (data: any, onChange: Function) => { 
        if(!!data) {
            const geocode = await geocodeByPlaceId(data.value?.place_id);
            const gps = geocode?.length > 0 ? await getLatLng(geocode[0]) : {};
            const country = geocode?.length > 0 && geocode[0]?.address_components?.length > 0 ? geocode[0].address_components.find(elem => elem.types.indexOf('country') > -1)?.short_name : null;

            onChange({ ...data, country, gps });
        }
    }

    const renderInput = (field?: any) => {
        return (
            <>
                { !!label && <Text g700 mb={0.375} medium small>{label}</Text> }
                <GooglePlacesAutocomplete
                    apiKey={config.googlePlacesKey}
                    apiOptions={{ language: auth?.user?.language || 'en-US' }}
                    autocompletionRequest={{
                        types: ['locality']
                    }}
                    selectProps={{
                        ...field,
                        isDisabled: disabled,
                        onChange: (e: any) => onChange(e, field.onChange),
                        placeholder: t('searchByCityCountry'),
                        styles: {
                            control: (provided: any) => ({
                                ...provided,
                                backgroundColor: disabled ? colors.g100 : colors.n01,
                                borderColor: 'transparent',
                                borderRadius: '0.5rem',
                                boxShadow: `0 0.125rem 0.0625rem rgba(16, 24, 40, 0.05), 0 0 0 0.063rem ${withError ? colors.e600 : colors.g300}`,
                                minHeight: '2.625rem'
                            }),
                            indicatorSeparator: (provided: any) => ({
                                ...provided,
                                display: 'none'
                            }),
                            indicatorsContainer: (provided: any) => ({
                                ...provided,
                                display: 'none'
                            }),
                            placeholder: (provided: any) => ({
                                ...provided,
                                color: colors.g500,
                                fontSize: '0.875rem'
                            }),
                            singleValue: (provided: any) => ({
                                ...provided,
                                color: colors.g900
                            })
                        },
                        ...forwardProps
                    }}
                />
                { !!hint && <Text mt={0.375} sColor={withError ? 'e500' : 'g500'} small>{hint}</Text> }
            </>
        );
    }

    return (
        <>
            { 
                control ?
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => renderInput(field)}
                    rules={rules}
                />
                :
                renderInput()
            }
        </>   
    )
}

export default GooglePlaces;
