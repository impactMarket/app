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
// import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import FormActions from '../Profile/FormActions';
import Input from '../../components/Input';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

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

const CommunityManagementForm = ({ isLoading, communityAddress, maxBeneficiaries, isLocked }: any) => {
    const { t } = useTranslations();
    // TODO: Add form title and description to Prismic
    // const { extractFromView } = usePrismicData();
    // const { contractDescription, contractTitle } = extractFromView('formSections') as any;
    const { lockCommunity, unlockCommunity, updateMaxBeneficiaries } = useAmbassador();
    const {
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors, isDirty, isSubmitting, dirtyFields }
    } = useForm({
        defaultValues: {
            lock: isLocked,
            maxBeneficiaries: maxBeneficiaries || ''
        },
        resolver: useYupValidationResolver(schema)
    });

    const handleCancel = (e: any) => {
        e.preventDefault();
        reset();
    };

    const onSubmit = async (data: any) => {
        try {
            const transactionChain: any = [];
            let transactionFailed = false;

            if (dirtyFields.maxBeneficiaries) {
                transactionChain.push(
                    updateMaxBeneficiaries(
                        communityAddress,
                        data.maxBeneficiaries
                    )
                        .then(() => {
                            toast.success('Maximum beneficiaries updated');
                        })
                        .catch(() => {
                            toast.error(
                                'Failed to update maximum number of benefeciaries'
                            );
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
                                toast.success(
                                    'Successfully locked the community'
                                );
                            })
                            .catch(() => {
                                toast.error('Failed to lock the community');
                                transactionFailed = true;
                            })
                    );
                } else {
                    lockAction.push(
                        await unlockCommunity(communityAddress)
                            .then(() => {
                                toast.success(
                                    'Successfully unlocked the community'
                                );
                            })
                            .catch(() => {
                                transactionFailed = true;
                                toast.error('Failed to unlock the community');
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
                    <Text g700 medium small>
                        Community Management
                    </Text>
                    <RichText
                        content="Here you will define some community parameters"
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
                                    hint={
                                        errors?.maxBeneficiaries?.message?.key
                                            ? t(
                                                  errors?.maxBeneficiaries
                                                      ?.message?.key
                                              )?.replace(
                                                  '{{ value }}',
                                                  errors?.maxBeneficiaries
                                                      ?.message?.value
                                              )
                                            : ''
                                    }
                                    label="Maximum number of beneficiaries"
                                    name="maxBeneficiaries"
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
                                        Lock this community.
                                    </Text>
                                    <RichText
                                        content="Locked communities beneficiaires cannot claim funds and managers cannot add/remove benericiaires."
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