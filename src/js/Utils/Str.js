export default class Str {
    /**
     * Generates a random string.
     *
     * @param length
     * @param additionalChars
     * @return {string}
     */
    static random(length, additionalChars = "") {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + additionalChars;
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}