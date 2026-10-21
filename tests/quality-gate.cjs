const assert=require('node:assert/strict');const {assess}=require('../scripts/quality-gate.cjs');
assert.equal(assess([]).pupilRelease,'FAIL');
assert.equal(assess([{status:'FAIL'}]).pupilRelease,'FAIL');
assert.equal(assess([{status:'PASS'}]).pupilRelease,'BLOCKED');
assert.equal(assess([{status:'PASS'},{status:'BLOCKED'}]).codeChecks,'FAIL');
assert.equal(assess([{status:'PASS'}]).requiredEvidence.realDevices,'BLOCKED');
console.log('PASS: empty, failed or missing evidence cannot approve release');
