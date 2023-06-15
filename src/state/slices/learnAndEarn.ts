import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type Level = {
    currency: string | null;
    rate: number | null;
    id: {
        alternate_languages: [];
        lang: string;
        lessons: [];
        title: string;
    };
};
interface LevelState {
    levels: Level[];
}

const slice = createSlice({
    initialState: {
        levels: []
    } as LevelState,
    name: 'learnAndEarn',
    reducers: {
        setLevels: (state, action: PayloadAction<Level[]>) => {
            state.levels = action.payload;
        }
    }
});

export const { setLevels } = slice.actions;

export const selectLevels = (state: RootState) => state.learnAndEarn.levels;

export default slice.reducer;
