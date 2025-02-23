'use strict'

module.exports = function createURL(domain, snippet) {
    try {
        const url = new URL(`https://${domain}/${snippet}`);
        return url.href;
    } catch (error) {
        return null;
    }
}
