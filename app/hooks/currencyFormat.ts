import { selectRates } from '../../app/state/slices/rates';
import { useSelector } from 'react-redux';

export const currencyFormat = (number: number, currency: string) => {
  // const rates = useSelector(selectRates);
  
  // console.log(rates);

  return `${currency}${number}`;
};