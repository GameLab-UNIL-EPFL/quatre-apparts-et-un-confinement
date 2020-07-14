from glob import glob
import pandas as pd

path = '../sprites/StoreScene/part3/*'

sprites = glob(path)

template = """new CardObject(
    this,
    { name: "NAME", url: "PATH" },
    new Phaser.Math.Vector2(20, 30),
    (scene) => scene.takeObject("NAME"),
    this
),
"""

rows = []

for sprite_path in sprites:
    path = sprite_path.replace('../', '')
    name = sprite_path.split('_')[-1].split('.')[0]
    code = template.replace("NAME", name).replace("PATH", path)
    rows.append([name, code])
df = pd.DataFrame(rows, columns = ['name', 'text'])

df.sort_values('name')['text'].apply(lambda t: print(t))