import { Box, DropdownMenu, Row, Spinner } from '@impact-market/ui';
import { useState } from 'react';
import NameFilter from '../../components/Filters';
import Select from '../../components/Select';
import useCommunitiesCountries from '../../hooks/useCommunitiesCountries';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Filters = ({ myCommunityTitle, filters, filterProperty }: any) => {
    const { t } = useTranslations();
    const { getByKey, update } = useFilters();
    const statusFilter = filters.state || 'valid';
    const { communitiesCountries, loadingCountries } =
        useCommunitiesCountries(statusFilter);
    const countries = getByKey('country')
        ? (getByKey('country') as string).split(';')
        : [];
    const [selectedCountries, setSelectedCountries] = useState(countries);

    const cleanState = (state: string) => ({ country: '', page: 0, state });

    const myCommunityItems = [
        {
            icon: 'check',
            onClick: () => {
                update(cleanState('valid'));
                setSelectedCountries([]);
            },
            title: t('valid')
        },
        {
            icon: 'loader',
            onClick: () => {
                update(cleanState('pending'));
                setSelectedCountries([]);
            },
            title: t('pending')
        },
        {
            icon: 'trash',
            onClick: () => {
                update(cleanState('removed'));
                setSelectedCountries([]);
            },
            title: t('removed')
        }
    ];

    return (
        <Box fLayout="center start" inlineFlex mt={0.8} w="100%">
            {filters.type === 'myCommunities' && (
                <DropdownMenu
                    {...({} as any)}
                    asButton
                    headerProps={{
                        fLayout: 'center between'
                    }}
                    icon="chevronDown"
                    items={myCommunityItems}
                    title={myCommunityTitle}
                    wrapperProps={{
                        mr: 1,
                        w: 15
                    }}
                />
            )}
            <NameFilter margin="0 1 0 0" property={filterProperty} />

            {!loadingCountries ? (
                <Select
                    callback={(value: any) => {
                        setSelectedCountries(value);
                        update({ country: value.join(';'), page: 0 });
                    }}
                    initialValue={getByKey('country')}
                    isClearable
                    isMultiple
                    options={communitiesCountries}
                    placeholder={`${t('allCountries')} (${
                        communitiesCountries.length
                    })`}
                    showFlag
                    value={selectedCountries}
                    withOptionsSearch
                />
            ) : (
                <Row fLayout="center" h="0.1" minW="160px">
                    <Spinner isActive />
                </Row>
            )}
        </Box>
    );
};

export default Filters;
