from glob import glob

path = '../sprites/StoreScene/part1/*'

sprites = glob(path)

template = """new CardObject(
this,
{ name: "NAME", url: "PATH" },
new Phaser.Math.Vector2(0, -300),
(scene) => scene.takeObject("NAME"),
this
),
"""

for sprite_path in sprites:
    path = sprite_path.replace('../', '')
    name = sprite_path.split('_')[-1].split('.')[0]
    print(template.replace("NAME", name).replace("PATH", path))
