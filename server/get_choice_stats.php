<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

$inserted_count = 0;

try{
    $data = Array();

    $pdo = new PDO('sqlite:'.dirname(__FILE__).'/database.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT

    $get_stmt = $pdo->query(<<<EOF
    SELECT
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice ) )
    AS percentage_kids_park
    FROM player_choice
    WHERE kids_park = 1
    UNION ALL
    SELECT
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice ) )
    AS percentage_grandma_hairdresser
    FROM player_choice
    WHERE grandma_hairdresser = 1
    UNION ALL
    SELECT
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice ) )
    AS percentage_damien_stay_home
    FROM player_choice
    WHERE damien_stay_home = 1
    UNION ALL
    SELECT
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice ) )
    AS percentage_freelancer_good_love_advice
    FROM player_choice
    WHERE freelancer_good_love_advice = 1;
;
EOF
);
    $get_stmt->execute();

    $data = $get_stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);

} catch(Exception $ex) {
    die('{"result": "error at connexion: ' . $ex->getMessage() . '"}');
}
