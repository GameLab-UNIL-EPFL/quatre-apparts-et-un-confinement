(WITH
    (SELECT COUNT(*)
    FROM player_choice)
AS player_count,

    (SELECT (COUNT(*) / 100)
    FROM player_choice P
    WHERE P.kids_park = 1)
AS kids_park_percent,

    (SELECT (COUNT(*) / 100)
     FROM player_choice P1
     WHERE P1.grandma_hairdresser = 1)
AS grandma_hairdresser_percent,

    (SELECT (COUNT(*) / 100)
     FROM player_choice P2
     WHERE P2.damien_stay_home = 1)
AS damien_stay_home_percent,

    (SELECT (COUNT(*) / 100)
     FROM player_choice P3
     WHERE P3.freelancer_good_love_advice = 1)
AS freelancer_good_love_advice_percent)

SELECT * / (SELECT * FROM player_count)
FROM kids_park_percent K, grandma_hairdresser_percent G, damien_stay_home_percent D, freelancer_good_love_advice_percent F
