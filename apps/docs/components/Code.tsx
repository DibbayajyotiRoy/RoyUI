import { codeToHtml, type BundledLanguage } from 'shiki';
import { CopyButton } from './CopyButton';

type Lang = BundledLanguage;

export async function Code({
  code,
  lang = 'tsx',
  label,
  inline = false,
}: {
  code: string;
  lang?: Lang | string;
  label?: string;
  inline?: boolean;
}) {
  const html = await codeToHtml(code, {
    lang: lang as Lang,
    theme: 'github-dark-default',
  });

  return (
    <div className={`code-card ${inline ? 'code-card--inline' : ''}`}>
      {(label || !inline) && (
        <div className="code-card__head">
          <span className="code-card__lang">{label ?? lang}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="code-card__body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
