/**
 * @class Paradigm
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/phonology/Orthography', 'tools/lang/phonology/PhonologyHelper', 'tools/data/ObjectHelper'], function(Word, Orthography, PhonologyHelper, ObjectHelper){

	/** @constant */
	var REGULAR = 'regular',
	/** @constant */
		IRREGULAR = 'irregular',
	/** @constant */
		PRONOMENAL_MARK = '#',
	/** @constant */
		PRONOMENAL_MARK_IMPERATIVE = '$';


	/**
	 * @param {Verb} verb
	 * @param {Object} themes generated by Themizer
	 */
	var generate = function(verb, themes){
		this.verb = verb;
		this.themes = themes;
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
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: ''),
				person;
			if(t.themeT8){
				person = root.firstSingular = {};
				if(this.verb.irregularity.eser)
					person.general = pronomenalMark + t.themeT8 + (!t.themeT8.match(/[cijɉñ]$/)? '(i)': '') + 'ón';
				else if(this.verb.irregularity.aver){
					person.general = pronomenalMark + t.themeT8.replace(/à$/, 'à/è');
					person.central_centralNorthern_lagunar_western = pronomenalMark + t.themeT8.replace(/à$/, 'ò');
				}
				else{
					person.general = pronomenalMark + t.themeT8 + 'e';
					person.central_centralNorthern_lagunar_western1 = pronomenalMark + t.themeT8 + 'o';
//					person.central_centralNorthern_lagunar_western2 = pronomenalMark + PhonologyHelper.finalConsonantVoicing(t.themeT8, 'northern');

					if(this.verb.irregularity.verb && type == IRREGULAR){
						if(this.verb.irregularity.saver)
							person.central_centralNorthern_lagunar_western3 = pronomenalMark + t.themeT8.replace(/à$/, 'ò');
						else
							person.central_centralNorthern_lagunar_western1 = pronomenalMark + t.themeT8 + (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'o';
					}
				}
				root.secondSingular = {
					general: pronomenalMark + t.themeT8.replace(/([^i])$/, '$1' + (!this.verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.themeT8.match(/à$/)? 'i': ''))
				};
				var third = t.themeT8 + (!this.verb.irregularity.verb.match(/darStarFar|s?aver/)? (this.verb.irregularity.eser? 'é': 'e'): '');
				root.third = {
					general: pronomenalMark + third,
//					northern_oriental: (third.match(/[ei]$/)? pronomenalMark + PhonologyHelper.finalConsonantVoicing(third.replace(/[ei]$/, ''), 'northern'): undefined),
//					archaic: (t.themeT10 && t.themeT10 !== third? pronomenalMark + t.themeT10.replace(/([ae])$/, '($1)'): undefined)
					archaic: (t.themeT10 && t.themeT10 !== third? pronomenalMark + t.themeT10: undefined)
				};
			}
			else if(t.themeT10){
//				var thirdNorthernOriental = PhonologyHelper.finalConsonantVoicing(t.themeT10.replace(/[ae]$/, ''), 'northern');
				root.third = {
					general: pronomenalMark + t.themeT10//,
//					northern_oriental: (t.themeT10 != thirdNorthernOriental? pronomenalMark + thirdNorthernOriental: undefined)
				};
			}
			if(t.themeT5)
				root.secondPlural = {
					general: pronomenalMark + t.themeT5,
					northern_oriental: (conj != 2 && t.themeT12? pronomenalMark + t.themeT12 + 'é': undefined),
					central_western: (conj == 2? pronomenalMark + t.themeT5.replace(/i?é$/, 'í'): undefined)
				};
			if(t.themeT12 || t.themeT5){
				person = root.firstPlural = {};
				if(t.themeT12){
					person.northern = pronomenalMark + t.themeT12 + 'ón';
					person.oriental = pronomenalMark + t.themeT12 + 'én';
				}
				if(t.themeT5){
					person.general = root.secondPlural.general.replace(/è$/, 'é') + 'mo';
					person.central_western = (root.secondPlural.central_western? root.secondPlural.central_western + 'mo': undefined);
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/)){
				root = namespace(this.paradigm, 'indicative', 'present', IRREGULAR);
				root.firstSingular || (root.firstSingular = {});
				root.firstSingular.central_centralNorthern_lagunar_western = pronomenalMark + t.themeT8.replace(/[lx]?$/, 'go');
			}
		}
	};

	/** @private */
	var generateIndicativeImperfect = function(type, t){
		if(t.themeT2 || t.themeT11){
			var root = namespace(this.paradigm, 'indicative', 'imperfect', type),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			if(t.themeT2){
				var tmp = pronomenalMark + t.themeT2 + (this.verb.irregularity.eser? 'r': '(v)');
				root.firstSingular = {
					general: tmp + 'a',
					northern_oriental: tmp + 'e',
					central: tmp + 'o'
				};
				root.secondPlural = {
					general: tmp + 'i',
					archaic: tmp + 'a'
				};
				root.secondSingular = {
					general: tmp + 'i'
				};
				root.third = {
					general: tmp + 'a'
				};
			}
			var person = root.secondPlural = (root.secondPlural || {});
			if(t.themeT11)
				person.northern = pronomenalMark + t.themeT11 + '(iv)ié';
			person = root.firstPlural = {};
			if(t.themeT2)
				person.general = root.secondPlural.general + 'mo';
			if(t.themeT11){
				person.northern1 = pronomenalMark + t.themeT11 + (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'ón(se)';
				person.northern2 = pronomenalMark + t.themeT11 + 'iv(i)ón(se)';
				person.oriental = pronomenalMark + t.themeT11 + '(iv)én(se)';
			}
		}
	};

	/** @private */
	var generateIndicativeFuture = function(type, t){
		if(t.themeT4){
			var root = namespace(this.paradigm, 'indicative', 'future', type),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: ''),
				firstPlural = pronomenalMark + t.themeT4 + 'r';
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
			var root = namespace(this.paradigm, 'subjunctive', 'present', type),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			if(t.themeT8){
				root.firstSingular = {
					general: pronomenalMark + t.themeT8 + 'a',
					northern_oriental: pronomenalMark + t.themeT8 + 'e'
				};
				root.secondSingular = {
					general: pronomenalMark + t.themeT8.replace(/([^i])$/, '$1i')
				};
				root.third = {
					general: pronomenalMark + t.themeT8 + 'a',
					northern_oriental1: pronomenalMark + t.themeT8 + 'e'//,
//					northern_oriental2: (t.themeT8.match(/[^aeiouàèéíòóú]$/)? pronomenalMark + PhonologyHelper.finalConsonantVoicing(t.themeT8, 'northern'): undefined)
				};

				if(type == IRREGULAR && !this.verb.irregularity.verb.match(/(aver|dever|eser)/)){
					root.firstSingular.general = pronomenalMark + t.themeT8 + (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'a';
					root.secondSingular.general = pronomenalMark + (t.themeT8.match(/[aeiouàèéíòóú]$/)? t.themeT8 + '(g)i': t.themeT8.replace(/([^i])$/, '$1i'));
					root.third.general = pronomenalMark + t.themeT8 + (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'a';
				}
			}
			if(t.themeT5)
				root.secondPlural = {
					general: pronomenalMark + t.themeT5,
					centralNorthern: (conj != 2? pronomenalMark + t.themeT5.replace(/[èí]$/, 'é'): undefined),
					central_western: (conj == 2 && t.themeT5.replace(/i?é$/, 'í') != t.themeT5? pronomenalMark + t.themeT5.replace(/i?é$/, 'í'): undefined),
					northern_oriental1: (t.themeT12? pronomenalMark + t.themeT12 + (this.verb.special3rd? '(i)': '') + 'é(de/ge)': undefined),
					northern_oriental2: (conj == 3 && !this.verb.special3rd? pronomenalMark + t.themeT5 + '(de/ge)': undefined)
				};
			if(t.themeT12 || t.themeT5){
				var person = root.firstPlural = {};
				if(t.themeT12){
					person.northern = pronomenalMark + t.themeT12 + (!t.themeT12.match(/[cijɉñ]$/)? '(i)': '') + 'ón(e)';
					person.oriental = pronomenalMark + t.themeT12 + 'én(e)';
				}
				if(t.themeT5){
					person.general = root.secondPlural.general.replace(/è$/, 'é') + 'mo';
					person.central_western = (root.secondPlural.central_western? root.secondPlural.central_western + 'mo': undefined);
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/)){
				root = namespace(this.paradigm, 'subjunctive', 'present', IRREGULAR);
				root.firstSingular || (root.firstSingular = {});
				root.secondSingular || (root.secondSingular = {});
				root.third || (root.third = {});
				root.firstSingular.central_centralNorthern_lagunar_western = pronomenalMark + t.themeT8.replace(/[lx]?$/, 'ga');
				root.secondSingular.general = pronomenalMark + t.themeT8.replace(/[lx]?$/, 'gi');
				root.third.general = pronomenalMark + t.themeT8.replace(/[lx]?$/, 'ga');
			}
		}
	};

	/** @private */
	var generateSubjunctiveImperfect = function(type, t){
		t = t.subjunctive || t;

		if(t.themeT2 || t.themeT11){
			var root = namespace(this.paradigm, 'subjunctive', 'imperfect', type),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			if(t.themeT2){
				var tmp = pronomenalMark + t.themeT2 + 's';
				root.firstSingular = {
					general: tmp + 'e'
				};
				root.secondPlural = {
					general: tmp + 'i',
					archaic: tmp + 'e',
					northern: (t.themeT11? pronomenalMark + t.themeT11 + '(is)ié(de/ge)': undefined)
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
				person.northern1 = pronomenalMark + t.themeT11 + (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'ón(e/se)';
				person.northern2 = pronomenalMark + t.themeT11 + 'is(i)ón(e/se)';
				person.oriental = pronomenalMark + t.themeT11 + '(is)én(e/se)';
			}
		}
	};

	/** @private */
	var generateConditionalSimple = function(type, t){
		if(t.themeT4){
			var root = namespace(this.paradigm, 'conditional', 'simple', type),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: ''),
				tmp = pronomenalMark + t.themeT4 + 'rí',
				firstPlural = pronomenalMark + t.themeT4 + 'r(is)';
			root.firstSingular = {
				general: tmp + 'a',
				northern_oriental: tmp + 'e'
			};
			root.secondPlural = {
				general: pronomenalMark + t.themeT4 + 'rési',
				northern: pronomenalMark + t.themeT4 + 'r(is)ié'
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
			root.archaic = pronomenalMark + t.themeT4 + 'rà(v)e';
		}
	};

	/** @private */
	var generateImperativePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);

		if(t.themeT5 || t.themeT9){
			var root = namespace(this.paradigm, 'imperative', 'present', type),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			if(t.themeT9)
				root.secondSingular = {
					general: pronomenalMark + t.themeT9 + PRONOMENAL_MARK_IMPERATIVE
				};
			if(t.themeT5)
				root.secondPlural = {
					general: pronomenalMark + t.themeT5 + PRONOMENAL_MARK_IMPERATIVE,
					northern_oriental: (conj != 2? pronomenalMark + t.themeT5.replace(/[èí]$/, 'é') + PRONOMENAL_MARK_IMPERATIVE: undefined),
					central_western: (conj == 2? pronomenalMark + t.themeT5.replace(/i?é$/, 'í') + PRONOMENAL_MARK_IMPERATIVE: undefined)
				};
		}
	};

	/** @private */
	var generateInfinitiveSimple = function(type, t){
		if(t.themeT1){
			var root = namespace(this.paradigm, 'infinitive', 'simple', type),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			root.all1 = t.themeT1 + 'r' + pronomenalMark;
			root.all2 = t.themeT1 + 're';
		}
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
					singularMasculine1: t.themeT6,
					singularMasculine2: t.themeT6 + '(d)o',
					pluralMasculine: t.themeT6 + '(d)i',
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
			if(strong){
				var root = namespace(this.paradigm, 'participle', 'perfect', IRREGULAR, 'strong');
				root.general = generateEntireDeclination(strong);

//				if(strong.match(/[^aeiouàèéíòóú]$/))
//					root.general.singularMasculine2 = PhonologyHelper.finalConsonantVoicing(strong, 'northern');
			}
		}
	};

	/** @private */
	var generateGerundSimple = function(type, t){
		if(t.themeT2 || t.themeT7){
			var person = namespace(this.paradigm, 'gerund', 'simple', type, 'all'),
				pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			if(t.themeT2)
				person.regular1 = t.themeT2 + 'ndo' + pronomenalMark;
			if(t.themeT7)
				person.regular2 = (this.verb.conjugation == 3? t.themeT7 + 'ndo' + pronomenalMark: undefined);
			if(this.verb.irregularity.eser)
				person.archaic = (this.verb.infinitive.substr(0, this.verb.infinitive.length - 'èser'.length)) + 'siàndo' + pronomenalMark;
			else if(this.verb.irregularity.aver)
				person.archaic = (this.verb.infinitive.substr(0, this.verb.infinitive.length - 'aver'.length)) + 'abiàndo' + pronomenalMark;
		}
	};

	/** @private */
	var generateParticiplePerfectStrong = (function(){
		var strong = [
			//1st conjugation
			[
				{matcher: /fà$/, replacement: 'fàt'},
				{matcher: /kóns$/, replacement: 'kóns'},
				{matcher: /súg$/, replacement: 'sút'},
				{matcher: /tr$/, replacement: 'tràt'}
			],

			//2nd conjugation
			[
				//rhizotonic
				[
					{matcher: /trà$/, replacement: 'tràt'},
					{matcher: /piàx$/, replacement: 'piàs'},
					{matcher: /dúx$/, replacement: 'dót'},
					{matcher: /spàrx$/, replacement: 'spàrs'},
					{matcher: /strén[đx]$/, replacement: 'strét'},
					{matcher: /([rn])[đx]$/, replacement: '$1t'},
					{matcher: /lè[đx]$/, replacement: 'lèt'},
					{matcher: /frí[đx]$/, replacement: 'frít'},
					{matcher: /([aeiouàèéíòóúl])x$/, replacement: '$1t'},
					{matcher: /rd$/, replacement: 'rs'},
					{matcher: /pànd$/, replacement: 'pànt'},
					{matcher: /kónd$/, replacement: 'kónt'},
					{matcher: /fónd$/, replacement: 'fúx'},
					{matcher: /pónd$/, replacement: 'póst'},
					{matcher: /nd$/, replacement: 'x'},
					{matcher: /véd$/, replacement: 'víst'},
					{matcher: /([csŧ])éd$/, replacement: '$1ès'},
					{matcher: /([aeiouàèéíòóúnl])d$/, replacement: '$1x'},
					{matcher: /([^s])t$/, replacement: '$1s'},
					{matcher: /lv$/, replacement: 'lt'},
					{matcher: /m([òó])v$/, replacement: 'm$1s'},
					{matcher: /skrív$/, replacement: 'skrít'},
					{matcher: /ím$/, replacement: 'ént'},
					{matcher: /úm$/, replacement: 'únt'},
					{matcher: /prím$/, replacement: 'près'},
					{matcher: /espèl$/, replacement: 'espúls'},
					{matcher: /kòj$/, replacement: 'kòlt'},
					{matcher: /kór$/, replacement: 'kórs'},
					{matcher: /íɉ$/, replacement: 'àt'},
					{matcher: /nàs$/, replacement: 'nàt'},
					{matcher: /n[sŧ]$/, replacement: 'nt'},
					{matcher: /pón$/, replacement: 'pòst'},
					{matcher: /romàñ$/, replacement: 'romàx'},
					{matcher: /rónp$/, replacement: 'rót'},
					{matcher: /stíngu$/, replacement: 'stínt'}
				],
				//rhizoatone
				[
					{matcher: /sól$/, replacement: 'sólit'},
					{matcher: /vàl$/, replacement: 'vàls'},
					//(per|re)maner
					{matcher: /n$/, replacement: 'x'},
					//{matcher: /n$/, replacement: 'st'},
					{matcher: /r$/, replacement: 'rs'},
					{matcher: /tòl$/, replacement: 'tòlt'}
				]
			],

			//3rd conjugation
			[
				{matcher: /mòr$/, falsePositives: /(inti|mar)mòr$/, replacement: 'mòrt'},
				{matcher: /([^aeiouàèéíòóú])r$/, falsePositives: /(mòr|núdr)$/, replacement: '$1èrt'},
				{matcher: /sepel$/, replacement: 'sepólt'},
				{matcher: /fér$/, replacement: 'fèrt'},
				{matcher: /([aeiouàèéíòóú])r$/, replacement: '$1rs'}
			]
		];

		return function(themeT8){
			var data = strong[this.verb.conjugation - 1];
			if(this.verb.conjugation == 2)
				data = data[this.verb.rhizotonic? 0: 1];

			var m, match;
			themeT8 = themeT8.replace(/\(.+\)/, '');
			if(data.some(function(el){ m = el; match = themeT8.match(el.matcher); return match; })
					&& (!m.falsePositives || !themeT8.match(m.falsePositives))){
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
	var applyDialectalVariations = function(verb, pronouns, dialect, markPronomenalForms){
		if(!dialect.none)
			purgeUnrequestedDialects.call(this, dialect);

		if(!dialect.northern && !dialect.western)
			applyStrongTheme.call(this, verb, dialect);

		if(verb.proComplementarPronouns.length)
			applyProComplementarPronouns.call(this, verb, pronouns);
		else if(!markPronomenalForms)
			visit(this, function(subParadigm, key){
				subParadigm[key] = subParadigm[key].replace(/[#$]/, '');
			});

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
				if(!k.match(found? reDialect: /^(general|all|archaic|first|second|third|singular|plural|regular)/))
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
					subParadigm[key] = subParadigm[key].replace(/^#(re)?/, '$1' + morpheme);
			});
			morpheme = (dialect.none? '(x/j)': (dialect.centralNorthern || dialect.oriental? 'j': '[x/j]'));
			visit(this.indicative.imperfect.irregular, function(subParadigm, key){
				if(!key.match(/^northern/) || key.match(/oriental/))
					subParadigm[key] = subParadigm[key].replace(/^#(re)?/, '$1' + morpheme);
			});
		}
		else if(verb.irregularity.aver){
			var morphemeProclitic = (dialect.none? '(g)': 'g'),
				morphemeEnclitic = (dialect.none? '(ge)': 'ge');
			visit(this, function(subParadigm, key){
				if(!key.match(/^(northern|oriental)/))
					subParadigm[key] = subParadigm[key]
						.replace(/^#(re)?/, '$1' + morphemeProclitic)
						.replace(/#$/, morphemeEnclitic);
			});
		}

		visit(this, function(subParadigm, key){
			subParadigm[key] = subParadigm[key].replace(/\$$/, '');
		});
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

			subParadigm[key] = subParadigm[key]
				.replace(/^#/, verb.proComplementarPronouns.join(' ') + ' ')
				.replace(/#$/, verb.proComplementarPronouns.join(''))
				.replace(/\$$/, '');
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
	var visit = function(obj, funct, id){
		for(var key in obj)
			if(obj.hasOwnProperty(key)){
				if(!ObjectHelper.isString(obj[key]))
					visit(obj[key], funct, (id? id + '.' + key: key));
				else
					funct(obj, key, id);
			}
	};


	return {
		PRONOMENAL_MARK: PRONOMENAL_MARK,
		PRONOMENAL_MARK_IMPERATIVE: PRONOMENAL_MARK_IMPERATIVE,

		generate: generate
	};

});
