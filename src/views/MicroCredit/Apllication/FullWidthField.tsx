import {
    EnhancedInputUpload as BaseInputUpload,
    Box,
    Button,
    DropdownMenu,
    Icon,
    Input,
    Row,
    Text,
    colors
} from '@impact-market/ui';
import { getCookie } from 'cookies-next';
import { mq } from 'styled-gen';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useGetMicrocreditPreSignedMutation } from 'src/api/microcredit';
import { useSelector } from 'react-redux';

import RichText from '../../../libs/Prismic/components/RichText';
import Select from '../../../components/Select';
import config from '../../../../config';
import styled, { css } from 'styled-components';
import useCommunitiesCountries from '../../../hooks/useCommunitiesCountries';

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

const Spacer = styled(Box)`
    ${mq.phone(css`
        display: none;
    `)};
`;

const CurrencySelector = styled(DropdownMenu)`
    p,
    svg {
        color: ${colors.g900};
    }
`;

export interface FullWidthProps {
    item: any;
    fieldType: string;
    idx: number;
    sectionId: string;
    updateFormData: (rowKey: string, columnKey: number, value: any) => void;
    getElement: (rowKey: any, columnKey: number) => any;
}

export interface FormDataProps {
    item: any;
    fieldType: string;
    idx: number;
    sectionId: string;
    updateFormData: (rowKey: string, columnKey: number, value: any) => void;
    getElement: (rowKey: any, columnKey: number) => any;
}

const fetcher = () =>
    fetch(
        `${config.baseApiUrl}/communities/count?groupBy=country&status=valid`
    ).then((res) => res.json());

