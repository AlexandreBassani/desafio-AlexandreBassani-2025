class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const CATALOGO = {
      Rex: ["RATO", "BOLA"],
      Mimi: ["BOLA", "LASER"],
      Fofo: ["BOLA", "RATO", "LASER"],
      Zero: ["RATO", "BOLA"],
      Bola: ["CAIXA", "NOVELO"],
      Bebe: ["LASER", "RATO", "BOLA"],
      Loco: ["SKATE", "RATO"],
    };

    const BRINQUEDOS_VALIDOS = new Set(["RATO", "BOLA", "LASER", "CAIXA", "NOVELO", "SKATE"]);

    const ehGato = (nome) => nome === "Mimi" || nome === "Fofo" || nome === "Zero";

    const separarLista = (texto) =>
      String(texto || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const temDuplicados = (arr) => {
      const vistos = new Set();
      for (const x of arr) {
        if (vistos.has(x)) return true;
        vistos.add(x);
      }
      return false;
    };

    const todosBrinquedosValidos = (arr) => arr.every((t) => BRINQUEDOS_VALIDOS.has(t));

    const correspondeSubsequencia = (favoritos, brinquedosPessoa) => {
      let i = 0;
      for (const b of brinquedosPessoa) {
        if (b === favoritos[i]) i++;
        if (i === favoritos.length) return true;
      }
      return favoritos.length === 0;
    };

    const correspondeContiguo = (favoritos, brinquedosPessoa) => {
      if (favoritos.length === 0) return true;
      for (let inicio = 0; inicio + favoritos.length <= brinquedosPessoa.length; inicio++) {
        let ok = true;
        for (let j = 0; j < favoritos.length; j++) {
          if (brinquedosPessoa[inicio + j] !== favoritos[j]) {
            ok = false;
            break;
          }
        }
        if (ok) return true;
      }
      return false;
    };

    const correspondeQualquerOrdem = (favoritos, brinquedosPessoa) => {
      const bolsa = new Map();
      for (const b of brinquedosPessoa) bolsa.set(b, (bolsa.get(b) || 0) + 1);
      for (const f of favoritos) {
        const q = bolsa.get(f) || 0;
        if (q <= 0) return false;
        bolsa.set(f, q - 1);
      }
      return true;
    };

    const listaPessoa1 = separarLista(brinquedosPessoa1).map((s) => s.toUpperCase());
    const listaPessoa2 = separarLista(brinquedosPessoa2).map((s) => s.toUpperCase());
    const ordem = separarLista(ordemAnimais);

    if (ordem.length === 0 || ordem.some((n) => !(n in CATALOGO)) || temDuplicados(ordem)) {
      return { erro: "Animal inválido" };
    }

    if (
      temDuplicados(listaPessoa1) ||
      temDuplicados(listaPessoa2) ||
      !todosBrinquedosValidos(listaPessoa1) ||
      !todosBrinquedosValidos(listaPessoa2)
    ) {
      return { erro: "Brinquedo inválido" };
    }

    const capacidade = { p1: 0, p2: 0 };
    const adocoes = new Map();
    let locoAdotante = null;

    for (const animal of ordem) {
      const favoritos = CATALOGO[animal];
      const aptidao = { p1: false, p2: false };

      const verificar = (ehLoco, ehGatoAnimal, brinquedos) => {
        if (ehLoco) return correspondeQualquerOrdem(favoritos, brinquedos);
        if (ehGatoAnimal) return correspondeContiguo(favoritos, brinquedos);
        return correspondeSubsequencia(favoritos, brinquedos);
      };

      aptidao.p1 = verificar(animal === "Loco", ehGato(animal), listaPessoa1);
      aptidao.p2 = verificar(animal === "Loco", ehGato(animal), listaPessoa2);

      let destino = "abrigo";

      if (aptidao.p1 && aptidao.p2) {
        destino = "abrigo";
      } else if (aptidao.p1 && capacidade.p1 < 3) {
        destino = "pessoa 1";
        capacidade.p1++;
        if (animal === "Loco") locoAdotante = "p1";
      } else if (aptidao.p2 && capacidade.p2 < 3) {
        destino = "pessoa 2";
        capacidade.p2++;
        if (animal === "Loco") locoAdotante = "p2";
      } else {
        destino = "abrigo";
      }

      adocoes.set(animal, destino);
    }

    if (adocoes.has("Loco") && adocoes.get("Loco") !== "abrigo") {
      const dono = locoAdotante;
      const total = dono === "p1" ? capacidade.p1 : capacidade.p2;
      if (total < 2) {
        adocoes.set("Loco", "abrigo");
        if (dono === "p1") capacidade.p1 = Math.max(0, capacidade.p1 - 1);
        if (dono === "p2") capacidade.p2 = Math.max(0, capacidade.p2 - 1);
      }
    }

    const lista = Array.from(adocoes.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([nome, destino]) => `${nome} - ${destino}`);

    return { lista };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
