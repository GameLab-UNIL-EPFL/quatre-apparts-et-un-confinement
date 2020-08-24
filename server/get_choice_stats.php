<?php
header("Access-Control-Allow-Origin: *");
// header('Content-Type: application/json; charset=utf-8');

$inserted_count = 0;

try{
    $data = Array();

    $pdo = new PDO('sqlite:'.dirname(__FILE__).'/database.db');
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT

    $get_stmt = $pdo->query(<<<EOF
    SELECT
    'kids_park' AS choice,
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice WHERE kids_park IS NOT NULL ) ) AS percentage
    FROM player_choice
    WHERE kids_park = 1
    UNION ALL
    SELECT
    'grandma_hairdresser' AS choice,
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice WHERE grandma_hairdresser IS NOT NULL) ) AS percentage
    FROM player_choice
    WHERE grandma_hairdresser = 1
    UNION ALL
    SELECT
    'damien_stay_home' AS choice,
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice WHERE damien_stay_home IS NOT NULL) ) AS percentage
    FROM player_choice
    WHERE damien_stay_home = 1
    UNION ALL
    SELECT
    'freelancer_good_love_advice' AS choice,
    ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice WHERE freelancer_good_love_advice IS NOT NULL) ) AS percentage
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
