"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMojangOS = getMojangOS;
exports.validateLibraryRules = validateLibraryRules;
exports.validateLibraryNatives = validateLibraryNatives;
exports.isLibraryCompatible = isLibraryCompatible;
exports.mcVersionAtLeast = mcVersionAtLeast;
function getMojangOS() {
    const opSys = process.platform;
    switch (opSys) {
        case 'darwin':
            return 'osx';
        case 'win32':
            return 'windows';
        case 'linux':
            return 'linux';
        default:
            return opSys;
    }
}
function validateLibraryRules(rules) {
    if (rules == null) {
        return false;
    }
    for (const rule of rules) {
        if (rule.action != null && rule.os != null) {
            const osName = rule.os.name;
            const osMoj = getMojangOS();
            if (rule.action === 'allow') {
                return osName === osMoj;
            }
            else if (rule.action === 'disallow') {
                return osName !== osMoj;
            }
        }
    }
    return true;
}
function validateLibraryNatives(natives) {
    return natives == null ? true : Object.hasOwnProperty.call(natives, getMojangOS());
}
function isLibraryCompatible(rules, natives) {
    return rules == null ? validateLibraryNatives(natives) : validateLibraryRules(rules);
}
/**
 * Returns true if the actual version is greater than
 * or equal to the desired version.
 *
 * @param {string} desired The desired version.
 * @param {string} actual The actual version.
 */
function mcVersionAtLeast(desired, actual) {
    const des = desired.split('.');
    const act = actual.split('.');
    if (act.length < des.length) {
        for (let i = act.length; i < des.length; i++) {
            act[i] = '0';
        }
    }
    for (let i = 0; i < des.length; i++) {
        const parsedDesired = parseInt(des[i]);
        const parsedActual = parseInt(act[i]);
        if (parsedActual > parsedDesired) {
            return true;
        }
        else if (parsedActual < parsedDesired) {
            return false;
        }
    }
    return true;
}
