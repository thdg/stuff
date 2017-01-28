$(document).ready(function() {
	function run() {
		var controler = $('.bf-controler'),
			input = $('#input', controler).val(),
			program = $('#program', controler).val(),
			memory = $('#memory', controler).val();
			if (memory==='') { memory = 30000; }
		$('#output', controler).val(bf(program, memory, input));
	}
	$('#run').click(run);
});