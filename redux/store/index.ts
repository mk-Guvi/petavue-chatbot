import { configureStore } from '@reduxjs/toolkit';
import { GlobalSliceStateT, } from '../slices';
import globalSliceReducers from '../slices/GlobalSlice';
export type StoreReducersT = {
  global: GlobalSliceStateT;

};

const store = configureStore<StoreReducersT>({
  reducer: {
    global: globalSliceReducers,
    
  },
});

export default store;
