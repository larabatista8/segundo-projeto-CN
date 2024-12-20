window.iterativo = {
  verificarSassenfeld: function(coeficientes) {
    const n = coeficientes.length;
    const beta = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let soma = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          soma += Math.abs(coeficientes[i][j]) * (j < i ? beta[j] : 1);
        }
      }
      beta[i] = soma / Math.abs(coeficientes[i][i]);
      if (beta[i] >= 1) return false;
    }
    return true;
  },

  verificarDominanciaDiagonal: function(coeficientes) {
    const n = coeficientes.length;

    for (let i = 0; i < n; i++) {
      let soma = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          soma += Math.abs(coeficientes[i][j]);
        }
      }
      if (Math.abs(coeficientes[i][i]) <= soma) return false;
    }
    return true;
  },

  calcularGaussSeidel: function() {
    const E = parseFloat(document.getElementById("E").value);
    const R1 = parseFloat(document.getElementById("R1").value);
    const R2 = parseFloat(document.getElementById("R2").value);
    const R3 = parseFloat(document.getElementById("R3").value);
    const R4 = parseFloat(document.getElementById("R4").value);
    const R5 = parseFloat(document.getElementById("R5").value);

    const coeficientes = [
      [R1, R2, 0, 0, R5],
      [0, 0, R3, -R4, -R5],
      [R1, 0, 0, R4, 0],
    ];

        if (!this.verificarDominanciaDiagonal(coeficientes) && !this.verificarSassenfeld(coeficientes)) {
      document.getElementById("resultado-iterativo").textContent = "O sistema não atende aos critérios de convergência.";
      return;
    }

    let I1 = 0, I2 = 0, I3 = 0, I4 = 0, I5 = 0; I6 = 0;
    const maxIter = 5000;
    const tol = 1e-8;
    const omega = 0.7;
    const limite = 1e6;
    let convergiu = false;

    for (let iter = 0; iter < maxIter; iter++) {
      let I1_old = I1, I2_old = I2, I3_old = I3, I4_old = I4, I5_old = I5; I6_old = I6;

      I1 = (1 - omega) * I1 + omega * (E - R2 * I2 - R5 * I5) / R1;
      I2 = (1 - omega) * I2 + omega * (E - R1 * I1 - R5 * I5) / R2;
      I3 = (1 - omega) * I3 + omega * (R4 * I4 - R5 * I5) / R3;
      I4 = (1 - omega) * I4 + omega * (E - R1 * I1) / R4;
      I5 = (1 - omega) * I5 + omega * (I4 * R4 - I3 * R3) / R5;
      I6 = I5 + I4 + I3 + I2 + I1; 

      if (Math.abs(I1) > limite || Math.abs(I2) > limite || Math.abs(I3) > limite || Math.abs(I4) > limite || Math.abs(I5) > limite || Math.abs(I6) > limite) {
        console.error("Valores das correntes atingiram o limite de estabilidade.");
        document.getElementById("resultado-iterativo").textContent = "O método divergiu devido à instabilidade numérica.";
        return;
      }

      if (
        Math.abs(I1 - I1_old) < tol &&
        Math.abs(I2 - I2_old) < tol &&
        Math.abs(I3 - I3_old) < tol &&
        Math.abs(I4 - I4_old) < tol &&
        Math.abs(I5 - I5_old) < tol &&
        Math.abs(I6 - I6_old) < tol
      ) {
        convergiu = true;
        break;
      }
    }

    if (convergiu) {
      document.getElementById("resultado-iterativo").textContent = `
        I1 = ${I1.toFixed(6)}, I2 = ${I2.toFixed(6)},
        I3 = ${I3.toFixed(6)}, I4 = ${I4.toFixed(6)}, I5 = ${I5.toFixed(6)}, I6 = ${I6.toFixed(6)} 
      `;
    } else {
      document.getElementById("resultado-iterativo").textContent = "O método não convergiu.";
    }
  },

  limparGaussSeidel: function() {
    document.getElementById("E").value = '';
    document.getElementById("R1").value = '';
    document.getElementById("R2").value = '';
    document.getElementById("R3").value = '';
    document.getElementById("R4").value = '';
    document.getElementById("R5").value = '';
    document.getElementById("resultado-iterativo").textContent = '';
  }
};
