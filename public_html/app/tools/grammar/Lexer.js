/**
 * @class Lexer
 *
 * @see {@link https://github.com/aaditmshah/lexer/blob/master/lexer.js}
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(){
		this.rules = [];
	};


	/**
	 * Add a new rule.
	 *
	 * @param {Regex} pattern		The regular expression designating what text matches this rule. Capture will be passed to the callback function.
	 * @param {Function} callback	A callback that is executed when this token is matched. This function should accept one argument: the lexeme matched.
	 */
	var addRule = function(pattern, callback){
		if(!pattern.global){
			var flags = 'g';
			if(pattern.multiline)
				flags += 'm';
			if(pattern.ignoreCase)
				flags += 'i';
			if(pattern.unicode)
				flags += 'u';
			if(pattern.sticky)
				flags += 'y';

			pattern = new RegExp(pattern.source, flags);
		}

		this.rules.push({
			pattern: pattern,
			callback: callback
		});

		return this;
	};

	/**
	 * Processes the input stream, matching and tokenizing left to right in a single pass.<br>
	 * Extracts the most problable (aka longest) rule that matches, or <code>undefined</code> if no rules matches.
	 *
	 * @param {String} [source]	String to set as source and lex.
	 * @return {Object}	The value returned by the callback whose rule matches.
	 */
	var lex = function(source){
		if(source){
			this.source = source;
			this.index = 0;
		}

		var match;
		while(match = scan.call(this)){
			var token = match.rule.callback.call(this, match.result);
			if(token)
				return token;
		}

		if(!match)
			return undefined;
	};

	/** @private */
	var scan = function(){
		var matches = [];
		for(var rule in this.rules){
			rule = this.rules[rule];

			var pattern = rule.pattern;
			pattern.lastIndex = this.index;

			var result = pattern.exec(this.source);
			if(result)
				matches.push({
					result: result[0],
					rule: rule,
					index: result.index
				});
		}

		var match = extractMostProbableMatch(matches);
		if(match)
			this.index = match.index + match.result.length;

		return match;
	};

	/** @private */
	var extractMostProbableMatch = function(matches){
		matches.sort(function(a, b){
			var r = a.index - b.index;
			return (r? r: a.result.length - b.result.length);
		});

		return matches[0];
	};


	Constructor.prototype = {
		constructor: Constructor,

		addRule: addRule,
		lex: lex
	};

	return Constructor;

});
