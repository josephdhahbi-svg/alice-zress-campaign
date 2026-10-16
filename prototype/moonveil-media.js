"use strict";
(()=>{const slides=[
{title:"The Moonlit Abyss",description:"An original vision of Alice's descent into the Underdark.",effect:"mv-art-abyss"},
{title:"The Elder Eye",description:"An ancient presence stirs beyond the cavern walls.",effect:"mv-art-eye"},
{title:"Eilistraee's Light",description:"A silver light offers hope within the darkness.",effect:"mv-art-light"},
{title:"The Path Forward",description:"Five choices, one journey, and a world that remembers.",effect:"mv-art-path"}];
const $=id=>document.getElementById(id);let index=0,timer=null;const image=$("mv-gallery-image"),stage=document.querySelector(".mv-gallery-stage");if(!image||!stage)return;
function show(i){index=(i+slides.length)%slides.length;const slide=slides[index];stage.classList.remove(...slides.map(s=>s.effect));stage.classList.add(slide.effect);$("mv-gallery-title").textContent=slide.title;$("mv-gallery-description").textContent=slide.description;$("mv-gallery-count").textContent=(index+1)+" / "+slides.length;image.alt="Original Moonveil Underdark artwork: "+slide.title;}
function stop(){if(timer!==null){clearInterval(timer);timer=null;}$("mv-gallery-play").textContent="Play slideshow";$("mv-gallery-play").setAttribute("aria-pressed","false");}
$("mv-gallery-prev").addEventListener("click",()=>show(index-1));$("mv-gallery-next").addEventListener("click",()=>show(index+1));
$("mv-gallery-play").addEventListener("click",()=>{if(timer!==null){stop();return;}timer=setInterval(()=>show(index+1),5500);$("mv-gallery-play").textContent="Pause slideshow";$("mv-gallery-play").setAttribute("aria-pressed","true");});
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
const cinema=$("cinematic-screen"),toggle=$("mv-cinema-toggle"),status=$("mv-cinema-status");toggle.addEventListener("click",()=>{const playing=cinema.classList.toggle("mv-cinema-playing");toggle.textContent=playing?"Pause animated scene":"Play animated scene";toggle.setAttribute("aria-pressed",String(playing));status.textContent=playing?"Playing · silent animated artwork":"Paused · silent visual sequence, not a recorded video";});show(0);
})();