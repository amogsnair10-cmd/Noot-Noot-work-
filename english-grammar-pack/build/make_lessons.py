# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lesson_data import L, SVS
from make_worksheets import PENGUIN

OUT = os.path.join(os.path.dirname(__file__), "..")
DOM = {"Leading Self": "#F0597A", "Leading Others": "#FDCB2E", "Leading India": "#A9C41F"}
TOPIC_COL = ["#F0597A", "#14A9D1", "#F5B800", "#8FB300", "#FF7A00", "#8A5CD6", "#FF7A00", "#F0597A", "#14A9D1"]

CSS = """
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; }
body { margin:0; font-family:'Patrick Hand','Comic Sans MS',sans-serif; font-size:13.3px; color:#23232f; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
h1,h2,h3,.lbl,.tag { font-family:'Baloo 2','Patrick Hand',sans-serif; }
.pg { width:297mm; height:210mm; overflow:hidden; padding:8mm 10mm; page-break-after:always; position:relative; }
.noot { width:46px; height:auto; }
.band { display:flex; align-items:center; gap:12px; border:3px solid #23232f; border-radius:255px 14px 225px 14px/14px 225px 14px 255px; padding:3px 18px; margin-bottom:6px; background:color-mix(in srgb, var(--c) 18%, white); }
.band .n { width:46px; height:46px; border-radius:50%; background:var(--c); color:#fff; font:700 26px 'Baloo 2'; display:flex; align-items:center; justify-content:center; border:3px solid #23232f; flex:none; }
.band h1 { margin:0; font-size:23px; line-height:1.05; } .band .tp { font:700 11.5px 'Baloo 2'; letter-spacing:2px; color:#555; }
.band .meta { margin-left:auto; text-align:right; font-size:12.5px; color:#444; }
.timeline { display:flex; height:19px; border:2px solid #23232f; border-radius:10px; overflow:hidden; margin:0 0 6px; font:700 11px 'Baloo 2'; color:#fff; line-height:15px; }
.timeline div { text-align:center; white-space:nowrap; overflow:hidden; border-right:2px solid #23232f; } .timeline div:last-child { border:0; }
table.lp { width:100%; border-collapse:collapse; table-layout:fixed; }
table.lp td, table.lp th { border:1.5px solid #8d8d9a; vertical-align:top; padding:5px 9px; }
table.lp thead th { background:#FFC000; text-decoration:underline; font:700 13.5px 'Baloo 2'; text-align:center; padding:2px; }
td.bar { width:13mm; background:#FF6D00; color:#fff; padding:0; text-align:center; vertical-align:middle; border-color:#FF6D00; }
td.bar span { display:inline-block; writing-mode:vertical-rl; transform:rotate(180deg); font:700 17px 'Baloo 2'; letter-spacing:4px; }
td.mq { width:25mm; text-align:center; vertical-align:middle; font:700 15px 'Baloo 2'; }
td.step { width:28mm; text-align:center; font:italic 700 12.5px 'Baloo 2'; vertical-align:middle; color:#222; }
td.step small { display:block; font-weight:400; font-style:normal; font-size:11px; color:#555; }
td.plan { line-height:1.3; font-size:14.6px; }
td.plan p { margin:0 0 3px; }
td.w { background:#fff; } td.b { background:#FFF2CC; }
ul.t { margin:0; padding-left:0; list-style:none; } ul.t li { margin:0 0 2px; padding-left:0; }
tr { break-inside: avoid; }
.xt { display:grid; grid-template-columns: 1.35fr 1fr 1fr; gap:7px; margin-top:7px; }
.xb { border:2px solid #23232f; border-radius:12px 5px 14px 5px; padding:4px 10px; font-size:13.8px; line-height:1.25; break-inside:avoid; }
.xb h3 { margin:0 0 2px; font-size:14.5px; } .xb .sv { margin:3px 0; padding-left:7px; border-left:6px solid; }
.xb .sv b { font-family:'Baloo 2'; } .xb small { color:#555; }
.band.mini { padding:1px 18px; } .band.mini .n { width:34px; height:34px; font-size:20px; } .band.mini h1 { font-size:19px; } .band.mini .noot { width:34px; }\n.ft { position:absolute; left:10mm; right:10mm; bottom:4mm; text-align:center; font-size:11px; color:#888; }\n.cover { background:#fff; }
.cover h1 { font-size:46px; color:#F0597A; margin:0; line-height:1; } .cover .sub { font-size:20px; color:#444; }
.cvhead { display:flex; align-items:center; gap:22px; margin:0 0 3mm; } .cvhead .noot { width:80px; }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.box { border:2.5px solid #23232f; border-radius:16px 6px 18px 6px; padding:5px 12px; background:#fff; font-size:13.8px; line-height:1.28; }
.box h2 { margin:0 0 3px; font-size:19px; }
table.ov { width:100%; border-collapse:collapse; font-size:12.3px; margin-top:4px; }
table.ov th { background:#23232f; color:#fff; padding:3px 6px; text-align:left; font-family:'Baloo 2'; }
table.ov td { border-bottom:1.5px dotted #aaa; padding:3px 6px; vertical-align:top; }
.dot { display:inline-block; width:11px; height:11px; border-radius:50%; margin-right:5px; border:1.5px solid #23232f; vertical-align:-1px; }
"""

