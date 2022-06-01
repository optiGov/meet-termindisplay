import crypto from 'crypto-js';

export default class SHA256 {
    /**
     * Returns the sha256 hash value of the buffer.
     *
     * @param buffer
     * @return {Buffer}
     */
    static async hash(message) {
        return crypto.SHA256(message).toString(crypto.enc.Base64)
    }
}