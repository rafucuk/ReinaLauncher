const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const { LoggerUtil } = require('helios-core')

const logger = LoggerUtil.getLogger('AuthlibManager')

class AuthlibManager {
    constructor(commonDirectory) {
        this.commonDirectory = commonDirectory
        this.authlibDirectory = path.join(this.commonDirectory, 'authlib-injector')
        this.authlibPath = path.join(this.authlibDirectory, 'authlib-injector.jar')
        this.metaUrl = 'https://authlib-injector.yushi.moe/artifact/latest.json'
    }

    /**
     * Ensures the Authlib injector exists and is up to date
     * @returns {Promise<string>} Path to the Authlib jar file
     */
    async validateAuthlib() {
        try {
            await fs.ensureDir(this.authlibDirectory)
            
            const needsDownload = await this._checkForUpdate()
            if (needsDownload) {
                await this._downloadLatest()
            }

            return this.authlibPath
        } catch (err) {
            logger.error('Error validating authlib-injector', err)
            throw err
        }
    }

    /**
     * Check if we need to download/update authlib
     * @returns {Promise<boolean>} True if update needed
     */
    async _checkForUpdate() {
        try {
            const exists = await fs.pathExists(this.authlibPath)
            if (!exists) {
                return true
            }

            const response = await fetch(this.metaUrl)
            const meta = await response.json()
            
            const localHash = await this._getLocalHash()
            return localHash !== meta.checksums.sha256
        } catch (err) {
            logger.warn('Error checking authlib update', err)
            return false
        }
    }

    /**
     * Download the latest version of authlib
     */
    async _downloadLatest() {
        try {
            const response = await fetch(this.metaUrl)
            const meta = await response.json()

            logger.info('Downloading authlib-injector...')
            const jarResponse = await fetch(meta.download_url)
            const buffer = await jarResponse.arrayBuffer()
            
            await fs.writeFile(this.authlibPath, Buffer.from(buffer))
            logger.info('Successfully downloaded authlib-injector')
        } catch (err) {
            logger.error('Failed to download authlib-injector', err)
            throw err
        }
    }

    /**
     * Calculate SHA-256 hash of local authlib file
     * @returns {Promise<string>} Hash of the file
     */
    async _getLocalHash() {
        try {
            const crypto = require('crypto')
            const fileBuffer = await fs.readFile(this.authlibPath)
            const hashSum = crypto.createHash('sha256')
            hashSum.update(fileBuffer)
            return hashSum.digest('hex')
        } catch (err) {
            logger.error('Error calculating authlib hash', err)
            return ''
        }
    }

    /**
     * Get the JVM arguments needed for authlib injection
     * @param {string} serverURL The authentication server URL
     * @returns {Promise<string[]>} Array of JVM arguments
     */
    async getJVMArgs(serverURL) {
        await this.validateAuthlib()
        return [
            `-javaagent:${this.authlibPath}=${serverURL}`,
            '-Dauthlibinjector.side=client'
        ]
    }

    /**
     * Add authlib arguments to existing JVM options
     * @param {string[]} existingArgs Current JVM arguments
     * @param {string} serverURL Authentication server URL
     * @returns {Promise<string[]>} Combined JVM arguments
     */
    async addToJVMArgs(existingArgs, serverURL) {
        const authlibArgs = await this.getJVMArgs(serverURL)
        return [...authlibArgs, ...existingArgs]
    }
}

module.exports = {
    /**
     * Create a new AuthlibManager instance
     * @param {string} commonDirectory Path to the common directory
     * @returns {AuthlibManager} New manager instance
     */
    createAuthlibManager: (commonDirectory) => {
        return new AuthlibManager(commonDirectory)
    }
}