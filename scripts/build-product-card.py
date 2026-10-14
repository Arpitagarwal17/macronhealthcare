"""Render the approved Product Card with one fixed typography scale.

Usage: python scripts/build-product-card.py [--install]
The approved wording is maintained in assets/product-card-approved-entries.json.
Long text receives more card/page space; no product-specific font reduction.
"""

from argparse import ArgumentParser
from functools import lru_cache
from pathlib import Path
import json
import re
import shutil

from PIL import Image
from pypdf import PdfReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf'
W, H = 1122, 1402
TOP, BOTTOM = 213, 1328
NAVY, TEAL, INK = '#052C63', '#008A8E', '#19323F'
BRAND_SIZE, BODY_SIZE, TAG_SIZE = 34, 21, 16
BRAND_LEADING, BODY_LEADING = 36, 24.78
GAP = 12

for name, file in [('CardBody','RobotoCondensed-Regular.ttf'),('CardBold','RobotoCondensed-Bold.ttf'),('CardHeader','Roboto-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path('C:/Windows/Fonts') / file)))

def rect(c,x,y,w,h,fill,radius=0,stroke=None):
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(1)
    if radius:
        c.roundRect(x,H-y-h,w,h,radius,fill=1,stroke=int(bool(stroke)))
    else:
        c.rect(x,H-y-h,w,h,fill=1,stroke=int(bool(stroke)))

def text(c,value,x,baseline,size,font='CardBody',color=INK):
    c.setFillColor(color)
    c.setFont(font,size)
    c.drawString(x,H-baseline,value)

def wrap(value,font,size,width):
    value = re.sub(r'(\d(?:[\d.]*\d)?)\s+(mg|mcg|gm|g|ml|IU|I\.U\.|kcal)\b',lambda m:m[1]+'\u00a0'+m[2],value)
    lines=[]
    for paragraph in value.split('\n'):
        line=''
        for word in paragraph.split(' '):
            if pdfmetrics.stringWidth(word,font,size)>width and '-' in word:
                if line:
                    lines.append(line)
                    line=''
                for piece in re.findall(r'[^-]+-?',word):
                    if line and pdfmetrics.stringWidth(line+piece,font,size)>width:
                        lines.append(line)
                        line=piece
                    else:
                        line+=piece
                continue
            candidate=(line+' '+word).strip()
            if line and pdfmetrics.stringWidth(candidate,font,size)>width:
                lines.append(line)
                line=word
            else:
                line=candidate
        if line:
            lines.append(line)
    assert all(pdfmetrics.stringWidth(s,font,size)<=width+.01 for s in lines), (value,width)
    return lines

def geometry(item,width):
    content_width=width-146
    titles=wrap(item['brand'],'CardBold',BRAND_SIZE,content_width)
    tag_width=pdfmetrics.stringWidth(item['form'],'CardBold',TAG_SIZE)+22
    assert tag_width<=content_width,(item['brand'],'form tag too wide')
    title_width=pdfmetrics.stringWidth(item['brand'],'CardBold',BRAND_SIZE)
    inline=len(titles)==1 and title_width+tag_width+16<=content_width
    offset=22+len(titles)*BRAND_LEADING+(7 if inline else 39)
    lines=wrap(item['composition'],'CardBody',BODY_SIZE,content_width)
    return {'titles':titles,'lines':lines,'inline':inline,'offset':offset,'height':offset+len(lines)*BODY_LEADING+14,'tag_width':tag_width}

def frame(c,section):
    rect(c,0,0,W,H,'#FFFFFF')
    c.setFillColor(NAVY)
    p=c.beginPath();p.moveTo(1010,H);p.lineTo(W,H);p.lineTo(W,H-234)
    p.curveTo(1060,H-214,1135,H-82,1010,H);c.drawPath(p,stroke=0,fill=1)
    c.setStrokeColor(TEAL);c.setLineWidth(11)
    p=c.beginPath();p.moveTo(1007,H);p.curveTo(1130,H-78,1120,H-161,1050,H-206);c.drawPath(p,stroke=1,fill=0)
    # Use the entire official logo file exactly, preserving its proportions.
    logo=ROOT/'public/logo.png'
    with Image.open(logo) as image:
        logo_h=456*image.height/image.width
    c.drawImage(str(logo),42,H-26-logo_h,width=456,height=logo_h,mask='auto')
    c.setStrokeColor(NAVY);c.setLineWidth(1.8);c.line(530,H-36,530,H-173)
    text(c,'PRODUCT LIST',578,95,54,'CardHeader',NAVY)
    section_width=pdfmetrics.stringWidth(section,'CardBold',28)+34
    rect(c,580,120,section_width,52,TEAL,14)
    text(c,section,597,157,28,'CardBold','#FFFFFF')
    c.setFillColor(NAVY)
    p=c.beginPath();p.moveTo(0,56);p.curveTo(350,-25,816,-30,W,82)
    p.lineTo(W,0);p.lineTo(0,0);p.close();c.drawPath(p,stroke=0,fill=1)
    c.setFillColor(TEAL)
    p=c.beginPath();p.moveTo(0,61);p.curveTo(130,16,255,4,359,0)
    p.lineTo(0,0);p.close();c.drawPath(p,stroke=0,fill=1)

audit=[]
def draw_card(c,item,x,y,width,height,page):
    g=geometry(item,width)
    assert height>=g['height']-.01
    assert y+height<=BOTTOM+.01
    rect(c,x+1,y+3,width,height,'#F0F3F4',19)
    rect(c,x,y,width,height,'#FFFFFF',19,'#E5E9EB')
    rect(c,x+18,y+18,58,58,TEAL,12)
    c.setFillColor('#FFFFFF');c.setFont('CardBold',36)
    c.drawCentredString(x+47,H-(y+60),str(item['number']))
    c.setStrokeColor('#D3DADB');c.setLineWidth(1)
    c.line(x+99,H-y-20,x+99,H-y-height+18)
    tx=x+123
    for i,line in enumerate(g['titles']):
        text(c,line,tx,y+22+BRAND_SIZE+i*BRAND_LEADING,BRAND_SIZE,'CardBold',NAVY)
    if g['inline']:
        px=tx+pdfmetrics.stringWidth(item['brand'],'CardBold',BRAND_SIZE)+15
        py=y+24
    else:
        px=tx
        py=y+24+len(g['titles'])*BRAND_LEADING
    rect(c,px,py,g['tag_width'],28,TEAL,7)
    text(c,item['form'],px+11,py+20,TAG_SIZE,'CardBold','#FFFFFF')
    body_y=y+g['offset']+BODY_SIZE*.84
    for line in g['lines']:
        text(c,line,tx,body_y,BODY_SIZE)
        body_y+=BODY_LEADING
    assert body_y-BODY_LEADING+BODY_SIZE*.25<y+height-3
    audit.append({'brand':item['brand'],'form':item['form'],'number':item['number'],'composition':item['composition'],'page':page,'box':[x,y,width,height],'brandFontSize':BRAND_SIZE,'bodyFontSize':BODY_SIZE,'tagFontSize':TAG_SIZE,'titles':g['titles'],'lines':g['lines']})

def balanced_columns(items,width=505):
    """Find an even number of columns, keeping existing reading order."""
    heights=[geometry(item,width)['height'] for item in items]
    available=BOTTOM-TOP
    for count in range(2,len(items)+1,2):
        target=(sum(heights)+GAP*(len(items)-count))/count
        @lru_cache(None)
        def solve(start,remaining):
            if remaining==0:
                return (0,[]) if start==len(items) else (float('inf'),[])
            best=(float('inf'),[])
            used=0
            for end in range(start+1,len(items)-remaining+2):
                used+=heights[end-1]+(GAP if end>start+1 else 0)
                if used>available:
                    break
                score,parts=solve(end,remaining-1)
                score+=(used-target)**2
                if score<best[0]:
                    best=(score,[(start,end)]+parts)
            return best
        score,parts=solve(0,count)
        if score<float('inf'):
            return [items[a:b] for a,b in parts]
    raise ValueError('Unable to paginate product entries at the fixed font sizes')

def column(c,items,x,width,page):
    base=sum(geometry(item,width)['height'] for item in items)+GAP*(len(items)-1)
    assert base<=BOTTOM-TOP
    extra=(BOTTOM-TOP-base)/len(items)
    y=TOP
    for item in items:
        height=geometry(item,width)['height']+extra
        draw_card(c,item,x,y,width,height,page)
        y+=height+GAP

def rows(c,groups,page):
    """Groups are rows of (product, left, width); never change text size."""
    heights=[max(geometry(item,width)['height'] for item,x,width in group) for group in groups]
    required=sum(heights)+GAP*(len(groups)-1)
    assert required<=BOTTOM-TOP, ('Row layout needs another page', required)
    extra=(BOTTOM-TOP-required)/len(groups)
    y=TOP
    for group,minimum in zip(groups,heights):
        height=minimum+extra
        for item,x,width in group:
            draw_card(c,item,x,y,width,height,page)
        y+=height+GAP

def build():
    args=ArgumentParser()
    args.add_argument('--install',action='store_true')
    options=args.parse_args()
    source=ROOT/'assets/product-card-approved-entries.json'
    sections=json.loads(source.read_text(encoding='utf-8'))['sections']
    assert sum(map(len,sections.values()))==59
    OUT.mkdir(exist_ok=True)
    target=OUT/'macron-product-card-uniform-fonts-2026.pdf'
    c=canvas.Canvas(str(target),pagesize=(W,H),pageCompression=1)
    c.setTitle('Macron Health Care - Product Card 2026')
    c.setAuthor('Macron Health Care')
    c.setSubject('Approved product compositions with consistent typography')
    c.setViewerPreference('DisplayDocTitle','true')
    page=0
    columns=balanced_columns(sections['tablets'])
    for i in range(0,len(columns),2):
        page+=1;frame(c,'TABLETS')
        column(c,columns[i],45,505,page)
        column(c,columns[i+1],573,505,page)
        c.showPage()
    page+=1;frame(c,'CAPSULES')
    column(c,sections['capsules'],48,1026,page);c.showPage()
    page+=1;frame(c,'SYRUPS & DRY SYRUPS')
    liquids=sections['liquids']
    rows(c,[[(item,45+528*j,505) for j,item in enumerate(liquids[i:i+2])] for i in range(0,len(liquids),2)],page)
    c.showPage()
    page+=1;frame(c,'INJECTIONS & MISCELLANEOUS')
    other=sections['injections_misc']
    rows(c,[[(other[j],40+352*j,338) for j in range(3)],[(other[3+j],40+534*j,508) for j in range(2)],[(other[5+j],40+534*j,508) for j in range(2)],[(other[7],40,1042)]],page)
    c.showPage();c.save()

    result=PdfReader(target)
    normalize=lambda value:re.sub(r'\s+','',value)
    all_text=normalize(''.join(p.extract_text() for p in result.pages))
    assert len(audit)==59
    for item in audit:
        assert normalize(item['brand']) in all_text, item['brand']
        assert normalize(item['composition']) in all_text, item['brand']
    assert {item['brandFontSize'] for item in audit}=={BRAND_SIZE}
    assert {item['bodyFontSize'] for item in audit}=={BODY_SIZE}
    assert {item['tagFontSize'] for item in audit}=={TAG_SIZE}
    (OUT/'product-card-uniform-typography-audit.json').write_text(json.dumps({'pages':page,'products':len(audit),'brandFont':'Roboto Condensed Bold','bodyFont':'Roboto Condensed Regular','brandFontSize':BRAND_SIZE,'bodyFontSize':BODY_SIZE,'tagFontSize':TAG_SIZE,'entries':audit},indent=2),encoding='utf-8')
    if options.install:
        shutil.copyfile(target,ROOT/'public/assets/pdfs/macron-product-card.pdf')
    print(target)
    print(f'Verified {len(audit)} products on {page} pages. Fixed sizes: brand {BRAND_SIZE}, composition {BODY_SIZE}, tags {TAG_SIZE}.')

if __name__=='__main__':
    build()
