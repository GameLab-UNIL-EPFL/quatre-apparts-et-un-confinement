<?php
header('Content-Type: text/html; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);

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
    
    // format: {'damien_clothes'; 1}
    
		// prepare add statement
		$add_stmt = $pdo->prepare("INSERT OR REPLACE INTO player_choice " .
			"(damien_clothes) " .
			"VALUES" .
			"(:damien_clothes)");

		$add_stmt->execute(array(
			':damien_clothes' => $data['damien_clothes'],
		));

		$pdo->commit();
		$inserted_count += $add_stmt->rowCount();

} catch(PDOException $ex) {
    die('{"result": "error at INSERT: ' . $ex->getMessage() . '"}'); // send back errors
}

echo '{"result": "success", "inserted_rows": "' . $inserted_count . '"}';
