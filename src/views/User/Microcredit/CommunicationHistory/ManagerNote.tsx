/* eslint-disable no-inline-comments */
import {
    Avatar,
    Box,
    CircledIcon,
    Divider,
    DropdownMenu,
    // Icon,
    Text,
    toast,
} from '@impact-market/ui';
import { dateHelpers } from 'src/helpers/dateHelpers';
import { formatAddress } from '../../../../utils/formatAddress';
import { getImage } from '../../../../utils/images';
import { getUserName } from '../../../../utils/users';
import { usePrismicData } from '../../../../libs/Prismic/components/PrismicDataProvider';
import Message from '../../../../libs/Prismic/components/Message';
import config from '../../../../../config';
import useTranslations from '../../../../libs/Prismic/hooks/useTranslations';
import useUserInfo from 'src/hooks/useUserInfo';


const ManagerNote = (props: {note: any }) => {
    const { note } = props;
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const {} = extractFromView('messages') as any;
    const { userInfo: manager} = useUserInfo(note?.manager?.address);

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

    
              
    


    return(
        <Box >
            <Box fLayout="center start" flex w="100%" fDirection="column"  padding="0rem 1rem 0rem 1rem" >
                <Box flex fLayout="center between" w="100%" mb="10px">
                    <Box flex fLayout="center start" >
                        {!!manager?.avatarMediaPath ? (
                            <Avatar
                                extrasmall
                                url={getImage({
                                    filePath: manager?.avatarMediaPath,
                                    fit: 'cover',
                                    height: 50,
                                    width: 50
                                })}
                            />
                        ) : (
                            <CircledIcon icon="user" small />
                        )}
                        <Box pl={0.75}>
                            {(!!manager?.firstName || !!manager?.lastName) && (
                                <Text g700 semibold small>
                                    {getUserName(manager)}
                                </Text>
                            )}
                            <Box>
                                <DropdownMenu
                                    {...({} as any)}
                                    icon="chevronDown"
                                    notes={[
                                        {
                                            icon: 'open',
                                            onClick: () => {
                                                window.open(
                                                    config.explorerUrl?.replace(
                                                        '#USER#',
                                                        manager?.address
                                                    )
                                                );
                                            },
                                            title: t('openInExplorer')
                                        },
                                        {
                                            icon: 'copy',
                                            onClick: () =>
                                                copyToClipboard(manager?.address),
                                            title: t('copyAddress')
                                        }
                                    ]}
                                    title={
                                        <Text p500 small>
                                            {formatAddress(manager?.address, [6, 5])}
                                        </Text>
                                    }
                                />
                            </Box>
                        </Box> 
                    </Box> 
                    {/* <Icon icon="trash" p500 /> */}
                </Box>
                <Box
                    flex 
                    fLayout="center start" 
                    w="100%"
                    mb="10px"
                >
                    <Text g800 regular base >
                        {note?.note}
                    </Text>
                </Box>
                <Box
                    flex 
                    fLayout="center start" 
                    w="100%"
                
                >
                    <Text g500 small >
                        {`${dateHelpers.getDateAndTime(note?.createdAt)[0]} · ${dateHelpers.getDateAndTime(note?.createdAt)[1]} `} 
                    </Text>
                </Box>
            </Box>
            <Divider/>
        </Box>
    )
};

export default ManagerNote;