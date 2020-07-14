import requests

def sendJson(_url, _json):
    r = False
    counter = 1
    while counter < 10:
        try:
            r = requests.post(_url, json=_json)
        except requests.exceptions.RequestException as e:  # This is the correct syntax
            print ('Attempt', counter, '>', e)
        if r == True:
            if r.status_code == 200:
                print('JSON sent at attempt', counter)
                break
            else:
                print('Attempt', counter, '>', r.status_code)
        counter += 1
    return r

payload = {
    'player_id': 1209380,
    'damien_clothes': 1
}

response = sendJson('https://labs.letemps.ch/interactive/2020/_sandbox/_covidou_server/add_choices.php', payload)

print(response.json())