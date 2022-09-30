import { usePrismicData } from '../components/PrismicDataProvider';
import { useRouter } from 'next/router';
import bracked from '../helpers/bracked';
import localesConfig from '../../../../locales.config';

const defaultLocale = localesConfig.find(({ isDefault }) => isDefault)?.shortCode || 'en';

const useTranslations = () => {
  const { locale } = useRouter();
  const { translations } = usePrismicData();

  const t = (id: string, variables = {} as { [key: string]: string | number }) => {
    const string = translations?.[locale]?.strings?.[id] || translations?.[defaultLocale]?.strings?.[id];

    if (!string) {
      console.log(`No translation find for the key "${id}"!`);

      return ''
    }

    return bracked(string, variables);
  };

  return { t };
};

export default useTranslations;
