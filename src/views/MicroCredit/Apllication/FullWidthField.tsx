import {
    InputUpload as BaseInputUpload,
    Box,
    Button,
    Icon,
    ImgClick,
    Input,
    Row,
    colors
} from '@impact-market/ui';
import { getCookie } from 'cookies-next';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useGetMicrocreditPreSignedMutation } from 'src/api/microcredit';
import { useSelector } from 'react-redux';

import RichText from '../../../libs/Prismic/components/RichText';
import Select from '../../../components/Select';
import config from '../../../../config';
import styled from 'styled-components';
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

const UploadWrapper = styled(Box)`
    height: 128px;
    display: flex;
    justify-content: space-between;
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.0625rem rgba(16, 24, 40, 0.05),
        0 0 0 1px ${colors.g300};

    > div a {
        background-color: ${colors.p25};
        box-shadow: none;
    }
`;

const ImageWrapper = styled(Box)`
    max-width: 30%;
    flex: 1;
    position: relative;

    img {
        object-fit: cover;
        z-index: 0;
        position: relative;
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
    const [profilePictureThumbnail, setProfilePictureThumbnail] = useState(
        null
    );

    const { communitiesCountries } = useCommunitiesCountries('valid', fetcher);
    const [getMicrocreditPreSigned] = useGetMicrocreditPreSignedMutation();
    const auth = useSelector(selectCurrentUser);

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
        if (!!item.type && !getElement(sectionId, idx)) {
            updateFormData(sectionId, idx, {
                data: '',
                hint: '',
                review: ''
            });
        }
        if (item.type === 'Upload' && !!getElement(sectionId, idx)?.data) {
            const obj = {
                bucket: 'impactmarket-microcredit-staging',
                key: `${getElement(sectionId, idx)?.data}`
            };
            const path = Buffer.from(JSON.stringify(obj)).toString('base64');

            setProfilePictureThumbnail(
                `https://dxdwf61ltxjyn.cloudfront.net/${path}`
            );
        }
        // if (
        //     item.type === 'CheckBox' && !getElement(sectionId, idx)
        // ) {
        //     updateFormData(sectionId, idx, {
        //         data: false,
        //         hint: '',
        //         review: ''
        //     });
        // }
    }, [item]);

    const handleFiles = async (file: any) => {
        const type = file[0]?.type?.split('/')[1] || '';

        setProfilePictureThumbnail(file[0]);
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
                    category: 1,
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
        }

        return res;
    };

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
                    <UploadWrapper flex>
                        <Box style={{ flexBasis: '40%' }}>
                            <BaseInputUpload
                                className="upload"
                                handleFiles={handleFiles}
                                accept={['image/png', 'image/jpeg']}
                                multiple={false}
                                name="documents"
                            >
                                <RichText
                                    g500
                                    small
                                    content={item.placeholder}
                                />
                            </BaseInputUpload>
                        </Box>

                        {!!profilePictureThumbnail && (
                            <ImageWrapper>
                                <ImgClick
                                    handleClick={(event: any) => {
                                        event.preventDefault();
                                        updateFormData(sectionId, idx, {
                                            data: '',
                                            hint: '',
                                            review: ''
                                        });
                                        setProfilePictureThumbnail(null);
                                    }}
                                    icon="trash"
                                    url={
                                        typeof profilePictureThumbnail ===
                                        'string'
                                            ? profilePictureThumbnail
                                            : URL.createObjectURL(
                                                  profilePictureThumbnail
                                              )
                                    }
                                />
                            </ImageWrapper>
                        )}
                    </UploadWrapper>
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
                        <Box>
                            {item.options.map((option: any, id: number) => (
                                <Box pb=".5rem">
                                    <input
                                        type="radio"
                                        name={`${sectionId}-${idx}`}
                                        className={id === 0 ? 'test' : ''}
                                        id={`${sectionId}-${idx}`}
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
                                    <label>{option.text}</label>
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
                            small
                            semibold
                        />
                    )}
                    {!item?.question[0]?.text && <Box mt="1.75rem" />}
                    <Box>
                        {
                            <Input
                                id={`${sectionId}-${idx}`}
                                className="test"
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
                                type={
                                    item.type === 'CurrencyField' ||
                                    item.type === 'NumericField'
                                        ? 'number'
                                        : ''
                                }
                                value={value?.data ?? ''}
                                onChange={(e: any) => {
                                    updateFormData(sectionId, idx, {
                                        data: e.target.value,
                                        hint: '',
                                        review: ''
                                    });
                                    // if (
                                    //     document.getElementById(
                                    //         `${sectionId}-${idx}-error`
                                    //     )
                                    // ) {
                                    //     const grandparent = document.getElementById(
                                    //         `${sectionId}-${idx}`
                                    //     ).parentElement?.parentElement;
                                    //     grandparent.style.boxShadow =
                                    //         '0 0.125rem 0.0625rem rgba(16,24,40,0.05), 0 0 0 1px #D0D5DD';
                                    //     document
                                    //         .getElementById(
                                    //             `${sectionId}-${idx}-error`
                                    //         )
                                    //         .remove();
                                    //     console.log(`${sectionId}-${idx}`);
                                    // }
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
