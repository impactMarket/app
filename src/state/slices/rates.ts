import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type Rate = {
    currency: string | null;
    rate: number | null;
};
interface RatesState {
    rates: Rate[]
};

const slice = createSlice({
    initialState: {
        rates: [{
            currency: null,
            rate: null
        }] 
    } as RatesState,
    name: 'rates',
    reducers: {
        setRates: (
            state,
            action: PayloadAction<Rate[]>
        ) => {
            // console.log('setRates', action);
            state.rates = action.payload;
        },
    }
});

export const { setRates } = slice.actions;

export const selectRates = (state: RootState) => state.rates.rates;

export default slice.reducer;
