const fs=require('node:fs');
const path=require('node:path');
module.exports=({pages,settings,btn})=>{
  const exists=name=>fs.existsSync(path.join(__dirname,'images',name+'.webp'));
  const photo=(name,alt)=>`<img src="images/${name}.webp" alt="${alt}" loading="lazy" decoding="async">`;
  const replace=(section,old,name,alt)=>{
    if(exists(name)) pages[section-1]=pages[section-1].replace(new RegExp('<img[^>]*src="images/'+old+'\\.webp"[^>]*>'),photo(name,alt));
  };
  replace(2,'treatment-hands','02-concerns','肩の重さが気になる女性のイメージ');
  replace(4,'profile-onishi','04-therapist','担当する理学療法士、大西英一郎');
  replace(5,'profile-onishi','05-flow-01-counseling','お悩みを伺うカウンセリングのイメージ');
  replace(5,'selfcare-exercise','05-flow-03-selfcare','セルフケアを一緒に確認するイメージ');
  replace(7,'selfcare-exercise','07-care-detail','タオルとアドバイス用紙のイメージ');
  replace(10,'check-posture','10.koe','ご利用いただいた方の声をご案内するイメージ');
  if(exists('01-intro-consultation')) pages[0]=pages[0].replace('<div class="hero-intro wrap"><div>','<div class="hero-intro wrap"><div>').replace('</h2></div><div><p>clearでは','</h2><figure class="intro-consultation">'+photo('01-intro-consultation','身体の状態についてお話を伺う様子')+'</figure></div><div><p>clearでは');
  const url=settings.reviews?.googleUrl;
  if(url){
    if(!/^https:\/\//.test(url))throw Error('Google review URL must use HTTPS');
    pages[9]=pages[9].replace('<div class="voice-list">','<div class="center-action">'+btn('Googleで確認する',url,'button-green')+'</div><div class="voice-list">');
  }
};

