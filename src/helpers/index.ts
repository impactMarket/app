import { JsonRpcProvider } from '@ethersproject/providers';
import config from '../../config';

const provider = new JsonRpcProvider(config.networkRpcUrl);

export { provider };
