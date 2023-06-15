import React, { FC } from 'react';
import parse from '../helpers/parse';
import useTranslations from '../hooks/useTranslations';

type Props = {
    children?: any;
    components?: { [key: string]: FC };
    id: string;
    variables?: { [key: string]: string | number };
};

const String = (props: Props) => {
    const { children, components, id, variables } = props;
    const { t } = useTranslations();

    const string = t(id, variables);

    if (typeof children === 'function') {
        return children(parse(string, components));
    }

    return <>{parse(string, components)}</>;
};

export default String;
