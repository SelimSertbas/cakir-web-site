import { Buffer } from 'buffer';
import process from 'process';
import { EventEmitter } from 'events';
import * as util from 'util-inspect';

// Create a custom util object with our implementations
const customUtil = {
  ...util,
  debuglog: () => () => {},
  inspect: (obj: any) => JSON.stringify(obj, null, 2)
};

// Make these available globally
window.Buffer = Buffer;
window.process = process;
window.EventEmitter = EventEmitter;
window.util = customUtil;

export {}; 