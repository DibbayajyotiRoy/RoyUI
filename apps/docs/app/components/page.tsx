import { Suspense } from 'react';
import { CatalogView } from '../../components/CatalogView';

export const metadata = {
  title: 'Components · RoyUI',
};

export default function ComponentsPage() {
  return (
    <main className="catalog">
      <div className="catalog__head">
        <div className="catalog__eyebrow">Library</div>
        <h1 className="catalog__title">Components</h1>
        <p className="catalog__lede">
          Every component in the library. Click any card to open its
          documentation with install instructions, live examples, and props.
        </p>
      </div>

      <Suspense fallback={<div className="catalog-empty">Loading…</div>}>
        <CatalogView />
      </Suspense>
    </main>
  );
}
