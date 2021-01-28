// Declared here so that we can use both Node.js's and browser's version
export declare class URL {
    constructor(u: string);

    auth: string | null;
    hash: string | null;
    host: string | null;
    hostname: string | null;
    href: string;
    path: string | null;
    pathname: string | null;
    protocol: string | null;
    search: string | null;
    slashes: boolean | null;
    port: string | null;
}

const createUrl = (href: string): any => {
    return new URL(href);
};

export default { createUrl };
