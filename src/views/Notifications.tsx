import {
    Box,
    Card,
    Col,
    Display,
    Divider,
    Pagination,
    Row,
    Text,
    TextLink,
    ViewContainer
} from '@impact-market/ui';
import { dateHelpers } from '../helpers/dateHelpers';
import { markAsRead } from '../state/slices/notifications';
import { store } from '../state/store';
import { useNotifications } from 'src/hooks/useNotifications';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useUpdateNotificationsMutation } from '../api/user';
import React, { useEffect, useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import useFilters from '../hooks/useFilters';

const Notifications: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { view } = usePrismicData({ list: true });
    const [updataNotifications] = useUpdateNotificationsMutation();
    const router = useRouter();
    const { update, getByKey } = useFilters();

    const limit = 7;
    const [offset, setItemOffset] = useState(0);

    const { notifications, loadingNotifications } = useNotifications([
        `limit=${limit}`,
        `offset=${offset}`,
        `isWebApp=true`
    ]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(notifications?.count / limit);
    const [changed, setChanged] = useState<Date>(new Date());
    const [ready, setReady] = useState(false);

    // On page load, check if there's a page or orderBy in the url and save it to state
    useEffect(() => {
        if (!!getByKey('page')) {
            const page = getByKey('page') as any;

            setItemOffset((page - 1) * limit);
            setChanged(new Date());
            setCurrentPage(page - 1);
        }

        setReady(true);
    }, []);

    useEffect(() => {
        const markedAsRead = async () => {
            if (notifications?.count > 0) {
                const notificationsRead = notifications?.rows
                    .filter((s: any) => !s.read)
                    .map((s: any) => s.id);

                if (notificationsRead?.length) {
                    await updataNotifications({
                        body: { notifications: notificationsRead }
                    });

                    store.dispatch(
                        markAsRead({
                            key: 'notifications',
                            reduce: notificationsRead.length
                        })
                    );
                }
            }
        };

        markedAsRead();
    }, [offset, ready, changed, notifications]);

    // Pagination
    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * limit) % notifications?.count;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * limit) % notifications?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * limit) % notifications?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        }
    };

    // Redirects
    const handlePageRedirect = (type: number, params: any) => {
        const data = params?.contentId
            ? params?.contentId
            : params?.communityId && params?.communityId;

        switch (type) {
            case 0: {
                router.push(`/stories?id=${data}`);
                break;
            }
            case 1: {
                router.push(`/communities/${data}`);
                break;
            }
            case 2: {
                router.push(`/communities/${data}`);
                break;
            }
            case 3: {
                router.push(`/communities/${data}`);
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <ViewContainer
            {...({} as any)}
            isLoading={isLoading || loadingNotifications}
        >
            <>
                <Display medium>
                    <String id="notifications" />
                </Display>
                <Text g500>
                    <RichText content={view.data.messageAllNotificationsSent} />
                </Text>
                <Box pb={2} pt={2}>
                    {notifications?.rows?.length ? (
                        <Card padding={0}>
                            {notifications?.rows.map(
                                (notification: any, index: number) => (
                                    <>
                                        <Box
                                            bgColor={
                                                notification?.read ? '' : 'p100'
                                            }
                                            key={index}
                                        >
                                            <Row pl={1} pr={1}>
                                                <TextLink
                                                    onClick={() =>
                                                        handlePageRedirect(
                                                            notification?.type,
                                                            notification?.params
                                                        )
                                                    }
                                                >
                                                    <RichText
                                                        content={
                                                            view?.data?.[
                                                                `messageType${notification?.type}title`
                                                            ]
                                                        }
                                                        g700
                                                        pb={0}
                                                        semibold
                                                    />
                                                </TextLink>
                                            </Row>
                                            <Row pl={1} pr={1} pt={0}>
                                                <Col
                                                    colSize={{
                                                        sm: 8,
                                                        xs: 12
                                                    }}
                                                    pt={0}
                                                >
                                                    <RichText
                                                        content={
                                                            view?.data?.[
                                                                `messageType${notification?.type}description`
                                                            ]
                                                        }
                                                        g500
                                                    />
                                                </Col>
                                                <Col
                                                    colSize={{
                                                        sm: 4,
                                                        xs: 12
                                                    }}
                                                    pt={0}
                                                    right
                                                >
                                                    <Text g500>
                                                        {dateHelpers.notificationsAgo(
                                                            notification?.createdAt
                                                        )}
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Divider
                                                bgColor={
                                                    notification?.read
                                                        ? ''
                                                        : 'g25'
                                                }
                                            />
                                        </Box>
                                    </>
                                )
                            )}

                            {pageCount > 1 && (
                                <Box padding={1} pt={0}>
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
                    ) : (
                        <Box mt="25vh">
                            <Row fLayout="center">
                                <String id="noNotificationsFound" />
                            </Row>
                        </Box>
                    )}
                </Box>
            </>
        </ViewContainer>
    );
};

export default Notifications;
