<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$data = json_decode(file_get_contents('php://input'), true);

$query_columns = join(", ", array_keys($data) );
$query_values = join(", :", array_keys($data) );

$inserted_count = 0;

try{
    $pdo = new PDO('sqlite:'.dirname(__FILE__).'/database.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
} catch(Exception $e) {
    echo "Erreur d’accès à la bdd: ".$e->getMessage();
    die();
}

// INSERT
$statement_text = '';

try {
    $pdo->beginTransaction();

		// prepare add statement
		$count_stmt = $pdo->prepare("SELECT COUNT(*) FROM player_choice WHERE player_id = ?");

		$count_stmt->execute([$data['player_id']]);

		$pdo->commit();

    $count = $count_stmt->fetchColumn();

} catch(PDOException $ex) {
    die('{"result": "error: ' . $ex->getMessage() . '"}'); // send back errors
}

echo '{"result": "success", "count": "' . $count . '"}';
