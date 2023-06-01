import {
    Document,
    Font,
    Page,
    StyleSheet,
    Text,
    View
} from '@react-pdf/renderer';

Font.register({
    family: 'Inter',
    fonts: [
        {
            fontWeight: 400,
            src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf'
        },
        {
            fontWeight: 700,
            src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf'
        }
    ]
});

Font.register({
    family: 'Italianno',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/italianno/v17/dg4n_p3sv6gCJkwzT6Rnj5YpQwM-gg.ttf'
        }
    ]
});

const styles = StyleSheet.create({
    heading1: {
        fontSize: 16
    },
    heading2: {
        fontSize: 14
    },
    heading3: {
        fontSize: 12
    },
    paragraph: {
        fontSize: 10
    },
    section: {
        color: '#344054',
        flexGrow: 1,
        fontFamily: 'Inter',
        gap: 13,
        lineHeight: 1.5,
        margin: 10,
        padding: 10
    },
    signature: {
        borderBottom: '1px solid #344054',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Italianno',
        fontSize: 30,
        lineHeight: 1,
        minWidth: '35%',
        textAlign: 'center'
    },
    signatureSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        textAlign: 'center'
    },
    signatureTitle: {
        color: '#344054',
        fontFamily: 'Inter',
        fontSize: 8,
        lineHeight: 1.5
    }
});

const PDF = (props: { data: any; signature: any }) => {
    const { data, signature } = props;
    const {
        contractBorrowerSignature,
        contractLenderSignature,
        contractSignature,
        userSignature
    } = signature;
    const date = new Date();
    const currentDate = `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}`;

    const contract = data
        ?.filter(
            (item: { type: string; text: string; spans: any }) =>
                item.text.trim() !== ''
        )
        ?.map((item: { type: string; text: string; spans: any }) => {
            let style = styles.paragraph;

            if (item.type === 'paragraph') {
                style = styles.paragraph;
            }
            if (item.type === 'heading1') {
                style = styles.heading1;
            }
            if (item.type === 'heading2') {
                style = styles.heading2;
            }
            if (item.type === 'heading3') {
                style = styles.heading3;
            }

            const getBoldText =
                item?.spans[0]?.type === 'strong' &&
                item.text.substring(item?.spans[0]?.start, item?.spans[0]?.end);

            return (
                <Text style={[style]}>
                    {item?.spans[0]?.type === 'strong' ? (
                        <>
                            <Text>
                                {item.text.substring(0, item?.spans[0]?.start)}
                            </Text>
                            <Text style={{ fontWeight: 700 }}>
                                {getBoldText}
                            </Text>
                            <Text>
                                {item.text.substring(item?.spans[0]?.end)}
                            </Text>
                        </>
                    ) : (
                        item.text
                    )}
                </Text>
            );
        });

    return (
        <Document>
            <Page size="A4">
                <View style={styles.section}>
                    {contract}
                    <View style={styles.signatureSection}>
                        <View>
                            <Text style={styles.signatureTitle}>
                                {contractLenderSignature}
                            </Text>
                            <Text style={styles.signature}>
                                {userSignature}
                            </Text>
                            <Text
                                style={[
                                    styles.signatureTitle,
                                    { marginTop: 10 }
                                ]}
                            >
                                {currentDate}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.signatureTitle}>
                                {contractBorrowerSignature}
                            </Text>
                            <Text style={styles.signature}>
                                {contractSignature}
                            </Text>
                            <Text
                                style={[
                                    styles.signatureTitle,
                                    { marginTop: 10 }
                                ]}
                            >
                                {currentDate}
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PDF;
