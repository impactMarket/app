import { JsonRpcProvider } from '@ethersproject/providers';
import config from '../../../app/config';

const provider = new JsonRpcProvider(config.networkRpcUrl);

export { provider };
