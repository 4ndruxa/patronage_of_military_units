import React from 'react';

// «Як це працює»: three compact steps in a row (sticky steps wait for the owner's text).
const STEPS = [
  { title: 'Оберіть збір', text: 'Підрозділи, яким потрібна підтримка саме зараз.' },
  { title: 'Підпишіться', text: 'Один клік, і збір у вашому кабінеті.' },
  { title: 'Донатьте регулярно', text: 'Щомісячне нагадування, щоб підтримка не переривалась.' },
];

const HowItWorks: React.FC = () => (
  <section className="pm-section pt-0" aria-labelledby="how-title">
    <div className="container">
      <h2 className="visually-hidden" id="how-title">Як це працює</h2>
      <ol className="pm-steps">
        {STEPS.map((step) => (
          <li key={step.title}>
            <span><strong>{step.title}</strong>{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
