# -*- coding: utf-8 -*-
import random, html, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from worksheet_data import WS

OUT = os.path.join(os.path.dirname(__file__), "..")
LETTERS = "ABCDEFGHIJ"
ICON = dict(match="🔗", choose="✅", fill="✏️", write="💬", order="🧩", sequence="🔢")
HINT = dict(
    match="Draw a line from one side to the other. Start with the <b>green example</b>!",
    choose="Read the sentence. Circle the best answer. Check the <b>green example</b> first!",
    fill="Pick a word from the <b>Word Box</b>. Write it on the line. Read it aloud to check!",
    write="Say your sentence out loud first. Use the starter to help you. Finish with a full stop!",
    order="Move the chips in your head. Start with a Capital letter, end with a full stop.",
    sequence="Which happened first? Write 1, 2, 3, 4 in the boxes.",
)

PENGUIN = """<svg class="noot" viewBox="0 0 100 124" xmlns="http://www.w3.org/2000/svg">
<g stroke="#23232f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
<ellipse cx="22" cy="74" rx="9" ry="22" fill="#2f3044" transform="rotate(14 22 74)"/>
<ellipse cx="78" cy="74" rx="9" ry="22" fill="#2f3044" transform="rotate(-14 78 74)"/>
<ellipse cx="50" cy="66" rx="31" ry="42" fill="#2f3044"/>
<ellipse cx="50" cy="76" rx="20" ry="30" fill="#fff"/>
<ellipse cx="40" cy="38" rx="8.5" ry="9.5" fill="#fff"/><ellipse cx="60" cy="38" rx="8.5" ry="9.5" fill="#fff"/>
<circle cx="42" cy="40" r="3.4" fill="#23232f"/><circle cx="58" cy="40" r="3.4" fill="#23232f"/>
<path d="M39 50 Q50 44 61 50 Q50 66 39 50Z" fill="#FF8A00"/>
<ellipse cx="36" cy="110" rx="12" ry="5.5" fill="#FF8A00"/><ellipse cx="64" cy="110" rx="12" ry="5.5" fill="#FF8A00"/>
<path d="M30 28 Q50 14 70 28" fill="none" stroke="#F0597A" stroke-width="5"/>
</g></svg>"""


def esc(s):
    return html.escape(s, quote=False)


def rng_for(*a):
    return random.Random(sum((i + 3) * (hash(str(x)) % 9973 if False else sum(map(ord, str(x)))) for i, x in enumerate(a)))


def shuffled(lst, seed):
    r = random.Random(seed)
    for _ in range(50):
        c = lst[:]
        r.shuffle(c)
        if c != lst or len(lst) < 2:
            return c
    return lst[::-1]


def blank(ans, filled=False):
    w = 170 if len(ans) > 11 else 118
    if filled:
        return f'<span class="blank filled" style="min-width:{w}px">{esc(ans)}</span>'
    return f'<span class="blank" style="min-width:{w}px"></span>'


def fill_sentence(s, ans, filled=False):
    return s.replace("____", blank(ans, filled), 1)


