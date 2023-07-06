import {
    InputUpload as BaseInputUpload,
    Box,
    Button,
    // Card,
    Icon,
    Input,
    Row,
    colors
    // Text
} from '@impact-market/ui';
import RichText from '../../../libs/Prismic/components/RichText';

import Select from '../../../components/Select';
import config from '../../../../config';
import styled from 'styled-components';
import useCommunitiesCountries from '../../../hooks/useCommunitiesCountries';

// import InputUpload from '../../../components/InputUpload';
// import { useState } from 'react';

const SelectElement = styled(Button)`
    background-color: white;
    border-radius: 0;
    color: ${colors.g800};
    padding: 0.6rem;
    border-color: ${colors.g300};
    transition: none;
    flex: 1;

    .button-content {
        font-size: 0.8rem;
        padding: 0;
    }

    &:hover,
    &.active {
        background-color: ${colors.g50} !important;
        border-color: ${colors.g300} !important;
    }

    &:first-of-type {
        border-radius: 8px 0px 0px 8px;
        border-right: 0px;
    }

    &:last-of-type {
        border-radius: 0px 8px 8px 0px;
        border-left: 0px;
    }
`;

const CheckBox = styled(Box)`
    background-color: ${colors.p100};
    border-radius: 5px;
    height: 20px;
    width: 20px;
`;

export interface FullWidthProps {
    item: any;
    fieldType: string;
    idx: number;
    sectionId: string;
    // formId: number;
    updateFormData: (rowKey: string, columnKey: number, value: any) => void;
    getElement: (rowKey: any, columnKey: number) => any;
}

const fetcher = () =>
    fetch(
        `${config.baseApiUrl  }/communities/count?groupBy=country&status=valid`
    ).then((res) => res.json());

