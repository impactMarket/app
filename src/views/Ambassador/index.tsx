import { Box, Card, Display, Divider, Grid, Text, TextLink, ViewContainer } from '@impact-market/ui';
import { ReportsType, useGetAmbassadorReportsMutation } from '../../api/user';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

const Ambassador: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<ReportsType>();
    const [getReports] = useGetAmbassadorReportsMutation();
    const limit = 1;
    const offset = 0;
    const { view } = usePrismicData();
    
    useEffect(() => {
        const getSuspiciousActivitiesReportsMethod = async () => {
            try {
                setLoading(true);

                const reportsRequest = await getReports({ limit, offset }).unwrap() as any;

                setReports(reportsRequest?.count);

                setLoading(false);     
            } catch (error) {
                console.log(error);
            }
        }

        getSuspiciousActivitiesReportsMethod();
    }, []);

  return (
    <ViewContainer isLoading={isLoading || loading}>
        <Display medium>
            <String id="dashboard" />
        </Display>
        <Text g500>
            <RichText content={view.data.messageCommunitiesPerforming}/>
        </Text>

        <Grid cols={1} pt={1}>
            <Card padding={0}>
                <Box padding={1}>
                    <Text g500 medium>
                        <String id="reportedSuspiciousActivity" />
                    </Text>
                    <Display bold pt={0.5}>
                        {reports}
                    </Display>
                </Box>

                <Divider margin={0}/>

                <Box fLayout="end" flex padding={1}>
                    <Link href="/ambassador/reports" passHref>
                        <TextLink medium>
                        <String id="viewAll" />
                        </TextLink>
                    </Link>
                    
                </Box>
            </Card>
        </Grid>
        
    </ViewContainer>
  )
}

export default Ambassador
