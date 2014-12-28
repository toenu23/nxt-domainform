<?php
/**
 * Nxt Helper class
 */
class Nxt {

	public static function call($query = array()) {

		$url = 'http://127.0.0.1:7876/nxt?';

		$ch = curl_init($url);

		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, count($query));
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($query));

		$result = curl_exec($ch);
		curl_close($ch);

		return json_decode($result);
	}

}
