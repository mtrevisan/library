require(['tools/lang/phonology/Phone', 'tools/lang/GrammarLearner'], function(Phone, GrammarLearner){
	QUnit.module('Phone');

	QUnit.test('phone conversion test', function(){
		deepEqual(Phone.convertStringIntoFeatures('a'), [
			{syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, tri: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: -1, bk: -1, tns: 0}
		]);
		deepEqual(Phone.convertStringIntoFeatures('lˠ'), [
			{syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, tri: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 0}
		]);
		deepEqual(Phone.convertStringIntoFeatures('ɢ͡ʁd̪͡z̪'), [
			{ant: 0, app: -1, bk: 1, cg: -1, cnt: -1, con: 1, cor: -1, dor: 1, dr: 1, dst: 0, ft: -1, hi: -1, lab: -1, lat: -1, ld: -1, lo: -1, nas: -1, rou: -1, sg: -1, son: -1, str: 0, syl: -1, tap: -1, tns: 0, tri: -1, voi: 1},
			{ant: 1, app: -1, bk: 0, cg: -1, cnt: -1, con: 1, cor: 1, dor: -1, dr: 1, dst: 1, ft: 0, hi: 0, lab: -1, lat: -1, ld: -1, lo: 0, nas: -1, rou: -1, sg: -1, son: -1, str: 1, syl: -1, tap: -1, tns: 0, tri: -1, voi: 1}
		]);
		equal(Phone.convertFeaturesIntoString(Phone.convertStringIntoFeatures('ɢ͡ʁd̪͡z̪')), 'ɢ͡ʁd̪͡z̪');
		deepEqual(Phone.convertFeaturesIntoRegExString(['a', {con: 1, son: 1, hi: 0}]), 'a[lmnrɭɱɳɺɻɽɾʙ]');
	});

	QUnit.test('convert features into regex', function(){
		equal(Phone.convertFeaturesIntoRegExString(Phone.convertStringIntoFeatures('abcɢ͡ʁd̪͡z̪')), 'abc(?:ɢ͡ʁ)(?:d̪͡z̪)');
		equal(Phone.convertFeaturesIntoRegExString(Phone.convertStringIntoFeatures('[+con]')), '(?:[bcdfklmnpqrstvxzçðħŋɕɖɟɡɢɣɧɫɬɭɮɱɲɳɴɸɺɻɽɾʀʁʂʃʈʎʐʑʒʔʕʙʝʟβθχ]|b͡d|b͡v|b͡β|c͡ç|d̠͡ɮ̠|d̪͡z̪|d̪͡ð|d̪͡ɮ̪|d͡z|d͡ɮ|d͡ʑ|d͡ʒ|k̟͡x̟|k̠͡x̠|k͡p|k͡x|p͡f|p͡t|p͡ɸ|q͡χ|t̪͡s̪|t̪͡ɬ̪|t̪͡θ|t͡s|t͡ɕ|t͡ɬ|t͡ɬ̲|t͡ʃ|ɖ͡ʐ|ɟ͡ʝ|ɡ̟͡ɣ̟|ɡ̠͡ɣ̠|ɡ͡b|ɡ͡ɣ|ɢ͡ʁ|ʈ͡ʂ)');
	});

	QUnit.test('compare features', function(){
		deepEqual(Phone.compareFeatures('#', '#'), {diff: [], same: {'0': '#'}});
		deepEqual(Phone.compareFeatures('a', 'b'), {diff: ['0'], same: {}});
		deepEqual(Phone.compareFeatures({con: 1}, {con: 1}), {diff: [], same: {con: 1}});
		deepEqual(Phone.compareFeatures({con: 1}, {con: -1}), {diff: ['con'], same: {}});
		deepEqual(Phone.compareFeatures('a', {con: 1}), {diff: ['0'], same: {}});
		deepEqual(Phone.compareFeatures({con: 1}, 'b'), {diff: ['con'], same: {}});

		deepEqual(Phone.compareFeatures('#', '#', true), {diff: [], same: {'0': '#'}});
		deepEqual(Phone.compareFeatures('a', 'b', true), {diff: ['0'], same: {}});
		deepEqual(Phone.compareFeatures({con: 1, voi: 0}, {con: 1, voi: 0}, true), {diff: [], same: {con: 1, voi: 0}});
		deepEqual(Phone.compareFeatures({con: 1, voi: 0}, {con: -1, voi: 0}, true), {diff: ['con'], same: {voi: 0}});
		deepEqual(Phone.compareFeatures({con: 1}, {con: -1, voi: 0}, true), {diff: ['con', 'voi'], same: {}});
		deepEqual(Phone.compareFeatures({con: 1, voi: 0}, {con: -1}, true), {diff: ['con', 'voi'], same: {}});
		deepEqual(Phone.compareFeatures('a', {con: 1, voi: 0}, true), {diff: ['0', 'con', 'voi'], same: {}});
		deepEqual(Phone.compareFeatures({con: 1, voi: 0}, 'b', true), {diff: ['con', 'voi', '0'], same: {}});
	});

	QUnit.test('similarity', function(){
		equal(Phone.similarity(Phone.convertStringIntoFeatures('a')[0], Phone.convertStringIntoFeatures('b')[0]), 0.46153846153846156);
		equal(Phone.similarity(Phone.convertStringIntoFeatures('t')[0], Phone.convertStringIntoFeatures('d')[0]), 0.038461538461538464);
		equal(Phone.similarity(Phone.convertStringIntoFeatures('t')[0], Phone.convertStringIntoFeatures('d')[0], 0.5), 0.5 * 0.038461538461538464);
		equal(Phone.similarity(Phone.convertStringIntoFeatures('l')[0], Phone.convertStringIntoFeatures('l̺')[0], 0.5), 0);
	});


	QUnit.test('rule application test', function(){
		Phone.setUseDiacritics(true);

		equal((new Phone.Rule('t', '∅', '_#')).applyTo('rat'), 'ra');
		equal((new Phone.Rule('t', 'ʔ', 'a_#', 't glottalization')).applyTo('goat'), 'goaʔ');
		equal((new Phone.Rule('k', 't͡ʃi', '#mu_#')).applyTo('muk'), 'mut͡ʃi');
		equal((new Phone.Rule('[-cnt]', '[-voi]', '_#', 'final obstruent devoicing')).applyTo('cab'), 'cap');
		equal((new Phone.Rule('l', '[+dor,+hi,-lo,-ft,+bk]', '_#', 'L-velarization')).applyTo('cal'), 'calˠ');
		equal((new Phone.Rule('[+syl,-hi,-lo]', '[+hi]', '_', 'mid vowel raising')).applyTo('cell'), 'cill');

		Phone.setUseDiacritics(false);
	});

	QUnit.test('rule containment test', function(){
		Phone.setUseDiacritics(true);

		notOk((new Phone.Rule('a', 'b', 'a_#')).contains(new Phone.Rule('a', 'c', 'a_#')));
		notOk((new Phone.Rule('a', 'b', 'ab_#')).contains(new Phone.Rule('a', 'b', 'a_#')));

		ok((new Phone.Rule('a', 'b', '[+con]_#')).contains(new Phone.Rule('a', 'b', '[+con]_#')));
		ok((new Phone.Rule('a', 'b', '[+con]_#')).contains(new Phone.Rule('a', 'b', '[+con,+voi]_#')));
		notOk((new Phone.Rule('a', 'b', '[+con,+voi]_#')).contains(new Phone.Rule('a', 'b', '[+con]_#')));

		ok((new Phone.Rule('a', 'b', 'a_#')).contains(new Phone.Rule('a', 'b', 'a_#')));
		ok((new Phone.Rule('a', 'b', '[-con]_#')).contains(new Phone.Rule('a', 'b', 'a_#')));
		notOk((new Phone.Rule('a', 'b', 'a_#')).contains(new Phone.Rule('a', 'b', '[-con]_#')));

		Phone.setUseDiacritics(false);
	});

	QUnit.test('rule inferring test (GrammarLearner)', function(){
		var rules = GrammarLearner.prototype.getRulesFromPair('sal', 'sar');
		equal(rules.length, 1);
		equal(rules[0].toString(), 'l → r / #sa_#');

		rules = GrammarLearner.prototype.getRulesFromPair('ʔak', 'ʔat͡ʃi');
		equal(rules.length, 1);
		equal(rules[0].toString(), 'k → t͡ʃi / #ʔa_#');

		rules = GrammarLearner.prototype.getRulesFromPair('ʔat͡ʃi', 'ʔak');
		equal(rules.length, 1);
		equal(rules[0].toString(), 't͡ʃi → k / #ʔa_#');

		rules = GrammarLearner.prototype.getRulesFromPair('dap', 'dapi');
		equal(rules.length, 1);
		equal(rules[0].toString(), '∅ → i / #dap_#');

		rules = GrammarLearner.prototype.getRulesFromPair('loti', 'lot');
		equal(rules.length, 1);
		equal(rules[0].toString(), 'i → ∅ / #lot_#');
	});
});
