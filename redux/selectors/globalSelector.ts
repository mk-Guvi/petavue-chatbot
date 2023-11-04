import { useSelector } from 'react-redux';
import { StoreReducersT } from '../store';

export const useGlobalData = () => {
  return useSelector((state: StoreReducersT) => state.global);
};
