import React, { useState, useEffect } from 'react';
import Flashcard from '../../components/Flashcard/Flashcard';
import FlashcardNavbar from './FlashcardNavbar';
import type { FlashcardSet } from './FlashcardNavbar';

const mockSets: FlashcardSet[] = [
  { id: '1', title: 'AP US History' },
  { id: '2', title: 'Machine Learning Terms' },
  { id: '3', title: 'Biology - Cell Structure' },
];

const mockFlashcards: Record<string, { front: string; back: string }[]> = {
  '1': [
    { front: 'Who was the first U.S. President?', back: 'George Washington' },
    { front: 'What year was the Declaration of Independence signed?', back: '1776' },
  ],
  '2': [
    { front: 'What is supervised learning?', back: 'Learning from labeled data.' },
    { front: 'Define overfitting.', back: 'When a model memorizes training data and fails to generalize.' },
  ],
  '3': [
    { front: 'What does the nucleus do?', back: 'It stores the cell’s DNA and coordinates activity.' },
    { front: 'What is the function of ribosomes?', back: 'They synthesize proteins.' },
  ],
};

const FlashcardsView: React.FC = () => {
  //TODO: we use the chatbot to ask it to create flashcards
  //once we ask, we store whatever it creates based on the format of the flashcards we need
  //when we switch to the flash card page, we show that generated flashcard
  const [activeSetId, setActiveSetId] = useState<string>(mockSets[0].id);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = mockFlashcards[activeSetId] || [];

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSetId]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FlashcardNavbar
        sets={mockSets}
        activeSetId={activeSetId}
        onSelect={setActiveSetId}
      />
      <div style={{ padding: '1rem', flex: 1, textAlign: 'center' }}>
        <h2>{mockSets.find(set => set.id === activeSetId)?.title}</h2>
        {cards.length > 0 ? (
          <>
            <Flashcard front={cards[currentIndex].front} back={cards[currentIndex].back} />
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={handlePrev}>Previous</button>
              <button onClick={handleNext}>Next</button>
            </div>
          </>
        ) : (
          <p>No flashcards available.</p>
        )}
      </div>
    </div>
  );
};

export default FlashcardsView;
