/**
 * Use Frank Liang's algorithm to hyphenate a word.
 *
 * @class Hyphenator
 *
 * @see {@link https://github.com/mnater/Hyphenator/blob/master/Hyphenator.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/Trie', 'tools/lang/phonology/Word'], function(Trie, Word){

		/** @constant */
	var WORD_BOUNDARY = '.',
		/** @constant */
		WORD_HYPHEN = '\u00AD',
		/** @constant */
		WORD_INTERNAL_HYPHEN = '-',
		/** @constant */
		CONFIG_DEFAULT = {
			/** regex stating the valid characters contained in a word in order to be a valid candidate for hyphenation */
			validWordRegex: undefined,
			/** minimal length of characters before the first hyphenation */
			leftmin: 0,
			/** minimal length of characters after the last hyphenation */
			rightmin: 0,
			/** list of exceptions in the form key-value, where the key is the word and the value the hyphenated one */
			exceptions: undefined
		};


	var Constructor = function(pattern){
		readPatterns.call(this, pattern.patterns);

		this.config = {};
		for(var k in CONFIG_DEFAULT)
			this.config[k] = CONFIG_DEFAULT[k];
		if(pattern)
			for(k in pattern)
				this.config[k] = pattern[k];

		this.cache = {};
	};

	Constructor.WORD_HYPHEN = WORD_HYPHEN;


	/** @private */
	var readPatterns = function(patterns){
		this.trie = new Trie();
		this.trieData = new Map();

		var node;
		Object.keys(patterns).forEach(function(length){
			chunkString(patterns[length], length).forEach(function(pattern){
				node = this.trie.add(pattern.replace(/\d/g, ''));
				this.trieData.set(node, pattern);
			}, this);
		}, this);
	};

	/** @private */
	var chunkString = function(str, length){
		return str.match(new RegExp('.{' + length + '}', 'g'));
	};

	var hyphenate = function(word){
		var hyphenatedWord = this.config.exceptions && this.config.exceptions[word];
		//the word is not in the exceptions list
		if(!hyphenatedWord){
			if(this.config.validWordRegex && !word.match(this.config.validWordRegex) || word.indexOf('&shy;') >= 0)
				//if the word contains invalid characters, or already contains the hyphen character: leave as it is
				hyphenatedWord = word;
			else if(this.cache[word])
				//if the word is in the cache then return it
				hyphenatedWord = this.cache[word];
			else if(word.indexOf(WORD_INTERNAL_HYPHEN) >= 0)
				//if word contains '-' then hyphenate the single parts
				hyphenatedWord = word.split(WORD_INTERNAL_HYPHEN)
					.map(hyphenate)
					.join(WORD_INTERNAL_HYPHEN);
			else{
				var pattern = getHyphenationPattern.call(this, word);

				hyphenatedWord = createHyphenatedWord.call(this.config, word, pattern);

				//put the word in the cache
				this.cache[word] = hyphenatedWord;
			}
		}

		return {
			syllabes: hyphenatedWord,

			hasSyllabationErrors: hasSyllabationErrors,
			getSyllabeIndex: getSyllabeIndex,
			getSyllabe: getSyllabe,
			getAt: getAt,
			getGlobalIndexOfStressedSyllabe: getGlobalIndexOfStressedSyllabe
		};
	};

	/** @private */
	var getHyphenationPattern = function(word){
		var w = WORD_BOUNDARY + Word.markDefaultStress(word.toLowerCase()) + WORD_BOUNDARY;
		if(String.prototype.normalize)
			w = w.normalize();

		var size = w.length - 1,
			hyp = [],
			i, j;
		for(i = 0; i < size; i ++)
			this.trie.findPrefix(w.substring(i)).forEach(function(pref){
				//console.log(w.replace(/^\.|\.$/g, '') + ': prefix ' + pref.node.prefix + ', node ' + this.get(pref.node));

				j = -1;
				this.get(pref.node).split('').forEach(function(d){
					d = parseInt(d);
					if(isNaN(d))
						j ++;
					else if(!hyp[i + j] || d > hyp[i + j])
						hyp[i + j] = d;
				});
			}, this.trieData);

		return hyp;
	};

	/** @private */
	var createHyphenatedWord = function(word, pattern){
		var maxLength = word.length - this.rightmin;
		return word.split('')
			.map(function(chr, idx){
				return (idx >= this.leftmin && idx <= maxLength && pattern[idx] % 2? WORD_INTERNAL_HYPHEN: '') + chr;
			}, this)
			.join('')
			.split(WORD_INTERNAL_HYPHEN);
	};

	/** @private */
	var hasSyllabationErrors = function(){
		return this.syllabes.some(function(syllabe){
			return (!syllabe.match(/ʼ/) && Word.getLastVowelIndex(syllabe) < 0);
		});
	};

	/**
	 * @param {Number} idx	Index with respect to the word from which to extract the index of the corresponding syllabe
	 * @return {Number} the (relative) index of the syllabe at the given (global) index
	 *
	 * @private
	 */
	var getSyllabeIndex = function(idx){
		var i = -1;
		this.syllabes.some(function(syllabe, j){
			idx -= syllabe.length;
			return (idx < 0? (i = j, true): false);
		});
		return i;
	};

	/**
	 * @param {Number} idx	Index with respect to the word from which to extract the index of the corresponding syllabe
	 * @return {String} the syllabe at the given (global) index
	 *
	 * @private
	 */
	var getSyllabe = function(idx){
		return this.syllabes[getSyllabeIndex.call(this, idx)];
	};

	/**
	 * @param {Number} idx	Index of syllabe to extract, if negative then it's relative to the last syllabe
	 * @return {String} the syllabe at the given (relative) index
	 *
	 * @private
	 */
	var getAt = function(idx){
		return this.syllabes[restoreRelativeIndex.call(this, idx)];
	};

	/**
	 * @param {Number} idx	Index of syllabe, if negative then it's relative to the last syllabe
	 *
	 * @private
	 */
	var getGlobalIndexOfStressedSyllabe = function(idx){
		return getGlobalIndex.call(this, idx) + Word.getLastVowelIndex(getAt.call(this, idx));
	};

	/**
	 * @param {Number} idx	Index of syllabe, if negative then it's relative to the last syllabe
	 * @return {Number} global index at which the syllabe starts
	 *
	 * @private
	 */
	var getGlobalIndex = function(idx){
		var len = 0;
		idx = restoreRelativeIndex.call(this, idx);
		this.syllabes.some(function(syllabe, i){
			return (i < idx? (len += syllabe.length, false): true);
		});
		return len;
	};

	/** @private */
	var restoreRelativeIndex = function(idx){
		return (idx + this.syllabes.length) % this.syllabes.length;
	};


	Constructor.prototype = {
		constructor: Constructor,

		hyphenate: hyphenate
	};

	return Constructor;

});
