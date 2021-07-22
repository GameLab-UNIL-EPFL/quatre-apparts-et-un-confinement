from enum import Enum
import json as js

class Langs(Enum):
    EN = "en"
    FR = "fr"

def flatten(list):
    res = ""
    for elem in list:
        res = res + elem + "\n"
    return res

def getTexts(filename):
    texts = []
    with open(filename) as file:
        json = js.loads(flatten(file.readlines()))
        for entry in json:
            texts = texts + list((json[entry]["text"]))
    return texts

def getPercentage(baseLang, lang):
    filenames = [
        "damienDialogApril",
        "damienDialogJune",
        "damienDialogMarch",
        "example",
        "florenceDialogApril",
        "florenceDialogJune",
        "florenceDialogMarch",
        "grandmaDialogApril",
        "grandmaDialogJune",
        "grandmaDialogMarch",
        "hallwayDialog",
        "patrickDialogApril",
        "patrickDialogJune",
        "patrickDialogMarch"
    ]

    basesrc = "src/dialogue/"
    extension = ".json"

    sames = 0.0
    total = 0.0
    for files in filenames:
        linesBase = getTexts(basesrc + baseLang + "/" + files + extension)
        linesLang = getTexts(basesrc + lang + "/" + files + extension)
        total = total + len(linesBase)
        for idx in range(0, len(linesBase)):
            baseTexts = linesBase[idx]
            langTexts = linesLang[idx]
            if baseTexts != langTexts:
                sames = sames + 1
    return int((sames / total) * 10000) / 100

if __name__ == "__main__":
    print("\n========== FRENCH TO ENGLISH TRANSLATION ==========\n" + str(getPercentage("fr", "en")) + "%\n===================================================\n")