TL = [("Spark 5", 5, "#FF7A00"), ("KLA 10", 10, "#14A9D1"), ("Assessment 18 (group work + individual check)", 18, "#8FB300"), ("Close 2", 2, "#8A5CD6")]


def timeline():
    return '<div class="timeline">' + "".join(f'<div style="width:{w / 35 * 100:.1f}%;background:{c}">{t if w > 3 else ""}</div>' for t, w, c in TL) + '</div>'


def svs_block(l):
    h = '<div class="xb" style="background:#FFF9F0"><h3>🌟 SVS Link (target: Level 2 ➜ Level 3)</h3>'
    for k in l["svs"]:
        dom, sub, l2, l3 = SVS[k]
        h += (f'<div class="sv" style="border-color:{DOM[dom]}"><b>{dom} • {sub}</b><br>'
              f'<small><b>L2:</b> {l2}.</small><br><small><b>L3:</b> {l3}.</small></div>')
    h += f'<div><b>Look-fors today:</b> {l["look"]}</div></div>'
    return h


def table(rows, first_idx=0):
    body = ""
    for n, (mq, step, sub, plan, cls, first, span, col) in enumerate(rows):
        tr = "<tr>"
        if n == 0:
            tr += f'<td class="bar" rowspan="{len(rows)}"><span>LESSON PLAN</span></td>'
        if first:
            tr += f'<td class="mq" rowspan="{span}" style="background:{col}">{mq}</td>'
        tr += f'<td class="step">{step}{f"<small>{sub}</small>" if sub else ""}</td><td class="plan {cls}">{plan}</td></tr>'
        body += tr
    return (f'<table class="lp"><colgroup><col style="width:13mm"><col style="width:25mm"><col style="width:28mm"><col></colgroup>'
            f'<thead><tr><th></th><th>5 Magic Questions</th><th>Steps (35 mins)</th><th>Plan</th></tr></thead><tbody>{body}</tbody></table>')


def lesson_page(l, i):
    c = TOPIC_COL[i]
    rowsA = [
        ("Purpose", "Objective", "", l["obj"], "w", True, 2, "#EAD1DC"),
        (None, "Big Question", "", l["bigq"], "b", False, 0, None),
        ("Integration", "Why", "", l["why"], "b", True, 1, "#FFF2CC"),
        ("Method", "Spark", "(5 mins)", l["spark"], "w", True, 2, "#CFE2F3"),
        (None, "KLA", "(10-12 mins)", l["kla"], "b", False, 0, None),
    ]
    rowsB = [
        ("Mastery", "Assessment", "(18-20 mins)", l["assess"], "w", True, 2, "#D0E0E3"),
        (None, "Closing", "(2 mins)", l["closing"], "b", False, 0, None),
        ("Partnership", "Group Work", "(fun in teams!)", l["group"], "w", True, 1, "#FCE5CD"),
    ]
    band = (f'<div class="band"><div class="n">{l["no"]}</div><div><div class="tp">{l["topic"].upper()} • GRADE 4 • 35 MINUTES</div>'
            f'<h1>{l["title"]}</h1></div><div class="meta"><b>Practice:</b> {l["ws"]}</div>{PENGUIN}</div>')
    mini = (f'<div class="band mini"><div class="n">{l["no"]}</div><div><h1>{l["title"]} <small style="font-weight:400;font-size:14px">(continued)</small></h1></div>{PENGUIN}</div>')
    pa = f'<div class="pg" style="--c:{c}">{band}{timeline()}{table(rowsA)}<div class="ft">Page 1 of 2 • Lesson {l["no"]}: {l["topic"]} ➜ turn over for Assessment, Closing &amp; Group Work</div></div>'
    pb = (f'<div class="pg" style="--c:{c}">{mini}{table(rowsB)}'
          f'<div class="xt">{svs_block(l)}<div class="xb"><h3>🧰 Materials &amp; Prep</h3>{l["mats"]}</div><div class="xb"><h3>🎯 Differentiation</h3>{l["diff"]}</div></div>'
          f'<div class="ft">Page 2 of 2 • Lesson {l["no"]}: {l["topic"]}</div></div>')
    return pa + pb


