import browser from './detail/browser';
import node from './detail/node';

export const isBrowser = (): boolean => global.hasOwnProperty('window'); // eslint-disable-line no-prototype-builtins

const createUrl = (href: string): any => {
    if (isBrowser()) {
        return browser.createUrl(href);
    }

    return node.createUrl(href);
};

export { createUrl };
