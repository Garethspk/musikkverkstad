// Twelve quarter-note beats with fixed outer boundaries. No listening prerequisite.
const Barlines=Object.freeze({
  required(meter){if(meter!==3&&meter!==4)throw new RangeError('Expected 3/4 or 4/4');return meter===3?[3,6,9]:[4,8]},
  inspect(meter,positions){
    const required=this.required(meter),chosen=[...new Set(positions)].sort((a,b)=>a-b);
    const extra=chosen.filter(n=>!required.includes(n)),missing=required.filter(n=>!chosen.includes(n));
    return {ok:!extra.length&&!missing.length,required,extra,missing,count:chosen.length,
      kind:chosen.length>required.length?'many':chosen.length<required.length?'few':extra.length?'positions':'correct'};
  }
});
