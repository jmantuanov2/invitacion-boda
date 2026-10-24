const weddingDate = new Date("2026-12-19T16:00:00-05:00");
const music=document.getElementById("music"), button=document.getElementById("musicButton");
function startMusic(){
  return music.play().then(()=>{
    button.textContent=button.classList.contains("is-floating")?"♫":"♫ Pausar música";
    button.setAttribute("aria-label","Pausar música");
  }).catch(error=>{
    console.error("No se pudo reproducir la música:",error);
    button.textContent="♫ Toca para activar música";
    button.setAttribute("aria-label","Toca para activar música");
  });
}
document.getElementById("open").addEventListener("click", () => {
  const playback=startMusic();
  const cover=document.getElementById("cover");
  const openButton=document.getElementById("open");
  openButton.disabled=true;
  cover.classList.add("is-opening");
  setTimeout(()=>{
    document.getElementById("site").classList.remove("hidden");
    button.classList.add("is-floating");
    button.setAttribute("aria-label","Pausar música");
    cover.classList.add("is-revealing");
    window.scrollTo({top:0,behavior:"smooth"});
    setTimeout(()=>{cover.style.display="none"},750);
  },900);
  return playback;
});
function tick(){
  const diff=Math.max(0,weddingDate.getTime()-Date.now());
  const values={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};
  Object.entries(values).forEach(([id,n])=>document.getElementById(id).textContent=String(n).padStart(2,"0"));
}
tick();setInterval(tick,1000);
const text=encodeURIComponent("¡Hola! Confirmo mi asistencia a la boda de Karla Santillán y Jefersson Mantuano, el 19 de diciembre de 2026. Mi nombre es: ");
document.getElementById("waKarla").href="https://wa.me/593991369750?text="+text;
document.getElementById("waJefersson").href="https://wa.me/593986418486?text="+text;
button.addEventListener("click",()=>{
  if(music.paused){startMusic()}
  else{
    music.pause();
    button.textContent=button.classList.contains("is-floating")?"♫":"♫ Activar música";
    button.setAttribute("aria-label","Activar música");
  }
});
