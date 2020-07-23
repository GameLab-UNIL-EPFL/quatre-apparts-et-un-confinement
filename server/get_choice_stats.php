<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

$inserted_count = 0;

try{
    $data = Array();

    $pdo = new PDO('sqlite:'.dirname(__FILE__).'/dabatase.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT

    $get_stmt = $pdo->query(<<<EOF
    SELECT *
    FROM player_choice
    LIMIT 10;
EOF
);
    $get_stmt->execute();

    $data = $get_stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);

} catch(Exception $ex) {
    die('{"result": "error at connexion: ' . $ex->getMessage() . '"}');
}
