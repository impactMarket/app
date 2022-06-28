import { Box, Card, Col, Display, Divider, Pagination, Row, Text, TextLink, ViewContainer } from '@impact-market/ui';
import { dateHelpers } from '../helpers/dateHelpers';
import { markAsRead } from '../state/slices/notifications';
import { store } from '../state/store';
import { useGetNotificationsMutation, useUpdateNotificationsMutation } from '../api/user';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import useFilters from '../hooks/useFilters';

const Notifications: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { view } = usePrismicData();
    const [getNotifications] = useGetNotificationsMutation();
    const [updataNotifications] = useUpdateNotificationsMutation();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any>();
    const router = useRouter();
    const { update, getByKey } = useFilters();

    // Pagination
    const limit = 10;
    const [offset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const notificationsCount = notifications?.count;
    const pageCount = Math.ceil(notificationsCount / limit);
    const [changed, setChanged] = useState<Date>(new Date());
    const [ready, setReady] = useState(false);

    // On page load, check if there's a page or orderBy in the url and save it to state
    useEffect(() => {
        if(!!getByKey('page')) {
            const page = getByKey('page') as any;

            setItemOffset((page - 1) * limit);
            setChanged(new Date());
            setCurrentPage(page - 1);
        }

        setReady(true);
    }, []);

    useEffect(() => {
        const getNotificationsMethod = async () => {
            try {
            
                setLoading(true);

                const notificationsRequest = await getNotifications({ limit, offset }).unwrap() as any;

                setNotifications(notificationsRequest);

                if(notificationsRequest?.count > 0) {
                    const notifications = notificationsRequest?.rows.filter((s: any) => !s.read).map((s: any) => s.id);

                    if(notifications?.length) {
                        await updataNotifications({body: {notifications}})
    
                        store.dispatch(markAsRead({key: 'notifications', reduce: notifications.length}))
                    }

                }

                setLoading(false);     
              
            } catch (error) {

                console.log(error);
            }
        }

        getNotificationsMethod();
    }, [offset, ready, changed]);

    // Pagination
    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * limit) % notificationsCount;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * limit) % notificationsCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * limit) % notificationsCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        }
    };

    // Redirects
    const handelPageRedirect = (type: number, contentId: number) => {
        switch(type) { 
            case 0: { 
                router.push(`/stories?id=${contentId}`);
                break;
            } 
            case 1: { 
                router.push(`/communities/${contentId}`);
                break;
            } 
            default: { 
               break; 
            } 
         } 
    }

    // Titles
    const handleTitle = (type: number) => {
        switch(type) { 
            case 0: { 
                return view?.data?.messageType0Title;
            } 
            case 1: { 
                return view?.data?.messageType1Title;
            } 
            default: { 
               break; 
            } 
         } 
    }

    // Descriptions
    const handleDescription = (type: number) => {
        switch(type) { 
            case 0: { 
                return view?.data?.messageType0Description; 
            } 
            case 1: { 
                return view?.data?.messageType1Description;
            } 
            default: { 
               break; 
            } 
         } 
    }

    return (
        <ViewContainer isLoading={isLoading || loading}>
            <Display medium>
                <String id="notifications" />
            </Display>
            {/* TODO prismic data */}
            <Text g500>Here you will get all the notifications sent to you.</Text>
            <Box pb={2} pt={2} >
                {notifications?.rows?.length ? (
                    <Card padding={0}>
                        {notifications?.rows.map((notification: any, index: number) => (
                            <>
                                <Box bgColor={notification?.read ? "" : "p100"} key={index}>
                                    <Row pl={1} pr={1}>
                                        <TextLink onClick={() => handelPageRedirect(notification?.type, notification?.params?.contentId)}>
                                            <RichText content={handleTitle(notification?.type)} g700 pb={0} semibold/>
                                        </TextLink>
                                    </Row>
                                    <Row pl={1} pr={1} pt={0}>
                                        <Col colSize={{ sm: 8, xs: 12 }} pt={0}>
                                            <RichText content={handleDescription(notification?.type)} g500 />
                                        </Col>
                                        <Col colSize={{ sm: 4, xs: 12 }} pt={0} right>
                                            <Text g500>{dateHelpers.ago(notification?.createdAt)}</Text>
                                        </Col>
                                    </Row>
                                    <Divider bgColor={notification?.read ? "" : "g25"}/>
                                </Box>
                            </>
                        ))}
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
                    </Card>
                ) : (
                    <Box mt="25vh">
                        <Row fLayout="center">
                            {/* TODO prismic data */}
                            <Text>No notifications found</Text>
                        </Row>
                    </Box>
                )}
            </Box>
        </ViewContainer>
    );
}

export default Notifications;
