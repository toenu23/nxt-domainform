<?php
require_once ('lib/Nxt.php');

$alias = isset($_POST['domain']) ? $_POST['domain'] : '';

if (!$alias) {
	exit ;
}

$query = array();
$query['requestType'] = 'getAlias';
$query['aliasName'] = $alias;

$result = Nxt::call($query);

if (isset($result -> aliasURI)) {

	$aliasObj = json_decode($result -> aliasURI);

	if (isset($aliasObj -> ip)) {

		$result -> _ip = $aliasObj -> ip;

	}

	if (isset($aliasObj -> ns)) {

		$result -> _ns = $aliasObj -> ns;

		$nameservers = explode(',', $aliasObj -> ns);
		$host = escapeshellarg($alias) . '.nxt';
		$ips = array();

		foreach ($nameservers as $nameserver) {

			// already got results
			if (!empty($ips)) {
				break;
			}

			// nameserver invalid
			if (!filter_var(gethostbyname($domain), FILTER_VALIDATE_IP)) {
				break;
			}

			$dns = escapeshellarg($nameserver);
			$ip = `nslookup $host $dns`;

			if (preg_match_all('/Address: ((?:\d{1,3}\.){3}\d{1,3})/', $ip, $match) > 0) {
				$ips = $match[1];
			}

		}

		if (!empty($ips)) {

			$result -> _nsips = implode(', ', $ips);

		}

	}

}

echo json_encode($result);
