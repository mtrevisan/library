/**
 * @class HierarchicalClusterer
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/Tree'], function(Tree){

	/**
	 *
	 * @param {Matrix<Number>} matrix	A square matrix
	 * @param {Array<String>} names		The names given to the clustering tree, it must have the same dimension of the matrix
	 * @returns {Tree}	The tree representation of the clustering
	 */
	var cluster = function(matrix, names){
		//make a copy of the matrix
		matrix = matrix.map(function(arr){ return arr.slice(); });

		var tree = new Tree(),
			minimum;
		//continue until the matrix collapses into one element
		names = names.splice(0);
		while(matrix.length > 1){
			minimum = findMinimum(matrix);

			collapseVariants(names, minimum, tree);

			collapseDistances(names, matrix, minimum);
		}

		return tree;
	};

	/**
	 * Search the matrix for the minimum
	 *
	 * @private
	 */
	var findMinimum = function(matrix){
		var rows = matrix.length,
			result = {dist: Number.MAX_VALUE},
			i, j,
			value;
		for(i = 0; i < rows; i ++)
			for(j = i + 1; j < rows; j ++){
				value = matrix[i][j];
				if(value < result.dist){
					//reckon the two variants
					result.v1 = i;
					result.v2 = j;
					result.dist = value;
				}
			}
		return result;
	};

	/**
	 * Collapse the two variants together in the variants vector
	 *
	 * @private
	 */
	var collapseVariants = function(variants, indicesVariants, tree){
		var v1 = indicesVariants.v1,
			v2 = indicesVariants.v2,
			dist = indicesVariants.dist;
		if(v2 > v1)
			v2 --;
		v1 = variants.splice(v1, 1)[0];
		v2 = variants.splice(v2, 1)[0];
		variants.push('(' + [v1, v2].sort().join('|') + ':' + dist.toFixed(4) + ')');

		v1 = v1.replace(/:[.\d]+/g, '');
		v2 = v2.replace(/:[.\d]+/g, '');
		if(v1.indexOf('|') < 0)
			tree.addChild(v1);
		if(v2.indexOf('|') < 0)
			tree.addChild(v2);
		tree.insertParent('(' + [v1, v2].sort().join('|') + ')', {distance: dist}, v1, v2);
	};

	/**
	 * Collapse the two variants together in the distance matrix, calculating the new distances from the cluster
	 * to each other variant
	 *
	 * @private
	 */
	var collapseDistances = function(variants, matrix, indicesVariants){
		var rows = matrix.length,
			v1 = indicesVariants.v1,
			v2 = indicesVariants.v2,
			i;
		for(i = 0; i < rows; i ++)
			if(i != v1 && i != v2)
				matrix[i][rows] = mergeValues(variants, matrix, i, v1, v2);
		matrix[rows] = [];
		matrix[rows][rows] = 0;

		removeVariants(matrix, v1, v2);
	};

	/** @private */
	var removeVariants = function(matrix, v1, v2){
		if(v2 > v1)
			v2 --;
		//remove the rows of the two variants
		matrix.splice(v1, 1);
		matrix.splice(v2, 1);
		//remove the columns of the two variants
		matrix = matrix.map(function(row){
			row.splice(v1, 1);
			row.splice(v2, 1);
			return row;
		});
	};

	/**
	 * Calculates the centroid
	 *
	 * @private
	 */
	var mergeValues = function(variants, matrix, i, v1, v2){
		var n1 = (variants[v1].match(/\|/g) || []).length + 1,
			n2 = (variants[v2 > v1? v2 - 1: v2].match(/\|/g) || []).length + 1;
		return (getValue(matrix, i, v1) * n1 + getValue(matrix, i, v2) * n2) / (n1 + n2);
	};

	/** @private */
	var getValue = function(matrix, i, j){
		return matrix[Math.min(i, j)][Math.max(i, j)];
	};


	return {
		cluster: cluster
	};

});
