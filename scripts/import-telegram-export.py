"""Розбирає експорт Telegram-каналу (Telegram Desktop → Експорт історії → JSON + фото)
у чернетку каталогу: пости з текстом, ціною, розмірами та прив'язаними фото.

Використання:
  python3 -I scripts/import-telegram-export.py <тека-експорту> <тека-результату>

Результат:
  posts.json  — чернетка для перенесення в src/data/catalog/products.ts
  posts.md    — те саме для перегляду людиною
  photos/     — фото, перейменовані як post-<N>-<k>.jpg

Нічого не вигадує: якщо ціну чи розміри не знайдено, поле лишається порожнім.
"""

import json
import os
import re
import shutil
import sys
from datetime import datetime

KEYCAPS = {f'{d}️⃣': str(d) for d in range(10)}
KEYCAPS.update({f'{d}⃣': str(d) for d in range(10)})

PRICE_RE = re.compile(r'(?:ціна|price|вартість)\s*[:\-–—]?\s*([\d\s.,]{2,})', re.I)
SIZES_LINE_RE = re.compile(r'розмір(?:и)?\s*[:\-–—]?\s*(.*)', re.I)
BULLET_RE = re.compile(r'^\s*[•\-–·*]\s*(.+)$')


def plain_text(t):
    """У JSON експорту текст буває рядком або списком фрагментів."""
    if isinstance(t, str):
        return t
    out = []
    for part in t or []:
        out.append(part if isinstance(part, str) else part.get('text', ''))
    return ''.join(out)


def normalize_digits(s):
    for k, v in KEYCAPS.items():
        s = s.replace(k, v)
    return s


def find_price(text):
    m = PRICE_RE.search(normalize_digits(text))
    if not m:
        return None
    digits = re.sub(r'\D', '', m.group(1))
    return int(digits) if digits else None


def find_sizes(text):
    lines = text.splitlines()
    for i, line in enumerate(lines):
        m = SIZES_LINE_RE.search(line)
        if not m:
            continue
        rest = m.group(1).strip(' :–-—')
        if rest:
            # «Розміри - M L» або «Розмір - S (oversize, може бути на M)»
            note = re.search(r'\(([^)]*)\)', rest)
            main = re.sub(r'\([^)]*\)', '', rest)
            values = [v for v in re.split(r'[\s,/]+', main) if v]
            return values, (note.group(1) if note else '')
        # Розміри списком нижче: «• 41.5 (26 см)»
        values = []
        for nxt in lines[i + 1:]:
            b = BULLET_RE.match(nxt)
            if not b:
                if nxt.strip():
                    break
                continue
            values.append(b.group(1).strip())
        return values, ''
    return [], ''


def first_line(text):
    for line in text.splitlines():
        t = re.sub(r'\(живі фото\)', '', line, flags=re.I).strip(' ✔️✅🔥')
        if t:
            return t
    return ''


def main(src, out):
    data = json.load(open(os.path.join(src, 'result.json'), encoding='utf-8'))
    msgs = [m for m in data.get('messages', []) if m.get('type') == 'message']
    for m in msgs:
        m['_t'] = datetime.fromisoformat(m['date'])
        m['_text'] = plain_text(m.get('text', ''))

    # Альбом в експорті — кілька повідомлень поспіль; текст зазвичай лише в одному з них.
    posts, cur = [], None
    for m in msgs:
        same_album = cur and (m['_t'] - cur['_last']).total_seconds() <= 5 and not (m['_text'] and cur['text'])
        if not same_album:
            cur = {'date': m['date'], 'text': '', 'photos': [], '_last': m['_t']}
            posts.append(cur)
        if m['_text']:
            cur['text'] = m['_text']
        if m.get('photo'):
            cur['photos'].append(m['photo'])
        cur['_last'] = m['_t']

    os.makedirs(os.path.join(out, 'photos'), exist_ok=True)
    result = []
    for n, p in enumerate([p for p in posts if p['text'] or p['photos']], 1):
        files = []
        for k, rel in enumerate(p['photos'], 1):
            srcf = os.path.join(src, rel)
            if os.path.exists(srcf):
                name = f'post-{n}-{k}{os.path.splitext(rel)[1] or ".jpg"}'
                shutil.copy(srcf, os.path.join(out, 'photos', name))
                files.append(name)
        sizes, note = find_sizes(p['text'])
        result.append({
            'n': n,
            'date': p['date'],
            'title': first_line(p['text']),
            'price': find_price(p['text']),
            'sizes': sizes,
            'sizeNote': note,
            'photos': files,
            'text': p['text'],
        })

    json.dump(result, open(os.path.join(out, 'posts.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    with open(os.path.join(out, 'posts.md'), 'w', encoding='utf-8') as f:
        for r in result:
            f.write(f"## {r['n']}. {r['title'] or '(без тексту)'}\n")
            f.write(f"- дата: {r['date']}\n- ціна: {r['price'] or '—'}\n- розміри: {', '.join(r['sizes']) or '—'}"
                    f"{' (' + r['sizeNote'] + ')' if r['sizeNote'] else ''}\n- фото: {', '.join(r['photos']) or '—'}\n\n")
    print(f"постів: {len(result)}, з ціною: {sum(1 for r in result if r['price'])}, "
          f"з фото: {sum(1 for r in result if r['photos'])}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
