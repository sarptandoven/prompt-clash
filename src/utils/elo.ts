export function calculateNewElo(ra: number, rb: number, scoreA: number, scoreB: number, k = 32) {
  const expectedA = 1 / (1 + Math.pow(10, (rb - ra) / 400))
  const expectedB = 1 - expectedA
  const newRa = ra + k * (scoreA - expectedA)
  const newRb = rb + k * (scoreB - expectedB)
  return { newRa: Math.round(newRa), newRb: Math.round(newRb) }
} 