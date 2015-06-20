/**
 * Vnmark
 * https://github.com/vunb/vnmark
 *
 * Copyright (c) 2015 Vunb
 * Licensed under the MIT license.
 */

var fs = require('fs')
    , FileLineReader = require("./utils/FileLineReader")
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

module.exports = function () {
    /**
     * map word
     */
    this.mapDict = {};
    /**
     * map Probability
     */
    this.mapProbability = {};
    /**
     * Add diacritics to text
     * @param {string} text
     * @returns {string}
     */
    this.$addMark = function (text) {
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
    };

    /**
     * Remove all diacritics of input
     * @param text
     * @returns {string}
     */
    this.$removeMark = function (text) {
        if (!text) return '';

        var regex = new RegExp('(' + Object.keys(chars).join('|') + ')');
        return String(text).replace(regex, function (match) {
            return chars[match];
        })
    };

    /**
     * Load database
     */
    this.$loadDb = function () {

        var reader = new FileLineReader("db/map.txt", 250); // max cols 250

        while (reader.hasNextLine()) {
            var line = reader.nextLine();
            var tokens = line.split('|');
            if (tokens.length == 2) {
                this.mapDict[tokens[0]] = tokens[1].split(',');
                //console.log(tokens[0] + "-->" + this.mapDict[tokens[0]].join(","));
            }
        }

        reader.close();
        reader = new FileLineReader("db/bigram.dict", 100);

        while (reader.hasNextLine()) {
            var line = reader.nextLine();
            var tokens = line.split('|');
            if (tokens.length == 2) {
                this.mapProbability[tokens[0]] = tokens[1];
                //console.log(tokens[0] + "-->" + tokens[1]);
            }
        }

        reader.close();
    };

    this.$min = function (arr) {
        arr = arr || [];

        var min = arr[0];
        arr.forEach(function (element, index, arr) {
            if (element < min) {
                min = element;
            }
        });

        return min;
    };

    this.$getPositionInArr = function (e, arr) {
        arr = arr || [];
        arr.forEach(function (element, index, arr) {
            if (e == element) {
                return index;
            }
        });
        return -1;
    };

    this.$moveArr = function (arr1, arr2) {
        if (arr1.length < arr2.length) return false;

        for (var i = 0; i < arr2.length; i++) {
            arr1[i] = arr2[i];
            arr2[i] = 0;
        }

        return true;
    };

    this.mark = function (str) {
        if(!str) return '';

        var pNotHas = this.mapProbability['notHas'];
        var s = "", p1 = [], p2= [], track = [,];

        var regex = /[ ]+/i;
        var word = str.split(regex);
        var wordResult = str.toLowerCase().split(regex);

        if(!this.mapDict[wordResult[0]]) {
            this.mapDict[wordResult[0]] = wordResult[0].split(/\s+/);
        }

        var tmpPrev = this.mapDict[wordResult[0]];

        for (var i = 0; i < wordResult.length; i ++) {
            if(!this.mapDict[wordResult[i]]) {
                this.mapDict[wordResult[i]] = wordResult[0].split(/\s+/);
            }

            var tmp = this.mapDict[wordResult[i]];
            for(var j = 0; j < tmp.length; j ++) {
                var ptemp = [];
                for(var k = 0; k < tmpPrev.length; k++) {
                    var st = tmpPrev[k] + " " + tmp[j];
                    p1[k] = this.mapProbability[st] || pNotHas;
                }
                p2[j] = this.$min(p1);
                var pos = this.$getPositionInArr(p2[j], p1);
                track[i, j] = (i * 10 + pos);
            }

            this.$moveArr(p1, p2);
            tmpPrev = tmp;
        }

        var pos = this.$getPositionInArr(p2[j], p1);
        for(var i = wordResult.length - 1; i >= 0; i--) {
            var tmp = this.mapDict[wordResult[i]];
            wordResult[i] = tmp[pos];
            pos = track[i,pos] % 10;
        }

        for(var i = 0; i < wordResult.length; i ++) {
            var singleWord = wordResult[i];
            if(this.$removeMark(singleWord) == word[i]) {
                var tmpSingleWord = "";
                for(var j = 0; j < singleWord.length; j++) {
                    var ch = singleWord.charAt(j);
                    if(word[i].charAt(j) > '@' && word[i].charAt(j) < '[') {
                        ch = ch.toUpperCase();
                    }
                    tmpSingleWord = singleWord + ch;
                }
                wordResult[i] = tmpSingleWord;
            }
            s = s + wordResult[i] + " ";
        }

        return s.trim();
    };

    this.markTextSegment = function (sentence) {
        if (!sentence) return '';

        var delim = /[\(\)\[\]\/\-\\\"\…\'\,\“\”\.\‘\’\?\!\:\;]+/
        var tokens = sentence.split(delim);


        for(var token in tokens) {

        }


    };

    // init
    this.$loadDb();
    return this;
};