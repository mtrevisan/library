/**
 * @class Grapheme
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone'], function(Phone){

	/** @constant */
	var HYATUS_MARKER = 'ϟ',
	/** @constant */
		HYATUS_MARKER_REGEXP = new RegExp(HYATUS_MARKER, 'g');

	/** @constant */
	var TYPE_GRAPHEME = 'Graphemes',
	/** @constant */
		TYPE_PHONEME = 'Phonemes',
	/** @constant */
		TYPE_PHONE = 'Phones';


	var isVowel = function(chr){
		return (chr && chr.match(/[aeiouàèéíòóú]/));
	};

	var endsInVowel = function(word){
		return word.match(/[aeiouàèéíòóú][^aàbcdđeéèfghiíjɉklƚmnñoóòprsʃtŧuúvxʒ]*$/);
	};

	var isDiphtong = function(group){
		//[aeoàèéòó][aeo]
		//[íú][aeiou]
		return group.match(/([iu][íú]|[àèéòó][iu])/);
	};

	var isHyatus = function(group){
		return group.match(/([aeoàèéòó][aeo]|[íú][aeiou]|[aeiou][àèéíòóú])/);
//		return group.match(/([íú][aeiou]|[iu][aeoàèéòó]|[aeo][aeoàèéíòóú]|[àèéòó][aeo])/);
	};

	var isEterophonicSequence = function(group){
		return group.match(/(^|[^aeiouàèéíòóú])[iju][àèéíòóú]/);
	};


	/**
	 * Convert a word into different formats in a different dialect.<p>
	 * NOTE: Use IPA standard.
	 *
	 * @param {String} word		Word to be converted.
	 * @param {String} from		Type from, one of [Grapheme.TYPE_GRAPHEME, Grapheme.TYPE_PHONEME, Grapheme.TYPE_PHONE].
	 * @param {String} to		Type to, one of [Grapheme.TYPE_GRAPHEME, Grapheme.TYPE_PHONEME, Grapheme.TYPE_PHONE].
	 * @param {String} dialect	Dialect to convert the word to.
	 * @param {Boolean} phonematicSyllabation	Wether to syllabate phonematically.
	 */
	var convert = function(word, from, to, dialect, phonematicSyllabation){
		return this['convert' + from + 'Into' + to](word, dialect, phonematicSyllabation);
	};

	/**
	 * Handle /j/ and /w/ phonemes.
	 *
	 * NOTE: Use IPA standard.
	 */
	var preConvertGraphemesIntoPhones = function(word){
		word = phonizeJAffineGrapheme(word);
		word = phonizeEterophonicSequence(word);
		return word;
	};

	/** NOTE: Use IPA standard. */
	var convertGraphemesIntoPhones = function(word, dialect, phonematicSyllabation){
		word = preConvertGraphemesIntoPhones(word);
		word = markPhonologicSyllabeSeparation(word, phonematicSyllabation);
		word = phonizeCombinatorialVariants(word, dialect);
		word = phonizeSingleGraphemes(word, dialect);
		return suppressStress(word);
	};

	/** @private */
	//NOTE: duplicated in Word
	var suppressStress = function(word){
		return word.replace(/[àèéíòóú]/g, function(chr){
			return 'aeeioou'['àèéíòóú'.indexOf(chr)];
		});
	};

	/** NOTE: Use IPA standard. */
	var convertGraphemesIntoPhonemes = function(word, dialect, graphematicSyllabation){
		return convertPhonesIntoPhonemes(convertGraphemesIntoPhones(word, dialect, graphematicSyllabation));
	};

	/**
	 * NOTE: Use non-standard IPA to mark /d͡ʒ/-affine grapheme.
	 *
	 * @private
	 */
	var phonizeJAffineGrapheme = function(word){
		//this step is mandatory before eterophonic sequence VjV
		return word.replace(/j/g, 'ʝ');
	};

	/** @private */
	var phonizeEterophonicSequence = function(word){
		return word
			.replace(/([^aeiouàèéíòóú])i([aeiouàèéíòóú])/g, '$1j$2')
			.replace(/((^|[^s])t)u([aeiouàèéíòóú])/g, '$1w$3')
			.replace(/((^|[^t])[kgrs])u([aeiouàèéíòóú])/g, '$1w$3');
	};

	var markPhonologicSyllabeSeparation = function(word, phonematicSyllabation){
		var replacement = '$1' + HYATUS_MARKER + '$2';

		word = word
			//greek digrams (abnegathion, àbside, drakma, tèknika, iks, tungstèno, pnèumo, psikoloxía, aritmètega, etnía)
			.replace(/([bkpt])([mns])/g, replacement)
			.replace(/([mnrjw])([lr])/g, replacement)
			//.replace(/([mnlrjw])([mnlrjw])/g, replacement)
			.replace(/([b])([dnt])/g, replacement);

		if(phonematicSyllabation)
			word = word
				//s-impure (word initial or after a vowel) followed by a consonant
				.replace(/(^|[aeiouàèéíòóú])([sxʃʒ])(?=[^jwaeiouàèéíòóú])/, '$1$2' + HYATUS_MARKER);
		else
			word = word
				//hyatus
				.replace(/([aeoàèéòó])([aeo])/g, replacement)
				.replace(/([íú])([aeiou])/g, replacement)
				.replace(/([aeo])([àèéíòóú])/g, replacement);
//				.replace(/([íú])([aeiou])/g, replacement)
//				.replace(/([iu])([aeoàèéòó])/g, replacement)
//				.replace(/([aeo])([aeiouàèéíòóú])/g, replacement)
//				.replace(/([àèéòó])([aeo])/g, replacement);

		return word;
	};

	var unmarkPhonologicSyllabeSeparation = function(word){
		return word.replace(HYATUS_MARKER_REGEXP, '');
	};

	var removeJLikePhone = function(word){
		return word.replace(/ʝ/g, 'j');
	};

	/** @private */
	var phonizeCombinatorialVariants = function(word, dialect){
		if(!dialect || dialect == 'lagunar.veneŧian')
			word = word
				//lateral pre-palatal + unilateral alveolar
				.replace(/l(?=[cʝjɉʃ]|$)/g, 'l̻ʲ').replace(/l(?=[bdđfghklƚmnñprstŧvxʒ])/g, 'l̺̝').replace(/l(?=[aeiouàèéíòóú])/g, 'l̺')
				//semi-velar pre-velar
				.replace(/^r|r(?=[aeiouàèéíòóú])/g, 'ɽ̠̟');
		else if(dialect == 'lagunar.mestrin')
			word = word
				//lateral pre-palatal + unilateral alveolar
				.replace(/l(?=[cʝjɉʃ]|$)/g, 'l̻ʲ').replace(/l(?=[bdđfghklƚmnñprstŧvxʒ])/g, 'l̺̝').replace(/l(?=[aeiouàèéíòóú])/g, 'l̺')
				//semi-velar pre-velar
				.replace(/^r|r(?=[aeiouàèéíòóú])/g, 'ɹ˞̠');
		else if(dialect != 'lagunar.coxòto')
			word = word
				//lateral pre-palatal + unilateral alveolar
				.replace(/l(?=[cjɉʃ]|$)/g, 'l̻ʲ').replace(/l(?=[bdđfghklƚmnñprstŧvxʒ])/g, 'l̺̝').replace(/l(?=[aeiouàèéíòóú])/g, 'l̺');

		return word
			//occlusive pre-velar + occlusive velar rounded
			.replace(/([kg])([eij])/g, '$1̟$2').replace(/([kg])w/g, '$1ʷw')
			//semi-naxal pro-velar
			.replace(/n(?=[bcdđfgjɉklƚmnñprsʃtŧvxʒ]|$)/g, 'ŋ̞̟')
			//lateralized approximant alveolar
			.replace(/r(?=[^aeiouàèéíòóú]|$)/g, 'ɹ˞̺');
	};

	/** @private */
	var phonizeSingleGraphemes = function(word, dialect){
		if(!dialect || dialect == 'lagunar.veneŧian')
			//semi-velar pre-velar
			word = word
				.replace(/ƚ/g, 'ʟ˞̟̞')
				.replace(/r/g, 'r̺');
		else if(dialect == 'lagunar.coxòto')
			word = word
				//unilateral alveolar
				.replace(/[lƚ]/g, 'l̺̝')
				//alveolar tap
				.replace(/r/g, 'ɾ̺');
		else
			//semi-lateral palatal
			word = word
				.replace(/ƚ/g, 'ʎ˞̞')
				.replace(/r/g, 'r̺');

		word = word
			.replace(/([td])/g, '$1̪')
			.replace(/s/g, 's̠').replace(/x/g, 'z̠')
			.replace(/n/g, 'n̺');

		var list = ((dialect && (
				dialect.match(/^northern\.(ŧitadin|altaTrevixana)/)
				|| dialect.match(/^oriental/)
				|| dialect.match(/^central\.(roigòto|valsuganòto|basoTrentin)/)
				|| dialect == 'western.ŧitadin')? 't͡s̪̠d͡z̪̠': 'θð')
			+ 'ɲzt̻͡ʃʲd̻͡ʒʲɛɔ').match(Phone.REGEX_UNICODE_SPLITTER);
		word = word.replace(/([ñŧđxcɉèò])/g, function(chr){
			return list['ŧđñxcɉèò'.indexOf(chr)];
		});

		return word;
	};


	/** NOTE: Use IPA standard. */
	var convertPhonesIntoGraphemes = function(word){
		return word
			.replace(/ɹ˞[̺̠]|r̺|ɾ̺|ɽ̠̟/g, 'r')
			.replace(/l(̺̝?|̻ʲ)/g, 'l')
			.replace(/ʎ˞̞|ʟ˞̟̞/g, 'ƚ')
			.replace(/ŋ̞̟/g, 'n')
			.replace(/ɲ/g, 'ñ')
			.replace(/([kg])[̟ʷ]/g, '$1')
			.replace(/t̻͡ʃʲ/g, 'c').replace(/d̻͡ʒʲ/g, 'ɉ')
			.replace(/θ|t͡s̪̠/g, 'ŧ').replace(/ð|d͡z̪̠/g, 'đ')
			.replace(/([td])̪/g, '$1')
			.replace(/s̠/g, 's')
			.replace(/z̠/g, 'x')
			.replace(/n̺/g, 'n')
			.replace(/j/g, 'i')
			.replace(/ʝ/g, 'j')
			.replace(/w/g, 'u')
			.replace(/ɛ/g, 'è')
			.replace(/ɔ/g, 'ò');
	};


	/** NOTE: Use IPA standard. */
	var convertPhonesIntoPhonemes = function(word){
		return word
			.replace(/ɹ˞[̺̠]|r̺|ɾ̺|ɽ̠̟/g, 'r')
			.replace(/l(̺̝?|̻ʲ)|ʎ˞̞|ʟ˞̟̞/g, 'l')
			.replace(/ŋ̞̟/g, 'n')
			.replace(/([kg])[̟ʷ]/g, '$1')
			.replace(/t̻͡ʃʲ/g, 't͡ʃ').replace(/d̻͡ʒʲ/g, 'd͡ʒ')
			.replace(/t͡s̪̠/g, 't͡s').replace(/d͡z̪̠/g, 'd͡z')
			.replace(/([td])̪/g, '$1')
			.replace(/s̠/g, 's')
			.replace(/z̠/g, 'x')
			.replace(/n̺/g, 'n');
	};


	/** NOTE: Use IPA standard. */
	var convertPhonemesIntoGraphemes = function(word){
		word
			.replace(/t͡ʃ/g, 'c').replace(/d͡ʒ/g, 'ɉ')
			.replace(/t͡s/g, 'ŧ').replace(/d͡z/g, 'đ');
	};

	/** NOTE: Use IPA standard. */
	var convertPhonemesIntoPhones = function(word, dialect, graphematicSyllabation){
		return convertGraphemesIntoPhones(convertPhonemesIntoGraphemes(word), dialect, graphematicSyllabation);
	};


	return {
		TYPE_GRAPHEME: TYPE_GRAPHEME,
		TYPE_PHONEME: TYPE_PHONEME,
		TYPE_PHONE: TYPE_PHONE,
		HYATUS_MARKER: HYATUS_MARKER,

		isVowel: isVowel,
		endsInVowel: endsInVowel,
		isDiphtong: isDiphtong,
		isHyatus: isHyatus,
		isEterophonicSequence: isEterophonicSequence,


		convert: convert,

		preConvertGraphemesIntoPhones: preConvertGraphemesIntoPhones,
		convertGraphemesIntoPhones: convertGraphemesIntoPhones,
		convertGraphemesIntoPhonemes: convertGraphemesIntoPhonemes,

		convertPhonesIntoGraphemes: convertPhonesIntoGraphemes,
		convertPhonesIntoPhonemes: convertPhonesIntoPhonemes,

		convertPhonemesIntoGraphemes: convertPhonemesIntoGraphemes,
		convertPhonemesIntoPhones: convertPhonemesIntoPhones,

		markPhonologicSyllabeSeparation: markPhonologicSyllabeSeparation,
		unmarkPhonologicSyllabeSeparation: unmarkPhonologicSyllabeSeparation,
		removeJLikePhone: removeJLikePhone
	};

});
