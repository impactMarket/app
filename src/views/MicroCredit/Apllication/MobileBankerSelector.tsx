import { Avatar, Box, Row, Text, colors } from '@impact-market/ui';
import { getImage } from '../../../utils/images';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RichText from '../../../libs/Prismic/components/RichText';
import Select from '../../../components/Select';
import config from '../../../../config';
import styled from 'styled-components';

const RadioWrapper = styled.label`
    align-items: center;
    border: 1px solid ${colors.g200};
    border-radius: 5px;
    display: flex;
    flex-basis: 49%;
    margin-bottom: 0.5rem;
    padding: 1rem;

    &.active {
        border: 1px solid ${colors.p500};
    }
`;

export interface MobileBankerProps {
    item: any;
    fieldType: string;
    idx: number;
    readOnly: boolean;
    sectionId: string;
    setLoanManagerId: (managerId: number) => void;
    updateFormData: (rowKey: string, columnKey: number, value: any) => void;
    getElement: (rowKey: any, columnKey: number) => any;
}

const MobileBankerSelector = (props: MobileBankerProps) => {
    const {
        idx,
        item,
        readOnly,
        sectionId,
        updateFormData,
        getElement,
        setLoanManagerId
    } = props;
    const formData = getElement(sectionId, idx)?.data;
    const [active, setActive] = useState(formData ?? -1);
    const auth = useSelector(selectCurrentUser);
    const { signature, message } = useSelector(selectCurrentUser);
    const [managers, setManagers] = useState([]);
    const [country, setCountry] = useState(
        getElement(sectionId, idx)?.data.split('-')[0] ?? ''
    );
    const [selectedId, setSelectedId] = useState(
        getElement(sectionId, idx)?.data.split('-')[1] ?? ''
    );
    const [countryLabel, setCountryLabel] = useState('');

    const countries = [
        { label: 'Uganda', value: 'UG' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Nigeria', value: 'NG' },
        { label: 'Venezuela', value: 'VE' }
    ];

    useEffect(() => {
        const selectedCountry = countries.find(
            (field) => field.value === country
        );

        setCountryLabel(selectedCountry?.label ?? '');
        fetchManagers(country);
    }, [country]);

    const fetchManagers = async (country: string) => {
        const managers = await fetch(
            `${config.baseApiUrl}/microcredit/managers/${country}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    message,
                    signature
                }
            }
        ).then((res) => res.json());

        setManagers(managers?.data);
    };

    return (
        <Row w="100%" ml="0">
            <Box pb="1.5rem" w="100%">
                {!!item?.cardTitle && (
                    <RichText
                        content={item?.cardTitle}
                        g700
                        medium
                        semibold
                        pt=".5rem"
                        w="100%"
                    />
                )}
                {!!item?.cardDescription && (
                    <RichText content={item?.cardDescription} g500 medium />
                )}

                <Select
                    callback={(value: string) => {
                        setCountry(value);
                        fetchManagers(value);
                    }}
                    placeholder={'Choose your country'}
                    isClearable
                    options={countries}
                    mt="1.5rem"
                    disabled={readOnly}
                    showFlag
                    value={country}
                    withOptionsSearch
                />

                {!!item?.cardDescription && !!managers?.length && (
                    <RichText
                        pt="1.5rem"
                        content={item?.description}
                        g700
                        medium
                    />
                )}

                <Box
                    className="radio-container"
                    style={{
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}
                    flex
                >
                    {managers?.map((option: any, id: number) => (
                        <RadioWrapper
                            className={active == id ? 'active' : ''}
                            htmlFor={`${sectionId}-${id}`}
                            onClick={() => !readOnly && setActive(id)}
                        >
                            <input
                                type="radio"
                                name={`${sectionId}-${id}`}
                                id={`${sectionId}-${id}`}
                                disabled={readOnly}
                                value={option.name}
                                style={{ alignItems: 'center' }}
                                checked={selectedId === id.toString()}
                                onChange={() => {
                                    setLoanManagerId(managers[id]?.id);
                                    setSelectedId(id.toString());
                                    updateFormData(sectionId, idx, {
                                        data: `${country}-${id.toString()}`,
                                        hint: '',
                                        review: ''
                                    });
                                }}
                            />
                            <Box
                                flex
                                fDirection="column"
                                style={{ flex: 1 }}
                                ml=".75rem"
                            >
                                <Text medium semibold>
                                    {`${option.firstName} ${option.lastName}`}
                                </Text>
                                <Text medium g400>
                                    {countryLabel}
                                </Text>
                            </Box>
                            <Box ml=".5rem">
                                <Avatar
                                    url={getImage({
                                        filePath: option.avatarMediaPath,
                                        fit: 'cover'
                                    })}
                                />
                            </Box>
                        </RadioWrapper>
                    ))}
                </Box>
            </Box>
        </Row>
    );
};

export default MobileBankerSelector;
