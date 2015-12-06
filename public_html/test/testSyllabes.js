require(['tools/lang/phonology/Syllabator'], function(Syllabator){
	QUnit.module('Syllabator');

	var syllabatePhonematicAndJoin = function(word){
		return Syllabator.syllabate(word, undefined, true).syllabes.join('-');
	};


	QUnit.test('phonematic - plain syllabation', function(){
		equal(syllabatePhonematicAndJoin('kaxa'), 'kà-xa');
		equal(syllabatePhonematicAndJoin('jutar'), 'ju-tàr');
		equal(syllabatePhonematicAndJoin('pàuxa'), 'pàu-xa');
		equal(syllabatePhonematicAndJoin('piaŧa'), 'pià-ŧa');
		equal(syllabatePhonematicAndJoin('auguri'), 'au-gú-ri');
		equal(syllabatePhonematicAndJoin('àuguri'), 'àu-gu-ri');
		equal(syllabatePhonematicAndJoin('poèta'), 'poè-ta');
		equal(syllabatePhonematicAndJoin('paura'), 'paú-ra');
		equal(syllabatePhonematicAndJoin('grant'), 'grànt');

		equal(syllabatePhonematicAndJoin('inbrijar'), 'in-bri-jàr');
		equal(syllabatePhonematicAndJoin('autoirònego'), 'au-toi-rò-ne-go');
		equal(syllabatePhonematicAndJoin('aŧión'), 'a-ŧión');
	});

	QUnit.test('phonematic - double consonant syllabation', function(){
		equal(syllabatePhonematicAndJoin('èrba'), 'èr-ba');
		equal(syllabatePhonematicAndJoin('saltar'), 'sal-tàr');
		equal(syllabatePhonematicAndJoin('lontan'), 'lon-tàn');
		equal(syllabatePhonematicAndJoin('finlandia'), 'fin-làn-dia');
		equal(syllabatePhonematicAndJoin('abdegar'), 'ab-de-gàr');
		equal(syllabatePhonematicAndJoin('gronda'), 'grón-da');
		equal(syllabatePhonematicAndJoin('umlaut'), 'um-laút');
		equal(syllabatePhonematicAndJoin('injasar'), 'in-ja-sàr');
		equal(syllabatePhonematicAndJoin('àlbaro'), 'àl-ba-ro');
		equal(syllabatePhonematicAndJoin('serpénte'), 'ser-pén-te');
	});

	QUnit.test('phonematic - double consonant with s initial syllabation', function(){
		equal(syllabatePhonematicAndJoin('kospiràr'), 'kos-pi-ràr');
		equal(syllabatePhonematicAndJoin('kósto'), 'kós-to');
	});

	QUnit.test('phonematic/graphematic - double consonant with muta cum liquida syllabation', function(){
		//b, k, d, f, g, p, t, v + l oppure r
		equal(syllabatePhonematicAndJoin('kablàr'), 'ka-blàr');
		equal(syllabatePhonematicAndJoin('cíklo'), 'cí-klo');
		//dl
		equal(syllabatePhonematicAndJoin('reflèso'), 're-flè-so');
		equal(syllabatePhonematicAndJoin('neglixénte'), 'ne-gli-xén-te');
		equal(syllabatePhonematicAndJoin('dúplise'), 'dú-pli-se');
		equal(syllabatePhonematicAndJoin('atlèta'), 'a-tlè-ta');
		//vl

		equal(syllabatePhonematicAndJoin('vibràr'), 'vi-bràr');
		equal(syllabatePhonematicAndJoin('àkre'), 'à-kre');
		equal(syllabatePhonematicAndJoin('kuàdro'), 'kuà-dro');
		equal(syllabatePhonematicAndJoin('àfro'), 'à-fro');
		equal(syllabatePhonematicAndJoin('àgro'), 'à-gro');
		equal(syllabatePhonematicAndJoin('suprèmo'), 'su-prè-mo');
		equal(syllabatePhonematicAndJoin('latràto'), 'la-trà-to');
		equal(syllabatePhonematicAndJoin('nevróxi'), 'ne-vró-xi');
	});

	QUnit.test('phonematic/graphematic - triple consonant syllabation', function(){
		equal(syllabatePhonematicAndJoin('sorprexa'), 'sor-pré-xa');
		equal(syllabatePhonematicAndJoin('subtropegal'), 'sub-tro-pe-gàl');
		equal(syllabatePhonematicAndJoin('inglexe'), 'in-glé-xe');
		equal(syllabatePhonematicAndJoin('kontròl'), 'kon-tròl');
		equal(syllabatePhonematicAndJoin('inpresión'), 'in-pre-sión');
		equal(syllabatePhonematicAndJoin('solstísio'), 'sol-stí-sio');
		equal(syllabatePhonematicAndJoin('rinbrotàr'), 'rin-bro-tàr');
	});

	QUnit.test('phonematic - triple consonant with s initial syllabation', function(){
		equal(syllabatePhonematicAndJoin('kostrénxer'), 'kos-trén-xer');
		equal(syllabatePhonematicAndJoin('despresàr'), 'des-pre-sàr');
	});

	QUnit.test('phonematic - s-impure inside word syllabation', function(){
		equal(syllabatePhonematicAndJoin('bastanŧa'), 'bas-tàn-ŧa');
		equal(syllabatePhonematicAndJoin('destrikar'), 'des-tri-kàr');
		equal(syllabatePhonematicAndJoin('peskar'), 'pes-kàr');
		equal(syllabatePhonematicAndJoin('maèstra'), 'maès-tra');
		equal(syllabatePhonematicAndJoin('dexmentegà'), 'dex-men-te-gà');
		equal(syllabatePhonematicAndJoin('ciklíxmo'), 'ci-klíx-mo');
	});

	QUnit.test('phonematic - s-impure initial syllabation', function(){
		equal(syllabatePhonematicAndJoin('strako'), 's-trà-ko');
		equal(syllabatePhonematicAndJoin('scantixo'), 's-can-tí-xo');
		equal(syllabatePhonematicAndJoin('sfexa'), 's-fé-xa');
		equal(syllabatePhonematicAndJoin('stabia'), 's-tà-bia');
		equal(syllabatePhonematicAndJoin('stranbo'), 's-tràn-bo');
		equal(syllabatePhonematicAndJoin('skòpo'), 's-kò-po');
		equal(syllabatePhonematicAndJoin('stabia'), 's-tà-bia');
		equal(syllabatePhonematicAndJoin('xbaro'), 'x-bà-ro');
		equal(syllabatePhonematicAndJoin('xbrigar'), 'x-bri-gàr');
		equal(syllabatePhonematicAndJoin('xbèrla'), 'x-bèr-la');
	});

	QUnit.test('phonematic - greek syllabation', function(){
		equal(syllabatePhonematicAndJoin('psíko'), 'p-sí-ko');
		equal(syllabatePhonematicAndJoin('pnèumo'), 'p-nèu-mo');
		equal(syllabatePhonematicAndJoin('tmèxi'), 't-mè-xi');
		equal(syllabatePhonematicAndJoin('biopsía'), 'biop-sía');
		equal(syllabatePhonematicAndJoin('kàpsula'), 'kàp-su-la');
		equal(syllabatePhonematicAndJoin('apnèa'), 'ap-nèa');
		equal(syllabatePhonematicAndJoin('ipnóxi'), 'ip-nó-xi');
		equal(syllabatePhonematicAndJoin('rítmo'), 'rít-mo');
		equal(syllabatePhonematicAndJoin('aritmètega'), 'a-rit-mè-te-ga');
		equal(syllabatePhonematicAndJoin('tungstèno'), 'tung-stè-no');
	});



	var syllabateGraphematicAndJoin = function(word){
		return Syllabator.syllabate(word, undefined, false).syllabes.join('-');
	};

	QUnit.test('graphematic - plain syllabation', function(){
		equal(syllabateGraphematicAndJoin('kaxa'), 'kà-xa');
		equal(syllabateGraphematicAndJoin('jutar'), 'ju-tàr');
		equal(syllabateGraphematicAndJoin('pàuxa'), 'pàu-xa');
		equal(syllabateGraphematicAndJoin('piaŧa'), 'pià-ŧa');
		equal(syllabateGraphematicAndJoin('auguri'), 'a-u-gú-ri');
		equal(syllabateGraphematicAndJoin('àuguri'), 'àu-gu-ri');
		equal(syllabateGraphematicAndJoin('poèta'), 'po-è-ta');
		equal(syllabateGraphematicAndJoin('paura'), 'pa-ú-ra');
		equal(syllabateGraphematicAndJoin('grant'), 'grànt');

		equal(syllabateGraphematicAndJoin('inbrijar'), 'in-bri-jàr');
		equal(syllabateGraphematicAndJoin('autoirònego'), 'a-u-to-i-rò-ne-go');
		equal(syllabateGraphematicAndJoin('aŧión'), 'a-ŧión');
	});

	QUnit.test('graphematic - double consonant syllabation', function(){
		equal(syllabateGraphematicAndJoin('èrba'), 'èr-ba');
		equal(syllabateGraphematicAndJoin('saltar'), 'sal-tàr');
		equal(syllabateGraphematicAndJoin('lontan'), 'lon-tàn');
		equal(syllabateGraphematicAndJoin('finlandia'), 'fin-làn-dia');
		equal(syllabateGraphematicAndJoin('abdegar'), 'ab-de-gàr');
		equal(syllabateGraphematicAndJoin('gronda'), 'grón-da');
		equal(syllabateGraphematicAndJoin('umlaut'), 'um-la-út');
		equal(syllabateGraphematicAndJoin('injasar'), 'in-ja-sàr');
		equal(syllabateGraphematicAndJoin('àlbaro'), 'àl-ba-ro');
		equal(syllabateGraphematicAndJoin('serpénte'), 'ser-pén-te');
	});

	QUnit.test('graphematic - double consonant with s initial syllabation', function(){
		equal(syllabateGraphematicAndJoin('kospiràr'), 'ko-spi-ràr');
		equal(syllabateGraphematicAndJoin('kósto'), 'kó-sto');
	});

	QUnit.test('graphematic - triple consonant with s initial syllabation', function(){
		equal(syllabateGraphematicAndJoin('kostrénxer'), 'ko-strén-xer');
		equal(syllabateGraphematicAndJoin('despresàr'), 'de-spre-sàr');
	});

	QUnit.test('graphematic - s-impure inside word syllabation', function(){
		equal(syllabateGraphematicAndJoin('bastanŧa'), 'ba-stàn-ŧa');
		equal(syllabateGraphematicAndJoin('destrikar'), 'de-stri-kàr');
		equal(syllabateGraphematicAndJoin('peskar'), 'pe-skàr');
		equal(syllabateGraphematicAndJoin('maèstra'), 'ma-è-stra');
		equal(syllabateGraphematicAndJoin('dexmentegà'), 'de-xmen-te-gà');
		equal(syllabateGraphematicAndJoin('ciklíxmo'), 'ci-klí-xmo');
	});

	QUnit.test('graphematic - s-impure initial syllabation', function(){
		equal(syllabateGraphematicAndJoin('strako'), 'strà-ko');
		equal(syllabateGraphematicAndJoin('scantixo'), 'scan-tí-xo');
		equal(syllabateGraphematicAndJoin('sfexa'), 'sfé-xa');
		equal(syllabateGraphematicAndJoin('stabia'), 'stà-bia');
		equal(syllabateGraphematicAndJoin('stranbo'), 'stràn-bo');
		equal(syllabateGraphematicAndJoin('skòpo'), 'skò-po');
		equal(syllabateGraphematicAndJoin('stabia'), 'stà-bia');
		equal(syllabateGraphematicAndJoin('xbaro'), 'xbà-ro');
		equal(syllabateGraphematicAndJoin('xbrigar'), 'xbri-gàr');
		equal(syllabateGraphematicAndJoin('xbèrla'), 'xbèr-la');
	});

	QUnit.test('graphematic - greek syllabation', function(){
		equal(syllabateGraphematicAndJoin('psíko'), 'p-sí-ko');
		equal(syllabateGraphematicAndJoin('pnèumo'), 'p-nèu-mo');
		equal(syllabateGraphematicAndJoin('tmèxi'), 't-mè-xi');
		equal(syllabateGraphematicAndJoin('biopsía'), 'biop-sí-a');
		equal(syllabateGraphematicAndJoin('kàpsula'), 'kàp-su-la');
		equal(syllabateGraphematicAndJoin('apnèa'), 'ap-nè-a');
		equal(syllabateGraphematicAndJoin('ipnóxi'), 'ip-nó-xi');
		equal(syllabateGraphematicAndJoin('rítmo'), 'rít-mo');
		equal(syllabateGraphematicAndJoin('aritmètega'), 'a-rit-mè-te-ga');
		equal(syllabateGraphematicAndJoin('tungstèno'), 'tung-stè-no');
	});
});
