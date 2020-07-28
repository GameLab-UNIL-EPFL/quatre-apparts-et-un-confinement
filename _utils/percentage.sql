SELECT ROUND( (count(*) *100 ) / (SELECT count(*) FROM player_choice ) ) as percentage
FROM player_choice
WHERE kids_park = 1


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
