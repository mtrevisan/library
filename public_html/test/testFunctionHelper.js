require(['tools/data/FunctionHelper'], function(FunctionHelper){
	module('FunctionHelper');

	test('memoize', function(){
		var count = 0;
		var factorial = FunctionHelper.memoize(function(n){
			count += 1;
			var result = 1;
			for(var i = 2; i <= n; i ++)
				result *= i;
			return result;
		});
		equal(factorial(5), 120);
		equal(factorial(5), 120);
		equal(factorial(5), 120);
		equal(count, 1);
	});

	test('compose', function(){
		var f = FunctionHelper.compose(function(value){ return value + 1; }, function(value){ return -value; }, Math.pow);

		equal(f(3, 4), -80);
	});

	test('curry', function(){
		var addFourNumbers = function(a, b, c, d){
			return a + b + c + d;
		};

		var curriedAddFourNumbers = FunctionHelper.curry(addFourNumbers),
			f = curriedAddFourNumbers(1, 2),
			g = f(3);

		equal(g(4), 10);
	});

	test('choice', function(){
		var fn = FunctionHelper.choice([
			[function(value){ return (value == 0); }, function(){ return 'water freezes at 0�C'; }],
			[function(value){ return (value == 100); }, function(){ return 'water boils at 100�C'; }],
			[function(){ return true; }, function(value){ return 'nothing special happens at ' + value + '�C'; }]
		]);

		equal(fn(0), 'water freezes at 0�C');
		equal(fn(50), 'nothing special happens at 50�C');
		equal(fn(100), 'water boils at 100�C');
	});
});