def render_section(ws, si, sec, qstart):
    """returns (html, next_q, key_html)"""
    t = sec["type"]
    L = LETTERS[si]
    items = sec["items"]
    q = qstart
    key = []
    out = [f'<section class="sec {t}"><div class="sec-h"><span class="badge" style="background:{ws["color"]}">{L}</span>'
           f'<span class="sec-t">{ICON[t]} {sec["title"]}</span></div><div class="hint">💡 {HINT[t]}</div>']

    if t == "match":
        ex, rest = items[0], items[1:]
        rights = shuffled([r for _, r in rest], ws["no"] * 31 + si)
        out.append(f'<div class="exbox"><span class="extag">SOLVED EXAMPLE ⭐</span>'
                   f'<div class="mrow ex"><span class="ml">{ex[0]}</span><span class="dot"></span><span class="mid"><i></i></span><span class="dot"></span><span class="mr">{ex[1]}</span></div></div>')
        out.append('<div class="mgrid">')
        for i, (l, _) in enumerate(rest):
            out.append(f'<div class="mrow"><span class="ml"><b class="n">{q + i}.</b> {l}</span><span class="dot"></span><span class="mid"></span><span class="dot"></span>'
                       f'<span class="mr"><b class="lt">{LETTERS[i]}.</b> {rights[i]}</span></div>')
        out.append('</div>')
        for i, (l, r) in enumerate(rest):
            key.append(f'{q + i}→{LETTERS[rights.index(r)]} ({esc(r) if not r.startswith("<") else r})')
        q += len(rest)

    elif t == "choose":
        ex, rest = items[0], items[1:]

        def opts(item, n, example=False):
            qq, ok, wr = item
            pos = (n + ws["no"]) % (len(wr) + 1)
            o = wr[:]
            o.insert(pos, ok)
            cls = lambda w: "opt ok" if (example and w == ok) else "opt"
            return o, "".join(f'<span class="{cls(w)}"><i class="circ">{"✔" if (example and w == ok) else ""}</i>{esc(w)}</span>' for w in o), "abcd"[o.index(ok)]
        o, oh, _ = opts(ex, 1, True)
        out.append(f'<div class="exbox"><span class="extag">SOLVED EXAMPLE ⭐</span><div class="q"><span class="qtxt">{fill_sentence(ex[0], "", False)}</span><div class="opts">{oh}</div></div></div>')
        for i, it in enumerate(rest):
            o, oh, let = opts(it, q + i)
            out.append(f'<div class="q"><b class="n">{q + i}.</b><span class="qtxt">{fill_sentence(it[0], "", False)}</span><div class="opts">{oh}</div></div>')
            key.append(f'{q + i}→{esc(it[1])}')
        q += len(rest)

    elif t == "fill":
        ex, rest = items[0], items[1:]
        bank = shuffled([a for _, a in rest], ws["no"] * 17 + si)
        out.append('<div class="bank"><span class="bank-t">📦 WORD BOX</span>' + "".join(f'<span class="chip">{esc(w)}</span>' for w in bank) + '</div>')
        out.append(f'<div class="exbox"><span class="extag">SOLVED EXAMPLE ⭐</span><div class="q f">{fill_sentence(ex[0], ex[1], True)}</div></div>')
        for i, (s, a) in enumerate(rest):
            out.append(f'<div class="q f"><b class="n">{q + i}.</b> {fill_sentence(s, a)}</div>')
            key.append(f'{q + i}→{esc(a)}')
        q += len(rest)

    elif t == "write":
        ex, rest = items[0], items[1:]
        def wblock(prompt, starter, sample, draw, example=False, n=None):
            s = f'<div class="q w{" exq" if example else ""}">'
            s += (f'<b class="n">{n}.</b> ' if n else "") + f'<span class="qtxt">{prompt}</span>'
            s += f'<div class="starter">🌟 Starter: <i>{esc(starter)}</i></div>'
            if draw:
                s += '<div class="drawbox"><span>🖍️ draw here</span></div>'
            if example:
                s += f'<div class="wline"><span class="ans">{esc(sample)}</span></div>'
            else:
                s += '<div class="wline"></div><div class="wline"></div>'
            return s + '</div>'
        out.append(f'<div class="exbox"><span class="extag">SOLVED EXAMPLE ⭐</span>{wblock(ex[0], ex[1], ex[2], ex[3], True)}</div>')
        for i, (p, st, sm, dr) in enumerate(rest):
            out.append(wblock(p, st, sm, dr, False, q + i))
            key.append(f'{q + i}→<i>{esc(sm)}</i> (answers vary)')
        q += len(rest)

    elif t == "order":
        ex, rest = items[0], items[1:]
        def ordblock(chips, ans, example, n=None):
            ch = "".join(f'<span class="chip big">{esc(c)}</span>' for c in shuffled(chips, ws["no"] * 7 + len(ans)))
            s = f'<div class="q o"><div class="chips">{(f"<b class=\"n\">{n}.</b> " if n else "")}{ch}</div>'
            s += f'<div class="wline"><span class="ans">{esc(ans) if example else ""}</span></div></div>'
            return s
        out.append(f'<div class="exbox"><span class="extag">SOLVED EXAMPLE ⭐</span>{ordblock(ex[0], ex[1], True)}</div>')
        for i, (c, a) in enumerate(rest):
            out.append(ordblock(c, a, False, q + i))
            key.append(f'{q + i}→{esc(a)}')
        q += len(rest)

    elif t == "sequence":
        def seqblock(story, example, n=None):
            order = shuffled(list(range(len(story))), ws["no"] * 5 + len(story[0]))
            rows = ""
            for pos in order:
                box = f'<i class="seqbox">{pos + 1 if example else ""}</i>'
                rows += f'<div class="seqrow">{box}<span>{esc(story[pos])}</span></div>'
            return f'<div class="q sq">{(f"<b class=\"n\">{n}.</b>" if n else "")}<div class="seqs">{rows}</div></div>', order
        h, _ = seqblock(items[0], True)
        out.append(f'<div class="exbox"><span class="extag">SOLVED EXAMPLE ⭐</span>{h}</div>')
        for i, st in enumerate(items[1:]):
            h, order = seqblock(st, False, q + i)
            out.append(h)
            key.append(f'{q + i}→ boxes top to bottom: {", ".join(str(p + 1) for p in order)}')
        q += len(items) - 1

    out.append('</section>')
    return "".join(out), q, key


