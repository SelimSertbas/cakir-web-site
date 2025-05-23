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

// Polyfills for older browsers
if (typeof window !== 'undefined') {
  // Add any browser polyfills here
  if (!window.TextEncoder) {
    window.TextEncoder = require('text-encoding').TextEncoder;
  }
  if (!window.TextDecoder) {
    window.TextDecoder = require('text-encoding').TextDecoder;
  }
}

export {}; 