<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// header('Content-Type: text/html; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);

/*$data = [
    'player_id' => 1230923,
    'damien_stay_home' => 1
  ];*/

// format: {'damien_clothes': 1}
$allowed_columns = ['player_id', 'damien_stay_home', 'damien_food', 'damien_game_score_mean', 'damien_clothes', 'damien_see_grandma', 'mother_stay_home', 'mother_game_score', 'freelancer_food_set', 'freelancer_food_amount', 'freelancer_love_advice', 'freelancer_game_score', 'grandma_books', 'grandma_advice'];

// Cf. https://stackoverflow.com/questions/134099/are-pdo-prepared-statements-sufficient-to-prevent-sql-injection
// @TODO

foreach($data as $key => $value){
  if(!in_array($key, $allowed_columns)){
    die('{"result": "unauthorized"}');
  }
}

$query_columns = join(", ", array_keys($data) );
$query_values = join(", :", array_keys($data) );

$inserted_count = 0;

try{
    $pdo = new PDO('sqlite:'.dirname(__FILE__).'/dabatase.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
} catch(Exception $e) {
    echo "Erreur d’accès à la bdd: ".$e->getMessage();
    die();
}

// INSERT

try {
    $pdo->beginTransaction();

		// prepare add statement
		$add_stmt = $pdo->prepare("INSERT OR REPLACE INTO player_choice " .
			"(" . $query_columns . ") " .
			"VALUES" .
			"(:" . $query_values . ")");

		$add_stmt->execute($data);

		$pdo->commit();
		$inserted_count += $add_stmt->rowCount();

} catch(PDOException $ex) {
    die('{"result": "error at INSERT: ' . $ex->getMessage() . '"}'); // send back errors
}

echo '{"result": "success", "inserted_rows": "' . $inserted_count . '"}';
