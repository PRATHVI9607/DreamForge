type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const getTimestamp = () => new Date().toISOString();

export const logger = {
    info: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.info(`%c[INFO] ${getTimestamp()}:`, 'color: #0ea5e9', message, ...args);
        } else {
            console.log(JSON.stringify({ level: 'info', timestamp: getTimestamp(), message, args }));
        }
    },

    warn: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`%c[WARN] ${getTimestamp()}:`, 'color: #f59e0b', message, ...args);
        } else {
            console.warn(JSON.stringify({ level: 'warn', timestamp: getTimestamp(), message, args }));
        }
    },

    error: (message: string, error?: any, ...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(`%c[ERROR] ${getTimestamp()}:`, 'color: #ef4444; font-weight: bold', message);
            if (error) console.error(error);
            if (args.length) console.log(...args);
        } else {
            console.error(JSON.stringify({ level: 'error', timestamp: getTimestamp(), message, error: error?.message || error, stack: error?.stack, args }));
        }
    },

    debug: (message: string, ...args: any[]) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`%c[DEBUG] ${getTimestamp()}:`, 'color: #8b5cf6', message, ...args);
        }
    }
};
