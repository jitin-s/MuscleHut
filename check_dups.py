with open('build_styles.css', 'r', encoding='utf-8') as f:
    text1 = f.read()
print('Count of :root in css:', text1.count(':root'))

with open('build_body.html', 'r', encoding='utf-8') as f:
    text2 = f.read()
print('Count of hero in body:', text2.count('id="hero"'))

with open('build_script.js', 'r', encoding='utf-8') as f:
    text3 = f.read()
print('Count of isPlayingPumpBeat in js:', text3.count('isPlayingPumpBeat'))
