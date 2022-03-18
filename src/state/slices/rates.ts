import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type RatesState = [{
    currency: string | null;
    rate: number | null;
}];

const slice = createSlice({
    initialState: [{
      currency: null,
      rate: null
    }] as RatesState,
    name: 'rates',
    reducers: {
        setRates: (
            state,
            action: PayloadAction<{ rates: RatesState }>
        ) => {
            console.log('setRates', action);
            state = action.payload.rates;
        },
    }
});

export const { setRates } = slice.actions;

export const selectRates = (state: RootState) => state.rates;

export default slice.reducer;
