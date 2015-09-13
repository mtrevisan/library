require(['tools/lang/morphology/Conjugator'], function(Conjugator){
	module('ExtractVerbsForms');

	test('portàr', function(){
		var forms = Conjugator.extractForms('portàr');

		var expected = [
			'pòrto',
			'portave',
			'portavo',
			'portavi',
			'portava',
			'portàvimo',
			'portarè',
			'portarò',
			'portaré',
			'portaremo',
			'portarà',
			'portante',
			'portasto',
			'portasti',
			'portasta',
			'portaste',
			'portasi',
			'portase',
			'portàsimo',
			'pòrti',
			'pòrta',
			'pòrte',
			'portè',
			'portemo',
			'portaresi',
			'portarésimo',
			'portaría',
			'portaríe',
			'portarave',
			'portando',
			'portivié',
			'portonse',
			'portionse',
			'portivon',
			'portivonse',
			'portivion',
			'portivionse',
			'portense',
			'portiven',
			'portivense',
			'portar',
			'portare',
			'portado',
			'portà',
			'portadi',
			'portàa',
			'portada',
			'portàe',
			'portade',
			'portié',
			'portiede',
			'portiege',
			'portisié',
			'portisiede',
			'portisiege',
			'porton',
			'portone',
			'portonse',
			'portion',
			'portione',
			'portionse',
			'portison',
			'portisone',
			'portisonse',
			'portision',
			'portisione',
			'portisionse',
			'porten',
			'portene',
			'portense',
			'portisen',
			'portisene',
			'portisense',
			'porté',
			'portede',
			'portege',
			'porton',
			'portone',
			'portion',
			'portione',
			'porten',
			'portene',
			'portarié',
			'portarisié',
			'portaron',
			'portaronse',
			'portarion',
			'portarionse',
			'portarison',
			'portarisonse',
			'portarision',
			'portarisionse',
			'portaren',
			'portarense',
			'portarisen',
			'portarisense'
		];

		deepEqual(forms, expected);
	});

	test('valér', function(){
		var forms = Conjugator.extractForms('valér');

		var expected = [
			'valo',
			'valeve',
			'valevo',
			'valevi',
			'valeva',
			'valévimo',
			'valerè',
			'valerò',
			'valeré',
			'valerí',
			'valeremo',
			'valerimo',
			'valerà',
			'valente',
			'valesto',
			'valesti',
			'valesta',
			'valeste',
			'valso',
			'valsi',
			'valsa',
			'valse',
			'valesi',
			'valese',
			'valésimo',
			'vali',
			'vala',
			'vale',
			'valí',
			'valemo',
			'valimo',
			'valeresi',
			'valerésimo',
			'valería',
			'valeríe',
			'valerave',
			'valendo',
			'valivié',
			'valonse',
			'valionse',
			'valivon',
			'valivonse',
			'valivion',
			'valivionse',
			'valense',
			'valiven',
			'valivense',
			'valer',
			'valere',
			'valudo',
			'valú',
			'valudi',
			'valúa',
			'valuda',
			'valúe',
			'valude',
			'valié',
			'valiede',
			'valiege',
			'valisié',
			'valisiede',
			'valisiege',
			'valon',
			'valone',
			'valonse',
			'valion',
			'valione',
			'valionse',
			'valison',
			'valisone',
			'valisonse',
			'valision',
			'valisione',
			'valisionse',
			'valen',
			'valene',
			'valense',
			'valisen',
			'valisene',
			'valisense',
			'valé',
			'valede',
			'valege',
			'valon',
			'valone',
			'valion',
			'valione',
			'valen',
			'valene',
			'valerié',
			'valerisié',
			'valeron',
			'valeronse',
			'valerion',
			'valerionse',
			'valerison',
			'valerisonse',
			'valerision',
			'valerisionse',
			'valeren',
			'valerense',
			'valerisen',
			'valerisense'
		];

		deepEqual(forms, expected);
	});

	test('béver', function(){
		var forms = Conjugator.extractForms('béver');

		var expected = [
			'bevo',
			'beveve',
			'bevevo',
			'bevevi',
			'beveva',
			'bevévimo',
			'beverè',
			'beverò',
			'beveré',
			'beverí',
			'beveremo',
			'beverimo',
			'beverà',
			'bevente',
			'bevesto',
			'bevesti',
			'bevesta',
			'beveste',
			'bevesi',
			'bevese',
			'bevésimo',
			'bevi',
			'beva',
			'beve',
			'beví',
			'bevemo',
			'bevimo',
			'beveresi',
			'beverésimo',
			'bevería',
			'beveríe',
			'beverave',
			'bevendo',
			'bevivié',
			'bevonse',
			'bevionse',
			'bevivon',
			'bevivonse',
			'bevivion',
			'bevivionse',
			'bevense',
			'beviven',
			'bevivense',
			'béver',
			'bévere',
			'bevudo',
			'bevú',
			'bevudi',
			'bevúa',
			'bevuda',
			'bevúe',
			'bevude',
			'bevié',
			'beviede',
			'beviege',
			'bevisié',
			'bevisiede',
			'bevisiege',
			'bevon',
			'bevone',
			'bevonse',
			'bevion',
			'bevione',
			'bevionse',
			'bevison',
			'bevisone',
			'bevisonse',
			'bevision',
			'bevisione',
			'bevisionse',
			'beven',
			'bevene',
			'bevense',
			'bevisen',
			'bevisene',
			'bevisense',
			'bevé',
			'bevede',
			'bevege',
			'bevon',
			'bevone',
			'bevion',
			'bevione',
			'beven',
			'bevene',
			'beverié',
			'beverisié',
			'beveron',
			'beveronse',
			'beverion',
			'beverionse',
			'beverison',
			'beverisonse',
			'beverision',
			'beverisionse',
			'beveren',
			'beverense',
			'beverisen',
			'beverisense'
		];

		deepEqual(forms, expected);
	});

	test('dormír', function(){
		var forms = Conjugator.extractForms('dormír');

		var expected = [
			'dòrmo',
			'dormive',
			'dormivo',
			'dormivi',
			'dormiva',
			'dormívimo',
			'dormirè',
			'dormirò',
			'dormiré',
			'dormiremo',
			'dormirà',
			'dormente',
			'dormisto',
			'dormisti',
			'dormista',
			'dormiste',
			'dormesto',
			'dormesti',
			'dormesta',
			'dormeste',
			'dormisi',
			'dormise',
			'dormísimo',
			'dòrmi',
			'dòrma',
			'dòrme',
			'dormimo',
			'dormiresi',
			'dormirésimo',
			'dormiría',
			'dormiríe',
			'dormirave',
			'dormindo',
			'dormendo',
			'dormivié',
			'dormonse',
			'dormionse',
			'dormivon',
			'dormivonse',
			'dormivion',
			'dormivionse',
			'dormense',
			'dormiven',
			'dormivense',
			'dormir',
			'dormire',
			'dormido',
			'dormidi',
			'dormía',
			'dormida',
			'dormíe',
			'dormié',
			'dormiede',
			'dormiege',
			'dormisié',
			'dormisiede',
			'dormisiege',
			'dormon',
			'dormone',
			'dormonse',
			'dormion',
			'dormione',
			'dormionse',
			'dormison',
			'dormisone',
			'dormisonse',
			'dormision',
			'dormisione',
			'dormisionse',
			'dormen',
			'dormene',
			'dormense',
			'dormisen',
			'dormisene',
			'dormisense',
			'dormé',
			'dormede',
			'dormege',
			'dormí',
			'dormide',
			'dormige',
			'dormon',
			'dormone',
			'dormion',
			'dormione',
			'dormen',
			'dormene',
			'dormirié',
			'dormirisié',
			'dormiron',
			'dormironse',
			'dormirion',
			'dormirionse',
			'dormirison',
			'dormirisonse',
			'dormirision',
			'dormirisionse',
			'dormiren',
			'dormirense',
			'dormirisen',
			'dormirisense'
		];

		deepEqual(forms, expected);
	});

	test('fenír', function(){
		var forms = Conjugator.extractForms('fenír');

		var expected = [
			'feniso',
			'fenive',
			'fenivo',
			'fenivi',
			'feniva',
			'fenívimo',
			'fenirè',
			'fenirò',
			'feniré',
			'feniremo',
			'fenirà',
			'fenente',
			'fenisto',
			'fenisti',
			'fenista',
			'feniste',
			'fenesto',
			'fenesti',
			'fenesta',
			'feneste',
			'fenísimo',
			'fenisi',
			'fenisa',
			'fenise',
			'fené',
			'fenimo',
			'feniresi',
			'fenirésimo',
			'feniría',
			'feniríe',
			'fenirave',
			'fenindo',
			'fenendo',
			'fenivié',
			'fenon',
			'fenonse',
			'fenion',
			'fenionse',
			'fenivon',
			'fenivonse',
			'fenivion',
			'fenivionse',
			'fenen',
			'fenense',
			'feniven',
			'fenivense',
			'fenir',
			'fenire',
			'fenido',
			'fení',
			'fenidi',
			'fenía',
			'fenida',
			'feníe',
			'fenide',
			'fenié',
			'feniede',
			'feniege',
			'fenon',
			'fenone',
			'fenonse',
			'fenion',
			'fenione',
			'fenionse',
			'fenison',
			'fenisone',
			'fenisonse',
			'fenision',
			'fenisione',
			'fenisionse',
			'fenen',
			'fenene',
			'fenense',
			'fenisen',
			'fenisene',
			'fenisense',
			'fenisé',
			'fenisede',
			'fenisege',
			'fenisié',
			'fenisiede',
			'fenisiege',
			'fenison',
			'fenisone',
			'fenision',
			'fenisione',
			'fenisen',
			'fenisene',
			'fenirié',
			'fenirisié',
			'feniron',
			'fenironse',
			'fenirion',
			'fenirionse',
			'fenirison',
			'fenirisonse',
			'fenirision',
			'fenirisionse',
			'feniren',
			'fenirense',
			'fenirisen',
			'fenirisense'
		];

		deepEqual(forms, expected);
	});


	test('andàr', function(){
		var forms = Conjugator.extractForms('andàr');

		var expected = [
			'ando',
			'andave',
			'andavo',
			'andavi',
			'andava',
			'andàvimo',
			'andarè',
			'andarò',
			'andaré',
			'andaremo',
			'andarà',
			'va',
			'andante',
			'andasto',
			'andasti',
			'andasta',
			'andaste',
			'andasi',
			'andase',
			'andàsimo',
			'andi',
			'anda',
			'ande',
			'andè',
			'andemo',
			'vae',
			'vè',
			've',
			'vemo',
			'andaresi',
			'andarésimo',
			'andaría',
			'andaríe',
			'andarave',
			'andando',
			'vao',
			'vago',
			'andivié',
			'andonse',
			'andionse',
			'andivon',
			'andivonse',
			'andivion',
			'andivionse',
			'andense',
			'andiven',
			'andivense',
			'andar',
			'andare',
			'andado',
			'andà',
			'andadi',
			'andàa',
			'andada',
			'andàe',
			'andade',
			'andié',
			'andiede',
			'andiege',
			'andisié',
			'andisiede',
			'andisiege',
			'andon',
			'andone',
			'andonse',
			'andion',
			'andione',
			'andionse',
			'andison',
			'andisone',
			'andisonse',
			'andision',
			'andisione',
			'andisionse',
			'anden',
			'andene',
			'andense',
			'andisen',
			'andisene',
			'andisense',
			'andé',
			'andede',
			'andege',
			'andon',
			'andone',
			'andion',
			'andione',
			'anden',
			'andene',
			'vai',
			'vagi',
			'vaa',
			'vaga',
			've',
			'vede',
			'vege',
			'von',
			'vone',
			'vion',
			'vione',
			'ven',
			'vene',
			'andarié',
			'andarisié',
			'andaron',
			'andaronse',
			'andarion',
			'andarionse',
			'andarison',
			'andarisonse',
			'andarision',
			'andarisionse',
			'andaren',
			'andarense',
			'andarisen',
			'andarisense'
		];

		deepEqual(forms, expected);
	});
});
