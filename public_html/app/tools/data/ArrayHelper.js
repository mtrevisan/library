/**
 * @class ArrayHelper
 *
 * @see {@link https://github.com/enricomarino/array/blob/master/lib/array.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/*var empty = function(array){
		array.length = 0;
	};*/

	/** Returns an array filled with 'len' copies of 'value' */
	var repeat = function(value, len){
		if(len == 0)
			return [];
		var a = [value];
		while(a.length * 2 <= len)
			a = a.concat(a);
		if(a.length < len)
			a = a.concat(a.slice(0, len - a.length));
		return a;
	};

	/**
	 * Copies the values of `source` to `destination`.
	 *
	 * @param {Array} source				The array to copy values from.
	 * @param {Array} [destination=[]]	The array to copy values to.
	 */
	var copy = function(source, destination){
		var index = -1,
			length = source.length;

		destination || (destination = Array(length));
		while(++ index < length)
			destination[index] = source[index];
		return destination;
	};

	var clone = function(source){
		if(Array.isArray(source)){
			var copy = source.slice(0);
			for(var i = 0, len = copy.length; i < len; i ++)
				copy[i] = arrayClone(copy[i]);
			return copy;
		}
		else if(ObjectHelper.isObject(source)){
			var copy = source.constructor();
			for(var attr in source)
				if(source.hasOwnProperty(attr))
					copy[attr] = source[attr];
			return copy;
		}
		return source;
	};

	/** NOTE: elements should be unique! */
	var equals = function(a, b){
		return (a.length == b.length && a.every(function(el){ return (b.indexOf(el) >= 0); }));
	};

	/** Tells whether <code>b</code> is contained into <code>a</code>. */
	var contains = function(a, b){
		return b.every(function(el){ return (a.indexOf(el) >= 0); });
	};

	/**
	 * Creates an array of unique values that are included in all of the provided arrays.
	 *
	 * @param {Array} arguments	The array(s).
	 * @return {Array}	New array of shared values.
	 */
	var intersection = function(a){
		if(a == null)
			return [];
		if(arguments.length === 1)
			return unique(a);

		var arr = Array.prototype.slice.call(arguments, 1);

		return unique(a).filter(function(el){
			//some?
			return arr.every(function(cur){
				return (cur && cur.indexOf(el) >= 0);
			});
		});
	};

	/**
	 * Creates an array of unique values that are included in all of the provided arrays.
	 *
	 * @param {Array} arguments	The array(s).
	 * @return {Array}	Array of unique items.
	 */
	var unique = function(){
		var arr = Array.prototype.concat.apply([], Array.prototype.slice.call(arguments));
		return arr.filter(function(el, idx, a){
			return (a.indexOf(el) == idx);
		});
	};

	/**
	 * Take the difference between one array and a number of other arrays.<p>
	 * Only the elements present in just the first array will remain.
	 *
	 * @param {Array} arguments	The array(s).
	 * @return {Array}	Array of difference.
	 */
	var difference = function(arr){
		if(!Array.isArray(arguments[0]))
			return [];
		for(var j = 1, argsLength = arguments.length; j < argsLength; j ++)
			if(!Array.isArray(arguments[j]))
				return arguments[0];

		var rest = Array.prototype.concat.apply([], Array.prototype.slice.call(arguments, 1));
		return arr.filter(function(value){
			return (rest.indexOf(value) < 0);
		});
	};

	var cartesianProductOf = function(){
		return Array.prototype.reduce.call(arguments, function(x, y){
			var ret = [];
			x.forEach(function(a){
				y.forEach(function(b){
					ret.push(a.concat([b]));
				});
			});
			return ret;
		}, [[]]);
	};

	/**
	 * Performs a binary search of an array to determine the index at which the element.<p>
	 * Returns the index <code>idx</code> in the table such that <code>value = array[idx]</code>, where <code>array[idx] <= array[idx + 1]</code>, if positive.<br>
	 * Returns the index <code>idx</code> in the table such that <code>array[-idx - 1] < value < array[-idx]</code>, if negative.
	 *
	 * @see {@link http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/}
	 *
	 * @param {Array} array	The sorted array to inspect.
	 * @param {*} element	The value to search.
	 * @return {Number}	The index of the matched value, otherwise the negated of the element just after.
	 *
	 * @private
	 */
	var binaryIndexOf = function(array, element){
		var low = 0,
			high = array.length - 1,
			mid, current;

		while(low <= high){
			mid = (low + high) >>> 1;
			current = array[mid];

			if(current < element)
				low = mid + 1;
			else if(current > element)
				high = mid - 1;
			else
				return mid;
		}

		return ~high;
	};

	/** Apply Fisher-Yates (aka Knuth) shuffle */
	var shuffle = function(array){
		var currentIndex = array.length,
			randomIndex;
		while(currentIndex){
			randomIndex = toInteger(Math.random() * currentIndex --);
			array[currentIndex] = [array[randomIndex], array[randomIndex] = array[currentIndex]][0];
		}
	};

	/**
	 * Takes a predicate and a list and returns the pair of lists of elements which do and do not satisfy the predicate, respectively.
	 *
	 * @example
	 * <code>
	 * ArrayHelper.partition(function(value){ return (value.indexOf('s') >= 0); }, ['sss', 'ttt', 'foo', 'bars']);
	 * //=> [['sss', 'bars'], ['ttt', 'foo']]
	 * </code>
	 *
	 * @param {Function} predicate	A predicate to determine which array the element belongs to, it accepts the value, the index, and the global list.
	 * @param {Array} list				The array to partition.
	 * @return {Array} A nested array, containing first an array of elements that satisfied the predicate, and second an array of elements
	 *		that did not satisfy.
	 */
	var partition = function(list, predicate){
		var result = {};
		list.forEach(function(value, index){
			var key = predicate(value, index, list);
			if(key in result)
				result[key].push(value);
			else
				result[key] = [value];
		});
		return result;
	};

	/**
	 * Returns a new list by pulling every item out of it (and all its sub-arrays) and putting them in a new array, depth-first.
	 *
	 * @param {Array} list The array to consider.
	 * @return {Array} The flattened list.
	 */
	var flatten = function(list){
		return (function recursiveFlatten(lst){
			var result = [];
			var add = function(x){
				if(Array.isArray(x) || ObjectHelper.isObject(x))
					result = result.concat(recursiveFlatten(x));
				else
					result.push(x);
			};

			if(ObjectHelper.isObject(lst))
				Object.keys(lst).forEach(function(x){
					add(lst[x]);
				});
			else
				lst.forEach(function(x){
					add(x);
				});
			return result;
		})(list);
	};

	/**
	 * Converts <code>value</code> to an integer.
	 *
	 * @param {*} value	The value to convert.
	 * @return {Number}	Returns the integer.
	 *
	 * @private
	 */
	var toInteger = function(value){
		return (value | 0);
	};


	return {
		repeat: repeat,
		copy: copy,
		clone: clone,
		equals: equals,
		contains: contains,
		intersection: intersection,
		unique: unique,
		difference: difference,
		cartesianProductOf: cartesianProductOf,
		binaryIndexOf: binaryIndexOf,
		shuffle: shuffle,
		partition: partition,
		flatten: flatten
	};

});
