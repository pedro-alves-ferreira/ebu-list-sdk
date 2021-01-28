const createUrl = (href: string): any => {
    const u = require('url'); // eslint-disable-line
    return new u.URL(href);
};

export default { createUrl };
