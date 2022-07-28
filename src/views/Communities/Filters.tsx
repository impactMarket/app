import { Box, DropdownMenu } from '@impact-market/ui';
import NameFilter from '../../components/Filters';
import React from 'react';
import Select from '../../components/Select';
import useCommunitiesCountries from "../../hooks/useCommunitiesCountries";
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Filters = ({myCommunityTitle, activeTab}: any) => { 
    const { t } = useTranslations();
    const { getByKey, update } = useFilters();
    const statusFilter = getByKey('status') || 'valid';
    const { communitiesCountries, loadingCountries } = useCommunitiesCountries(statusFilter.toString());

    const cleanState = (state: string) => (
        { country: '', offset: 0, state,  status: state }
    );

    const myCommunityItems = [
        {
            icon: 'check',
            onClick: () => {
                update(cleanState('valid'));
            },
            title: t('valid')
        },
        {
            icon: 'loader',
            onClick: () => {
                update(cleanState('pending'));
            },
            title: t('pending')
        },
        {
            icon: 'trash',
            onClick: () => {
                update(cleanState('removed'));
            },
            title: t('removed')
        }
    ];

    return ( 
        <Box fLayout="center start" inlineFlex mt={0.8} w="100%">
            {activeTab === 'myCommunities' &&
                <DropdownMenu
                    asButton
                    headerProps={{
                        fLayout: "center between"
                    }}
                    icon="chevronDown"
                    items={myCommunityItems}
                    title={myCommunityTitle}
                    wrapperProps={{
                        mr:1,
                        w:15
                    }}
                />
            }
            <NameFilter margin="0 1 0 0" property="name" />

            {!loadingCountries && <Select
                callback={
                    (value: any) => update('country', value?.join(';'))
                }
                initialValue={getByKey('country')}
                isClearable
                isMultiple
                options={communitiesCountries}
                placeholder={`${t('allCountries')} (${communitiesCountries.length})` }
                showFlag
                withOptionsSearch
            />}
        </Box>
    );
};

export default Filters;
