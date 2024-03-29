import {
    Avatar,
    Box,
    Card,
    Divider,
    DropdownMenu,
    Label,
    Pagination,
    Text,
    TextLink,
    ViewContainer,
    toast
} from '@impact-market/ui';
import { dateHelpers } from '../../helpers/dateHelpers';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';
import useFilters from '../../hooks/useFilters';
import useSuspiciousReports from '../../hooks/useSuspiciousReports';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Reports: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const router = useRouter();
    const { update, getByKey } = useFilters();
    const { t } = useTranslations();
    const { view } = usePrismicData();
    const communityId = getByKey('community')
        ? getByKey('community').toString()
        : null;

    // Pagination
    const limit = 10;
    const [offset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const { data, loadingReports } = useSuspiciousReports(
        communityId,
        limit,
        offset
    );
    const pageCount = Math.ceil(data?.count / limit);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * limit) % data?.count;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * limit) % data?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * limit) % data?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        }
    };

    // On page load, check if there's a page or orderBy in the url and save it to state
    useEffect(() => {
        if (!!getByKey('page')) {
            const page = getByKey('page') as any;

            setItemOffset((page - 1) * limit);
            setCurrentPage(page - 1);
        }
    }, []);

    const copyToClipboard = (content: string) => {
        navigator?.clipboard.writeText(content);
        toast.success(<Message id="copiedAddress" />);
    };

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading || loadingReports}>
            <Box as="a" onClick={() => router.push('/ambassador')}>
                <Label content={<String id="back" />} icon="arrowLeft" />
            </Box>
            <RichText
                content={view.data.headingTitle}
                extralarge
                medium
                pt={2}
            />
            <Text g500>
                <RichText content={view.data.headingContent} />
            </Text>
            <Box pt={2}>
                <Card padding={0}>
                    {data?.rows?.map((report: any) => (
                        <>
                            <Box padding={1}>
                                <Box fLayout="between" flex>
                                    <Box fLayout="center start" flex>
                                        <Avatar
                                            url={getImage({
                                                filePath:
                                                    report?.community
                                                        ?.coverMediaPath,
                                                fit: 'cover',
                                                height: 32,
                                                width: 32
                                            })}
                                        />
                                        <Box pl={1}>
                                            <Link
                                                href={`/communities/${report.communityId}`}
                                                passHref
                                            >
                                                <TextLink g900 medium>
                                                    {report?.community?.name}
                                                </TextLink>
                                            </Link>
                                            <Box>
                                                <DropdownMenu
                                                    {...({} as any)}
                                                    icon="chevronDown"
                                                    items={[
                                                        {
                                                            icon: 'open',
                                                            onClick: () =>
                                                                window.open(
                                                                    config.explorerUrl?.replace(
                                                                        '#USER#',
                                                                        report
                                                                            ?.community
                                                                            ?.contractAddress
                                                                    )
                                                                ),
                                                            title: t(
                                                                'openInExplorer'
                                                            )
                                                        },
                                                        {
                                                            icon: 'copy',
                                                            onClick: () =>
                                                                copyToClipboard(
                                                                    report
                                                                        ?.community
                                                                        ?.contractAddress
                                                                ),
                                                            title: t(
                                                                'copyAddress'
                                                            )
                                                        }
                                                    ]}
                                                    title={formatAddress(
                                                        report?.community
                                                            ?.contractAddress,
                                                        [6, 4]
                                                    )}
                                                    wrapperProps={{ mt: 0.25 }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Text>
                                            {dateHelpers.agoISO(
                                                report?.createdAt
                                            )}
                                        </Text>
                                    </Box>
                                </Box>
                                <Text pt={1.5}>{report?.message}</Text>
                            </Box>

                            <Divider margin={0} />
                        </>
                    ))}

                    {pageCount > 1 && (
                        <Box padding={1}>
                            <Pagination
                                currentPage={currentPage}
                                handlePageClick={handlePageClick}
                                nextIcon="arrowRight"
                                nextLabel="Next"
                                pageCount={pageCount}
                                previousIcon="arrowLeft"
                                previousLabel="Previous"
                            />
                        </Box>
                    )}
                </Card>
            </Box>
        </ViewContainer>
    );
};

export default Reports;
