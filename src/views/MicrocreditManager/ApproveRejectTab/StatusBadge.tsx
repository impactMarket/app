import { Badge, Box, Icon, Text } from '@impact-market/ui';
import { FormStatus } from '../../../utils/formStatus';
import React from 'react';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

export const loanStatus = (status: any) => {
    const { t } = useTranslations();
    let badgeContent = null;
    let bgColor = '';

    switch (status) {
        case FormStatus.PENDING:
            badgeContent = (
                <Box flex>
                    <Icon icon={'clock'} g700 mr={0.2} />
                    <Text g700 extrasmall medium>
                        {t('pending')}
                    </Text>
                </Box>
            );
            bgColor = 'bgG50';
            break;
        case FormStatus.REQUEST_CHANGES:
            badgeContent = (
                <Box flex>
                    <Icon icon={'edit'} p700 mr={0.2} />
                    <Text g900 extrasmall medium>
                        {t('revise')}
                    </Text>
                </Box>
            );
            bgColor = 'bgP50';
            break;

        case FormStatus.INTERVIEW:
            badgeContent = (
                <Box flex>
                    <Icon icon={'menu'} p700 mr={0.2} />
                    <Text p700 extrasmall medium>
                        {t('interview')}
                    </Text>
                </Box>
            );
            bgColor = 'bgP50';
            break;
        case FormStatus.APPROVED:
            badgeContent = (
                <Box flex>
                    <Icon icon={'check'} s500 mr={0.2} />
                    <Text s700 extrasmall medium>
                        {t('approved')}
                    </Text>
                </Box>
            );
            bgColor = 'bgS50';
            break;
        case FormStatus.REJECTED:
            badgeContent = (
                <Box flex>
                    <Icon icon={'close'} e500 mr={0.2} />
                    <Text e700 extrasmall medium>
                        {t('rejected')}
                    </Text>
                </Box>
            );
            bgColor = 'bgE50';
            break;
        default:
            badgeContent = <></>;
            bgColor = 'bgN01';
    }

    return (
        <Box fLayout="center start" flex>
            <Badge {...{ [bgColor]: true }} style={{ width: 'fit-content' }}>
                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {badgeContent}
                </Box>
            </Badge>
        </Box>
    );
};
