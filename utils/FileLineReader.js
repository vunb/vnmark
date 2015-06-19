/**
 * Vnmark
 * https://github.com/vunb/vnmark
 *
 * Copyright (c) 2015 Vunb
 * Licensed under the MIT license.
 */

var fs = require('fs')
    ;


var chars = {
    'á': 'a',
    'à': 'a',
    'ả': 'a',
    'ã': 'a',
    'ạ': 'a',

    'â': 'a',
    'ấ': 'a',
    'ầ': 'a',
    'ẩ': 'a',
    'ẫ': 'a',
    'ậ': 'a',

    'ă': 'a',
    'ắ': 'a',
    'ằ': 'a',
    'ẳ': 'a',
    'ẵ': 'a',
    'ặ': 'a',

    'é': 'e',
    'è': 'e',
    'ẻ': 'e',
    'ẽ': 'e',
    'ẹ': 'e',

    'ê': 'e',
    'ế': 'e',
    'ề': 'e',
    'ể': 'e',
    'ễ': 'e',
    'ệ': 'e',

    'ó': 'o',
    'ò': 'o',
    'ỏ': 'o',
    'õ': 'o',
    'ọ': 'o',

    'ô': 'o',
    'ồ': 'o',
    'ố': 'o',
    'ổ': 'o',
    'ỗ': 'o',
    'ộ': 'o',

    'ơ': 'o',
    'ớ': 'o',
    'ờ': 'o',
    'ở': 'o',
    'ỡ': 'o',
    'ợ': 'o',

    'í': 'i',
    'ì': 'i',
    'ỉ': 'i',
    'ĩ': 'i',
    'ị': 'i',

    'ú': 'u',
    'ù': 'u',
    'ủ': 'u',
    'ũ': 'u',
    'ụ': 'u',

    'ư': 'u',
    'ứ': 'u',
    'ừ': 'u',
    'ử': 'u',
    'ữ': 'u',
    'ự': 'u',

    'đ': 'd',

    'ý': 'y',
    'ỳ': 'y',
    'ỷ': 'y',
    'ỹ': 'y',
    'ỵ': 'y'
};

module.exports = {
    /**
     * Add diacritics to text
     * @param {string} text
     * @returns {string}
     */
    addMark: function (text) {
        if (!text) return '';

        var values = Object.keys(chars).map(function (key) {
            return chars[key];
        });
        var regex = new RegExp('(' + values.join('|') + ')', 'g');

        return String(text).replace(regex, function (match) {
            for (var key in chars) {
                if (chars.hasOwnProperty(key) && chars[key] === match) {
                    return key;
                }
            }
        });
    },

    /**
     * Remove all diacritics of input
     * @param text
     * @returns {string}
     */
    removeMark: function (text) {
        if (!text) return '';

        var regex = new RegExp('(' + Object.keys(chars).join('|') + ')');
        return String(text).replace(regex, function (match) {
            return chars[match];
        })
    },

    /**
     * Load database
     */
    loadDb: function () {

        var data = fs.readFileSync("db/map.txt", "utf16");

        

    }


};