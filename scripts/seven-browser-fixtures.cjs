module.exports=async()=>{require('node:child_process').execFileSync(process.env.PYTHON||'python3',['scripts/build-seven-weeks.py'],{stdio:'pipe'})};
