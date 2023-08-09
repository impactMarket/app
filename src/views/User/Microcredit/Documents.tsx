import { Text, openModal } from '@impact-market/ui';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import React, { useState } from 'react';
import Table from 'src/components/Table';
import config from '../../../../config';
import useFilters from 'src/hooks/useFilters';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 4;

const getColumns = () => {
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { repayment, currentDebt, loanRepayment } = extractFromView(
        'microcredit'
    ) as any;

    return [
        {
            minWidth: 12,
            render: (data: any) => {
                let filepath = '';

                if (data?.filepath) {
                    const obj = {
                        bucket: config.microcreditBucket,
                        key: data.filepath
                    };

                    const path = Buffer.from(JSON.stringify(obj)).toString(
                        'base64'
                    );

                    filepath = `${config.imagesUrl}${path}`;
                }

                return (
                    <Text
                        p500
                        small
                        medium
                        onClick={() =>
                            openModal('previewFile', {
                                filepath,
                                type: data?.filepath
                            })
                        }
                    >
                        {data?.filepath}
                    </Text>
                );
            },
            title: 'Document',
            value: 'document',
            width: '60%'
        }
    ];
};

const Documents = (props: { docs: any }) => {
    const { docs } = props;
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns()}
            itemsPerPage={itemsPerPage}
            isLoading={false}
            mt={1.25}
            page={page}
            // count={docs?.length}
            pb={6}
            prefix={docs}
            setItemOffset={setItemOffset}
        />
    );
};

export default Documents;