const FullWidthField = (props: FullWidthProps) => {
    const { item, sectionId, idx, updateFormData, getElement } = props;
    const { communitiesCountries } = useCommunitiesCountries('valid', fetcher);

    const toggleActive = (value: string, id: number) => {
        updateFormData(sectionId, idx, value);
        document.querySelector(`.active`)?.classList.remove('active');
        document.querySelector(`.select-${id}`).classList.add('active');
    };

    const value = getElement(sectionId, idx);

    return (
        <Row w="100%" ml="0">
            {item.type === 'Checkbox' && (
                <Box pb="1.5rem" w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            small
                            pb="1.5rem"
                            pt=".5rem"
                            w="100%"
                        />
                    )}
                    <Box>
                        {item.options.map((option: any, id: number) => (
                            <Box flex pb="1.5rem">
                                <Box
                                    mr={0.6}
                                    flex
                                    style={{ alignItems: 'center' }}
                                >
                                    <CheckBox
                                        onClick={() => {
                                            const checked = getElement(
                                                sectionId,
                                                id
                                            );

                                            console.log(checked);

                                            if (!!checked) {
                                                updateFormData(
                                                    sectionId,
                                                    id,
                                                    false
                                                );
                                            } else {
                                                updateFormData(
                                                    sectionId,
                                                    id,
                                                    true
                                                );
                                            }
                                        }}
                                        padding={0.3}
                                        flex
                                    >
                                        {getElement(sectionId, id) && (
                                            <Icon
                                                icon="tick"
                                                p500
                                                h="100%"
                                                w="100%"
                                            />
                                        )}
                                    </CheckBox>
                                </Box>
                                <label style={{ textAlign: 'left' }}>
                                    <RichText
                                        content={option?.text}
                                        small
                                        semibold
                                        g700
                                    />
                                </label>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
            {item.type === 'Upload' && (
                <Box pb="1.5rem" w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            small
                            semibold
                            pb="1rem"
                            pt=".5rem"
                            w="100%"
                        />
                    )}
                    <Box>
                        <BaseInputUpload
                            handleFiles={() => console.log('cenas')}
                        />
                    </Box>
                </Box>
            )}
            {item.type === 'Radio' && (
                <Box w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            small
                            semibold
                            pb="1rem"
                            pt=".5rem"
                            w="100%"
                        />
                    )}
                    <Box>
                        {item.options.map((option: any, id: number) => (
                            <Box pb=".5rem">
                                <input
                                    type="radio"
                                    name={`${sectionId}-${idx}`}
                                    id={option.text}
                                    value={option.text}
                                    style={{ margin: '0 .75rem 0 0' }}
                                    checked={
                                        getElement(sectionId, idx) ===
                                        id.toString()
                                    }
                                    onChange={() => {
                                        console.log(id);

                                        updateFormData(
                                            sectionId,
                                            idx,
                                            id.toString()
                                        );
                                    }}
                                />
                                <label>{option.text}</label>
                            </Box>
                        ))}
                        {!!item?.disclaimer.length && (
                            <RichText
                                content={item?.disclaimer}
                                g500
                                pt="1rem"
                            />
                        )}
                    </Box>
                </Box>
            )}
            {item.type === 'Select' && (
                <Box pb="1.5rem" w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            small
                            semibold
                            pb=".5rem"
                            w="100%"
                        />
                    )}
                    <Box>
                        <Box flex>
                            {item.options.map((option: any, id: number) => (
                                <SelectElement
                                    pb=".5rem"
                                    className={`select-${id} ${
                                        getElement(sectionId, idx) ===
                                        option.text
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        toggleActive(option.text, id)
                                    }
                                >
                                    {option.text}
                                </SelectElement>
                            ))}
                        </Box>

                        {!!item?.disclaimer.length && (
                            <RichText
                                content={item?.disclaimer}
                                g500
                                pt="1rem"
                            />
                        )}
                    </Box>
                </Box>
            )}
            {(item.type === 'TextField' ||
                item.type === 'CurrencyField' ||
                item.type === 'EmailField' ||
                item.type === 'Textbox') && (
                <Box w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            small
                            semibold
                        />
                    )}
                    {!item?.question[0]?.text && <Box mt="1.75rem" />}
                    <Box>
                        {
                            <Input
                                hint={
                                    item?.disclaimer.length
                                        ? item?.disclaimer[0].text
                                        : ''
                                }
                                icon={item.type === 'EmailField' ? 'mail' : ''}
                                placeholder={
                                    item?.placeholder.length
                                        ? item?.placeholder[0].text
                                        : ''
                                }
                                prefix={
                                    item.type === 'CurrencyField' ? '$' : ''
                                }
                                rows={item.type === 'Textbox' ? 5 : 0}
                                suffix={
                                    item.type === 'CurrencyField' ? 'USD' : ''
                                }
                                value={value?.data ?? ''}
                                onChange={(e: any) => {
                                    updateFormData(sectionId, idx, {
                                        data: e.target.value,
                                        hint: '',
                                        review: ''
                                    });
                                }}
                                wrapperProps={{
                                    mt: 0.5
                                }}
                            />
                        }
                    </Box>
                </Box>
            )}
            {item.type === 'CountryDropdown' && (
                <Box pb="1.5rem" w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            small
                            semibold
                            pb="1rem"
                            pt=".5rem"
                            w="100%"
                        />
                    )}
                    <Box>
                        {
                            <Select
                                callback={(value: any) => {
                                    updateFormData(sectionId, idx, value);
                                }}
                                initialValue={''}
                                isClearable
                                options={communitiesCountries}
                                placeholder={'Countries'}
                                showFlag
                                value={value ?? ''}
                                withOptionsSearch
                            />
                        }
                        {!!item?.disclaimer.length && (
                            <RichText
                                content={item?.disclaimer}
                                g500
                                pt="1rem"
                            />
                        )}
                    </Box>
                </Box>
            )}
        </Row>
    );
};

export default FullWidthField;
