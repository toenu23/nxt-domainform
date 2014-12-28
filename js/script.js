$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {

		if (this.name == 'ip' || 'ns') {
			this.value = splitTrim(this.value);
		}

		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');

		} else {
			o[this.name] = this.value || '';
		}

		if (this.value == '') {
			delete o[this.name]
		}
	});

	return o;
};

var splitTrim = function(data) {
	data = data.split(',');
	data = $.map(data, $.trim);
	if (data.length < 2) {
		data = data.toString();
	}
	return data;
}
$(function() {

	$('form').submit(function() {

		result = JSON.stringify($('form').serializeObject());
		$('#result-text').val(result);
		// stop form from actually submit
		return false;

	});

	$('#method').on('change', function() {

		if (this.value == 'Nameservers') {

			$('#group-ip').hide();
			$('#ip').val('');
			$('#group-ns').show();

		}

		if (this.value == 'IP Address') {

			$('#group-ns').hide();
			$('#ns').val('');
			$('#group-ip').show();

		}

	});

	$('#btnTest').click(function() {

		$('#test-result').text('');

		var data = {};
		data.domain = $('#domain').val();

		$.ajax({

			url : "dnstest.php",
			data : data,
			dataType : 'json',
			type : 'POST',

		}).done(function(response) {

			if ('errorCode' in response) {

				$('#test-result').text('Error: ' + response.errorDescription);

			} else if ('_ip' in response) {

				if (response._ip.match(/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/)) {
					$('#test-result').text(data.domain + '.nxt resolves to IP address ' + response._ip);
				} else {
					$('#test-result').text(data.domain + '.nxt contains invalid IP address ' + response._ip);
				}

			} else if ('_ns' in response) {

				var output;
				output = data.domain + " has authoratitive nameservers " + response._ns + "<br/>";

				if ('_nsips' in response) {
					output += "Nameserver(s) returned IP address(es): " + response._nsips;
				} else {
					output += "Nameserver(s) invalid or did not return any IP address for " + data.domain + '.nxt';
				}

				$('#test-result').html(output);

			} else {

				$('#test-result').text('Alias registered but not configured for DNS.');

			}
		});
	});
});
