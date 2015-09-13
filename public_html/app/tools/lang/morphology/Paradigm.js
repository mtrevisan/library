/**
 * @class Paradigm
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/phonology/Orthography', 'tools/data/ObjectHelper'], function(Word, Orthography, ObjectHelper){

	/** @constant */
	var REGULAR = 'regular',
	/** @constant */
		IRREGULAR = 'irregular';


	/**
	 * @param {Verb} verb
	 * @param {Object} themes generated by Themizer
	 */
	var Constructor = function(verb, themes){
		this.verb = verb;
		this.themes = themes;
	};


	var generate = function(){
		this.paradigm = {
			applyDialectalVariations: applyDialectalVariations
		};

		var reg = this.themes[REGULAR];
		var irr = this.themes[IRREGULAR];

		[REGULAR, IRREGULAR].forEach(function(type){
			var t = this.themes[type];

			generateIndicativePresent.call(this, type, t);
			generateInfinitiveSimple.call(this, type, t);
			if(!this.verb.irregularity.poder)
				generateImperativePresent.call(this, type, t);
			generateParticipleImperfect.call(this, type, t);
			generateParticiplePerfect.call(this, type, t);
		}, this);
		generateParticiplePerfect_strong.call(this);
		if(!this.verb.irregularity.eser){
			generateIndicativeImperfect.call(this, REGULAR, reg);
			generateIndicativeFuture.call(this, REGULAR, reg);
			generateSubjunctiveImperfect.call(this, REGULAR, reg);
			generateConditionalSimple.call(this, REGULAR, reg);

			generateGerundSimple.call(this, IRREGULAR, irr);
		}
		//ensure syncope does not occurs
		if(!this.verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
			generateIndicativeImperfect.call(this, IRREGULAR, irr);
		generateIndicativeFuture.call(this, IRREGULAR, irr);
		//ensure syncope does not occurs
		if(!this.verb.irregularity.verb.match(/dever|eser|s?aver/))
			generateSubjunctivePresent.call(this, REGULAR, reg);
		generateSubjunctivePresent.call(this, IRREGULAR, irr);
		generateSubjunctiveImperfect.call(this, IRREGULAR, irr);
		generateConditionalSimple.call(this, IRREGULAR, irr);
		generateGerundSimple.call(this, REGULAR, reg);

		return this.paradigm;
	};


	/** @private */
	var generateIndicativePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);

		if(t.themeT12 || t.themeT5 || t.themeT8 || t.themeT10){
			var root = namespace(this.paradigm, 'indicative', 'present', type),
				person;
			if(t.themeT8){
				person = root.firstSingular = {};
				if(this.verb.irregularity.eser)
					person.general = t.themeT8 + (!t.themeT8.match(/[cijñ]$/)? '(i)': '') + 'ón';
				else if(this.verb.irregularity.aver){
					person.general = t.themeT8.replace(/à$/, 'à/è');
					person.central_centralNorthern_lagunar_western = t.themeT8.replace(/à$/, 'ò');
				}
				else{
					person.general = t.themeT8 + 'e';
					person.central_centralNorthern_lagunar_western = t.themeT8 + 'o';

					if(this.verb.irregularity.verb && type == 'irregular')
						person.central_centralNorthern_lagunar_western = (this.verb.irregularity.saver?
							t.themeT8.replace(/(.)$/, '($1)o'):
							t.themeT8 + (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'o');
				}
				root.secondSingular = {
					general: t.themeT8.replace(/([^i])$/, '$1' + (!this.verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.themeT8.match(/à$/)? 'i': ''))
				};
				var third = t.themeT8 + (!this.verb.irregularity.verb.match(/darStarFar|s?aver/)? (this.verb.irregularity.eser? 'é': 'e'): '');
				root.third = {
					general: third,
					archaic: (t.themeT10 && t.themeT10 !== third? t.themeT10: undefined)
				};
			}
			else if(t.themeT10)
				root.third = {
					general: t.themeT10
				};
			if(t.themeT5)
				root.secondPlural = {
					general: t.themeT5,
					northern_oriental: (conj != 2 && t.themeT12? t.themeT12 + 'é': undefined),
					central_western: (conj == 2? t.themeT5.replace(/i?é$/, 'í'): undefined)
				};
			if(t.themeT12 || t.themeT5){
				person = root.firstPlural = {};
				if(t.themeT12){
					person.northern = t.themeT12 + 'ón';
					person.oriental = t.themeT12 + 'én';
				}
				if(t.themeT5){
					person.general = root.secondPlural.general.replace(/è$/, 'é') + 'mo';
					person.central_western = (root.secondPlural.central_western? root.secondPlural.central_western + 'mo': undefined);
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/)){
				root = namespace(this.paradigm, 'indicative', 'present', 'irregular');
				root.firstSingular || (root.firstSingular = {});
				root.firstSingular.central_centralNorthern_lagunar_western = t.themeT8.replace(/[lx]?$/, 'go');
			}
		}
	};

	/** @private */
	var generateIndicativeImperfect = function(type, t){
		if(t.themeT2 || t.themeT11){
			var root = namespace(this.paradigm, 'indicative', 'imperfect', type);
			if(t.themeT2){
				var tmp = t.themeT2 + (this.verb.irregularity.eser? 'r': 'v');
				root.firstSingular = {
					general: tmp + 'a',
					northern_oriental: tmp + 'e',
					central: tmp + 'o'
				};
				root.secondPlural = {
					general: tmp + 'i',
					archaic: tmp + 'a',
					northern: (t.themeT11? t.themeT11 + '(iv)ié': undefined)
				};
				root.secondSingular = {
					general: tmp + 'i'
				};
				root.third = {
					general: tmp + 'a'
				};
			}
			var person = root.firstPlural = {};
			if(t.themeT2)
				person.general = root.secondPlural.general + 'mo';
			if(t.themeT11){
				var firstPlural = t.themeT11 + '(iv)';
				person.northern = firstPlural + (!firstPlural.match(/[cijñ]$/)? '(i)': '') + 'ón(se)';
				person.oriental = firstPlural + 'én(se)';
			}
		}
	};

	/** @private */
	var generateIndicativeFuture = function(type, t){
		if(t.themeT4){
			var root = namespace(this.paradigm, 'indicative', 'future', type),
				firstPlural = t.themeT4 + 'r';
			root.firstSingular = {
				general: firstPlural + 'à',
				northern_oriental: firstPlural + 'è',
				central: firstPlural + 'ò'
			};
			root.secondSingular = {
				general: firstPlural + 'à'
			};
			root.secondPlural = {
				general: firstPlural + 'é',
				central_western: (this.verb.conjugation == 2? firstPlural + 'í': undefined)
			};
			root.firstPlural = {
				general: root.secondPlural.general + 'mo',
				northern: firstPlural + 'ón',
				oriental: firstPlural + 'én',
				central_western: (root.secondPlural.central_western? root.secondPlural.central_western + 'mo': undefined)
			};
			root.third = {
				general: firstPlural + 'à'
			};
		}
	};

	/** @private */
	var generateSubjunctivePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);
		t = t.subjunctive || t;

		if(t.themeT12 || t.themeT5 || t.themeT8){
			var root = namespace(this.paradigm, 'subjunctive', 'present', type);
			if(t.themeT8){
				root.firstSingular = {
					general: t.themeT8 + 'a',
					northern_oriental: t.themeT8 + 'e'
				};
				root.secondSingular = {
					general: t.themeT8.replace(/([^i])$/, '$1i')
				};
				root.third = {
					general: t.themeT8 + 'a',
					northern_oriental: t.themeT8 + 'e'
				};

				if(type == 'irregular' && !this.verb.irregularity.verb.match(/(aver|dever|eser)/)){
					root.firstSingular.general = t.themeT8 + (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'a';
					root.secondSingular.general = (t.themeT8.match(/[aeiouàèéíòóú]$/)? t.themeT8 + '(g)i': t.themeT8.replace(/([^i])$/, '$1i'));
					root.third.general = t.themeT8 + (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'a';
				}
			}
			if(t.themeT5)
				root.secondPlural = {
					general: t.themeT5,
					centralNorthern: (conj != 2? t.themeT5.replace(/[èí]$/, 'é'): undefined),
					central_western: (conj == 2 && t.themeT5.replace(/i?é$/, 'í') != t.themeT5? t.themeT5.replace(/i?é$/, 'í'): undefined),
					northern_oriental1: (t.themeT12? t.themeT12 + (this.verb.special3rd? '(i)': '') + 'é(de/ge)': undefined),
					northern_oriental2: (conj == 3 && !this.verb.special3rd? t.themeT5 + '(de/ge)': undefined)
				};
			if(t.themeT12 || t.themeT5){
				var person = root.firstPlural = {};
				if(t.themeT12){
					person.northern = t.themeT12 + (!t.themeT12.match(/[cijñ]$/)? '(i)': '') + 'ón(e)';
					person.oriental = t.themeT12 + 'én(e)';
				}
				if(t.themeT5){
					person.general = root.secondPlural.general.replace(/è$/, 'é') + 'mo';
					person.central_western = (root.secondPlural.central_western? root.secondPlural.central_western + 'mo': undefined);
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/)){
				root = namespace(this.paradigm, 'subjunctive', 'present', 'irregular');
				root.firstSingular || (root.firstSingular = {});
				root.secondSingular || (root.secondSingular = {});
				root.third || (root.third = {});
				root.firstSingular.central_centralNorthern_lagunar_western = t.themeT8.replace(/[lx]?$/, 'ga');
				root.secondSingular.general = t.themeT8.replace(/[lx]?$/, 'gi');
				root.third.general = t.themeT8.replace(/[lx]?$/, 'ga');
			}
		}
	};

	/** @private */
	var generateSubjunctiveImperfect = function(type, t){
		t = t.subjunctive || t;

		if(t.themeT2 || t.themeT11){
			var root = namespace(this.paradigm, 'subjunctive', 'imperfect', type);
			if(t.themeT2){
				var tmp = t.themeT2 + 's';
				root.firstSingular = {
					general: tmp + 'e'
				};
				root.secondPlural = {
					general: tmp + 'i',
					archaic: tmp + 'e',
					northern: (t.themeT11? t.themeT11 + '(is)ié(de/ge)': undefined)
				};
				root.secondSingular = {
					general: tmp + 'i'
				};
				root.third = {
					general: tmp + 'e'
				};
			}
			var person = root.firstPlural = {};
			if(t.themeT2)
				person.general = root.secondPlural.general + 'mo';
			if(t.themeT11){
				var firstPlural = t.themeT11 + '(is)';
				person.northern = firstPlural + (!firstPlural.match(/[cijñ]$/)? '(i)': '') + 'ón(e/se)';
				person.oriental = firstPlural + 'én(e/se)';
			}
		}
	};

	/** @private */
	var generateConditionalSimple = function(type, t){
		if(t.themeT4){
			var root = namespace(this.paradigm, 'conditional', 'simple', type),
				tmp = t.themeT4 + 'rí',
				firstPlural = t.themeT4 + 'r(is)';
			root.firstSingular = {
				general: tmp + 'a',
				northern_oriental: tmp + 'e'
			};
			root.secondPlural = {
				general: t.themeT4 + 'rési',
				northern: t.themeT4 + 'r(is)ié'
			};
			root.firstPlural = {
				general: root.secondPlural.general + 'mo',
				northern: firstPlural + '(i)ón(se)',
				oriental: firstPlural + 'én(se)'
			};
			root.secondSingular = {
				general: tmp + 'a'
			};
			root.third = {
				general: tmp + 'a',
				northern_oriental: tmp + 'e'
			};
			root.archaic = t.themeT4 + 'ràve';
		}
	};

	/** @private */
	var generateImperativePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);

		if(t.themeT5 || t.themeT9){
			var root = namespace(this.paradigm, 'imperative', 'present', type);
			if(t.themeT9)
				root.secondSingular = {
					general: t.themeT9
				};
			if(t.themeT5)
				root.secondPlural = {
					general: t.themeT5,
					northern_oriental: (conj != 2? t.themeT5.replace(/[èí]$/, 'é'): undefined),
					central_western: (conj == 2? t.themeT5.replace(/i?é$/, 'í'): undefined)
				};
		}
	};

	/** @private */
	var generateInfinitiveSimple = function(type, t){
		if(t.themeT1)
			namespace(this.paradigm, 'infinitive', 'simple', type).all = t.themeT1 + 'r(e)';
	};

	/** @private */
	var generateParticipleImperfect = function(type, t){
		if(t.themeT7)
			namespace(this.paradigm, 'participle', 'imperfect', type).all = t.themeT7 + 'nte';
	};

	/** @private */
	var generateParticiplePerfect = function(type, t){
		t = t.participlePerfect || t;

		if(t.themeT2 || t.themeT6 || t.themeT7){
			var root = namespace(this.paradigm, 'participle', 'perfect', type);
			if(t.themeT6)
				root.general = {
					singularMasculine: t.themeT6 + '(do)',
					pluralMasculine: t.themeT6 + '(di)',
					singularFeminine: t.themeT6 + '(d)a',
					pluralFeminine: t.themeT6 + '(d)e'
				};
			if(t.themeT2)
				root.northern_oriental1 = generateEntireDeclination(t.themeT2 + 'st');
			if(t.themeT7)
				root.northern_oriental2 = (this.verb.conjugation == 3? generateEntireDeclination(t.themeT7 + 'st'): undefined);
		}
	};

	/** @private */
	var generateParticiplePerfect_strong = function(){
		var t;
		[REGULAR, IRREGULAR].forEach(function(k){
			if(!t || !t.themeT8){
				t = this.themes[k];
				t = t.participlePerfect || t;
			}
		}, this);

		if(t.themeT8){
			var strong = generateParticiplePerfectStrong.call(this, t.themeT8);
			namespace(this.paradigm, 'participle', 'perfect', 'irregular', 'strong').general = (strong? generateEntireDeclination(strong): undefined);
		}
	};

	/** @private */
	var generateGerundSimple = function(type, t){
		if(t.themeT2 || t.themeT7){
			var person = namespace(this.paradigm, 'gerund', 'simple', type, 'all');
			if(t.themeT2)
				person.regular1 = t.themeT2 + 'ndo';
			if(t.themeT7)
				person.regular2 = (this.verb.conjugation == 3? t.themeT7 + 'ndo': undefined);
			if(this.verb.irregularity.eser)
				person.archaic = 'siàndo';
			else if(this.verb.irregularity.aver)
				person.archaic = 'abiàndo';
		}
	};

	/** @private */
	var generateParticiplePerfectStrong = (function(){

		/*var strongT = [
			//{matcher: /([aeiouàèéíòóú])rn?$/, replacement: '($1rt/rS1t)'},
			{matcher: /([aeiouàèéíòóú])rn?$/, replacement: '$1rt'},
			{matcher: /([^aeiouàèéíòóú])r$/, replacement: '$1èrt'},
			{matcher: /li?$/, replacement: 'lt'},
			{matcher: /([aeiouàèéíòóú])$/, replacement: '$1t'},
			{matcher: /rí?x$/, replacement: 'rèt'},
			{matcher: /úx$/, replacement: 'ót'},
			{matcher: /ónd?$/, replacement: 'óst'},
			{matcher: /m|n[ds]$/, replacement: 'nt'},
			{matcher: /n[xđp]|[bđgstŧvx]$/, replacement: 't'}
		];

		var strongS = [
			{matcher: /sucéd$/, replacement: 'sucès'},

			{matcher: /ónd$/, replacement: 'úx'},
			{matcher: /([aeiouàèéíòóú])n?d$/, replacement: '$1x'},
			{matcher: /([^aeiouàèéíòóú]n?)d|[stvx]$/, replacement: '$1s'},
			{matcher: /pèl$/, replacement: 'púls'},
			{matcher: /ím$/, replacement: 'ès'},
			{matcher: /st$/, replacement: 'íx'},
			{matcher: /rd?$/, replacement: 'rs'},
			{matcher: /l$/, replacement: 'ls'}
		];*/

		var strong = [
			//1st conjugation
			[
				{matcher: /fà$/, replacement: 'fàt'}
			],

			//2nd conjugation
			[
				//rhizotonic
				[
					//TODO
					{matcher: /trà$/, replacement: 'tràt'},
					{matcher: /díx$/, replacement: 'dít'},
					{matcher: /rónp$/, replacement: 'rót'},
					{matcher: /spànd$/, replacement: 'spànt'},
					{matcher: /skrív$/, replacement: 'skrít'},
					//kuèrdh, vínth, provéd
					{matcher: /kór$/, replacement: 'kórs'},
					{matcher: /ofénd$/, replacement: 'oféx'},
					{matcher: /pèrd$/, replacement: 'pèrs'},
					{matcher: /mét$/, replacement: 'més'},
					{matcher: /móv$/, replacement: 'mós'},
					{matcher: /sucéd$/, replacement: 'sucès'}
					//...
				],
				//rhizoatone (avér, -manér, -parér, podér, savér, -tolér/-volér, e valér)
				[
					{matcher: /n$/, replacement: 'x'},
					{matcher: /r$/, replacement: 'rs'},
					{matcher: /tòl$/, replacement: 'tòlt'},
					{matcher: /àl$/, replacement: 'àls'}
				]
			],

			//3rd conjugation
			[
				{matcher: /mòr$/, falsePositives: /(inti|mar)mòr$/, replacement: 'mòrt'},

				{matcher: /([^aeiouàèéíòóú])r$/, falsePositives: /núdr$/, replacement: '$1èrt'},
				{matcher: /r$/, replacement: 'rs'}
			]
		];

		return function(themeT8){
			var data = strong[this.verb.conjugation - 1];
			if(this.verb.conjugation == 2)
				data = data[this.verb.rhizotonic? 0: 1];
			//FIXME
			//choose between T- and S-past-participle for 2nd conjugation verbs?
			//...

			var m, match;
			if(data.some(function(el){ m = el; match = this.match(el.matcher); return match; }, themeT8) && (!m.falsePositives || !themeT8.match(m.falsePositives))){
				if(Word.isStressed(m.replacement) && !Word.isStressed(match[0]))
					themeT8 = Word.suppressStress(themeT8);
				return themeT8.replace(m.matcher, m.replacement);
			}
			return undefined;
		};

	})();

	/** @private */
	var generateEntireDeclination = function(root){
		return {
			singularMasculine: root + 'o',
			pluralMasculine: root + 'i',
			singularFeminine: root + 'a',
			pluralFeminine: root + 'e'
		};
	};

	/** @private */
	var namespace = function(root){
		var size = arguments.length,
			i, key;
		for(i = 1; i < size; i ++){
			key = arguments[i];
			root = root[key] = root[key] || {};
		}
		return root;
	};

	/** @private */
	var getIrregularVerbConjugation = function(type){
		return (type == IRREGULAR && this.verb.irregularity.traer? 1: this.verb.conjugation);
	};


	/**
	 * @param {Verb} verb
	 * @param {Pronouns} pronouns
	 * @param {Dialect} dialect
	 */
	var applyDialectalVariations = function(verb, pronouns, dialect){
		if(!dialect.none)
			purgeUnrequestedDialects.call(this, dialect);

		if(!dialect.northern && !dialect.western)
			applyStrongTheme.call(this, verb, dialect);

		if(verb.proComplementarPronouns.length)
			applyProComplementarPronouns.call(this, verb, pronouns);

		convertIntoDialect.call(this, dialect);
	};

	/**
	 * @param {Dialect} dialect
	 *
	 * @private
	 */
	var purgeUnrequestedDialects = function(dialect){
		var reDialect = new RegExp(dialect.main);
		visit(this, function(subParadigm){
			var found = false,
				k;
			for(k in subParadigm)
				if(k.match(reDialect)){
					found = !!subParadigm[k];
					break;
				}
			for(k in subParadigm)
				//if the given dialect is not found, then remove all the others except 'general', 'all', 'archaic', etc
				//otherwise retain only it
				if(!k.match(found? reDialect: /^general|all|archaic|first|second|third|singular|plural|regular/))
					delete subParadigm[k];
		});
	};

	/**
	 * @param {Verb} verb
	 * @param {Dialect} dialect
	 *
	 * @private
	 */
	var applyStrongTheme = function(verb, dialect){
		if(verb.irregularity.eser){
			var morpheme = (dialect.none? '(x)': 'x');
			visit(this.indicative.present.irregular, function(subParadigm, key){
				if(key.match(/^archaic/))
					subParadigm[key] = subParadigm[key].replace(/^(re)?()/, '$1' + morpheme);
			});
			morpheme = (dialect.none? '(x/j)': (dialect.centralNorthern || dialect.oriental? 'j': '[x/j]'));
			visit(this.indicative.imperfect.irregular, function(subParadigm, key){
				if(!key.match(/^northern/) || key.match(/^oriental/))
					subParadigm[key] = subParadigm[key].replace(/^(re)?()/, '$1' + morpheme);
			});
		}
		else if(verb.irregularity.aver){
			var morphemeProclitic = (dialect.none? '(g)': 'g'),
				morphemeEnclitic = (dialect.none? '(ge)': 'ge');
			visit(this, function(subParadigm, key, id){
				if(!key.match(/^(northern|oriental)/)){
					if(id.match(/^infinitive/) && verb.proComplementarPronouns[0] !== 'ge')
						subParadigm[key] = subParadigm[key] + morphemeEnclitic;
					else if(!id.match(/^(infinitive|participle)/))
						subParadigm[key] = subParadigm[key].replace(/^(re)?()/, '$1' + morphemeProclitic);
				}
			});
		}
	};

	/**
	 * @param {Verb} verb
	 * @param {Pronouns} pronouns
	 *
	 * @private
	 */
	var applyProComplementarPronouns = function(verb, pronouns){
		var isVerbReflexive = (verb.proComplementarPronouns[0] == 'se');
		visit(this, function(subParadigm, key, id){
			if(isVerbReflexive)
				verb.proComplementarPronouns[0] = pronouns.weak.reflexive[id.match(/[^.]+$/)[0]] || 'se';

			if(id.match(/^(infinitive|gerund)/) || !verb.irregularity.verb.match(/dever|eser|s?aver/) && id.match(/^imperative/))
				subParadigm[key] = subParadigm[key] + verb.proComplementarPronouns.join('');
			else if(!id.match(/^(imperative|participle)/))
				subParadigm[key] = verb.proComplementarPronouns.join(' ') + ' ' + subParadigm[key];
		});
	};

	/**
	 * @param {Dialect} dialect
	 *
	 * @private
	 */
	var convertIntoDialect = function(dialect){
		visit(this, function(subParadigm, key){
			subParadigm[key] = Orthography.convertDialect(subParadigm[key], dialect.dialect, false);
		});
	};

	/** @private */
	var visit = function(subParadigm, funct, id){
		for(var key in subParadigm)
			if(subParadigm.hasOwnProperty(key)){
				if(!ObjectHelper.isString(subParadigm[key]))
					visit(subParadigm[key], funct, (id? id + '.' + key: key));
				else
					funct(subParadigm, key, id);
			}
	};


	Constructor.prototype = {
		constructor: Constructor,

		generate: generate
	};


	return Constructor;

});
