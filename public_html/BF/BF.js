function Tape(tape) { this.tape=tape, this.head=0; }
Tape.prototype.L = function() { return --this.head; }
Tape.prototype.R = function() { return ++this.head; }
Tape.prototype.G = function() { return this.tape[this.head]; }
Tape.prototype.P = function(val) { return this.tape[this.head] = val; }
Tape.prototype.J = function(cell) { return this.head = cell; }

function I() {
  switch (program_tape.G()) {
    case '+': memory_tape.P(memory_tape.G()+1); break;
    case '-': memory_tape.P(memory_tape.G()-1); break;
    case '<': memory_tape.L(); break;
    case '>': memory_tape.R(); break;
    case '.': output += String.fromCharCode(memory_tape.G()); break;
    case ',': memory_tape.P(input_tape.G().charCodeAt()); input_tape.R(); break;
    case ']': output = 'Unexpected bracket "]"'; program_tape.J(program_tape.tape.length); return;
    case '[': start.push(program_tape.head);
              while (memory_tape.G()>0) { 
                program_tape.R();
                while ( program_tape.G()!=']' ) { I(); }
                program_tape.J(start[start.length-1]);
              }
              start.pop();
              var skip = 1;
              while (skip>0) { 
                program_tape.R(); 
                if (program_tape.G()==='[') { skip++; }
                if (program_tape.G()===']') { skip--; }
              }
  }
  program_tape.R();

}

function bf(program, size, input) { 
  var memory = new Array(size); while(size--) { memory[size]=0; }
      memory_tape = new Tape(memory),
      program_tape = new Tape(program),
      input_tape = new Tape(input+String.fromCharCode(undefined)),
      output = '', start = [];
  while (program_tape.G()) { I(); }
  return output;
}