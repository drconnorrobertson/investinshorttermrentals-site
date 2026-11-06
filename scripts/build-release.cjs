const {execFileSync}=require('node:child_process');
execFileSync(process.execPath,["scripts/build-content.mjs"],{stdio:'inherit'});
execFileSync(process.execPath,["scripts/instrument-conversions.mjs", "dist"],{stdio:'inherit'});
execFileSync(process.execPath,["scripts/brand-check.mjs", "dist"],{stdio:'inherit'});
execFileSync(process.execPath,["scripts/buyer-intent-release.cjs", "dist"],{stdio:'inherit'});
execFileSync(process.execPath,["scripts/practical-homepage.cjs", "dist"],{stdio:'inherit'});
execFileSync(process.execPath,["scripts/brand-check.mjs", "dist"],{stdio:'inherit'});
execFileSync(process.execPath,["scripts/test-portfolio-stress.cjs"],{stdio:'inherit'});
execFileSync(process.execPath,["scripts/check-published-seo.cjs", "dist"],{stdio:'inherit'});
