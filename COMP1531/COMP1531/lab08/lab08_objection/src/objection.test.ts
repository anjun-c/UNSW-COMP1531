import { getObjections, Objection, ExaminationType } from './objection';

describe('Objection Tests', () => {
  it('should raise an ARGUMENTATIVE objection for a cross examination question without a question mark', () => {
    const result = getObjections('You are lying', 'No, I am not', ExaminationType.CROSS);
    expect(result).toContain(Objection.ARGUMENTATIVE);
  });

  it('should not raise an ARGUMENTATIVE objection for a direct examination question without a question mark', () => {
    const result = getObjections('You are lying', 'No, I am not', ExaminationType.DIRECT);
    expect(result).not.toContain(Objection.ARGUMENTATIVE);
  });

  it('should raise a COMPOUND objection for a question with multiple question marks', () => {
    const result = getObjections('Did you go to the store? And did you buy milk?', 'Yes', ExaminationType.CROSS);
    expect(result).toContain(Objection.COMPOUND);
  });

  it('should raise a HEARSAY objection for a testimony containing hearsay phrases', () => {
    const result = getObjections('What did they say?', 'They told me that...', ExaminationType.DIRECT);
    expect(result).toContain(Objection.HEARSAY);
  });

  it('should raise a LEADING objection for a direct examination question starting with "why did you"', () => {
    const result = getObjections('Why did you go there?', 'Because I had to', ExaminationType.DIRECT);
    expect(result).toContain(Objection.LEADING);
  });

  it('should raise a LEADING objection for a direct examination question ending with "right?"', () => {
    const result = getObjections('You went to the store, right?', 'Yes', ExaminationType.DIRECT);
    expect(result).toContain(Objection.LEADING);
  });

  it('should raise a NON_RESPONSIVE objection for a testimony not containing any words from the question', () => {
    const result = getObjections('Did you see the accident?', 'I was at home', ExaminationType.CROSS);
    expect(result).toContain(Objection.NON_RESPONSIVE);
  });

  it('should raise a RELEVANCE objection for a testimony that is more than twice as long as the question', () => {
    const result = getObjections('What happened?', 'A very long and detailed explanation that exceeds twice the length of the question', ExaminationType.CROSS);
    expect(result).toContain(Objection.RELEVANCE);
  });

  it('should raise a SPECULATION objection for a direct examination testimony containing the word "think"', () => {
    const result = getObjections('What do you think happened?', 'I think it was an accident', ExaminationType.DIRECT);
    expect(result).toContain(Objection.SPECULATION);
  });

  it('should raise a SPECULATION objection for a cross examination question containing the word "think"', () => {
    const result = getObjections('What do you think?', 'I think it was an accident', ExaminationType.CROSS);
    expect(result).toContain(Objection.SPECULATION);
  });

  it('should raise multiple objections if applicable', () => {
    const result = getObjections('Do you agree that you think this is speculative and leading, right?', 'They told me that they think it is', ExaminationType.DIRECT);
    expect(result).toContain(Objection.LEADING);
    expect(result).toContain(Objection.HEARSAY);
    expect(result).toContain(Objection.SPECULATION);
  });

  it('should raise no objections for valid question and testimony', () => {
    const result = getObjections('Did you see a car?', 'I saw a car.', ExaminationType.CROSS);
    expect(result.size).toStrictEqual(0);
  });

  it('should throw an error if the question is an empty string', () => {
    expect(() => {
      getObjections('', 'Valid testimony', ExaminationType.CROSS);
    }).toThrow(Error);
  });

  it('should throw an error if the testimony is an empty string', () => {
    expect(() => {
      getObjections('Valid question', '', ExaminationType.CROSS);
    }).toThrow(Error);
  });
});
