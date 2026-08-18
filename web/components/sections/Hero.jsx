'use client';

import { Eyebrow, SectionHeading } from '../ds/Brand';
import { Button, CheckItem, AnnotationBadge } from '../ds/Core';
import { Container } from '../ds/Layout';
import { ShortlistPanel, CandidateCard } from '../ds/Cards';
import { useModal } from '../SearchModal';
import { us } from '@/lib/content/us';

export function Hero({ content = us }) {
  const { open } = useModal();
  const { hero } = content;

  return (
    <section id="top" className="hero">
      <Container>
        <div className="hero__grid" data-grid="hero">
          <div className="hero__copy" data-hero-copy>
            <Eyebrow size="lg">{hero.eyebrow}</Eyebrow>
            <SectionHeading as="h1" size="h1" emphasis={hero.emphasis} style={{ whiteSpace: 'pre-line' }}>
              {hero.heading}
            </SectionHeading>
            <p className="hero__lead">{hero.lead}</p>
            <div className="hero__ctas">
              <Button onClick={open}>Start a search</Button>
              <Button variant="secondary" withArrow={false} href="#how">How it works</Button>
            </div>
            <ul className="hero__checks">
              {hero.checks.map((c) => <CheckItem key={c} size="sm">{c}</CheckItem>)}
            </ul>
          </div>

          <div className="hero__shortlist" data-shortlist>
            <ShortlistPanel
              badge={hero.shortlist.badge}
              footnote={hero.shortlist.footnote}
              annotation={<AnnotationBadge>Illustrative</AnnotationBadge>}
            >
              {hero.shortlist.candidates.map((c) => <CandidateCard key={c.role} {...c} />)}
            </ShortlistPanel>
          </div>
        </div>
      </Container>
    </section>
  );
}
