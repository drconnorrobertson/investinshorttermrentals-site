(function(root){
function calculate(input){
 const {reserve,floor,months,shock,repairs,properties}=input;
 const nums=[reserve,floor,months,shock,repairs,...properties.flatMap(p=>[p.revenue,p.variable,p.fixed])];
 if(nums.some(x=>!Number.isFinite(x)||x<0)||!Number.isInteger(months)||months<1||months>24||shock>1||properties.some(p=>p.variable>1))throw Error('Enter nonnegative amounts, a whole horizon from 1 to 24 months, and percentages from 0 to 100.');
 const base=properties.reduce((s,p)=>s+p.revenue*(1-p.variable)-p.fixed,0);
 const stressed=properties.reduce((s,p)=>s+p.revenue*(1-shock)*(1-p.variable)-p.fixed,0);
 const end=reserve+months*stressed-repairs;
 const lowest=Math.min(reserve-repairs,end); // Lump sum paid at the beginning, constant monthly cash thereafter.
 return {base,stressed,end,lowest,gap:Math.max(0,floor-lowest),decline:(base-stressed)*months,netChange:end-reserve};
}
if(typeof module!=='undefined')module.exports={calculate};
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',()=>{const form=document.getElementById('portfolio-stress');if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();try{const d=new FormData(form),n=k=>Number(d.get(k)),v={reserve:n('reserve'),floor:n('floor'),months:n('months'),shock:n('shock')/100,repairs:n('repairs'),properties:[0,1,2].map(i=>({revenue:n('revenue'+i),variable:n('variable'+i)/100,fixed:n('fixed'+i)}))};const r=calculate(v),cash=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);document.getElementById('stress-result').textContent='Base monthly cash: '+cash(r.base)+'. Stressed monthly cash: '+cash(r.stressed)+'. Ending reserve: '+cash(r.end)+'. Lowest modeled reserve: '+cash(r.lowest)+'. Extra funding needed to preserve your chosen floor: '+cash(r.gap)+'. Cash change over the horizon: '+cash(r.netChange)+'. Deterioration versus base operating cash: '+cash(r.decline)+'. Hypothetical constant-month stress only, not a revenue forecast.';}catch(err){document.getElementById('stress-result').textContent=err.message;}});});
})(typeof globalThis!=='undefined'?globalThis:this);
