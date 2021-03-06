/**
 * @class Themizer
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/data/StringHelper', 'tools/lang/phonology/Hyphenator', 'tools/lang/phonology/hyphenatorPatterns/vec'], function(Word, StringHelper, Hyphenator, pattern_vec){

	/**
	 * @param {Verb} verb
	 * @param {Dialect} dialect
	 */
	var generate = function(verb, dialect){
		this.verb = verb;
		this.dialect = dialect;
		this.themes = {
			regular: {},
			irregular: {}
		};

		this.themes.regular = generateRegularThemes.call(this, verb);

		if(this.verb.irregular)
			this.themes.irregular = generateIrregularThemes.call(this);

		return this.themes;
	};

	var generateRegularThemes = function(verb){
		this.verb = verb;

		//T1
		var themeT1 = this.verb.infinitive.replace(/.$/, '');

		//T4 = T1: no stress
		var themeT4 = Word.suppressStress(themeT1);

		//T2 = T1: stress PTV > TV
		var themeT2 = themeT4.replace(/.$/, Word.addStressAcute);

		//T3 = T1: stress TV > (A)PTV | í > <ís>i
		var themeT3 = themeT1;
		if(this.verb.semiSpecial3rd)
			themeT3 = themeT1.replace(/í$/, '(ís)i');
		else if(this.verb.special3rd)
			themeT3 += 'si';
		else{
			var syllabationT4 = syllabateThemeT4(themeT4),
				idx = getIndexOfStressThemeT3.call(this, themeT1, syllabationT4);
			if(idx >= 0)
				themeT3 = StringHelper.setCharacterAt(themeT4, idx, Word[themeT4[idx].match(/[eo]/) && hasGraveStress(themeT4, syllabationT4, idx)? 'addStressGrave': 'addStressAcute']);
		}

		//T8 = T3: TV > ∅
		var themeT8 = themeT3.replace(/.$/, '');

		return {
			themeT1: themeT1,
			themeT2: themeT2,
			themeT3: themeT3,
			themeT4: themeT4,
			//T5 = T2: à > è/(é) | (é > í) | (í no -is- > é)
			themeT5: themeT2.replace(/à$/, 'è'),
			//T6 = T2: é > ú
			themeT6: themeT2.replace(/u?é$/, 'ú').replace(/asolvú/, 'asol(v)ú'),
			//T7 = T2: í > é
			themeT7: themeT2.replace(/í$/, 'é'),
			themeT8: themeT8,
			//T9 = T3: e > i
			themeT9: themeT3.replace(/e$/, 'i'),
			//T10 = T3: i > e
			themeT10: themeT3.replace(/i$/, 'e'),
			//T11 = T4: TV > ∅
			themeT11: themeT4.replace(/i?[aei]$/, ''),
			//T12 = T8: no stress
			themeT12: Word.suppressStress(themeT8)
		};
	};

	var generateIrregularThemes = (function(){
		var irregular = {
			andar: function(t){
				var themeX5 = t.themeT5.replace(/andè$/, 'vè'),
					themeX8 = t.themeT3.replace(/ànda$/, 'và'),
					themeX12 = t.themeT12.replace(/and$/, 'v');

				return {
					themeT5: themeX5,
					themeT8: themeX8,
					themeT9: themeX8,
					themeT10: themeX8,
					themeT12: themeX12,

					subjunctive: {
						themeT5: themeX5,
						themeT8: themeX8,
						themeT12: themeX12
					}
				};
			},

			darStarFar: function(t){
				var themeX8 = t.themeT3;

				//erase phonologically unacceptable themes
				t.themeT8 = undefined;
				//duplicated by X8
				t.themeT10 = undefined;

				return {
					themeT8: themeX8,

					subjunctive: {
						themeT8: themeX8
					}
				};
			},

			eser: function(t){
				var themeX5 = t.themeT5.replace(/esé$/, 'sé'),
					themeX5subj = t.themeT5.replace(/esé$/, 'sipié'),
					themeX6 = t.themeT6.replace(/esú$/, 'stà'),
					themeX8 = t.themeT8.replace(/ès$/, 's'),
					themeX8subj = t.themeT8.replace(/ès$/, 'sípi'),
					themeX9 = t.themeT9.replace(/èsi$/, 'sí'),
					themeX10 = t.themeT10.replace(/èse$/, 'é'),
					themeX12 = t.themeT12.replace(/es$/, 's'),
					themeX12subj = t.themeT12.replace(/es$/, 'sipi');

				//erase phonologically unacceptable themes
				t.themeT5 = undefined;
				t.themeT8 = undefined;
				t.themeT9 = undefined;
				t.themeT10 = undefined;
				t.themeT12 = undefined;

				return {
					themeT2: t.themeT2.replace(/esé$/, 'è'),
					themeT4: t.themeT4.replace(/ese$/, 'se'),
					themeT5: themeX5,
					themeT6: themeX6,
					themeT8: themeX8,
					themeT9: themeX9,
					themeT10: themeX10,
					themeT11: t.themeT11.replace(/es$/, 'er'),
					themeT12: themeX12,

					subjunctive: {
						themeT2: t.themeT2.replace(/esé$/, 'fú'),
						themeT4: t.themeT4.replace(/ese$/, 'fu'),
						themeT5: themeX5subj,
						themeT8: themeX8subj,
						themeT11: t.themeT11.replace(/es$/, 'fus'),
						themeT12: themeX12subj
					},

					participlePerfect: {
						themeT2: themeX6,
						themeT6: themeX6
					}
				};
			},

			averSaver: function(t){
				var themeX8 = t.themeT3.replace(/v?e$/, ''),
					themeX8subj = t.themeT8.replace(/v?$/, 'pi');

				//erase phonologically unacceptable themes
				t.themeT8 = undefined;
				t.themeT9 = undefined;
				t.themeT10 = undefined;

				return {
					themeT8: themeX8,
					themeT9: themeX8,
					themeT10: themeX8,

					subjunctive: {
						themeT5: t.themeT5.replace(/v?é$/, 'piè'),
						themeT8: themeX8subj,
						themeT12: t.themeT12.replace(/v?$/, 'pi')
					}
				};
			},

			traer: function(t){
				var themeX9 = t.themeT3.replace(/e$/, '');

				return {
					themeT1: t.themeT1.replace(/e$/, ''),
					//NOTE: prepare for syncope of 'de' before vibrant (indicative future and conditional simple only)
					themeT4: t.themeT4.replace(/e$/, ''),
					themeT5: t.themeT5.replace(/aé$/, 'è'),
					themeT9: themeX9,
					themeT10: themeX9,
					themeT12: t.themeT12.replace(/a$/, ''),

					subjunctive: {
						themeT4: undefined,
						themeT5: undefined
					}
				};
			},

			dever: function(t){
				return {
					subjunctive: {
						themeT5: t.themeT5.replace(/vé$/, 'biè'),
						themeT8: t.themeT8.replace(/v$/, 'bi'),
						themeT12: t.themeT12.replace(/v$/, 'bi')
					}
				};
			},

			dixer: function(t){
				return {
					themeT1: t.themeT1.replace(/xe$/, ''),
					//NOTE: prepare for syncope of 'xe' before vibrant (indicative future and conditional simple only)
					themeT4: t.themeT4.replace(/xe$/, ''),

					subjunctive: {
						themeT4: undefined
					}
				};
			},

			poder: function(t){
				return {
					//NOTE: prepare for syncope of 'de' before vibrant (indicative future and conditional simple only)
					themeT4: t.themeT4.replace(/d?e$/, ''),
					themeT10: t.themeT3.replace(/d?e$/, 'le'),

					subjunctive: {
						themeT5: undefined
					}
				};
			},

			toler: function(t){
				return {
					themeT1: t.themeT1.replace(/to[lƚ]é$/, 'tò'),
					themeT4: t.themeT4.replace(/[lƚ]e$/, ''),

					subjunctive: {
						themeT5: undefined
					}
				};
			},

			viver: function(t){
				var themeX6 = t.themeT6.replace(/vú$/, 'sú');

				return {
					participlePerfect: {
						themeT6: themeX6
					}
				};
			},

			voler: function(t){
				var themeX6 = t.themeT6.replace(/[lƚ]ú$/, 'sú');

				return {
					themeT4: t.themeT4.replace(/[lƚ]e$/, ''),
					themeT6: themeX6,

					subjunctive: {
						themeT5: undefined
					},

					participlePerfect: {
						themeT6: themeX6
					}
				};
			},

			enher: function(t, dialect){
				var themeX9 = t.themeT3.replace(/[èé]ñe$/, (dialect.none? '(i)': (!dialect.western? 'i': '')) + t.themeT3.substr(-3, 1) + 'n');

				return {
					themeT9: themeX9,
					themeT10: themeX9
				};
			}
		};


		return function(){
			return irregular[this.verb.irregularity.verb.match(/s?aver/)? 'averSaver': this.verb.irregularity.verb](this.themes.regular, this.dialect);
		};
	})();


	/** @private */
	var syllabateThemeT4 = (function(){
		var trueHyatuses = [
			{matcher: /auspika$/, replacement: 'àuspika'},
			{matcher: /autora$/, replacement: 'àutora'},
			{matcher: /(fr|[lƚ])auda$/, replacement: '$1àuda'},
			{matcher: /([lƚ])aurea$/, replacement: '$1àurea'},
			{matcher: /naufraga$/, replacement: 'nàufraga'},
			{matcher: /nauxea$/, replacement: 'nàuxea'},
			{matcher: /paupera$/, replacement: 'pàupera'},
			{matcher: /(in|re)staura$/, replacement: '$1stàura'},

			{matcher: /([psŧv])io([lƚ])a$/, replacement: '$1ío$2a'},
			{matcher: /perioda/, replacement: 'períoda'},

			{matcher: /(^(in)?g|([fg])r|(stra)?s)ua$/, replacement: '$1úa'},

			{matcher: /((ar|[ei]n)f|^(dex)?n|([kp]|st)r|^s|(de|in|x)v)ia$/, replacement: '$1ía'}
		];
		var hyphenator = new Hyphenator(pattern_vec);

		return function(themeT4){
			//infer stress position
			var m;
			if(trueHyatuses.some(function(el){ m = el; return this.match(el.matcher); }, themeT4))
				themeT4 = themeT4.replace(m.matcher, m.replacement);

			return hyphenator.hyphenate(themeT4);
		};
	})();

	/** @private */
	var getIndexOfStressThemeT3 = (function(){
		//note for latin: bisyllabe and trisyllabe with long penultimate syllabe > parossitone, trisyllabe with short penultimate syllabe > proparossitone
		//short vowel + CC(C) > long by position, but short vowel + occlusive + r > short (stress tend to backtrack, as in ÍNTĔGRUM > íntegro)
		var stressIndices = [
			/^(aé|abd([ei]g|ik)à|abità|abrogà|aerà|agorà|a[lr]b[eo]rà|al[dv]egà|alt[ae]rà|anemà|ankorà|ansimà|apl([ei]g|ik)à|a[lr]bitrà|ar[dđx][ae][nr]à|ar[dđx]i[nñ]à|augurà|ausp([ei]g|ik)à|autorà|axenà|axità|axo[lƚ]à|a[sŧ]idà|edukà|emu[lƚ]à|[ae]rpegà|evokà|exekrà|e[ŧtx]ità|exu[lƚ]à|ibridà|inpl([ei]g|ik)à|inputà|inrità|insu[lƚ]à|integrà|in[sŧ]ità|irità|it[ae]rà|ixo[lƚ]à|obl[ei]gà|oke[lƚ]à|okupà|ondu[lƚ]à|onfegà|onto[lƚ]à|op[ae]rà|orbegà|ordenà|ospità|ostregà|otimà|ub([ei]g|ik)à|uke[lƚ]à|ultimà|u[lƚ]u[lƚ]à|ustegà|uño[lƚ]à|uxità)$/,
			/^(ba[gt]o[lƚ]à|ba[lƚ]egà|balsamà|barikà|bearà|beko[lƚ]à|betegà|bev[ae]rà|beà|bigo[lƚ]à|bindo[lƚ]à|bisko[lƚ]à|bixegà|bo[lƚ]egà|bolsegà|bo[sŧ]o[lƚ]à|bu[lƚ][ei]gà|bu[dđx][ae]rà|cac[ae]rà|c[ae]ko[lƚ]à|ce[lƚ][ae]rà|ceregà|cetarà|cico[lƚ]à|ci[jɉ]arà|cuco[lƚ]à|cipegà|ded([ei]g|ik)à|de[lƚ]egà|ded([ei]g|ik)à|deputà|derogà|desputà|destenà|dexinà|de[sŧ]i[mp]à|dindo[lƚ]à|disipà|domenà|dop[ae]rà|dubità|dulkorà|dupl([ei]g|ik)à|[đdx]oà|[đdx]akolà|xakoƚà|fabr([ei]g|ik)à|fanfanà|femenà|fev[ae]rà|fifo[lƚ]à|fod[ae]rà|folgorà|formo[lƚ]à|fornegà|fulm[ei]nà|fu[mr]([ei]g|ik)à|fustegà|fuxo[lƚ]à|ga[dđx]egà|ganb[ae]rà|ga[dđx]arà|ga[dđx]egà|godegà|gomità|gon[dg]o[lƚ]à|guà|[jɉ]egomà|[jɉ]o[sŧ]o[lƚ]à|[jɉ]ud([ei]g|ik)à|kaba[lƚ]à|kadukà|ka[lƚ]ibrà|ka[lƚ]igà|kalkarà|kalko[lƚ]à|kal[sŧ]erà|kandidà|kanforà|kanpanà|kapità|karo[lƚ]à|kar[sŧ]erà|kasegà|kauxà|ko[gk]o[lƚ]à|ko[lƚ]egà|ko[lƚ]okà|komodà|konfutà|koniugà|konpl([ei]g|ik)à|konpl([ei]g|ik)à|konvokà|koà|kortegà|kosp[ae]rà|kumu[lƚ]à|ku[fsŧ]o[lƚ]à|[lƚ]agremà|[lƚ]apidà|[lƚ]audà|[lƚ]aureà|[lƚ]et[ae]rà|[lƚ]exenà|[lƚ]ib[ae]rà|[lƚ]ikuidà|[lƚ]imegà|[lƚ]imità|[lƚ]isegà|[lƚ]itigà|[lƚ]ogorà|[lƚ]uminà|ma[dđx]egà|makinà|malga[mn]à|malmenà|mando[lƚ]à|mane[dg]à|mante[dđgkx]à|man[sŧ]ipà|marxinà|maskabà|mask[ae]rà|m[ae]st([ei]g|ik)à|ma[sŧ]añà|max[ae]rà|maxe[gn]à|ma[sŧ]ipà|med([ei]g|ik)à|m[ae]r[ei]tà|mi[lƚ]ità|maku[lƚ]à|mitigà|modu[lƚ]à|mo[km]o[lƚ]à|mont([ei]g|ik)à|morbinà|mormo[lƚr]à|mors([ei]g|ik)à|mu[cd]arà|mutegà|muti[lƚ]à|m[ou]xegà|muxo[lƚ]à|muà|mu[ñsŧ]egà|nanarà|naufragà|nauxeà|navegà|neve[gr]à|ninegà|nino[lƚ]à|nià|nodrigà|nomenà|n[ou]à|noto[lƚ]à|numerà|nuvo[lƚ]à|ñao[lƚ]à|pacarà|palpi[ae]rà|pa[cp]o[lƚ]à|pasko[lƚ]à|patinà|pauxà|pendo[lƚ]à|penetrà|pe[np]o[lƚ]à|p[ae]rmutà|p[ae]rorà|p[ae]rpetrà|pe[rs]t([ei]g|ik)à|pesegà|pesto[lƚ]à|petenà|peto[lƚ]à|pev[ae]rà|pià|piko[lƚ]à|pindo[lƚ]à|pio[lƚ]à|pispo[lƚ]à|pixo[lƚ]à|pi[sŧ]([ei]g|ik)à|pi[rsŧ]o[lƚ]à|pomegà|pomo[lƚ]à|polverà|ponto[lƚ]à|po[pv]o[lƚ]à|poé|publ([ei]g|ik)à|rako[lƚ]à|ran[pt]([ei]g|ik)à|ranto[lƚ]à|ra[dp]([ei]g|ik)à|redità|re[cfg]o[lƚ]à|regonà|reklutà|re[lƚ]egà|rep[lr]([ei]g|ik)à|reputà|revokà|rexe[gk]à|re[sŧ]ità|rix([ei]g|ik)à|ri[gsŧ]?o[lƚ]à|rodo[lƚ]à|roegà|ronko[lƚ]à|ron[sŧ]egà|ro[pvx]egà|roà|rubr([ei]g|ik)à|rugo[lƚ]à|rumegà|ruminà|ruà|saba[dlƚ]à|sabo[lƚ]à|sagomà|sangonà|sanguenà|saé|sedo[lƚ]à|segregà|se[gk]uità|seità|s[eu]menà|se[ms]o[lƚ]à|seo[lƚ]à|sevità|sibi[lƚ]à|siegà|sifo[lƚ]à|sim[ou][lƚ]à|sind[ai]kà|sinkopà|si[sx]o[lƚ]à|sià|sofegà|solfarà|sup[ae]rà|supl([ei]g|ik)à|suporà|susità|suà|tabu[lƚ]à|tako[lƚ]à|tanbarà|tardigà|teà|tenp[ae]rà|t[ae]rm[ei]nà|tinpanà|titubà|to[lƚ][ae]rà|ton[bf]o[lƚ]à|t[ou]rb[ou][lƚ]à|torigà|torko[lƚ]à|tos([ei]g|ik)à|turbinà|tuà|[sŧ]eko[lƚ]à|[sŧ]e[lƚ][ae]rà|va[lƚ]idà|va[lƚ]utà|veà|vedovà|v[ei]nd([ei]g|ik)à|v[ae]rgo[lƚ]à|vexetà|ve[jɉ]età|vento[lƚ]à|vermenà|videgà|vidimà|vinko[lƚ]à|vio[lƚ]à|vixi[lƚt]à|volto[lƚ]à|vomità|vuln[ae]rà|xao[lƚ]à|xemenà|[dđx]ud([ei]g|ik)à|[sŧ]ufo[lƚ]à|ñiño[lƚ]à|ñoko[lƚ]à|[dđx]en[ae]rà|[dđx][ou]go[lƚ]à|[sŧ]ainà|[sŧ]a[kp]o[lƚ]à|[sŧ]apegà|[sŧ]e[lƚ]ebrà|[sŧ]i[fgkm]?o[lƚ]à|[sŧ]iferà|[sŧ]imegà|[sŧ]irko[lƚ]à|[sŧ]oko[lƚ]à|[sŧ]o[pt]egà|[sŧ]ukarà|[sŧ]uko[lƚ]à|[sŧ]upegà|[jɉ]o[sŧ]o[lƚ]à|[jɉx]ubi[lƚ]à|[jɉx]ugu[lƚ]à|xixo[lƚ]à)$/,
			/^(reaé|abi[lƚ]ità|a[lƚ]eà|amutinà|api[sŧ]o[lƚ]à|apokopà|apostrofà|asid[ae]rà|asimi[lƚ]à|axevo[lƚ]à|axeà|a[sŧ]e[lƚ][ae]rà|in(augurà|ikuità)|biaxemà|blat[ae]rà|brago[lƚ]à|bramegà|bra[sŧ]o[lƚ]à|brisko[lƚ]à|broko[lƚ]à|bron[bdt]o[lƚ]à|broxemà|broà|bru[lƚ]([ei]g|ik)à|brusketà|bruskinà|brusto[lƚ]à|dia[lƚ]ogà|(edi|tra)f([ei]g|ik)à|e[lƚ]iminà|epi[lƚ]ogà|erad([ei]g|ik)à|e[sŧ]e[sŧ]ionà|exam[ei]nà|exasp[ae]rà|exautorà|exa[jɉ][ae]rà|ex[ae]r[sŧ]ità|exon[ae]rà|fievarà|fio[sŧ]inà|frab([ei]g|ik)à|frapo[lƚ]à|fraudà|fredo[lƚ]à|frego[lƚ]à|fritegà|frito[lƚ]à|fruà|fruño[lƚ]à|globo[lƚ]à|glutinà|gramo[lƚ]à|grandenà|greto[lƚ]à|grongo[lƚ]à|gruà|guindo[lƚ]à|i[lƚ]uminà|imaxinà|ina[lr]b[eo]rà|inamidà|inan[dđx]o[lƚ]à|inarpe[dđx]à|inar[dđx][ae]rà|inaxo[lƚ]à|ina[sŧ]idà|inedukà|inoku[lƚ]à|iri[sŧ]o[lƚ]à|koabità|koordenà|kre[kp]o[lƚ]à|krexemà|kreà|kriko[lƚ]à|krit([ei]g|ik)à|krià|kroko[lƚ]à|krostenà|krosto[lƚ]à|kroà|omo[lƚ]ogà|ori[dđx]enà|osixenà|otenp[ae]rà|piato[lƚ]à|platinà|pla[sŧ]ità|prat([ei]g|ik)à|pred([ei]g|ik)à|prià|prod[ei]gà|prorogà|prosimà|prosp[ae]rà|provokà|proà|reanemà|reintegrà|reit[ae]rà|scikarà|sfode[gr]à|sfogonà|sfo[jɉ]o[lƚ]à|sforbe[dđx]à|sfulminà|sfumegà|sfuregà|siop[ae]rà|skalmanà|skalpo[lƚ]à|skanpanà|skap?o[lƚ]à|skarpe[dđx]à|skasegà|skito[lƚ]à|skodegà|skoo[lƚ]à|skorporà|skort([ei]g|ik)à|sko[tv]o[lƚ]à|skoà|spacarà|spanpanà|spantegà|spa[pt]o[lƚ]à|spaxemà|speku[lƚ]à|spe[lƚ]egà|sp[ae]rt([ei]g|ik)à|spetenà|speto[lƚr]à|speà|sp[ei][sŧ]egà|spif[ae]rà|spigo[lƚ]à|spinfarà|spi[ps]?o[lƚ]à|spià|spirità|spolv[ae]rà|spontegà|spo[pv]o[lƚ]à|spu[lƚ]egà|spuntigà|spuà|stangonà|stantarà|stenp[ae]rà|st[ae]rm[ei]nà|stipu[lƚ]à|stomegà|stuà|stu[sŧ]([ei]g|ik)à|tranba[lƚ]à|tranxità|trapo[lƚ]à|tremo[lƚ]à|tri[bdk]o[lƚ]à|trobo[lƚ]à|troto[lƚ]à|tru[sŧ]idà|xbaf[ae]rà|xbanpo[lƚ]à|xbaporà|xbato[lƚ]à|xba[sŧ]egà|xbe[rt]([ei]g|ik)à|xbe[sŧ]o[lƚ]à|xbin?go[lƚ]à|xbixegà|xboko[lƚ]à|xbo[ln]segà|xbolsonà|xbo[st]egà|xboxemà|xboà|xbuxo[lƚ]à|xdentegà|xdindo[lƚ]à|xganb[ae]rà|xgang[ae]rà|xga[xñ]o[lƚ]à|xgo[sŧ]o[lƚ]à|xlanbanà|xlanegà|xli[mpsŧ]egà|xluxegà|xma[fn]arà|xmalmenà|xmas[ae]rà|xmask[ae]rà|xmax[ae]rà|xmego[lƚ]à|xmelmorà|xmemorà|xment([ei]g|ik)à|xmeo[lƚ]à|xm[ae]rgo[lƚ]à|xmodu[lƚ]à|xmoko[lƚ]à|xmontegà|xmorgo[lƚ]à|xmo[sŧ]egà|xmuxegà|xnanarà|xnonbo[lƚ]à|xnuà|xñao[lƚ]à|xrego[lƚ]à|xvanpo[lƚ]à|xvaporà|xvento[lƚ]à|xv[ae]rgo[lƚ]à|xveto[lƚ]à|xvimenà|xvinko[lƚ]à|xvià|xvolto[lƚ]à|xñoko[lƚ]à|x[jɉ]edo[lƚ]à|x[jɉ]o[sŧ]o[lƚ]à)$/,
			/^(adiutarà|anti[sŧ]ipà|arfià|arluminà|arm[ae]rità|arnià|arsusità|artiko[lƚ]à|arvixità|arvivo[lƚ]à|arvolto[lƚ]à|ba[lƚ]uxenà|bix[ei]go[lƚ]à|(bene|boni|mañi|noti|pa[lƚrsŧx]|puri|rati|v[ae]ri|vini)f([ei]g|ik)à|borondo[lƚ]à|dekapità|de[lƚ]apidà|de[lƚ]ib[ae]rà|demest([ei]g|ik)à|denegà|denomenà|depoxità|deriŧolà|deriso[lƚ]à|desemenà|desif[ae]rà|desim[iu][lƚ]à|det[ae]rm[ei]nà|deveà|devià|dexabità|dexalborà|dexanemà|dexautorà|dexaxo[lƚ]à|dexid[ae]rà|dexordenà|de[sŧ]ako[lƚ]à|domest([ei]g|ik)à|ekuivokà|enfià|eskorporà|espetorà|est[ae]rm[ei]nà|fad[ei]gà|fe[lƚ]i[sŧ]ità|fi[lƚ]oxofà|fo[lƚ]iskarà|garofo[lƚ]à|garofo[lƚ]à|idroxenà|inbago[lƚ]à|inba[lƚ]([ei]g|ik)à|inbals[ae]mà|inbanbo[lƚ]à|inbav[ae]rà|inbearà|inbev[ae]rà|inbexenà|inboko[lƚ]à|inbolsamà|inbonb([ei]g|ik)à|inbovo[lƚ]à|inboxemà|inb[ou][sŧ]o[lƚ]à|inbu[dđx][ae]rà|in[dđx]akolà|inxako[lƚ]à|indafarà|indasenà|ind[eu]bità|indoà|infa[sŧ]o[lƚ]à|inf[ae]rvorà|infist([ei]g|ik)à|infià|infogonà|infoibà|infum([ei]g|ik)à|infuxo[lƚ]à|inganb[ae]rà|ingato[lƚ]à|ingurxità|inguà|inkaba[lƚ]à|inkanevà|inkankarà|in[dđx]eregà|inkan[ei]pà|inkaro[lƚ]à|inkar[sŧ]erà|inkatigà|inko[dlƚ]([ei]g|ik)à|inkogo[lƚ]à|inkomodà|inkonko[lƚ]à|inkorporà|inkot([ei]g|ik)à|inkoto[lƚ]à|inku[sŧ]o[lƚ]à|inleà|inluminà|inman([ei]g|ik)à|inmarxinà|inmask[ae]rà|inmaxarà|inmucarà|inpaco[lƚ]à|inpatinà|inp[ae]v[ae]rà|inpià|inpe[gnt]o[lƚ]à|inpi[crsŧ]o[lƚ]à|inpolv[ae]rà|inpomo[lƚ]à|inri[sŧ]o[lƚ]à|inrodo[lƚ]à|insako[lƚ]à|insangonà|insanguenà|insemo[lƚ]à|inseà|insolfarà|inso[lƚ]idà|inso[nsŧ]o[lƚ]à|intanbarà|intard([ei]g|ik)à|intardigà|intavo[lƚ]à|inte[lƚ][ae]rà|intenp[ae]rà|int[ae]rogà|int[ae]rpretà|intito[lƚ]à|intor[kgt]o[lƚ]à|intos([ei]g|ik)à|inva[lƚ]idà|inv[ae]rgo[lƚ]à|investigà|invià|involto[lƚ]à|inx[ae]r([ei]g|ik)à|in[đx]en[ae]rà|in[sŧ]ako[lƚ]à|in[sŧ]ango[lƚ]à|in[sŧ][ae]r([ei]g|ik)à|in[sŧ]ukarà|in[jɉ]emarà|iske[lƚ]etrà|ispaxemà|ispeà|ispirità|istuà|kapito[lƚ]à|karako[lƚ]à|kata[lƚ]ogà|katast([ei]g|ik)à|ko[jɉ]onb[ae]rà|ko[lƚ]audà|komun([ei]g|ik)à|[lƚ]emoxinà|[lƚ]exitimà|ma[lƚ]augurà|manipo[lƚ]à|marangonà|marià|ma[sŧ]oko[lƚ]à|nobi[lƚ]ità|oblit[ae]rà|mo[lƚ]ifegà|parafraxà|pareà|p[ae]rifraxà|p[ae]riko[lƚ]à|p[ae]riodà|pete[dđgx]o[lƚ]à|peti[dđx]o[lƚ]à|preokupà|ravivo[lƚ]à|rebeko[lƚ]à|rebondo[lƚ]à|regurxità|rekal[sŧ]itrà|rekapità|rekup[ae]rà|remar(ik|eg)à|rem[ae][lƚr]ità|remunerà|refuà|renegà|repo[pv]o[lƚ]à|resemenà|resusità|revolto[lƚ]à|roman[sŧx]inà|ro[sŧ]à|rovi[jɉ]o[lƚ]à|sa[lƚ]uà|sfiamegà|sfraxenà|sfrego[lƚ]à|sfritegà|sfri[dđx]egà|skuakuarà|skre[kpsŧ]o[lƚ]à|skri[ksŧ]o[lƚ]à|skro[fkv]?o[lƚ]à|skroità|siñifegà|siroka[lƚ]à|sofist([ei]g|ik)à|so[lƚ][ei][sŧ]ità|spro[lƚ]egà|strako[lƚ]à|strango[lƚ]à|stranba[lƚ]à|strapegà|strepità|striko[lƚ]à|strià|stro[lƚ]([ei]g|ik)à|struko[lƚ]à|subordenà|supedità|surogà|suse[gk]uità|te[lƚ]efonà|v[ae]rigo[lƚ]à|xbiaxemà|xbraità|xbraso[lƚ]à|xbra[sŧ]o[lƚ]à|xbrind[eo][lƚ]à|x[bg]ri[sŧ]o[lƚ]à|xbrodegà|xbrodo[lƚ]à|xbronko[lƚ]à|xdrumenà|xgramo[lƚ]à|xgrendenà|xgreto[lƚ]à|xgriño[lƚ]à|xgron[gsŧ]o[lƚ]à|xguindo[lƚ]à|xguaità|[dđx]irando[lƚ]à|xmiao[lƚ]à|[dđx][ou]gato[lƚ]à|[jɉ]e[lƚ]omarà|vivato[lƚ]à)$/,
			/^(albregà|(anpli|dol[sŧ]i|falsi|forti|glori|klasi|morti|petri|sakri|scari|spe[sŧ]i)f([ei]g|ik)à|defraudà|desfabr([ei]g|ik)à|desfogonà|deskankarà|deskapità|deskavedà|deskoà|deskodegà|deskomodà|despeko[lƚ]à|despe[nt]o[lƚ]à|despetenà|despetorà|desp[ei]go[lƚ]à|despolv[ae]rà|destego[lƚ]à|destenp[ae]rà|dest[ae]rm[ei]nà|destoko[lƚ]à|destuà|dexba[fv][ae]rà|dexbigo[lƚ]à|dexbingo[lƚ]à|dexbonbo[lƚ]à|dexboxemà|dexbo[sŧ]o[lƚ]à|dexbu[sx]o[lƚ]à|dexdà|dexganb[ae]rà|dexlanegà|dexmanegà|dexmaskarà|dexm[eo]ntegà|dexmestegà|dexmunegà|dexnaxo[lƚ]à|dexnià|dexnonbo[lƚ]à|dexn[ou]à|dexri[sŧ]o[lƚ]à|dexv[ae]r[xdđ]enà|dexvià|sfad[ei]gà|fantastegà|farnet([ei]g|ik)à|farnetegà|formigo[lƚ]à|inaxeà|inbra[sŧ]o[lƚ]à|inbrià|infrapo[lƚ]à|ingravidà|inkreà|inkrosto[lƚ]à|inkro[sŧ]o[lƚ]à|inprià|inskato[lƚ]à|inske[lƚ]etrà|inspaxemà|inspeà|inspirità|instaurà|intrapo[lƚ]à|intrinsekà|introità|kalki[dđx]o[lƚ]à|ka[lƚ]ierà|kastigà|konmixerà|konpanegà|konpenetrà|konsid[ae]rà|kontaminà|mo[lr]tip[lr]([ei]g|ik)à|parte[sŧ]ipà|p[ae]rmudarà|p([ae]r|re)se[gk]uità|piovexinà|posti[sŧ]ipà|predestenà|predomenà|presostatà|pre[dđx]ud([ei]g|ik)à|pre[sŧ]ipità|prevarikà|profumegà|pronostegà|regroà|represtinà|respexo[lƚ]à|restaurà|rin[đx]ovenà|salvadegà|skomunegà|stenografà|strao(rden|blig|kup|r[sŧ])à|tartufo[lƚ]à|tramuà|tramudarà|xbixigo[lƚ]à|xbonigo[lƚ]à|xgarofo[lƚ]à|xmo[lƚ][ei]xinà)$/,
			/^(skonpa[jɉ]inà|strasaé|barafuxo[lƚ]à|desfrab([ei]g|ik)à|desfrego[lƚ]à|destr[ei]go[lƚ]à|dexabi[lƚ]ità|dexbramegà|dexbraxo[lƚ]à|dexgr[ae]ndenà|feramentà|(identi|kuanti|senpli|skarni)f([ei]g|ik)à|inv[ae]rigo[lƚ]à|in[dđx]eñato[lƚ]à|[jɉ]egomarà|konglom[ae]rà|kongratu[lƚ]à|[lƚ]avoratà|[lƚ]ustrisimà|malkreà|malprategà|metamorfi[dđx]à|rekapito[lƚ]à|rinprov[ae]rà|skonbuso[lƚ]à|skonpaxenà|spa[sŧ]aorà|spre[dđx]ud([ei]g|ik)à|spropoxità|stra([mns]u|or[sŧ]|seko[lƚ]|xorden)à|xbarbato[lƚ]à|xmo[lr]tip[lr]([ei]g|ik)à|[sŧ]entrifugà)$/,

			/^(dex(bonigo[lƚ]à|infià|intos([ei]g|ik)à)|deversif(ik|eg)à|dexenfià|in(formigo[lƚ]à|kantexemà)|konpanadegà|reinprov[ae]rà|rekonsid[ae]rà|skrimiato[lƚ]à)$/,

			/^(inkat[ao]rigo[lƚ]à|[sŧ]irkumnav[ei]gà|despropoxità|ingra[sŧ]ianà)$/,

			/^dexlonbrià$/
		];

		return function(themeT1, syllabationT4){
			var themeVowel = themeT1[themeT1.length - 1],
				idx = -1;
			//all but second conjugation parossitone (which does not need to backtrack stress)
			if(themeVowel != 'e' && !stressIndices.some(function(re, i){ idx = i; return !!this.match(re); }, themeT1))
				//note: about 83.8% of the verbs have the stress on the penultimate syllabe
				idx = syllabationT4.getGlobalIndexOfStressedSyllabe(syllabationT4.syllabes.length > 1 && !this.verb.irregularity.darStarFar? -2: -1);
			return idx;
		};
	})();

	/**
	 * NOTE: these relates mainly to the central-northern dialect.
	 *
	 * @private
	 */
	var hasGraveStress = (function(){
		var infixes = [
			/^e([flƚ]a|xe|xi|vo|du)/,
			/ae[lƚ]a/,
			/[lƚp]ea/,
			/^re([glƚs]a|xe|go)/,
			/xrego/,
			/be([fglƚ]a|re|ko)/, /bare/,
			/ce([fklƚrst]a|[lƚr]e|ko)/, /cara/,
			/de([lƚt]a|[kg]ua|[bdsŧ]i|[dlƚ]e|ro|pu)/,
			/đe([lƚ]a|[nr]e)/,
			/fe([lƚst]a|ria|tu)/,
			/[mps]ie[đgtx]a/,
			/[jɉ]e([lƚ]a|go)/,
			/xbiega/,
			/ke(ga|[lƚ]e)/,
			/[lƚ]e([fgtv]a|via|gua|[tx]e|[sŧ]i|fo)/,
			/me([lƚr]a|[dlƚ]ia|[dr]e|[rlƚ]i)/, /mar[aei]/,
			/ne([glƚ]a|bia|du|t[ei])/,
			/pe([cklƚrt]a|[nt]e|po|[kt]u)/, /para/,
			/re(ka|[dsŧ]i|p[lr]i|[lƚ]e|vo|[kp]u|klu)/,
			/se([dlƚrs]a|dia|re|v?i|[gk]ui|ko|tu)/, /sar[ae]/,
			/^te([glƚr]a|dia|[lƚ]e|[sŧ]i|ro|nu)/, /^tar[ao]/,
			/ŧe([flƚs]a|[lƚ]e|ko|tu|[sŧ]io)/,
			/ve([clƚ]a|ria)/, /varia/,
			/xe([lƚt]a|[mr]e|gui)/, /xare/,

			/[ae]r([nst]a|pe|vi)/,
			/b[ae]r[gl]a/,
			/f[ae]r(a|vo)/,
			/[jɉ][ae]rma/,
			/k[ae]r[msŧ]a/,
			/[dlƚ][ae]rna/,
			/m[ae]r([dkl]a|[sŧ]ia)/,
			/n[ae]r[bv]?a/,
			/p[ae]r(la|[pt]e|mu)/,
			/s[ae]r([btv]a|vi)/,
			/t[ae]r([gnsŧ]a|(m|pr)e|mi)/,
			/ŧ[ae]r(t?a|e)/,
			/uar[cn]?a/, /ue(([flƚ]|r[cn]?)a|stu)/,
			/v[ae]r([cgns]a|sia|[dđmx]e)/,
			/x[ae]r(ma|[sŧ]i)/,

			/^[flƚnrst]?esta/,
			/[alƚnu]estra/,
			/des(te|pu)/,
			/melmo/,
			/vesti/,

			/[lƚ]ieva/,
			/mie[lƚ]a/,
			/[gsŧ]iera/,
			/[pt]i[ae]ra/,
			/pleta/,
			/xle[pv]a/,

			/spe[sŧ]ia/,

			/krea/,
			/bre(ga|via|fe)/,
			/dre[lƚ]a/,
			/greva/,
			/krepa/,
			/pre([gstŧ]a|[mx]ia|de)/,
			/tre(bia|pi)/,
			/[gp]re[sŧ]ia/,


			/^(stra)?o([cjɉkprstx]a|[dlƚsŧv]ia|vra|[kp]e|bl[ei]|ti|fri|ku)/,
			/[dn]oa/,
			/poe/,
			/bo([cgrsŧ]a|[ksŧv]o)/,
			/co([dkpt]a|[lƚ]e)/,
			/do([bcglƚmprstx]?a|[lƚmp]e)/,
			/đo[gtv]?a/,
			/fo([fgjɉlƚñrst]a|i|go)/,
			/go([bñrstx]a|sia|de|mi)/,
			/io([klƚt]a|ŧi)/,
			/[jɉ]o[klƚt]a/,
			/ko([kñrstŧx]a|[mnp]ia|[dmt]e|[gklƚmt]o|niu)/,
			/[lƚ]o([dđfgjɉkmñpstŧvx]a|[gx]o)/,
			/mo([gjɉklƚstŧ]a|nia|[sŧx]e|ri|[klƚ]o|du)/,
			/no([cdjɉklƚstv]a|vra|me|dri|to|ku)/,
			/ñok[ao]/,
			/po([cjɉlƚt]a|[ds]e|xi|[kpv]o)/,
			/ro([bcdgklƚñ]a|[vx]e|[df]o)/,
			/so([cdjɉmñrt]a|[nsŧ]ia|[lƚ]i|fri|[kn]o)/,
			/to([clƚpsŧt]a|[lƚs]e|ko)/,
			/ŧo([lƚt]a|ko)/,
			/vo([dgjɉk]a|vra|[lƚ]e|mi)/,
			/xo[gklƚñrstv]?a/,

			/^olsa/,
			/^kol[gt]a/,
			/solda/,
			/vol([đtx]a|to)/,

			/^or[bđsx]a/,
			/borña/,
			/bao[kx]a/,
			/p[ei]o[ct]a/,
			/d(or|ro)mi/,
			/for[fstŧ]a/,
			/kon(sta|vo)/,
			/kor([dđgnstŧx]a|po)/,
			/mor([bcsŧ]a|[bf]ia|se|fi|[gm]o)/,
			/norba/,
			/porta/,
			/tor([ct]a|[dđkx]ia|to)/,
			/vor[sŧ]ia/,
			/xor[bt]a/,

			/os(tia|tre|p[ei])/,
			/[kmpt]osta/,
			/[cijɉ]ostra/,
			/noste/,
			/sosta/,

			/sco[kp]a/,

			/[sŧ]aora/,

			/siope/,
			/xioga/, /[dđx]iova/,

			/bloka/,
			/flosa/,
			/glo(ria|me|bo)/,

			/groa/,
			/bro([dgjɉx]a|[dk]o)/,
			/fro[dñx]a/,
			/grosa/,
			/kro([klƚs]a|i|k?o)/,
			/pro([nt]a|pia|[dlƚv]e|spe|[ds]i|[rv]o)/,
			/tro([cdđlƚñstŧx]a|[lƚ]e|to)/
		];
		//note: only /^(re)?xeta/ is a true positive, so /xeta/ is used in 'infixes' above and /[aun]xeta/ here
		var falsePositives = [/^(inca|des|[pr]o|sco)peta/, /[aun]xeta/, /^[pv]e[lƚ]a/, /^(re)?poxa/, /^(in)?bota$/, /(^|des)kosta$/, /(^|in)kuieta$/, /([gp]a|[bx]e|[stŧ]o|per|sti)[lƚ]eta$/, /rsora$/, /frandoxa$/];

		return function(themeT4, syllabationT4, idx){
			idx = syllabationT4.getSyllabeIndex(idx);
			return (StringHelper.isMatching(Word.suppressStress(syllabationT4.syllabes[idx] + syllabationT4.syllabes[idx + 1]), infixes)
				&& !StringHelper.isMatching(themeT4, falsePositives));
		};
	})();


	return {
		generate: generate,
		generateRegularThemes: generateRegularThemes,
		generateIrregularThemes: generateIrregularThemes
	};

});
