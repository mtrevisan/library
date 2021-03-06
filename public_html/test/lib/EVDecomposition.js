/**
 * @class EVDecomposition
 *
 * @see {@link www.cs.bham.ac.uk/~pxc/js/}
 * @see {@link http://people.math.gatech.edu/~klounici6/2605/Lectures%20notes%20Carlen/chap3.pdf}
 *
 * @author Mauro Trevisan
 */
define(function(){
/*
 Description: Javascript routines to find the eigenvalues and eigenvectors of a matrix.
 Acknowledgement: This Javascript code is based on the source code of
 JAMA, A Java Matrix package (http://math.nist.gov/javanumerics/jama/),
 which states "Copyright Notice This software is a cooperative product
 of The MathWorks and the National Institute of Standards and
 Technology (NIST) which has been released to the public domain.
 Neither The MathWorks nor NIST assumes any responsibility whatsoever
 for its use by other parties, and makes no guarantees, expressed
 or implied, about its quality, reliability, or any other
 characteristic."
 Author: Peter Coxhead (http://www.cs.bham.ac.uk/~pxc/)
 Copyright: The conversion of the JAMA source to Javascript is
 copyright Peter Coxhead, 2008, and is released under GPLv3
 (http://www.gnu.org/licenses/gpl-3.0.html).
 Last Revision: 9 Dec 2008


 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 EV Decomposition (from the JAMA package)

 Eigenvalues and eigenvectors of a real matrix.

 If A is symmetric, then A = V*L*V' where the eigenvalue matrix L is
 diagonal and the eigenvector matrix V is orthogonal (i.e. V*V' = I).
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// EVDecomposition.create(mo): given a matrix as a Matrix object mo, it
//   returns an EVDecomposition object which contains the eigenvectors
//   and eigenvalues of the matrix. The fields of an EVDecomposition
//   object are:
//   eigenvectors   the columnwise eigenvectors as a Matrix object
//   eigenvalues    the real part of the eigenvalues as an array
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var decompose = function(matrix){
			//row and column dimension (square matrix)
		var n = matrix.length,
			eigenvectors = [],
			eigenvalues_real = [],
			eigenvalues_imaginary = [],
			i, j;
		for(i = 0; i < n; i ++)
			eigenvectors[i] = [];
		for(i = 0; i < n; i ++)
			for(j = i; j < n; j ++){
				eigenvectors[i][j] = matrix[i][j];
				eigenvectors[j][i] = matrix[i][j];
			}

		//process a symmetric matrix
		tridiagonalize(n, eigenvalues_real, eigenvalues_imaginary, eigenvectors);
		diagonalize(n, eigenvalues_real, eigenvalues_imaginary, eigenvectors);

		//reduce small values to 0
		var eps = Math.pow(2, -40);
		eigenvalues_real = eigenvalues_real.map(function(el){ return (Math.abs(el) < eps? 0: el); });
		eigenvalues_imaginary = eigenvalues_imaginary.map(function(el){ return (Math.abs(el) < eps? 0: el); });

		//create an object to return the results
		return {
			eigenvectors: eigenvectors,
			eigenvalues_real: eigenvalues_real,
			eigenvalues_imaginary: eigenvalues_imaginary
		};
	};

	/**
	 * Perform the symmetric Householder reduction to tridiagonal form.
	 * This is derived from the Algol procedures tred2 by Bowdler, Martin, Reinsch, and Wilkinson, Handbook
	 * for Auto. Comp., Vol.ii-Linear Algebra, and the corresponding Fortran subroutine in EISPACK
	 *
	 * @private
	 */
	var tridiagonalize = function(n, eigenvalues_real, eigenvalues_imaginary, eigenvectors){
		var i, j, k;
		for(j = 0; j < n; j ++)
			eigenvalues_real[j] = eigenvectors[n - 1][j];

		//Householder reduction to tridiagonal form
		var scale, h, hh,
			f, g;
		for(i = n - 1; i > 0; i --){
			//scale to avoid under/overflow
			scale = 0;
			h = 0;
			for(k = 0; k < i; k ++)
				scale += Math.abs(eigenvalues_real[k]);
			if(!scale){
				eigenvalues_imaginary[i] = eigenvalues_real[i - 1];
				for(j = 0; j < i; j ++){
					eigenvalues_real[j] = eigenvectors[i - 1][j];
					eigenvectors[i][j] = 0;
					eigenvectors[j][i] = 0;
				}
			}
			else{
				//generate Householder vector
				for(k = 0; k < i; k ++){
					eigenvalues_real[k] /= scale;
					h += eigenvalues_real[k] * eigenvalues_real[k];
				}
				f = eigenvalues_real[i - 1];
				g = Math.sqrt(h);
				if(f > 0)
					g = -g;
				eigenvalues_imaginary[i] = scale * g;
				h = h - f * g;
				eigenvalues_real[i - 1] = f - g;
				for(j = 0; j < i; j ++)
					eigenvalues_imaginary[j] = 0;
				//apply similarity transformation to remaining columns
				for(j = 0; j < i; j ++){
					f = eigenvalues_real[j];
					eigenvectors[j][i] = f;
					g = eigenvalues_imaginary[j] + eigenvectors[j][j] * f;
					for(k = j + 1; k <= i - 1; k ++){
						g += eigenvectors[k][j] * eigenvalues_real[k];
						eigenvalues_imaginary[k] += eigenvectors[k][j] * f;
					}
					eigenvalues_imaginary[j] = g;
				}
				f = 0;
				for(j = 0; j < i; j ++){
					eigenvalues_imaginary[j] /= h;
					f += eigenvalues_imaginary[j] * eigenvalues_real[j];
				}
				hh = f / (h + h);
				for(j = 0; j < i; j ++)
					eigenvalues_imaginary[j] -= hh * eigenvalues_real[j];
				for(j = 0; j < i; j ++){
					f = eigenvalues_real[j];
					g = eigenvalues_imaginary[j];
					for(k = j; k <= i - 1; k ++)
						eigenvectors[k][j] -= (f * eigenvalues_imaginary[k] + g * eigenvalues_real[k]);
					eigenvalues_real[j] = eigenvectors[i - 1][j];
					eigenvectors[i][j] = 0;
				}
			}
			eigenvalues_real[i] = h;
		}
		//accumulate transformations
		for(i = 0; i < n - 1; i ++){
			eigenvectors[n - 1][i] = eigenvectors[i][i];
			eigenvectors[i][i] = 1;
			h = eigenvalues_real[i + 1];
			if(h){
				for(k = 0; k <= i; k ++)
					eigenvalues_real[k] = eigenvectors[k][i + 1] / h;
				for(j = 0; j <= i; j ++){
					g = 0;
					for(k = 0; k <= i; k ++)
						g += eigenvectors[k][i + 1] * eigenvectors[k][j];
					for(k = 0; k <= i; k ++)
						eigenvectors[k][j] -= g * eigenvalues_real[k];
				}
			}
			for(k = 0; k <= i; k ++)
				eigenvectors[k][i + 1] = 0;
		}
		for(j = 0; j < n; j ++){
			eigenvalues_real[j] = eigenvectors[n - 1][j];
			eigenvectors[n - 1][j] = 0;
		}
		eigenvectors[n - 1][n - 1] = 1;
		eigenvalues_imaginary[0] = 0;
	};

	/**
	 * Perform the symmetric tridiagonal QL algorithm
	 * This is derived from the Algol procedures tql2, by Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
	 * Auto. Comp., Vol.ii-Linear Algebra, and the corresponding Fortran subroutine in EISPACK
	 *
	 * @private
	 */
	var diagonalize = function(n, eigenvalues_real, eigenvalues_imaginary, eigenvectorsV){
		var eps = 0.5 * Math.pow(2, -40),
			i, j, k,
			f, tst1, l, m, p;

		for(i = 1; i < n; i ++)
			eigenvalues_imaginary[i - 1] = eigenvalues_imaginary[i];
		eigenvalues_imaginary[n - 1] = 0;

		f = 0;
		tst1 = 0;
		for(l = 0; l < n; l ++){
			//find small subdiagonal element
			tst1 = Math.max(tst1, Math.abs(eigenvalues_real[l]) + Math.abs(eigenvalues_imaginary[l]));
			m = l;
			while(m < n){
				if(Math.abs(eigenvalues_imaginary[m]) <= eps * tst1)
					break;
				m ++;
			}

			//if m == l, d[l] is an eigenvalue, otherwise, iterate
			if(m > l){
				var iter = 0;
				do{
					//(could check iteration count here)
					iter ++;
					//compute implicit shift
					var g = eigenvalues_real[l],
						p = (eigenvalues_real[l + 1] - g) / (2 * eigenvalues_imaginary[l]),
						r = hypot(p, 1);
					if(p < 0)
						r = -r;
					eigenvalues_real[l] = eigenvalues_imaginary[l] / (p + r);
					eigenvalues_real[l + 1] = eigenvalues_imaginary[l] * (p + r);
					var dl1 = eigenvalues_real[l + 1],
						h = g - eigenvalues_real[l];
					for(i = l + 2; i < n; i++)
						eigenvalues_real[i] -= h;
					f = f + h;

					// Implicit QL transformation.
					p = eigenvalues_real[m];
					var c = 1,
						c2 = c,
						c3 = c,
						el1 = eigenvalues_imaginary[l + 1],
						s = 0,
						s2 = 0;
					for(i = m - 1; i >= l; i--){
						c3 = c2;
						c2 = c;
						s2 = s;
						g = c * eigenvalues_imaginary[i];
						h = c * p;
						r = hypot(p, eigenvalues_imaginary[i]);
						eigenvalues_imaginary[i + 1] = s * r;
						s = eigenvalues_imaginary[i] / r;
						c = p / r;
						p = c * eigenvalues_real[i] - s * g;
						eigenvalues_real[i + 1] = h + s * (c * g + s * eigenvalues_real[i]);

						//accumulate transformation
						for(k = 0; k < n; k ++){
							h = eigenvectorsV[k][i + 1];
							eigenvectorsV[k][i + 1] = s * eigenvectorsV[k][i] + c * h;
							eigenvectorsV[k][i] = c * eigenvectorsV[k][i] - s * h;
						}
					}
					p = -s * s2 * c3 * el1 * eigenvalues_imaginary[l] / dl1;
					eigenvalues_imaginary[l] = s * p;
					eigenvalues_real[l] = c * p;
				//check for convergence
				}while(Math.abs(eigenvalues_imaginary[l]) > eps * tst1);
			}
			eigenvalues_real[l] = eigenvalues_real[l] + f;
			eigenvalues_imaginary[l] = 0;
		}

		//sort eigenvalues and corresponding vectors
		for(i = 0; i < n - 1; i ++){
			k = i;
			p = eigenvalues_real[i];
			for(j = i + 1; j < n; j ++)
				if(eigenvalues_real[j] < p){
					k = j;
					p = eigenvalues_real[j];
				}
			if(k != i){
				eigenvalues_real[k] = eigenvalues_real[i];
				eigenvalues_real[i] = p;
				for(j = 0; j < n; j ++){
					p = eigenvectorsV[j][i];
					eigenvectorsV[j][i] = eigenvectorsV[j][k];
					eigenvectorsV[j][k] = p;
				}
			}
		}
	};

	/**
	 * Find sqrt(a^2 + b^2) reliably
	 *
	 * @private
	 */
	var hypot = function(a, b){
		var r = 0,
			aa = Math.abs(a),
			bb = Math.abs(b);
		if(aa > bb){
			r = b / a;
			r = aa * Math.sqrt(1 + r * r);
		}
		else if(b){
			r = a / b;
			r = bb * Math.sqrt(1 + r * r);
		}
		return r;
	};


	return {
		decompose: decompose
	};
});