def front():
    ov = "".join(
        f'<tr><td><b>{l["no"]}</b></td><td><span class="dot" style="background:{TOPIC_COL[i]}"></span><b>{l["topic"]}</b>: {l["title"]}</td><td>{l["bigq"]}</td><td>{l["ws"]}</td>'
        f'<td>{" • ".join(SVS[k][1] for k in l["svs"])}</td></tr>' for i, l in enumerate(L))
    cover = f"""<div class="pg cover"><div class="cvhead">{PENGUIN}<div><div class="tag" style="font-weight:700;letter-spacing:2px;color:#555">NOOT-NOOT ENGLISH CLUB • GRADE 4</div><h1>Grammar Detectives</h1><div class="sub">9 lesson plans • 35 minutes each • FUN, FAST &amp; EFFECTIVE</div></div></div>
<div class="grid2">
<div class="box"><h2>⏱️ The 35-minute flow (TFI template)</h2>{timeline()}
<b>Spark (5)</b> a funny hook that makes the “why” come alive<br><b>KLA (10)</b> key learning activity: I do ➜ We do ➜ You do<br><b>Assessment (18)</b> group work (~12) + individual check (~6)<br><b>Closing (2)</b> revisit the Big Question
<p style="margin:4px 0 0">Each lesson follows the <b>5 Magic Questions</b>: <b>Purpose</b> (objective, big question) • <b>Integration</b> (why) • <b>Method</b> (spark, KLA) • <b>Mastery</b> (assessment, closing) • <b>Partnership</b> (group work).</p></div>
<div class="box"><h2>🎬 What makes these lessons LOVED by 4th graders</h2>Every lesson has a silly spark, moving around (corners, doors, floor lines), <b>acting, dialogues and conversations</b>, and a team challenge (skits, treasure hunt, council, escape room). Objectives are short and kid-friendly (“I can…”) so children always know <b>why</b> they are learning. Each lesson has <b>pre-emergent / emergent / stretch</b> supports.</div>
</div>
<div class="box" style="margin-top:8px"><h2>📚 Teaching sequence (lessons + worksheets)</h2>
<table class="ov"><tr><th>#</th><th>Lesson</th><th>Big Question</th><th>Worksheets</th><th>SVS focus</th></tr>{ov}</table>
<p style="margin:4px 0 0"><b>Suggested flow:</b> L1 Nouns → L2 Verbs → L3 Adjectives → <b>Mixed 1</b> • L4 Pronouns → L5 Articles → L6 Prepositions → <b>Mixed 2</b> • L7 Adverbs → L8 Conjunctions → <b>Mixed 3</b> • L9 Sentences → <b>Mixed 4</b> → <b>Grand Challenge</b>. Use the lesson for the first worksheet; the second worksheet is for the next class or independent practice.</p></div></div>"""
    svs_rows = "".join(
        f'<tr><td><span class="dot" style="background:{DOM[SVS[k][0]]}"></span>{SVS[k][0]}</td><td><b>{SVS[k][1]}</b></td><td>{SVS[k][2]}.</td><td>{SVS[k][3]}.</td>'
        f'<td>{", ".join(str(l["no"]) for l in L if k in l["svs"])}</td></tr>' for k in SVS)
    svs = f"""<div class="pg"><div class="band" style="--c:#FDCB2E"><div class="n">★</div><div><div class="tp">SVS SCALE (STUDENT VALUES &amp; SKILLS) LINKS</div><h1>How the lessons build the SVS skills</h1></div>{PENGUIN}</div>
<div class="box"><p style="margin:0 0 4px">Grade 4 children typically sit between <b>Level 2</b> and <b>Level 3</b>. Each lesson names the SVS skills it practises and gives <b>look-fors</b> so you can notice, name and celebrate the behaviour (“I saw you ask a teammate for help. That is Level 3!”). Use the “I” statements as exit-talk with children.</p>
<table class="ov"><tr><th>Domain</th><th>Skill</th><th>Level 2: “I…”</th><th>Level 3: “I…”</th><th>Lessons</th></tr>{svs_rows}</table></div>
<div class="grid2" style="margin-top:8px"><div class="box"><h2>How to use SVS during the lesson</h2>• Before the group task, <b>name the target</b>: “Today we practise Build Community: we ask for help when we need it.”<br>• While circulating, tally <b>look-fors</b> on a sticky note.<br>• In the closing, praise 2–3 specific behaviours and ask: “Which level did your team reach today?”</div>
<div class="box"><h2>Tips for a smooth lesson</h2>• Set group roles BEFORE the activity starts.<br>• Use a 30-second countdown (“3-2-1 freeze!”) for transitions.<br>• For pre-emergent learners, start orally, then add pictures, then words.<br>• Keep the penguin <b>Noot</b> (a toy or drawing) as your class mascot.</div></div></div>"""
    return cover + svs


def build():
    pages = front() + "".join(lesson_page(l, i) for i, l in enumerate(L))
    open(os.path.join(OUT, "Grade4_Grammar_LessonPlans.html"), "w", encoding="utf-8").write(
        f'<!doctype html><html><head><meta charset="utf-8"><title>Grade 4 Grammar Lesson Plans</title><style>{CSS}</style></head><body>{pages}</body></html>')


if __name__ == "__main__":
    build()
