/* eslint-disable no-nested-ternary */
import { Box, Button, CircledIcon, ModalWrapper, Text, useModal } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const ConfirmAdd = () => {
    const { data, handleClose, isSubmitting, language, onSubmit } = useModal();

    const localeCurrency = new Intl.NumberFormat(language, {
        currency: 'USD',
        style: 'currency'
    });

    const { t } = useTranslations();
    const { extractFromModals } = usePrismicData();
    const { beneficiaryAble, content, title } = extractFromModals('createAddCommunity') as any;

    const amount = currencyFormat(data.claimAmount, localeCurrency);
    const interval = data.baseInterval === 'day' ? t('perDay') : data.baseInterval === 'week' ? t('perWeek') : '';
    const maxAmount = currencyFormat(data.maxClaim, localeCurrency);
    const minutes = data.incrementInterval;

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <CircledIcon icon="checkCircle" medium success /> 
            <Text g900 large mt={1.25} semibold>{title}</Text>
            <RichText content={content} g500 mt={0.5} small />
            <RichText content={beneficiaryAble} g500 mt={1.25} variables={{ amount, interval, maxAmount, minutes }} />
            <Box flex mt={2}>
                <Box pr={0.375} w="50%">
                    <Button disabled={isSubmitting} gray onClick={handleClose} w="100%">
                        <String id="goBack" />
                    </Button>
                </Box>
                <Box pl={0.375} w="50%">
                    <Button disabled={isSubmitting} isLoading={isSubmitting} onClick={() => { onSubmit(data); handleClose(); }} w="100%">
                        <String id="iConfirm" />
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    )
}

export default ConfirmAdd;
