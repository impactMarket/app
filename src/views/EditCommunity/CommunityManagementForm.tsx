/* eslint-disable no-nested-ternary */
import {
    Box,
    Card,
    Col,
    Divider,
    Row,
    Text,
    Toggle,
    toast
} from '@impact-market/ui';
import { Controller, useForm } from 'react-hook-form';
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import FormActions from '../Profile/FormActions';
import Input from '../../components/Input';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
// import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const schema = yup.object().shape({
    lock: yup.boolean(),
    maxBeneficiaries: yup
        .number()
        .positive()
        .integer()
        .min(0)
        .max(100000)
        .nullable(true)
});

const CommunityManagementForm = ({
    isLoading,
    communityAddress,
    maxBeneficiaries,
    isLocked
}: any) => {
    // const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const {
        communityManagement,
        communityParameters,
        maxNumberBeneficiaries,
        lockCommunity: lockCommunityTitle,
        lockedCommunityHint,
        maxBeneficiariesUpdated,
        maxBeneficiariesUpdateError,
        lockedCommunitySuccess,
        lockedCommunityError,
        unlockCommunitySuccess,
        unlockCommunityError
    } = extractFromView('formSections') as any;
    const {
        lockCommunity,
        unlockCommunity,
        updateMaxBeneficiaries
    } = useAmbassador();
    const {
        handleSubmit,
        reset,
        control,
        getValues,
        setValue,
        formState: { errors, isDirty, isSubmitting, dirtyFields }
    } = useForm({
        defaultValues: {
            lock: '',
            maxBeneficiaries: 0
        },
        resolver: useYupValidationResolver(schema)
    });

    useEffect(() => {
        setValue('lock', isLocked);
        setValue('maxBeneficiaries', maxBeneficiaries);
    }, [isLocked, maxBeneficiaries]);

    const handleCancel = (e: any) => {
        e.preventDefault();
        reset();
    };

    const onSubmit = async (data: any) => {
        try {
            const transactionChain: any = [];
            let transactionFailed = false;

            toast.info(<Message id="approveTransaction" />);
            if (dirtyFields.maxBeneficiaries) {
                transactionChain.push(
                    updateMaxBeneficiaries(
                        communityAddress,
                        data.maxBeneficiaries
                    )
                        .then(() => {
                            toast.success(maxBeneficiariesUpdated[0]?.text);
                        })
                        .catch(() => {
                            toast.error(maxBeneficiariesUpdateError[0]?.text);
                            transactionFailed = true;
                        })
                );
            }

            if (dirtyFields.lock) {
                const lockAction = [];

                if (data.lock) {
                    lockAction.push(
                        await lockCommunity(communityAddress)
                            .then(() => {
                                toast.success(lockedCommunitySuccess[0]?.text);
                            })
                            .catch(() => {
                                toast.error(lockedCommunityError[0]?.text);
                                transactionFailed = true;
                            })
                    );
                } else {
                    lockAction.push(
                        await unlockCommunity(communityAddress)
                            .then(() => {
                                toast.success(unlockCommunitySuccess[0]?.text);
                            })
                            .catch(() => {
                                transactionFailed = true;
                                toast.error(unlockCommunityError[0]?.text);
                            })
                    );
                }

                transactionChain.push(lockAction);
            }

            await Promise.all(transactionChain)
                .then(() => {
                    if (!transactionFailed) {
                        reset(getValues());
                    }
                })
                .catch(() => {
                    toast.error(<Message id="errorOccurred" />);
                });
        } catch (error) {
            toast.error(<Message id="errorOccurred" />);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row pb="3rem">
                <Col
                    colSize={{ sm: 4, xs: 12 }}
                    pb={1.25}
                    pt={{ sm: 1.25, xs: 0 }}
                >
                    <Divider
                        margin="1.25 0"
                        show={{ sm: 'none', xs: 'block' }}
                    />
                    <RichText content={communityManagement} g700 medium small />
                    <RichText
                        content={communityParameters}
                        g500
                        regular
                        small
                    />
                </Col>
                <Col
                    colSize={{ sm: 8, xs: 12 }}
                    pb={1.25}
                    pt={{ sm: 1.25, xs: 0 }}
                >
                    <Card padding={1.5}>
                        <Box fDirection="column" fLayout="start" flex>
                            <Box pt={{ sm: 0, xs: 1.5 }} w={{ xs: '100%' }}>
                                <Input
                                    control={control}
                                    disabled={isLoading}
                                    label={maxNumberBeneficiaries[0]?.text}
                                    name="maxBeneficiaries"
                                    placeholder={maxBeneficiaries || ''}
                                    onKeyDown={(e: any) =>
                                        (e.key === 'e' || e.key === '-') &&
                                        e.preventDefault()
                                    }
                                    type="number"
                                    withError={!!errors?.maxBeneficiaries}
                                />
                            </Box>
                            <Box flex pt="1.5rem">
                                <Box pr={0.5}>
                                    <Controller
                                        control={control}
                                        name="lock"
                                        render={({
                                            field: { onChange, value }
                                        }) => (
                                            <Toggle
                                                disabled={isLoading}
                                                isActive={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box w="100%">
                                    <Text g700 medium small>
                                        {lockCommunityTitle[0]?.text}
                                    </Text>
                                    <RichText
                                        content={lockedCommunityHint[0]?.text}
                                        g500
                                        small
                                    />
                                </Box>
                            </Box>
                        </Box>
                        {(isDirty || isSubmitting) && (
                            <FormActions
                                handleCancel={handleCancel}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </form>
    );
};

export default CommunityManagementForm;
