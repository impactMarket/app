import { TextLink, openModal } from '@impact-market/ui';
import { useMicrocreditBorrower } from 'src/hooks/useMicrocredit';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import React, { useState } from 'react';
import Table from 'src/components/Table';
import config from '../../../../../config';
import useFilters from 'src/hooks/useFilters';

const itemsPerPage = 4;

const getColumns = () => {
    const { extractFromView } = usePrismicData();
    const { document } = extractFromView('microcredit') as any;

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
                    <TextLink
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
                    </TextLink>
                );
            },
            title: document,
            value: 'document',
            width: '60%'
        }
    ];
};

const Documents = (props: { user: any }) => {
    const { user } = props;
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [, setItemOffset] = useState(page * itemsPerPage || 0);

    const { borrower, loadingBorrower } = useMicrocreditBorrower([
        `address=${user?.address}`,
        `include=docs`
    ]);

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns()}
            itemsPerPage={itemsPerPage}
            isLoading={loadingBorrower}
            mt={1.25}
            page={page}
            // count={docs?.length}
            pb={6}
            prefix={borrower?.docs}
            setItemOffset={setItemOffset}
        />
    );
};

export default Documents;
