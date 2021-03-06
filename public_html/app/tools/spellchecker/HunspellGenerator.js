/**
 * Hunspell-style dictionaries.
 *
 * @class HunspellGenerator
 *
 * @see {@link https://github.com/cfinke/Typo.js}
 */
define(function(){

	var EOL = '\r\n',
		SEPARATOR = /\s+/;


	/**
	 * @param {String} affData	The data from the dictionary's .aff file
	 * @param {Object} flags	Flag settings
	 * @returns {Typo} A HunspellDictionary object
	 */
	var Constructor = function(affData, flags){
		this.flags = flags || {};

		try{
			parseAFF.call(this, affData);
		}
		catch(e){
			console.log(e);
		}
	};

	/**
	 * Parse the rules out from a .aff file.
	 *
	 * @param {String} data	The contents of the affix file
	 * @returns {object}		The rules from the file
	 *
	 * @private
	 */
	var parseAFF = (function(){
		var copyOver = function(ruleType, definitionParts){ this.flags[ruleType] = definitionParts[0]; return 0; },
			copyOverJoined = function(ruleType, definitionParts){ this.flags[ruleType] = definitionParts.join(' '); return 0; },
			doNothing = function(ruleType, definitionParts){ return (Number(definitionParts) == definitionParts? Number(definitionParts): 0); };
		var ruleFunction = {
			NAME: doNothing,
			VERSION: doNothing,
			HOME: doNothing,
			LANG: doNothing,
			SET: doNothing,
			TRY: doNothing,
			KEY: doNothing,
			WORDCHARS: doNothing,
			BREAK: doNothing,
			KEEPCASE: copyOver,
			FULLSTRIP: copyOverJoined,
			MAP: doNothing,
			ICONV: doNothing,
			REP: doNothing,
			FLAG: function(ruleType, definitionParts){ this.flags[ruleType] = definitionParts[0]; return 0; },
			PFX: function(ruleType, definitionParts, lines, i){ return parseAffix.call(this, ruleType, definitionParts, lines, i); },
			SFX: function(ruleType, definitionParts, lines, i){ return parseAffix.call(this, ruleType, definitionParts, lines, i); }
		};

		return function(data){
			this.rules = {};

			//remove comment lines
			data = removeAffixComments(data);

			var lines = data.split(/\r?\n/),
				len = lines.length,
				i,
				definitionParts, ruleType, fun;
			for(i = 0; i < len; i ++){
				definitionParts = lines[i].split(SEPARATOR);

				ruleType = definitionParts.shift();
				fun = ruleFunction[ruleType];
				if(fun)
					i += fun.call(this, ruleType, definitionParts, lines, i);
				else
					console.log('Cannot determine reader for command ' + ruleType);
			}
		};
	})();

	/** @private */
	var parseAffix = function(ruleType, definitionParts, lines, i){
		var isSuffix = (ruleType == 'SFX'),
			ruleCode = definitionParts[0],
			combineable = (definitionParts[1] == 'Y'),
			numEntries = parseInt(definitionParts[2], 10);

		var entries = [],
			sublen = i + 1 + numEntries,
			j, lineParts, charactersToRemove, additionParts, regexToMatch,
			continuationClasses, entry;
		for(j = i + 1; j < sublen; j ++){
			lineParts = lines[j].split(SEPARATOR);
			charactersToRemove = lineParts[2];
			additionParts = lineParts[3].split('/');
			regexToMatch = lineParts[4];

			continuationClasses = parseRuleCodes.call(this, additionParts[1]);

			entry = {
				add: (additionParts[0] == '0'? '': additionParts[0])
			};
			if(continuationClasses.length)
				entry.continuationClasses = continuationClasses;
			if(regexToMatch && regexToMatch != '.')
				entry.match = new RegExp(isSuffix? regexToMatch + '$': '^' + regexToMatch);
			if(charactersToRemove != '0')
				entry.remove = new RegExp(isSuffix? charactersToRemove + '$': '^' + charactersToRemove);
			//if(isSuffix && charactersToRemove && additionParts[0].length > 1 && charactersToRemove[0] == additionParts[0][0])
			//	console.log('This line has characters in common between removed and added part' + lines[j]);
			entries.push(entry);
		}

		this.rules[ruleCode] = {isSuffix: isSuffix, combineable: combineable, entries: entries};

		return numEntries;
	};

	var extractContinuationClasses = function(line){
		var lineParts = line.split(SEPARATOR);
		var additionParts = lineParts[0].split('/');
		var continuationClasses = parseRuleCodes.call(this, additionParts[1]);
		return continuationClasses;
	};

	var hasRule = function(ruleClass){
		return (!!this.rules[ruleClass] || this.flags['KEEPCASE'] === ruleClass);
	};

	var canParse = function(word, continuationClass){
		var productionsToAdd = applyRule.call(this, word, continuationClass);
		return !!productionsToAdd.length;
	};

	/**
	 * Removes comment lines and then cleans up blank lines and trailing whitespace.
	 *
	 * @param {String} data	The data from an affix file.
	 * @return {String}		The cleaned-up data.
	 *
	 * @private
	 */
	var removeAffixComments = function(data){
		return data
			//remove comments
			.replace(/^$|\s*#.*$/mg, '')
			.replace(/^\r?\n/mg, '')
			//trim each line
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$/mg, '')
			//remove blank lines
			.replace(/(\r?\n){2,}/mg, EOL)
			//trim the entire string
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$|\r?\n$/mg, '');
	};

	/** @private */
	var parseRuleCodes = function(textCodes){
		if(!textCodes)
			return [];

		if(!('FLAG' in this.flags) || this.flags.FLAG == 'UTF-8')
			return textCodes.split('');
		if(this.flags.FLAG == 'long')
			return textCodes.match(/.{2}/g);
		if(this.flags.FLAG == 'num')
			return textCodes.split(',');
	};

	var applyRules = function(wordFlags){
		var parts = wordFlags.split('/');
		var word = parts[0];
		var continuationClasses = {
			prefixes: [],
			suffixes: []
		};
		parseRuleCodes.call(this, parts[1]).forEach(function(ruleClass){
			var rule = this.rules[ruleClass];
			if(rule && 'isSuffix' in rule)
				continuationClasses[rule.isSuffix? 'suffixes': 'prefixes'].push(ruleClass);
		}, this);

		var productions = [{production: word, rules: []}];
		continuationClasses.suffixes.forEach(function(suffix){
			var productionsToAdd = applyRule.call(this, word, suffix);
			Array.prototype.push.apply(productions, productionsToAdd);
		}, this);
		var productionsCopy = arrayClone(productions);
		continuationClasses.prefixes.forEach(function(prefix){
			productionsCopy.forEach(function(prod){
				var productionsToAdd = applyRule.call(this, prod.production, prefix);
				Array.prototype.push.apply(productions, productionsToAdd);
			}, this);
		}, this);

		return productions;
	};

	/** {@link ArrayHelper.clone} */
	var arrayClone = function(obj){
		if(Array.isArray(obj)){
			var copy = obj.slice(0);
			for(var i = 0, len = copy.length; i < len; i ++)
				copy[i] = arrayClone(copy[i]);
			return copy;
		}
		else if(typeof obj === 'object'){
			var copy = obj.constructor();
			for(var attr in obj)
				if(obj.hasOwnProperty(attr))
					copy[attr] = obj[attr];
			return copy;
		}
		return obj;
	};

	/**
	 * Applies an affix rule to a word.
	 *
	 * @param {String} word	The base word.
	 * @param {String} ruleClass	The affix rule class.
	 * @param {String} previousGeneration	Previous generation rule.
	 * @returns {Object[]}	The new words generated by the rule, composed by 'production' and 'rules'.
	 *
	 * @private
	 */
	var applyRule = function(word, ruleClass, previousGeneration){
		var rule = this.rules[ruleClass],
			productions = [],
			newWord;
		if(rule)
			rule.entries.forEach(function(entry){
				if(!entry.match || word.match(entry.match)){
					newWord = (entry.remove? word.replace(entry.remove, ''): word);
					if(!newWord.length && !('FULLSTRIP' in this.flags))
						throw 'Cannot strip full words without the flag FULLSTRIP';

					newWord = (rule.isSuffix? newWord + entry.add: entry.add + newWord);

					var formattedRule = (rule.isSuffix? 'SFX': 'PFX')
						+ ' ' + ruleClass
						+ ' ' + (entry.remove? entry.remove.source.replace(/^\^|\$$/g, ''): '0')
						+ ' ' + entry.add + (entry.continuationClasses? '/' + entry.continuationClasses.join(''): '')
						+ ' ' + (entry.match? entry.match.source.replace(/^\^|\$$/g, ''): '.');
					productions.push({production: newWord, rules: [previousGeneration, formattedRule].filter(function(el){ return !!el; })});

					if(!previousGeneration && 'continuationClasses' in entry)
						entry.continuationClasses.forEach(function(cl){
							Array.prototype.push.apply(productions, applyRule.call(this, newWord, cl, formattedRule));
						}, this);
				}
			}, this);
		else if(this.flags['KEEPCASE'] === ruleClass)
			productions.push({production: word, rules: []});
		else
			console.log(word + ' does not have a rule for class ' + ruleClass + (previousGeneration? ' (previous generation is ' + previousGeneration + ')': ''));
		return productions;
	};


	Constructor.prototype = {
		constructor: Constructor,

		applyRules: applyRules,
		extractContinuationClasses: extractContinuationClasses,
		hasRule: hasRule,
		canParse: canParse
	};

	return Constructor;

});
