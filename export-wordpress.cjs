const fs=require('node:fs');
const path=require('node:path');

// Scope this project's simple CSS rules, including nested @media rules.
// Unsupported at-rules fail loudly instead of silently leaking styles into WordPress.
function scopeCSS(css){
  css=css.replace(/@charset\s+[^;]+;/g,'').replace(/\/\*[\s\S]*?\*\//g,'');
  let result='',pos=0;
  while(pos<css.length){
    const start=css.indexOf('{',pos);
    if(start<0){if(css.slice(pos).trim())throw Error('Unexpected CSS tail');break;}
    const head=css.slice(pos,start).trim();
    let depth=1,end=start+1;
    for(;end<css.length&&depth;end++){if(css[end]==='{')depth++;else if(css[end]==='}')depth--;}
    if(depth)throw Error('Unbalanced CSS');
    const body=css.slice(start+1,end-1);
    if(head.startsWith('@media')) result+=`${head}{\n${scopeCSS(body)}}\n`;
    else if(head.startsWith('@'))throw Error('Unsupported CSS at-rule: '+head);
    else {
      const selectors=head.split(',').map(x=>x.trim()).filter(x=>x!=='html');
      if(selectors.length) result+=selectors.map(x=>x===':root'||x==='body'?'.clear-lp':x==='*'?'.clear-lp, .clear-lp *':'.clear-lp '+x).join(',')+'{'+body+'}\n';
    }
    pos=end;
  }
  return result;
}
module.exports=({html,pages,settings})=>{
  const out=path.join(__dirname,'wordpress');
  fs.mkdirSync(out,{recursive:true});
  const write=(name,text)=>fs.writeFileSync(path.join(out,name),text+'\n');
  const src=fs.readFileSync(path.join(__dirname,'styles.css'),'utf8');
  const scoped=scopeCSS(src)+`
/* WordPress integration: styles are limited to the LP. */
.clear-lp{display:block;width:100%;max-width:none;margin:0!important;padding:0;border:0;isolation:isolate;text-align:left;font-style:normal;font-weight:400}
.clear-lp section[id]{scroll-margin-top:32px}
.clear-lp a{box-shadow:none}
.clear-lp img{max-width:100%;border:0;box-shadow:none}
.clear-lp p,.clear-lp li,.clear-lp dd{font-family:var(--sans)}
.clear-lp h1,.clear-lp h2,.clear-lp h3{padding:0;border:0;background:none;color:inherit;text-transform:none}
.clear-lp h1::before,.clear-lp h1::after,.clear-lp h2::before,.clear-lp h2::after,.clear-lp h3::before,.clear-lp h3::after{content:none}
.clear-lp .hero h1 em{color:var(--green)}
.clear-lp .dark h2{color:var(--paper)}
.clear-lp .serif,.clear-lp .hero-message{font-family:var(--serif)}
.clear-lp .hero-intro p{color:var(--paper)}
.clear-lp .voices-intro{padding-bottom:28px}
.clear-lp .voices-outro{padding-top:28px}
.clear-lp .voices-outro .center-action{margin-top:30px}
.clear-lp .review-fallback{padding:0}
.clear-lp .review-fallback .voice-list{margin:0}
.clear-lp-page{width:100%;max-width:none!important;gap:0!important;padding:0!important}
.clear-lp-page>*{margin-block-start:0!important;margin-block-end:0!important;max-width:none!important}
.clear-lp-reviews{margin:0!important;padding:0 max(22px,calc((100% - 1160px)/2))!important;background:#f7f5ef;color:#292e2b;font-size:18px;line-height:1.95}
.clear-lp-reviews p{font-size:18px;line-height:1.95}
@media(max-width:640px){.clear-lp{padding-bottom:0}.clear-lp .site-footer{padding-bottom:calc(112px + env(safe-area-inset-bottom))}.clear-lp .voices-intro{padding-bottom:25px}.clear-lp .voices-outro{padding-top:25px}}
`;
  write('00-common.css',scoped);
  write('00-common-style.html','<!-- 最初に1回だけ貼付。保存時にstyleが消える場合は00-common.cssを追加CSSへ。 -->\n<style>\n'+scoped+'</style>');
  const media=h=>h.replace(/src="images\/([^"/]+)"/g,(_,file)=>{
    const url=settings.imageUrls[file]||settings.imageBaseUrl+file;
    if(!/^https:\/\//.test(url))throw Error('WordPress image URL must be HTTPS: '+file);
    return 'src="'+url.replaceAll('&','&amp;').replaceAll('"','&quot;')+'"';
  });
  const wpIds=h=>h.replace(/\bid="([^" ]+)"/g,(_,id)=>`id="clear-${id}"`).replace(/href="#([^" ]+)"/g,(_,id)=>`href="#clear-${id}"`);
  const pretty=h=>h.replace(/></g,'>\n<');
  const wrap=h=>pretty(media(wpIds('<div class="clear-lp">'+h+'</div>')));
  const header=html.match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
  const footer=html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0];
  const sticky=html.match(/<nav class="mobile-booking"[\s\S]*?<\/nav>/)[0];
  const voice=pages[9];
  const voiceStart=voice.indexOf('<div class="voice-list">');
  const voiceEnd=voice.indexOf('<p class="fineprint">');
  const intro=voice.slice(0,voiceStart).replace('class="section voices"','class="section voices voices-intro"')+'</div></section>';
  const outro='<div class="section voices voices-outro"><div class="wrap">'+voice.slice(voiceEnd).replace(/<\/section>$/,'</div>');
  const fallback='<div class="review-fallback"><div class="wrap">'+voice.slice(voiceStart,voiceEnd)+'</div></div>';
  const parts=[
    ['01-sections-01-03.html',wrap(header+pages.slice(0,3).join('\n'))],
    ['02-sections-04-06.html',wrap(pages.slice(3,6).join('\n'))],
    ['03-sections-07-09-and-voices-heading.html',wrap(pages.slice(6,9).join('\n')+intro)],
    ['04-sections-11-13-and-footer.html',wrap(outro+pages.slice(10,13).join('\n')+footer+sticky)]
  ];
  for(const [name,body] of parts)write(name,`<!-- ${name}: このファイル全体を1つのカスタムHTMLブロックへ貼り付け -->\n${body}`);
  write('reviews-fallback.html','<!-- プラグイン導入前だけ使用。03と04の間へ。プラグイン稼働後は削除して二重表示を防ぐ。 -->\n'+wrap(fallback));
  write('preview.html',`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>clear｜WordPress用4分割プレビュー</title><link rel="stylesheet" href="00-common.css"><style>body{margin:0}.theme-check{padding:8px;font:16px sans-serif;background:#fff;color:#111}</style></head><body><main class="clear-lp-page">${parts.slice(0,3).map(x=>x[1]).join('\n')}${wrap(fallback)}${parts[3][1]}</main></body></html>`);
  console.log('Exported four independent WordPress blocks, scoped CSS, review fallback, and preview.');
};
