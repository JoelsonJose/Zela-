const url = 'https://panning-shortlist-pacific.ngrok-free.dev/api/denuncias';

const points = [
  { categoria_ia: 'Plástico', gravidade_ia: 'Média', descricao_ia: 'Acúmulo de garrafas PET no chão', latitude: '-8.05428', longitude: '-34.8813' },
  { categoria_ia: 'Eletrônico', gravidade_ia: 'Alta', descricao_ia: 'Microondas velho abandonado na esquina', latitude: '-8.06428', longitude: '-34.8713' },
  { categoria_ia: 'Entulho', gravidade_ia: 'Baixa', descricao_ia: 'Resto de tijolo e cimento', latitude: '-8.04428', longitude: '-34.8913' },
  { categoria_ia: 'Orgânico', gravidade_ia: 'Média', descricao_ia: 'Lixo orgânico com mau cheiro', latitude: '-8.05900', longitude: '-34.8750' }
];

async function seed() {
  for (const point of points) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(point)
      });
      const data = await res.text();
      console.log(`Success: ${point.categoria_ia} -> ${data}`);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
  }
}
seed();