const FullWidthField = (props: FullWidthProps) => {
    const { item, sectionId, idx, updateFormData, getElement } = props;
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [income, setIncome] = useState('');
    const { communitiesCountries } = useCommunitiesCountries('valid', fetcher);
    const [getMicrocreditPreSigned] = useGetMicrocreditPreSignedMutation();
    const auth = useSelector(selectCurrentUser);
    const walletAddress = auth?.user?.address;

    const toggleActive = (value: string, id: number) => {
        updateFormData(sectionId, idx, {
            data: value,
            hint: '',
            review: ''
        });
        document.querySelector(`.active`)?.classList.remove('active');
        document.querySelector(`.select-${id}`).classList.add('active');
    };

    const value = getElement(sectionId, idx);

    useEffect(() => {
        if (item.type === 'CurrencyField' && value?.data) {
            setIncome(value?.data?.split(' ')[0]);
            setCurrency(value?.data?.split(' ')[1]);
        }
        if (!!item.type && !getElement(sectionId, idx)) {
            updateFormData(sectionId, idx, {
                data: '',
                hint: '',
                review: ''
            });
        }
        if (item.type === 'Upload' && !!getElement(sectionId, idx)?.data) {
            setFileName(getElement(sectionId, idx)?.data);
        }
    }, [item]);

    const handleFiles = async (file: any) => {
        const type = file[0]?.type?.split('/')[1] || '';
        const preSigned = await getMicrocreditPreSigned(type).unwrap();

        if (!preSigned?.uploadURL) {
            return null;
        }

        await fetch(preSigned?.uploadURL, {
            body: file[0],
            method: 'PUT'
        });

        const res = await fetch(`${config.baseApiUrl}/microcredit/docs`, {
            body: JSON.stringify([
                {
                    category: 2,
                    filepath: preSigned?.filePath
                }
            ]),
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${auth.token}`,
                'Content-Type': 'application/json',
                message: getCookie('MESSAGE').toString(),
                signature: getCookie('SIGNATURE').toString()
            },
            method: 'POST'
        });

        if (res?.ok) {
            updateFormData(sectionId, idx, {
                data: preSigned?.filePath,
                hint: '',
                review: ''
            });

            setFileName(file[0].name);
            setFileSize(`${Math.floor(file[0].size / 1024)} KB`);
        }

        return res;
    };

    const updateIncome = (value: string, curr: string) => {
        updateFormData(sectionId, idx, {
            data: `${value} ${curr}`,
            hint: '',
            review: ''
        });
    };

    return (
        <Row w="100%" ml="0">
            {item.type === 'Checkbox' && (
                <Box pb="1.5rem" w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
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
                                        on
                                        onClick={() => {
                                            const checked = getElement(
                                                sectionId,
                                                id
                                            );

                                            if (!!checked?.data) {
                                                updateFormData(sectionId, id, {
                                                    data: false,
                                                    hint: '',
                                                    review: ''
                                                });
                                            } else {
                                                updateFormData(sectionId, id, {
                                                    data: true,
                                                    hint: '',
                                                    review: ''
                                                });
                                            }
                                        }}
                                        padding={0.3}
                                        flex
                                    >
                                        {getElement(sectionId, id)?.data ===
                                            true && (
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
                                        content={[option]}
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
                            semibold
                            pb="1rem"
                            pt=".5rem"
                            w="100%"
                        />
                    )}
                    <BaseInputUpload
                        className="upload"
                        hint={
                            <RichText g500 small content={item.placeholder} />
                        }
                        handleFiles={handleFiles}
                        accept={['image/png', 'image/jpeg']}
                        multiple={false}
                        name="documents"
                    >
                        <Box mt="-.75rem">
                            <Text sColor={colors.g700} medium>
                                {fileName}
                            </Text>
                            <Text sColor={colors.g500} small>
                                {fileSize}
                            </Text>
                        </Box>
                    </BaseInputUpload>
                </Box>
            )}
            {(item.type === 'Radio' || item.type === 'RadioSingleLine') && (
                <Box w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            // small
                            semibold
                            pb="1rem"
                            pt=".5rem"
                            variables={{ walletAddress }}
                            w="100%"
                        />
                    )}
                    <Box>
                        <Box flex={item.type === 'RadioSingleLine' ? true : ''}>
                            {item.options.map((option: any, id: number) => (
                                <Box
                                    pb=".5rem"
                                    mr={
                                        item.type === 'RadioSingleLine'
                                            ? '.5rem'
                                            : ''
                                    }
                                >
                                    <input
                                        type="radio"
                                        name={`${sectionId}-${idx}`}
                                        // className={id === 0 ? 'test' : ''}
                                        id={`${sectionId}-${id}`}
                                        value={option.text}
                                        style={{ margin: '0 .75rem 0 0' }}
                                        checked={
                                            getElement(sectionId, idx)?.data ===
                                            id.toString()
                                        }
                                        onChange={() => {
                                            updateFormData(sectionId, idx, {
                                                data: id.toString(),
                                                hint: '',
                                                review: ''
                                            });
                                        }}
                                    />
                                    <label htmlFor={`${sectionId}-${id}`}>
                                        {option.text}
                                    </label>
                                </Box>
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
            {item.type === 'Select' && (
                <Box pb="1.5rem" w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            // small
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
                                        getElement(sectionId, idx)?.data ===
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
                item.type === 'Textbox' ||
                item.type === 'NumericField') && (
                <Box w="100%">
                    {!!item?.question[0]?.text && (
                        <RichText
                            content={item?.question}
                            g700
                            medium
                            // small
                            semibold
                        />
                    )}
                    {!item?.question[0]?.text && item.type !== 'Textbox' && (
                        <Spacer mt="1.75rem" />
                    )}
                    <Box style={{ position: 'relative' }}>
                        {
                            <Input
                                id={`${sectionId}-${idx}`}
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
                                // suffix={
                                //     item.type === 'CurrencyField' ? 'USD' : ''
                                // }
                                type={
                                    item.type === 'CurrencyField' ||
                                    item.type === 'NumericField'
                                        ? 'number'
                                        : ''
                                }
                                value={
                                    item.type === 'CurrencyField'
                                        ? income
                                        : value?.data ?? ''
                                }
                                onChange={(e: any) => {
                                    if (item.type === 'CurrencyField') {
                                        setIncome(e.target.value);
                                        updateIncome(e.target.value, currency);
                                    } else {
                                        updateFormData(sectionId, idx, {
                                            data: e.target.value,
                                            hint: '',
                                            review: ''
                                        });
                                    }
                                }}
                                wrapperProps={{
                                    mt: !!item?.question[0]?.text ? 0.5 : ''
                                }}
                            />
                        }
                        {item.type === 'CurrencyField' && (
                            <Box
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '0.625rem'
                                }}
                            >
                                <CurrencySelector
                                    {...({} as any)}
                                    icon="chevronDown"
                                    items={[
                                        {
                                            onClick: () => {
                                                updateIncome(income, 'USD');
                                                setCurrency('USD');
                                                console.log(currency);
                                            },
                                            title: 'USD'
                                        },
                                        {
                                            onClick: () => {
                                                updateIncome(income, 'UGX');
                                                setCurrency('UGX');
                                            },
                                            title: 'UGX'
                                        },
                                        {
                                            onClick: () => {
                                                updateIncome(income, 'BRL');
                                                setCurrency('BRL');
                                            },
                                            title: 'BRL'
                                        },
                                        {
                                            onClick: () => {
                                                updateIncome(income, 'NGN');
                                                setCurrency('NGN');
                                            },
                                            title: 'NGN'
                                        },
                                        {
                                            onClick: () => {
                                                updateIncome(income, 'VED');
                                                setCurrency('VED');
                                            },
                                            title: 'VED'
                                        }
                                    ]}
                                    title={currency}
                                />
                            </Box>
                        )}
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
                            // small
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
                                    updateFormData(sectionId, idx, {
                                        data: value,
                                        hint: '',
                                        review: ''
                                    });
                                }}
                                initialValue={''}
                                isClearable
                                options={communitiesCountries}
                                placeholder={'Countries'}
                                showFlag
                                value={value?.data ?? ''}
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
