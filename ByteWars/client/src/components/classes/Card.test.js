import Card from './Card';

describe('Card - generatePowerAttack', () => {
  it('should return the correct power attack for a human Warrior', () => {
    const card = new Card('Warrior', 'human');
    expect(card.powerAttack).toBe(20);
  });

  it('should return the correct power attack for a robot RoboCap', () => {
    const card = new Card('RoboCap', 'robot');
    expect(card.powerAttack).toBe(28);
  });

  it('should return the default power attack for an unknown human character', () => {
    const card = new Card('Unknown', 'human');
    expect(card.powerAttack).toBe(10);
  });

  it('should return the default power attack for an unknown robot character', () => {
    const card = new Card('Unknown', 'robot');
    expect(card.powerAttack).toBe(10);
  });
  
});