def header(ws, page):
    mixed = '<span class="mixedtag">MIXED ⭐</span>' if ws.get("mixed") else ""
    if page == 1:
        return (f'<header class="top" style="--c:{ws["color"]}"><div class="num">{ws["no"]}</div>'
                f'<div class="ttl"><div class="tp">{ws["topic"].upper()} {mixed}</div><h1>{ws["title"]}</h1></div>{PENGUIN}</header>'
                f'<div class="nameline">Name: <span></span> Class: <span class="s"></span> Date: <span class="s"></span></div>')
    return (f'<header class="top mini" style="--c:{ws["color"]}"><div class="num">{ws["no"]}</div>'
            f'<div class="ttl"><h1>{ws["title"]}</h1></div>{PENGUIN}</header>')


def render_sheet(ws):
    splits = ws.get("splits", [2])
    secs, keys, q = [], [], 1
    for si, sec in enumerate(ws["sections"]):
        h, q, k = render_section(ws, si, sec, q)
        secs.append(h)
        keys.append((LETTERS[si], sec["title"], sec["type"], k))
    total_q = q - 1
    bounds = [0] + splits + [len(secs)]
    npages = len(bounds) - 1
    cards = "".join(f'<div class="card"><div class="em">{e}</div><div class="cl">{l}</div></div>' for e, l in ws["cards"])
    out = ""
    for pi in range(npages):
        body = "".join(secs[bounds[pi]:bounds[pi + 1]])
        last = pi == npages - 1
        if pi == 0:
            top = (f'{header(ws, 1)}<div class="can">⭐ <b>Today I can:</b> {ws["can"]}</div>'
                   f'<div class="learn"><span class="ltag">LET\'S LEARN</span><p>{ws["rule"]}</p><div class="cards">{cards}</div></div>'
                   f'<div class="tip">{PENGUIN}<div class="bubble"><b>Noot says:</b> {ws["tip"]}</div></div>')
        else:
            top = header(ws, 2)
        sc = ('<div class="selfcheck"><b>How did I do?</b> Circle one: <span>😟 I need help</span><span>🙂 I got most</span><span>🤩 I got it!</span>'
              '<div class="stars">⭐⭐⭐ Colour a star for each part you finished!</div></div>') if last else ""
        more = "" if last else " &nbsp;➜ turn over!"
        ft = f'Noot-Noot English Club • Grade 4 • Worksheet {ws["no"]} • Page {pi + 1} of {npages}{more}' + (f' • {total_q} questions' if last else '')
        tg = ws.get("tight")
        tight = tg is True or (isinstance(tg, list) and pi in tg)
        cls = "page" + (" later" if pi > 0 and not tight else "")
        out += f'<div class="{cls}" style="--c:{ws["color"]}">{top}{body}{sc}<footer>{ft}</footer></div>'
    return out, keys, total_q, npages


CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin:0; padding:0; }
body { font-family: 'Patrick Hand', 'Comic Sans MS', sans-serif; font-size: 15.5px; color:#23232f; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1,h2,.num,.ltag,.extag,.badge,.bank-t,.tp,.mixedtag { font-family: 'Baloo 2', 'Patrick Hand', sans-serif; }
.page { width:210mm; height:297mm; padding:7mm 11mm 12mm; position:relative; overflow:hidden; page-break-after:always; background:#fff; }
.top { display:flex; align-items:center; gap:14px; border:3px solid #23232f; border-radius:255px 18px 225px 18px/18px 225px 18px 255px; padding:6px 16px; background: color-mix(in srgb, var(--c) 18%, white); }
.top .num { flex:none; width:58px; height:58px; border-radius:50%; background:var(--c); color:#fff; font-size:34px; font-weight:700; display:flex; align-items:center; justify-content:center; border:3px solid #23232f; line-height:1; }
.top .ttl { flex:1; }
.top h1 { margin:0; font-size:27px; line-height:1.05; }
.tp { font-size:13px; letter-spacing:2px; color:#555; font-weight:700; }
.mixedtag { background:#23232f; color:#fff; padding:1px 8px; border-radius:20px; font-size:11px; margin-left:6px; letter-spacing:1px; }
.noot { width:54px; height:auto; flex:none; }
.top.mini { padding:2px 14px; } .top.mini .num { width:40px; height:40px; font-size:22px; } .top.mini h1 { font-size:20px; } .top.mini .noot { width:34px; }
.nameline { margin:5px 2px 2px; font-size:16px; display:flex; gap:10px; align-items:flex-end; }
.nameline span { flex:2; border-bottom:2px dotted #666; height:18px; } .nameline span.s { flex:1; }
.can { background:#FFF6CF; border:2px dashed #E0A000; border-radius:14px; padding:4px 12px; margin:5px 0; font-size:16.5px; }
.learn { position:relative; border:2.5px solid #23232f; border-radius:20px 8px 22px 8px; padding:10px 14px 6px; margin:11px 0 4px; background: color-mix(in srgb, var(--c) 8%, white); }
.ltag { position:absolute; top:-13px; left:16px; background:var(--c); color:#fff; padding:0 12px; border-radius:16px; font-size:14px; letter-spacing:1.5px; border:2px solid #23232f; }
.learn p { margin:2px 0 6px; font-size:16px; line-height:1.25; }
.cards { display:flex; gap:9px; justify-content:center; flex-wrap:wrap; }
.card { background:#fff; border:2px solid #23232f; border-radius:14px 6px 16px 6px; padding:4px 10px 3px; text-align:center; min-width:82px; }
.card .em { font-size:28px; line-height:1.1; min-height:40px; display:flex; align-items:center; justify-content:center; font-family:'Noto Color Emoji','Patrick Hand'; }
.card .cl { font-size:15px; font-weight:700; color:#23232f; }
.tip { display:flex; align-items:center; gap:8px; margin:6px 0 2px; }
.tip .noot { width:40px; }
.bubble { position:relative; background:#E6F7FC; border:2px solid #14A9D1; border-radius:16px; padding:3px 12px; font-size:15.5px; }
.bubble:before { content:''; position:absolute; left:-9px; top:50%; margin-top:-7px; border:7px solid transparent; border-right-color:#14A9D1; border-left:0; }
.sec { margin:7px 0 4px; }
.sec-h { display:flex; align-items:center; gap:8px; }
.badge { width:26px; height:26px; border-radius:50%; color:#fff; font-weight:700; display:flex; align-items:center; justify-content:center; font-size:16px; border:2px solid #23232f; flex:none; }
.sec-t { font-family:'Baloo 2'; font-weight:700; font-size:18.5px; }
.hint { font-size:14px; color:#555; margin:1px 0 4px 34px; }
.exbox { position:relative; background:#F1FAE1; border:2px dashed #7CA600; border-radius:12px; padding:9px 10px 4px; margin:7px 0 6px; }
.extag { position:absolute; top:-11px; left:12px; background:#7CA600; color:#fff; font-size:12px; font-weight:700; padding:0 9px; border-radius:12px; letter-spacing:.5px; }
.q { margin:4px 0; line-height:1.25; }
.n { display:inline-block; min-width:24px; color:var(--c); font-family:'Baloo 2'; font-size:17px; }
.opts { display:flex; flex-wrap:wrap; gap:6px 12px; margin:2px 0 0 26px; }
.exbox .opts { margin-left:2px; }
.opt { display:inline-flex; align-items:center; gap:5px; font-size:16px; }
.circ { display:inline-flex; width:19px; height:19px; border:2px solid #23232f; border-radius:50%; align-items:center; justify-content:center; font-style:normal; font-size:13px; color:#fff; }
.opt.ok .circ { background:#7CA600; border-color:#7CA600; } .opt.ok { color:#4d6d00; font-weight:700; }
.blank { display:inline-block; border-bottom:2px solid #23232f; height:20px; vertical-align:bottom; margin:0 3px; text-align:center; }
.blank.filled { color:#2E8B00; font-size:19px; line-height:18px; border-bottom-color:#2E8B00; }
.bank { display:flex; flex-wrap:wrap; gap:6px 8px; align-items:center; background:#FFF6E0; border:2px solid #FFB300; border-radius:14px; padding:4px 10px; margin:2px 0 4px; }
.bank-t { font-size:13px; font-weight:700; color:#B26A00; }
.chip { display:inline-block; border:2px solid #23232f; border-radius:12px 5px 12px 5px; padding:0 10px; background:#fff; font-size:17px; }
.chip.big { font-size:18px; padding:2px 11px; margin:2px 0; }
.mgrid .mrow, .mrow { display:flex; align-items:center; margin:5px 0; min-height:28px; }
.ml { flex:0 0 46%; font-size:16px; line-height:1.2; } .mr { flex:0 0 38%; font-size:16px; line-height:1.2; }
.mid { flex:1; height:2px; } .mid i { display:block; height:3px; background:#2E8B00; border-radius:3px; transform:rotate(-1.5deg); }
.dot { flex:none; width:12px; height:12px; border-radius:50%; background:#23232f; margin:0 4px; }
.lt { color:var(--c); font-family:'Baloo 2'; }
.mr { font-size:17px; }
.starter { font-size:14.5px; color:#666; margin:1px 0 0 26px; }
.exq .starter { margin-left:2px; }
.wline { height:28px; margin:3px 0 0 0; border-bottom:2px solid #8a8aa0; background: linear-gradient(to bottom, transparent 49%, #cfd3e6 49%, #cfd3e6 52%, transparent 52%); position:relative; }
.wline .ans { position:absolute; left:6px; bottom:1px; color:#2E8B00; font-size:19px; }
.drawbox { height:64px; border:2px dashed #999; border-radius:14px; margin:3px 0 3px 26px; color:#aaa; font-size:13px; padding:2px 8px; }
.chips { display:flex; flex-wrap:wrap; gap:4px 8px; align-items:center; }
.seqs { display:grid; gap:4px; margin:3px 0 0 6px; }
.seqrow { display:flex; align-items:center; gap:8px; font-size:17px; }
.seqbox { width:26px; height:26px; border:2px solid #23232f; border-radius:7px; display:inline-flex; align-items:center; justify-content:center; font-style:normal; color:#2E8B00; font-size:19px; flex:none; background:#fff; }
.q.sq { margin:6px 0; }
.selfcheck { position:absolute; left:11mm; right:11mm; bottom:15mm; border:2px dashed #aaa; border-radius:14px; padding:4px 12px; font-size:15.5px; background:#fafafa; }
.selfcheck span { margin-left:12px; padding:0 8px; border:2px solid #23232f; border-radius:12px; background:#fff; }
.selfcheck .stars { font-size:13.5px; color:#777; margin-top:2px; }
footer { position:absolute; left:11mm; right:11mm; bottom:6mm; text-align:center; font-size:12.5px; color:#777; border-top:1.5px dotted #bbb; padding-top:2px; }

.later .wline { height:36px; }
.later .q.f { margin:10px 0; font-size:17px; }
.later .drawbox { height:92px; }
.later .q { margin:7px 0; }
.later .seqrow { margin:2px 0; }
.later .sec { margin:11px 0 6px; }
/* prepositions doodle scenes */
.scene { position:relative; width:74px; height:48px; margin:auto; font-size:26px; }
.scene .a, .scene .b { position:absolute; font-family:'Noto Color Emoji'; }
.scene.in .b { left:20px; top:6px; font-size:38px; } .scene.in .a { left:30px; top:17px; font-size:18px; z-index:3; }
.scene.on .b { left:20px; top:20px; font-size:34px; } .scene.on .a { left:26px; top:-3px; font-size:26px; }
.scene.under .b { left:20px; top:-2px; font-size:34px; } .scene.under .a { left:26px; top:24px; font-size:24px; }
.scene.behind .b { left:30px; top:6px; font-size:36px; z-index:2; } .scene.behind .a { left:12px; top:10px; font-size:30px; z-index:1; }
.scene.front .b { left:12px; top:6px; font-size:36px; z-index:1; } .scene.front .a { left:38px; top:14px; font-size:30px; z-index:2; }
"""


def build_student():
    pages, keyall, counts = [], [], []
    # cover
    pgstart, cur = {}, 2
    for w in WS:
        pgstart[w["no"]] = cur
        cur += len(w.get("splits", [2])) + 1
    rows = "".join(
        f'<tr><td class="cn" style="background:{w["color"]}">{w["no"]}</td><td>{w["title"]}</td><td>{w["topic"]}{" ⭐" if w.get("mixed") else ""}</td><td class="pg">{pgstart[w["no"]]}–{pgstart[w["no"]] + len(w.get("splits", [2]))}</td></tr>'
        for w in WS)
    cover = (f'<div class="page cover"><div class="cvtop">{PENGUIN}<div><div class="tp">NOOT-NOOT ENGLISH CLUB • GRADE 4</div><h1>Grammar Detectives</h1><div class="sub">20 guided worksheets for pre-emergent &amp; emergent readers</div></div></div>'
             f'<div class="cvbox"><b>How these worksheets work:</b> every section starts with a <b style="color:#2E8B00">green SOLVED EXAMPLE ⭐</b>. Read it, then try yours! '
             f'Each worksheet has 17+ questions: <b>match</b>, <b>choose</b>, <b>fill in the blank</b> and <b>write your own sentences</b>.</div>'
             f'<table class="toc"><tr><th>#</th><th>Worksheet</th><th>Topic</th><th>Pages</th></tr>{rows}</table>'
             f'<footer>Worksheets 16–20 ⭐ are MIXED revision sheets • Noot-Noot English Club</footer></div>')
    pages.append(cover)
    for w in WS:
        h, keys, tq, _np = render_sheet(w)
        pages.append(h)
        keyall.append((w, keys, tq))
        counts.append(tq)
    css = CSS + """
.cover { background: linear-gradient(#fff, #fff); }
.cvtop { display:flex; align-items:center; gap:22px; margin:8mm 0 10mm; } .cvtop .noot { width:110px; }
.cvtop h1 { font-size:50px; margin:0; line-height:1; color:#F0597A; } .sub { font-size:20px; color:#444; }
.cvbox { border:2.5px dashed #FF7A00; border-radius:18px; padding:10px 16px; background:#FFF6E0; font-size:18px; margin-bottom:10px; }
.toc { width:100%; border-collapse:collapse; font-size:17px; } .toc th { background:#23232f; color:#fff; padding:3px 8px; text-align:left; font-family:'Baloo 2'; }
.toc td { border-bottom:1.5px dotted #bbb; padding:3px 8px; } .toc td.cn { color:#fff; font-weight:700; text-align:center; font-family:'Baloo 2'; width:34px; } .toc td.pg { text-align:center; }
"""
    doc = f'<!doctype html><html><head><meta charset="utf-8"><title>Grade 4 Grammar Worksheets</title><style>{css}</style></head><body>{"".join(pages)}</body></html>'
    open(os.path.join(OUT, "Grade4_Grammar_Worksheets.html"), "w", encoding="utf-8").write(doc)

    # answer key
    cards = []
    for w, keys, tq in keyall:
        body = ""
        for L, title, t, k in keys:
            body += f'<div class="kl"><b>{L}. {title}</b><div>{" &nbsp;•&nbsp; ".join(k)}</div></div>'
        cards.append(f'<div class="kc" style="border-color:{w["color"]}"><div class="kh" style="background:{w["color"]}">Worksheet {w["no"]}: {w["title"]} <span>({tq} Qs)</span></div>{body}</div>')
    kcss = """
@page { size: A4; margin: 0; } * { box-sizing:border-box; }
body { font-family:'Patrick Hand'; font-size:13.5px; color:#23232f; margin:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
h1 { font-family:'Baloo 2'; margin:0; } .kp { width:210mm; padding:10mm; page-break-after:always; }
.kc { border:2.5px solid; border-radius:12px; margin-bottom:8px; overflow:hidden; break-inside:avoid; }
.kh { color:#fff; font-family:'Baloo 2'; font-weight:700; padding:1px 10px; font-size:15px; } .kh span { font-weight:400; opacity:.9; font-size:12px; }
.kl { padding:2px 10px; border-bottom:1px dotted #ccc; line-height:1.3; } .kl:last-child { border:0; }
.top { display:flex; gap:12px; align-items:center; margin-bottom:8px; } .noot { width:44px; }
"""
    pages_k = []
    for i in range(0, 20, 4):
        pages_k.append(f'<div class="kp"><div class="top">{PENGUIN}<h1>Teacher Answer Key {"(cont.)" if i else ""} <small style="font-size:14px;font-weight:400">Grade 4 Grammar Detectives</small></h1></div>{"".join(cards[i:i + 4])}</div>')
    open(os.path.join(OUT, "Grade4_Grammar_AnswerKey.html"), "w", encoding="utf-8").write(
        f'<!doctype html><html><head><meta charset="utf-8"><title>Answer Key</title><style>{kcss}</style></head><body>{"".join(pages_k)}</body></html>')
    print("question counts:", counts)


if __name__ == "__main__":
    build_student()
