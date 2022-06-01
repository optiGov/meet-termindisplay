export default class Base64 {
    /**
     * Returns the base64 encoded value of the string.
     *
     * @param str
     * @return {string}
     */
    static encode(str) {
        return str.replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}