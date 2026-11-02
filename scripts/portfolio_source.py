"""Extract original source as data, never execute its JS/HTML. Only KO.rbit is migrated."""
from pathlib import Path
from html.parser import HTMLParser
import html,json,re,hashlib
ROOT=Path(__file__).resolve().parents[1];REF='35ecfec2c43c535ea013e23720ffa6ad73108f10';REPO='allyytc/allyytc.github.io'
class Node:
 def __init__(self,tag='',attrs=(),parent=None):self.tag=tag;self.attrs=dict(attrs);self.parent=parent;self.children=[]
 def walk(self):
  yield self
  for c in self.children:
   if isinstance(c,Node):yield from c.walk()
 def text(self):return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
def norm(s):return re.sub(r'\s+',' ',html.unescape(s)).strip()
class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root]
 def handle_starttag(self,tag,attrs):
  n=Node(tag,attrs,self.stack[-1]);self.stack[-1].children.append(n)
  if tag not in {'img','br','hr','input','meta','link','source','wbr','area','embed','col','param','track'}:self.stack.append(n)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==tag:self.stack=self.stack[:i];return
 def handle_data(self,s):self.stack[-1].children.append(s)
def parse(path):
 p=Parser();p.feed(path.read_text());return p.root
def source(path,anchor=None):
 d={'repository':REPO,'ref':REF,'path':path}
 if anchor:d['anchor']=anchor
 return d
def rich(n):
 out=[]
 for c in n.children:
  if isinstance(c,str):out.append(re.sub(r'\s+',' ',c))
  elif c.tag in ('strong','em'):out.append({'text':norm(c.text()),'emphasis':c.tag})
  elif c.tag=='a':out.append({'text':norm(c.text()),'href':c.attrs.get('href','')})
  else:out.extend(rich(c))
 return out
