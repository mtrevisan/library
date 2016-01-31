require(['tools/data/clustering/OPTICSClusterer', 'tools/data/ArrayHelper'], function(OPTICSClusterer, ArrayHelper){
	QUnit.module('OPTICSClusterer');

	var data = [
		[ 0,    0],
		[ 0,    0.5],
		[ 0,   -0.8],
		[ 1,    0],
		[-1,    0],
		[-1,    0.5],
		[-1.2,  0.5],
		[-1,   -0.4],
		[ 1,    0.4],
		[ 1,    0.2]
	];

	QUnit.test('clustering', function(assert){
		var result = OPTICSClusterer.cluster(data, 0.9, 2);

		assert.equal(result.length, data.length);

		var clusterIds = [],
			i,
			clusterSum;
		for(i = 0; i < result.length; i ++)
			clusterIds[result[i].clusterId] = clusterIds[result[i].clusterId] + 1 || 1;
		clusterSum = (clusterIds.noise || 0);
		for(i = 0; i < clusterIds.length; i ++)
			clusterSum += clusterIds[i];
		assert.equal(clusterSum, data.length);
	});

	/*QUnit.test('das', function(assert){
		var variants = ['Anpeŧ', 'Pàđule', 'Uronŧo', 'Poŧale', 'Verona', 'Ŧenŧenige', 'Kaxan', 'Arfanta (Tarŧo)', 'Belun', 'Sa Stin', 'Venèsia', 'Krespaòro', 'Bixa', 'Montebèlo', 'Teoƚo', 'Roman', 'Vas', 'Toneđa', 'Vicensa', 'Lovadina', 'Kanpo San Martin', 'Istrana', 'Raldon', 'Méolo', 'Cerèa', 'Frata', 'Vila', 'Kavàrxare', 'Trevixo', 'Italia'],
			data2 = [[-0.14661656605581921,-0.0813696629634311,0.05012026139100382,-0.10284205617885159,0.036132732410681316,-0.06105233394995394,0.03552563508992247,0.021693718872174736,0.022964382711396458,-0.0007490359499520344,0.007292559525653018,0.002415600099244671,0.0004991212643295862,-0.0032976788527500846,-0.004950989255302941,0.001152681913320796,-0.0006125799643186489,0.001434508011163451,-0.0014661075719375998,-0.002017330579980489,0.0009118378153133772,-0.0008695965509619041,-0.0007806391645988143,0.0006492087852629661,-0.00016949395500205644,0],[-0.20478537390500912,-0.09262542863136697,-0.015531362277167818,0.12990628061705223,-0.06257374250334442,-0.03215116580306635,-0.009538139463395727,0.009360963780657346,0.011552511312650282,0.002896884390987248,0.004449609197777666,-0.0035017967285021307,0.003057475354061389,-0.0007016953854145516,-0.0003756367009227819,0.002023407332740072,-0.002477504076911499,0.00018428680321487808,-0.0007416733517848078,-0.0006158430814511625,0.000641733438762528,-0.0006884726470546126,-0.000507521131631398,0.00020192137453198242,-0.00005999094601941518,0],[-0.13308250154095252,-0.06989688076487445,0.018026010502563913,-0.014888467750241774,0.014901619143772558,0.015901934208158882,-0.01066545291519949,0.006456057519582268,-0.04519310665964319,-0.021460615608230427,-0.03569364636204383,0.007242383858527399,-0.010473659132110744,0.01213386386825281,0.006880944862353193,-0.0025317590733326583,0.007914014873180983,0.00251372108529879,-0.000615314927365425,0.002868301017984375,-0.001637398563523421,0.0013429626463125244,0.0006815615207780606,-0.0015333155251036244,0.00007127279080816516,0],[-0.18165547233243262,-0.04626776612716313,0.004460922956319765,-0.03200858152265378,0.04300636151207354,0.08015298821205687,-0.03904766595204805,-0.028982349336086847,0.010642055152978601,0.001125448837936007,0.015303077381678243,-0.005086844877670389,0.005803397864722857,-0.006782052368637955,-0.00008327185369577749,0.001906967276199222,-0.007656576461749951,-0.0043824832950288516,0.0013096747165280346,-0.0016198970653450416,-0.000545619214782202,-0.0004817367927392042,0.0007813586387692784,0.0009543067773993023,0.00008937997437004438,0],[0.03081470054436158,0.00775397837167212,0.009388310266483825,-0.03806788407735923,-0.04714506426209866,-0.002958687278241375,-0.028323719740879914,-0.007561206676185866,0.00035722342210793535,0.033163241128110484,-0.03013501012618586,-0.008176199078242694,0.0025298611096050594,-0.015194122098613382,-0.007548718755332925,0.0038439391443119185,0.0012513565334691698,-0.0008113006819094738,-0.004657390926943983,-0.004394895043623561,-0.0057129776094478855,-0.00014638926896005374,-0.005189414404474817,0.002030921959569164,-0.00003583632954835328,0],[-0.12372871421702246,0.08581055789429456,-0.03983570732547206,0.00024548927899565383,-0.009243878809685966,-0.0040570357046154784,0.07758701533613126,-0.040258025647531816,-0.025474994169726217,0.024655100849904035,0.00478437746921914,-0.0008566013299658223,-0.0013418391767277995,-0.0024983072458744913,0.002151141119743511,-0.005401043003725344,0.0015026605840794455,-0.0005952528484276295,0.0013224745720856143,0.002616605528133063,-0.0013844057755629496,-0.0008594335933742814,0.0008135602124406902,0.00027759729841079865,0.0001598872402675328,0],[-0.044188886414646404,0.08709651364945799,-0.045025571848438105,0.00019946963039340395,0.005521660753179533,0.01957822755400259,-0.018744582431144668,0.04235742694683549,0.007983982202503456,0.0024721169376566714,0.011689984367767433,0.0021692161738513303,-0.018456909211014977,-0.008293764411399911,-0.00040420580971888605,-0.017966369918394346,0.0007784957811046649,0.0019625327267167206,0.00459677828886658,0.0013908820008646757,-0.005229817927417518,-0.005035353218856894,0.0012642281399277986,0.0007550420868119885,-0.0008650105840234904,0],[-0.01272123596548452,0.08624743635770903,-0.033377441986490244,0.007452869534220964,0.029092303462501884,-0.02053207088570522,-0.005241855447661853,0.010238000297795632,0.016373432160117003,-0.001657200360318744,-0.027171049415991206,0.0061142735704952334,-0.004786498293403407,-0.006337145263528119,0.010529788561445753,0.006276063483352249,-0.015696701752069595,0.0017281577220905626,-0.010080597607794096,0.0006626907438392676,-0.001847177912897567,-0.002033194743268676,0.0045103414482819525,-0.0007482535548555157,0.0010029884098736032,0],[-0.058120187853949574,0.10118082536193007,-0.031325075685396116,0.0028145921070064626,0.015370540812041665,0.01672657807984726,-0.00020922260578923918,0.008611440656714283,0.022534350040455776,0.010674984403185353,-0.01074215374969607,-0.0013438491065595358,0.0023886757582793324,0.022926002210436485,-0.012680956205331297,0.01694611901749744,0.006042895140008042,-0.002377880681916828,0.006988498172492635,-0.002785125902584385,0.007717986155204109,0.0014525206117470759,-0.0018869923106753458,-0.0029288347569349405,-0.0005664474361217117,0],[0.01690708915038053,0.03891866564811931,-0.008293748624032959,0.01995528099537424,0.029403169370448946,-0.033764534169619435,-0.018251341164502916,-0.01948686006900037,-0.009619388010716694,-0.02241562051835933,-0.0021287398219130248,-0.00878260823328882,-0.015406894554456999,-0.007118121603505007,-0.02195697475931666,-0.009145999098573443,-0.003647087961339396,-0.009574571919583028,-0.0010058702103690998,-0.007439266074204812,0.0024511070014456003,0.0035567459492142654,-0.0028033226827870175,-0.0010470243936256762,0.0015096639351205676,0],[0.05365140079933178,-0.017554022790486748,0.013465961567197456,0.016437460496667392,0.02189891073725244,-0.011633787539698239,-0.01970138232011375,0.000431866671107353,-0.030866190076636893,0.018295169276160574,0.017624316811910772,0.03566440481837525,-0.001971498767269462,-0.014636432148127368,-0.007665305277066585,0.008941831848019803,-0.0006655978366083998,-0.0005589676452873811,-0.0031684903635696804,-0.0012099683280525234,0.004934719695432602,-0.004973448367475842,0.0007131426433325709,-0.003909926024432234,-0.0009046768463711516,0],[0.045305327539984966,-0.019533018512973892,0.005351354217030585,-0.006508626501925171,-0.027446849679570826,0.025067887268973747,0.013786405841693038,0.008187740185813547,-0.0025722975355145484,-0.014600064143953128,0.003775553588993572,-0.013389132597486496,0.008278911659565302,-0.01411717021839686,-0.012225321299547913,0.005681125265208383,0.009941671940877628,0.013439665315246934,0.0036257065004498433,0.004249220453480972,0.0034633184959640614,-0.007669622502415742,0.00055702460049906,-0.00040001454756384927,0.002470088210522556,0],[-0.008415267551640059,0.0727395603556441,0.01211799743954022,-0.047615493817145284,-0.08591199330772933,-0.017116209155490253,-0.018187527140564607,-0.022001953093878774,-0.001491354363763824,-0.03472939331754193,0.017237318093758704,0.01843043094185664,-0.00594355111055092,0.009531157148084536,0.0014348086586994226,0.006848904002610054,-0.007490956423168085,0.00215079960333374,0.002415719916789896,-0.00005792882344477501,-0.0015110257222943038,0.0006447891067829567,-0.0004227342052532725,0.002748025772749769,-0.00020848973937744484,0],[0.04933834138971642,-0.02016241643559194,0.0036018980631234068,-0.005078846706965476,-0.025279928900323687,0.024514615912833992,0.019559990844036812,0.008611967099593871,0.007707335977992867,-0.007542080777334483,0.005653216587955376,-0.005891269827272811,-0.0017298725655811446,-0.005542356754049272,-0.006367438386312958,0.0038092093641675776,0.0021285106324224756,-0.005998490014540478,-0.014214506931405567,0.006644542144626167,0.0018493300933615717,0.008448001638772046,0.007238878614170221,-0.0026017060980490056,-0.00009613899458860855,0],[0.07335519939642954,-0.02172761420461852,0.021989114462624776,0.02152677861534761,0.010073844941591482,0.002015319634472396,0.017556854537893546,0.0004795507064226227,0.008170375936407709,-0.006737690327479577,0.000016278247828616965,0.004399633107923905,0.006557764934167835,0.005625738743291919,0.007459984073002567,0.003924641723830894,0.005729259567372746,-0.026876401175234023,0.0012390540390119443,-0.00042554822846282444,-0.005964888981662466,-0.008074390138739732,0.00138395853412218,0.001849555359203581,0.0008865879562731896,0],[0.04615047182046875,0.00901208371577266,0.02703358974925584,0.0035947516658006206,0.013145243019257919,-0.00350453188058991,-0.005428723925224959,0.013678255601188271,-0.02275742175242575,0.008822005266729669,0.00031017244371082454,-0.01027175644405587,0.02392529009206987,0.015060616169067323,-0.005427058387140608,-0.0071368943697043335,-0.023080026897501365,0.0005258039055128013,-0.0014680709949315563,0.00992721073541749,0.0062203902272443675,-0.002499543755505071,-0.0009577467627607581,0.002572746879935526,0.00016230350865436953,0],[-0.041091278570220005,0.08886128013393324,-0.032952780683535125,0.004428031760581468,0.009221850283964524,0.009827777874920106,0.004223479927330496,0.023967801333843217,-0.003362943970194904,-0.015155810894206166,0.006166804585679552,0.012461025840032097,0.02901059157524227,-0.009312921694883063,0.011708701427229715,-0.0027928336781055814,0.00997182228516359,-0.00021150696956937816,-0.005308103673179125,-0.00041080461583357583,0.0009195662774669898,0.006730595715540546,-0.005428483228931041,0.0009870704017862822,0.0005106361867096562,0],[0.04841053370335807,-0.01965994456812711,0.0060609430511687264,-0.0021934440776854584,-0.026971574668779447,0.02544064001304193,0.024404937144929712,0.02656941781561736,-0.012717479590331796,0.010310331147042554,-0.0030474271563249128,0.0014564837832071547,-0.011088012692847262,0.0007822765672123363,-0.004611678662917976,0.0038974626450117562,-0.007554422797691644,0.001234429906440576,0.012646255345642371,-0.011772334338262781,-0.00020742053587252514,0.00516622017224356,0.005415574329466879,0.0031854920381682453,0.0003021939318362512,0],[0.050236956535908525,-0.021798719220976228,0.009470961408915667,-0.00423688932406239,-0.02557139406578254,0.025290946098275188,0.020712684476455242,0.010248966556675534,-0.006231904056358094,-0.006416911621885309,0.0023130155571293486,-0.009607561443915998,-0.0026396319673373005,0.0007861315301391009,-0.007937409110812452,0.006595325074306949,-0.0034250758684192225,-0.001532911955686919,-0.008598776443571078,0.004371006320224982,-0.008708935423407515,-0.00013660254974831208,-0.0047554896848948595,-0.0009774869644144956,-0.00204521191240238,0],[0.020243254635429947,0.052701104298168884,0.0011587831290119782,0.017746578511602842,0.038083716269198535,-0.028516276794793727,-0.00960817568646268,-0.015578379388879566,-0.0030254345330821848,-0.01675844163997316,0.003432888591405389,-0.02696269823206363,-0.0016981234944936938,0.00029524105616140063,0.00264057023862562,0.007652109543252955,0.0043270462422150165,0.008136249219493992,0.001996047816603693,0.0015219154138321953,-0.004067234476954849,-0.005835790804915374,0.0028699136664321052,-0.0008863786072068785,-0.0015860219551957122,0],[0.06465855275482212,-0.018509815879796086,0.029048786939215736,0.016975184339935362,0.020068461163148366,-0.0018540798929171742,0.01404268345468439,0.010855420169739177,-0.01031290451150383,-0.005759749384861785,0.009877590608156976,-0.008809166638887296,0.01204707264255829,0.002581794354894362,0.006072890271436357,-0.002645754893566266,-0.005807510464942556,0.0009708996777598762,0.009122624210993073,-0.010156023174228933,-0.006663720416855333,0.0029484425994457703,-0.0030307430276290733,-0.0051172757023668376,0.000011462251365755045,0],[0.05121039516779263,-0.0056809346908192485,0.01634372964319711,0.018045653572305538,0.030196006157917458,-0.009123897049470676,-0.014251586282662007,-0.0015346197528895804,-0.00920844921855158,0.00722220941069154,0.002747631312902025,0.0017143995399428113,0.004292400747038691,0.0029694574002684863,0.012027898323317698,0.01029793459197178,0.009046560813019064,0.006385209722119544,-0.0017728756486466444,-0.0057611372759814395,0.00019649137899545056,-0.0006914520174112429,0.001359848283727472,0.005599930437388492,0.00012952994069159883,0],[0.023813453822781137,0.005429220452731614,0.022476812705648545,-0.03821814233011333,-0.0482488161135658,-0.012334138311581724,-0.022468613138398288,-0.008749485259667959,0.0015460491650667195,0.010995318241103828,0.0032769559019051498,-0.017206399498652606,0.002746378836169189,-0.005198767298089463,0.026773284766747417,-0.004759607106357885,-0.0008195305669875462,-0.002347800613498938,0.0015970695360660516,-0.004117659555183349,0.006648345834134337,0.0009842967272956182,0.0018867740805340219,-0.004687484974686709,-0.0000014415737373498386,0],[0.038668200932156845,-0.0013395546146229168,0.01435751889278186,0.015638610681424164,0.023548279852796606,-0.021849231237514522,-0.014584618966660634,-0.005904122934075917,-0.004143223821635224,0.0014821758805763263,0.0016717533166703373,-0.010347012135441138,0.0026243508452601224,-0.006807220050446828,-0.004974846093828623,-0.006051241672548387,0.010315016366479494,-0.0036849636976462223,0.0017057487034768746,0.002959113488035996,0.005039737219581127,0.007356499476878836,0.002748582436823337,0.004463181897236441,-0.0015716000832667768,0],[0.02150816751531544,-0.001387605443957724,0.011248047181717824,-0.030256516730760182,-0.03569047735323535,-0.009551175920360698,-0.01989193531667857,0.00165688062200629,0.007816110215363358,0.008326911799343676,-0.009737555086393575,0.0074563469359556125,0.005427494831270261,0.008304445256700191,-0.00556707027659325,-0.012273995055256571,0.010328413037452397,-0.005927942871276154,0.008356734446352976,0.007966681277693097,0.0018463366117701966,-0.0037550191864191107,0.0014288441673717183,-0.0016165626924663336,-0.00016261667259874523,0],[0.06017779103233201,-0.01827196583770461,0.03490148416428495,0.029394412555837045,0.0074519220973451,0.010287711407718388,0.01005473319941286,-0.029259683345944067,0.030454021634647794,-0.003795413107710453,-0.014519236519864859,0.02106022823334244,0.020011000706914923,0.0043710352837320054,-0.008310390392793675,-0.013573136956303269,-0.0000013537869992565985,0.012010421061894672,-0.000964671958902554,-0.00497789387197224,-0.00489020211769953,0.0007139203528816149,0.0032680182727804243,-0.0009591639031894187,-0.0005060062178567192,0],[0.06283749822596058,-0.022366249253246307,0.018433017701867695,0.015343109935767322,-0.002306300272589491,0.030703890623175033,0.025087793482875105,-0.0029464167070327105,0.011374021246381233,-0.0038761035960407494,0.0006502079573432952,-0.001268298044285258,-0.021592617116729385,0.009808557922744767,0.007815611261870452,-0.009560688402796499,0.001841781045130063,0.0031027422021610625,-0.01310588486070598,-0.008379645928499841,0.010665886941282652,-0.005521269566890503,-0.004453604345250526,0.0013805907721662995,-0.00043341330286090937,0],[0.06900001465644436,-0.029776736901140504,0.025617321861399152,0.02938214475972049,0.022852934364984718,0.007486580972745615,0.01783835137548982,-0.010511384350922274,0.020259894642308388,-0.004929899042913604,-0.011086982108149675,0.008986311169049382,-0.017482277307344817,-0.015246000674076667,0.011645308010754639,0.004939045295664114,-0.006212865651701102,0.0010931185090518488,0.014541108410544125,0.01378173449363019,0.002864477669845418,0.0041039253688480905,-0.004872037475824956,0.00033559315206013366,-0.00009674778593349378,0],[0.02817893851086408,0.0005753698111430757,0.0311210241184369,0.008207071665396559,0.01832276607663449,-0.009327905010620538,-0.022269555643860364,-0.0016132820538058824,0.005168923166816595,0.027335098273177847,0.022986450505937697,0.0005900702376607952,-0.01741409177189185,0.01953738592591784,0.0018378755306021532,-0.0005222256062485437,0.005526745321359156,0.006421872919575936,-0.005359414605939656,0.006970627996299264,-0.0076890761486709735,0.005359307603143688,-0.001208904384902363,-0.0007073570749545126,0.0020212561600587895,0],[0.09993919627333646,-0.1283982592096798,-0.179452162982257,-0.035378821705665454,0.008097697507914193,-0.01366803727598301,-0.003966466569607528,-0.009017706219865397,0.0020724232828901196,-0.0011929655518445894,0.003002038293180219,0.0013403859068252062,0.0028256889405045443,0.006370052630890416,0.00210846412080578,-0.0003752186865530365,-0.0014984596529239434,0.0015860559785301834,0.0010642554011417442,0.00021077027304790963,-0.00031136402875626604,0.0004630877356303985,-0.0006239767798418532,0.0001295998271664357,-0.000018106161633094952,0]];

		var result = OPTICSClusterer.cluster(data2, 0.24);
		//Montebèlo|Teoƚo
		//Krespaòro|Bixa|Montebèlo, Istrana|Raldon
		//Krespaòro|Bixa|Montebèlo|Teoƚo, Istrana|Raldon
		//Krespaòro|Bixa|Montebèlo|Teoƚo, Vas|Toneđa, Istrana|Raldon
		//Sa Stin|Venèsia, Bixa|Montebèlo|Teoƚo|Roman, Toneđa|Vicensa, Istrana|Raldon
		//Sa Stin|Venèsia, Bixa|Montebèlo|Teoƚo|Roman, Toneđa|Vicensa|Lovadina|Kanpo San Martin, Méolo|Cerèa
		//Verona|Ŧenŧenige|Kaxan, Krespaòro|Bixa, Montebèlo|Teoƚo|Roman|Vas|Toneđa, Vicensa|Lovadina|Kanpo San Martin|Istrana
		//Verona|Ŧenŧenige|Kaxan, Krespaòro|Bixa, Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina, Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa
		//Verona|Ŧenŧenige|Kaxan, Krespaòro|Bixa, Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata
		//Verona|Ŧenŧenige|Kaxan, Belun|Sa Stin, Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lova…n|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare
		//Verona|Ŧenŧenige|Kaxan, Belun|Sa Stin|Venèsia, Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lova…n|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare
		//Verona|Ŧenŧenige|Kaxan, Belun|Sa Stin|Venèsia|Krespaòro, Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare
		//Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon, Cerèa|Frata|Vila|Kavàrxare
		//Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila
		//Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare
		//Uronŧo|Poŧale, Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare
		//Uronŧo|Poŧale, Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare|Trevixo
		//Anpeŧ|Pàđule|Uronŧo, Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare|Trevixo
		//Anpeŧ|Pàđule|Uronŧo|Poŧale|Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare
		//Anpeŧ|Pàđule|Uronŧo|Poŧale|Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare|Trevixo
		//Anpeŧ|Pàđule|Uronŧo|Poŧale|Verona|Ŧenŧenige|Kaxan|Arfanta (Tarŧo)|Belun|Sa Stin|Venèsia|Krespaòro|Bixa|Montebèlo|Teoƚo|Roman|Vas|Toneđa|Vicensa|Lovadina|Kanpo San Martin|Istrana|Raldon|Méolo|Cerèa|Frata|Vila|Kavàrxare|Trevixo|Italia

		result = result.map(function(el, i){
			return {variant: variants[i], id: el.clusterId};
		});
		var response = ArrayHelper.partition(result, function(value){ return value.id; });
		Object.keys(response).forEach(function(i){
			response[i] = response[i].map(function(el){ return el.variant; }).join('|');
		});

		console.log(response);
	});*/
});
