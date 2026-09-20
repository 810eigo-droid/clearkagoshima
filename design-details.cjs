// Editorial treatment. All original client copy remains in the page.
module.exports=({pages,image})=>{
  pages[0]=pages[0].replace('<h1>肩こり・腰のつらさを、<br>その場しのぎで<br><em>終わらせない。</em></h1>',
    '<h1><span class="hero-overline">肩こり・腰のつらさを、</span><span class="hero-line">その場しのぎで</span><em class="hero-word">終わらせない。</em></h1>');
  const collage=`<div class="hero-collage"><div class="orbit orbit-one" aria-hidden="true"></div><div class="orbit orbit-two" aria-hidden="true"></div><figure class="hero-image">${image('check-posture','理学療法士の大西英一郎が、女性のお客様の身体の状態を確認している様子','',true)}</figure><figure class="hero-detail">${image('selfcare-exercise','動き方や身体の使い方も、一緒に確認します。')}</figure><div class="hero-seal"><span>理学療法士</span><strong>13<small>年</small></strong><span>大西 英一郎</span></div><span class="photo-script" aria-hidden="true">Care for your life.</span></div>`;
  pages[0]=pages[0].replace(/<figure class="hero-image">[\s\S]*?<\/figure>/,collage);
  pages[0]=pages[0].replace('まずは今の身体の状態を知るところから。','まずは<span class="headline-mark">今の身体の状態</span>を知るところから。');
  pages[2]=pages[2].replace('「何をしたらいいかわからない」<br>から卒業するために。','「何をしたらいいか<br>わからない」<br><span class="headline-mark">から卒業するために。</span>');
  pages[3]=pages[3].replace('<h2>理学療法士として13年。<br>延べ5万人以上の身体を見てきました。</h2>',
    '<h2 class="profile-headline"><span>理学療法士として<span class="stat-value">13</span>年。</span><span>延べ<span class="stat-value">5</span>万人以上の<br>身体を見てきました。</span></h2>');
  pages[5]=pages[5].replace('安心して相談できる場所へ。','<span class="headline-mark">安心して相談できる場所へ。</span>');
  pages[6]=pages[6].replace('<div class="price-card">','<div class="price-card"><span class="price-ribbon" aria-hidden="true">FIRST VISIT</span>');
  pages[12]=pages[12].replace('これからも付き合っていくために。','<span class="headline-mark">これからも<br>付き合っていくために。</span>');
};
