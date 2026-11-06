const assert=require('node:assert/strict');const {calculate}=require('../assets/portfolio-stress.js');
const input={reserve:60000,floor:45000,months:3,shock:.2,repairs:15000,properties:[{revenue:8000,variable:.25,fixed:5500},{revenue:6500,variable:.25,fixed:4500},{revenue:5000,variable:.25,fixed:3500}]};
assert.deepEqual(calculate(input),{base:1125,stressed:-1800,end:39600,lowest:39600,gap:5400,decline:8775,netChange:-20400});
assert.equal(calculate({...input,shock:0,repairs:0}).end,63375);
assert.equal(calculate({...input,shock:0,repairs:15000}).lowest,45000);
for(const patch of [{months:0},{months:1.5},{shock:1.1},{reserve:-1},{repairs:NaN}])assert.throws(()=>calculate({...input,...patch}));
console.log('Portfolio stress regression passed: default, positive cash, immediate bill and invalid input cases.');
