/* eslint-disable no-nested-ternary */
import { useSelector } from 'react-redux';
import React from 'react';

import {
    Box,
    Button,
    Card,
    Grid,
    Icon,
    openModal,
    toast
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import CanBeRendered from '../../components/CanBeRendered';
import Message from '../../libs/Prismic/components/Message';
import String from '../../libs/Prismic/components/String';
import UserCard from '../../components/UserCard'


const Managers = ({ ambassador, community, status, setRefreshingPage, requestedCommunity, role } : any) => {
    const { removeManager } = useAmbassador();
    const { user } = useSelector(selectCurrentUser);
    const [ roleData ] = Object.values(role) as any[]
    
    const removeManagerFunc = async (address: any) => {
        try {
            setRefreshingPage(true)

            const { status } = await removeManager(community?.id, address);

            if(status) {
                toast.success(<Message id="managerRemoved" />);
            }
            else {
                toast.error(<Message id="errorOccurred" />);
            }
        }
        catch(e) {
            console.log(e);

            toast.error(<Message id="errorOccurred" />);

            setRefreshingPage(false)
        }

        setRefreshingPage(false)
    }

    return (
        <>
            {/* Add Manager  */}
            {Object.keys(role)?.includes('managers') && (
                (status === 'valid' && user?.address?.toLowerCase() === ambassador?.address?.toLowerCase()) && (
                    <CanBeRendered types={['ambassador']}>     
                        <Box mb={1} right>
                            <Button
                                icon="userPlus"
                                margin="0 0.5 0 0"
                                onClick={() =>
                                    openModal('addManager', { community, setRefreshingPage })
                                }
                            >
                                <String id="addNewManager"/>
                            </Button>
                        </Box> 
                    </CanBeRendered>
                )
            )}

            {!!roleData?.length ?
                <Grid cols={{ sm: 3, xs: 1 }}>
                    {roleData?.map((data: any, key: number) => (
                            <Card key={key}>
                                <UserCard
                                    community={community}
                                    data={data}
                                    requestedCommunity={requestedCommunity}
                                />
                                {/* Remove Manager  */}
                                {Object.keys(role)?.includes('managers') && data.state === 0 &&
                                    <CanBeRendered types={['ambassador']}>
                                        {user?.address?.toLowerCase() === ambassador?.address?.toLowerCase() && (
                                            <Box center mt={1}>
                                                <Button onClick={() => removeManagerFunc(role?.address)} secondary w="100%">
                                                    <Icon
                                                        icon="userMinus"
                                                        margin="0 0.5 0 0"
                                                        p700
                                                    />
                                                    <String id="removeManager"/>
                                                </Button>
                                            </Box>
                                        )}
                                    </CanBeRendered>
                                }
                            </Card>
                    ))}
                </Grid> 
            : 
                Object.keys(role)?.includes('managers') ? 
                    <String id="noManagers"/> : 
                Object.keys(role)?.includes('merchants') && 
                    <String id="noMerchants"/>
            }   
        </>
)}

export default Managers;
