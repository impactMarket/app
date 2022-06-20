/* eslint-disable no-nested-ternary */
import { Alert, Box, Card, Col, Divider, Row, Text, Toggle } from '@impact-market/ui';
import { getExpectedUBIDuration } from '../../utils/communities';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useWatch } from "react-hook-form";
import Input from '../../components/Input';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import Select from '../../components/Select';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const ContractForm: React.FC<{ control: any, currency: string, errors: any, isLoading: boolean }> = props => {
    const { control, currency, errors, isLoading } = props;
    const [privateCommunity, setPrivateCommunity] = useState(false);
    const [expectedUBIDuration, setExpectedUBIDuration] = useState('');

    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { contractAlert, contractDescription, contractFirstText, contractPrivateDescription, contractPrivateTitle, contractSecondText, contractTitle } = extractFromView('formSections') as any;

    // TODO: add texts to Prismic
    const baseIntervals = [
        { label: "Daily", value: 'day' },
        { label: "Weekly", value: 'week' }
    ];

    const togglePrivateCommunity = () => {
        if(privateCommunity) {
            setPrivateCommunity(false);
        }
        else {
            setPrivateCommunity(true);
        }
    }

    const claimAmountWatch = useWatch({ control, name: 'claimAmount' });
    const maxClaimWatch = useWatch({ control, name: 'maxClaim' });
    const baseIntervalWatch = useWatch({ control, name: 'baseInterval' });
    const incrementIntervalWatch = useWatch({ control, name: 'incrementInterval' });
        
    useEffect(() => {
        let remaining = '';

        if(claimAmountWatch && maxClaimWatch && baseIntervalWatch && incrementIntervalWatch) {
            const { days, hours, minutes, months, years } = getExpectedUBIDuration(claimAmountWatch, maxClaimWatch, baseIntervalWatch, incrementIntervalWatch);

            if (years > 0) {
                remaining = `${years} ${t('years').toLowerCase()} `;
            }
            if (months > 0) {
                remaining = `${remaining}${months} ${t('months').toLowerCase()} `;
            }
            if (days > 0) {
                remaining = `${remaining}${days} ${t('days').toLowerCase()} `;
            }
            if (hours > 0) {
                remaining = `${remaining}${hours} ${t('hours').toLowerCase()} `;
            }
            if (minutes > 0) {
                remaining = `${remaining}${minutes} ${t('minutes').toLowerCase()} `;
            }

            if(remaining) {
                remaining = remaining.slice(0, -1);
            }
        }

        setExpectedUBIDuration(remaining);
    }, [claimAmountWatch, maxClaimWatch, baseIntervalWatch, incrementIntervalWatch]);

    return (
        <Row>
            <Col colSize={{ sm: 4, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <Divider margin="1.25 0" show={{ sm: 'none', xs: 'block' }} />
                <Text g700 medium small>{contractTitle}</Text>
                <RichText content={contractDescription} g500 regular small />
            </Col>
            <Col colSize={{ sm: 8, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <Card padding={1.5}>
                    {expectedUBIDuration &&
                        <Alert 
                            icon="alertCircle" 
                            info 
                            mb={1.5}
                            title={<RichText content={contractAlert} variables={{ value: expectedUBIDuration }} />}
                        />
                    }
                    <RichText content={contractFirstText} g600 small />
                    <RichText content={contractSecondText} g600 mt={2} small />
                    <Box fLayout="start" fWrap="wrap" flex mt={1.5}>
                        <Box pr={{ sm: 0.75, xs: 0 }} w={{ sm: '50%', xs: '100%' }}>
                            { /* TODO: add text to Prismic */ }
                            <Input 
                                control={control}
                                disabled={!currency || isLoading}
                                hint={!currency ? 
                                    'Please select a Country first' : 
                                    errors?.claimAmount?.message?.key ? 
                                    t(errors?.claimAmount?.message?.key)?.replace('{{ value }}', errors?.claimAmount?.message?.value) : 
                                    errors?.claimAmount ? 
                                    t('fieldRequired') : 
                                    ''
                                }
                                label={t('amountPerClaim')}
                                name="claimAmount"
                                onKeyDown={(e: any) => (e.key === 'e' || e.key === '-') && e.preventDefault()}
                                suffix={currency}
                                type="number"
                                withError={!!errors?.claimAmount}
                            />
                        </Box>
                        <Box pl={{ sm: 0.75, xs: 0 }} pt={{ sm: 0, xs: 1.5 }} w={{ sm: '50%', xs: '100%' }}>
                            { /* TODO: add text to Prismic */ }
                            <Input 
                                control={control}
                                disabled={!currency || isLoading}
                                hint={!currency ? 
                                    'Please select a Country first' : 
                                    errors?.maxClaim?.message?.key ? 
                                    t(errors?.maxClaim?.message?.key)?.replace('{{ value }}', errors?.maxClaim?.message?.value) : 
                                    errors?.maxClaim ? 
                                    t('fieldRequired') : 
                                    ''
                                }
                                label={t('maxClaim')}
                                name="maxClaim"
                                onKeyDown={(e: any) => (e.key === 'e' || e.key === '-') && e.preventDefault()}
                                suffix={currency}
                                type="number"
                                withError={!!errors?.maxClaim}
                            />
                        </Box>
                    </Box>
                    <Box fLayout="start" fWrap="wrap" flex mt={1.5}>
                        <Box pr={{ sm: 0.75, xs: 0 }} w={{ sm: '50%', xs: '100%' }}>
                            <Select
                                control={control}
                                disabled={isLoading}
                                hint={errors?.baseInterval ? t('fieldRequired') : ''}
                                isMultiple={false}
                                label={t('baseInterval')}
                                name="baseInterval"
                                options={baseIntervals}
                                withError={!!errors?.baseInterval}
                            />
                        </Box>
                        <Box pl={{ sm: 0.75, xs: 0 }} pt={{ sm: 0, xs: 1.5 }} w={{ sm: '50%', xs: '100%' }}>
                            { /* TODO: add text to Prismic */ }
                            <Input 
                                control={control}
                                disabled={isLoading}
                                hint={errors?.incrementInterval?.message?.key ? 
                                    t(errors?.incrementInterval?.message?.key)?.replace('{{ value }}', errors?.incrementInterval?.message?.value) : 
                                    errors?.incrementInterval ? 
                                    t('fieldRequired') : 
                                    ''
                                }
                                label="Total time increment after each claim"
                                name="incrementInterval"
                                onKeyDown={(e: any) => (e.key === 'e' || e.key === '-') && e.preventDefault()}
                                suffix={t('minutes')}
                                type="number"
                                withError={!!errors?.incrementInterval}
                            />
                        </Box>
                    </Box>
                    <Divider margin="1.5 0" />
                    <Box fLayout="start" flex>
                        <Box pr={0.5}>
                            <Toggle 
                                disabled={isLoading}
                                isActive={privateCommunity}
                                onChange={togglePrivateCommunity}
                            />
                        </Box>
                        { /* TODO: Check with Bernardo how to do this part, it's the same as in the Mobile app? */ }
                        <Box w="100%">
                            <Text g700 medium small>{contractPrivateTitle}</Text>
                            <RichText content={contractPrivateDescription} g500 small />
                        </Box>
                    </Box>
                </Card>
            </Col>
        </Row>
    );
};

export default ContractForm;
