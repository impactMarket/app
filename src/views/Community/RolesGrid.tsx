/* eslint-disable no-nested-ternary */
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

import {
    Box,
    Button,
    Card,
    Grid,
    Icon,
    Spinner,
    openModal,
    toast
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import CanBeRendered from '../../components/CanBeRendered';
import Message from '../../libs/Prismic/components/Message';
import ShimmerEffect from '../../components/ShimmerEffect';
import String from '../../libs/Prismic/components/String';
import UserCard from '../../components/UserCard';
import config from '../../../config';
import useManagers from '../../hooks/useManagers';

const Managers = ({
    ambassador,
    community,
    status,
    communityId,
    requestedCommunity
}: any) => {
    const { removeManager } = useAmbassador();
    const { user } = useSelector(selectCurrentUser);
    const [updateState, setUpdateState] = useState<number[]>([]);
    const fetcher = (url: string, headers: any | {}) =>
        fetch(config.baseApiUrl + url, headers).then((res) => res.json());
    const { managers, loadingManagers, mutate } = useManagers(
        communityId,
        ['limit=999', 'orderBy=state'],
        fetcher
    );

    const removeManagerFunc = async (address: any, key: number) => {
        setUpdateState([...updateState, key]);

        try {
            const { status } = await removeManager(community?.id, address);

            if (status) {
                toast.success(<Message id="managerRemoved" />);
                mutate('/communities/7085/managers?limit=999&orderBy=state');
            } else {
                toast.error(<Message id="errorOccurred" />);
            }
        } catch (e) {
            console.log(e);

            toast.error(<Message id="errorOccurred" />);
        }

        const index = updateState.indexOf(key);

        if (index) setUpdateState(updateState.splice(index, 1));
    };

    return (
        <>
            {/* Add Manager  */}
            {status === 'valid' &&
                user?.address?.toLowerCase() ===
                    ambassador?.address?.toLowerCase() && (
                    <CanBeRendered types={['ambassador']}>
                        <Box mb={1} right>
                            <Button
                                icon="userPlus"
                                margin="0 0.5 0 0"
                                onClick={() =>
                                    openModal('addManager', {
                                        community,
                                        mutate: () =>
                                            mutate(
                                                '/communities/7085/managers?limit=999&orderBy=state'
                                            )
                                    })
                                }
                            >
                                <String id="addNewManager" />
                            </Button>
                        </Box>
                    </CanBeRendered>
                )}

            {!loadingManagers && !managers && <String id="noManagers" />}

            <Grid cols={{ sm: 3, xs: 1 }}>
                {loadingManagers &&
                    [1,2,3].map((key: number) => (
                        <Card key={key}>
                            <ShimmerEffect
                                isLoading
                                style={{
                                    height: '41.5px',
                                    marginTop: '10px',
                                    width: '100%'
                                }}
                            />
                            <ShimmerEffect
                                isLoading
                                style={{
                                    height: '11.5px',
                                    marginTop: '10px',
                                    width: '70%'
                                }}
                            />
                            <ShimmerEffect
                                isLoading
                                style={{
                                    height: '11.5px',
                                    marginTop: '10px',
                                    width: '90%'
                                }}
                            />
                            <ShimmerEffect
                                isLoading
                                style={{
                                    height: '41.5px',
                                    marginTop: '10px',
                                    width: '100%'
                                }}
                            />
                        </Card>
                    ))}
                {!!managers?.rows?.length &&
                    managers?.rows?.map((data: any, key: number) => (
                        <Card key={key}>
                            <UserCard
                                community={community}
                                data={data}
                                requestedCommunity={requestedCommunity}
                            />
                            {/* Remove Manager  */}
                            {data.state === 0 && (
                                <CanBeRendered types={['ambassador']}>
                                    {user?.address?.toLowerCase() ===
                                        ambassador?.address?.toLowerCase() && (
                                        <Box center mt={1}>
                                            <Button
                                                onClick={() =>
                                                    removeManagerFunc(
                                                        data?.address,
                                                        key
                                                    )
                                                }
                                                secondary
                                                w="100%"
                                            >
                                                {!updateState.includes(key) ? (
                                                    <>
                                                        <Icon
                                                            icon="userMinus"
                                                            margin="0 0.5 0 0"
                                                            p700
                                                        />
                                                        <String id="removeManager" />
                                                    </>
                                                ) : (
                                                    <Spinner isActive />
                                                )}
                                            </Button>
                                        </Box>
                                    )}
                                </CanBeRendered>
                            )}
                        </Card>
                    ))}
            </Grid>
        </>
    );
};

export default Managers;
