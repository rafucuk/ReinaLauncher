"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftErrorCode = void 0;
exports.decipherErrorCode = decipherErrorCode;
/**
 * Various error codes from any point of the Microsoft authentication process.
 */
var MicrosoftErrorCode;
(function (MicrosoftErrorCode) {
    /**
     * Unknown Error
     */
    MicrosoftErrorCode[MicrosoftErrorCode["UNKNOWN"] = 0] = "UNKNOWN";
    /**
     * Profile Error
     *
     * Account has not set up a minecraft profile or does not own the game.
     *
     * Note that Xbox Game Pass users who haven't logged into the new Minecraft
     * Launcher at least once will not return a profile, and will need to login
     * once after activating Xbox Game Pass to setup their Minecraft username.
     *
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Get_the_profile
     */
    MicrosoftErrorCode[MicrosoftErrorCode["NO_PROFILE"] = 1] = "NO_PROFILE";
    /**
     * XSTS Error
     *
     * The account doesn't have an Xbox account. Once they sign up for one
     * (or login through minecraft.net to create one) then they can proceed
     * with the login. This shouldn't happen with accounts that have purchased
     * Minecraft with a Microsoft account, as they would've already gone
     * through that Xbox signup process.
     *
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Authenticate_with_XSTS
     */
    MicrosoftErrorCode[MicrosoftErrorCode["NO_XBOX_ACCOUNT"] = 2148916233] = "NO_XBOX_ACCOUNT";
    /**
     * XSTS Error
     *
     * The account is from a country where Xbox Live is not available/banned.
     *
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Authenticate_with_XSTS
     */
    MicrosoftErrorCode[MicrosoftErrorCode["XBL_BANNED"] = 2148916235] = "XBL_BANNED";
    /**
     * XSTS Error
     *
     * The account is a child (under 18) and cannot proceed unless the account
     * is added to a Family by an adult. This only seems to occur when using a
     * custom Microsoft Azure application. When using the Minecraft launchers
     * client id, this doesn't trigger.
     *
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Authenticate_with_XSTS
     */
    MicrosoftErrorCode[MicrosoftErrorCode["UNDER_18"] = 2148916238] = "UNDER_18";
})(MicrosoftErrorCode || (exports.MicrosoftErrorCode = MicrosoftErrorCode = {}));
/**
 * Resolve the error response code from the response body.
 *
 * @param body The microsoft error body response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decipherErrorCode(body) {
    if (body) {
        if (body.XErr) {
            const xErr = body.XErr;
            switch (xErr) {
                case MicrosoftErrorCode.NO_XBOX_ACCOUNT:
                    return MicrosoftErrorCode.NO_XBOX_ACCOUNT;
                case MicrosoftErrorCode.XBL_BANNED:
                    return MicrosoftErrorCode.XBL_BANNED;
                case MicrosoftErrorCode.UNDER_18:
                    return MicrosoftErrorCode.UNDER_18;
            }
        }
    }
    return MicrosoftErrorCode.UNKNOWN;
}
