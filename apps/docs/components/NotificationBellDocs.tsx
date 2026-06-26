import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { DocSection, Example, PropsTable } from './DocShell';
import { NotificationBellDemo, NotificationBellThemesDemo } from './demos/NotificationBellDemo';

export function NotificationBellDocs() {
  return (
    <>
      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="Add the package. A self-contained bell button — an unread badge, a hover pill that names itself, a periodic ring, an opt-in chime, and a centered portal modal with a headless body. It ships its own CSS and its own default sound, so there's nothing else to wire up."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code
            label="Import"
            code={`import { NotificationBell } from '@roy-ui/ui';

// or just this component:
import { NotificationBell } from '@roy-ui/ui/notification-bell';`}
          />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="At rest it's a circular bell with a rose count badge. Hover or focus it and it animates open into a dark pill that spells out its label and count. Click it and a centered modal opens over a dimmed backdrop — and its body is entirely yours: children is a headless slot, so you render the rows, badges, and empty states however you like."
      >
        <Example
          title="Bell with a modal list"
          description="Pass a count for the badge and a title for the modal header. Everything inside children is the modal body — map your own notifications into whatever markup fits. Close it with the button, Escape, or a click on the backdrop; focus returns to the bell."
          code={`const notifications = [
  { id: 1, who: 'Ava', text: 'mentioned you in Design Review', when: '2m' },
  { id: 2, who: 'Build', text: 'pipeline #418 passed', when: '14m' },
  { id: 3, who: 'Noah', text: 'requested your review', when: '1h' },
];

<NotificationBell count={notifications.length} title="Notifications">
  <ul className="my-feed">
    {notifications.map((n) => (
      <li key={n.id} className="my-feed__row">
        <strong>{n.who}</strong> {n.text}
        <span className="my-feed__when">{n.when}</span>
      </li>
    ))}
  </ul>
</NotificationBell>`}
        >
          <NotificationBellDemo theme="auto" />
        </Example>
      </DocSection>

      <DocSection
        id="ring-and-sound"
        eyebrow="03"
        title="Ring & sound"
        description="While count > 0 the bell rings on a timer — a short, damped wobble every ringInterval milliseconds (1700 by default). It also rings once immediately whenever count goes up, so a fresh notification always announces itself, and it pauses entirely while the modal is open. Sound is a separate, opt-in layer that is OFF by default — the bell rings silently unless you set sound, because browsers block autoplay until the user interacts with the page. So leaving sound out (or sound={false}) is how you mute it. Point soundSrc at your own file to replace the chime, use volume (0–1) to set the level, and set ring to false to keep the badge but stop the motion."
      >
        <Example
          title="Silent by default — no sound"
          description="Out of the box the bell makes no sound. Hit “Send notification” and watch it shake (and the badge climb) with zero audio. This is the muted state; you do not need to disable anything."
          code={`// No sound prop → silent. The bell still rings (shakes) on new arrivals.
<NotificationBell count={unread} title="Notifications">
  {/* …rows… */}
</NotificationBell>

// Being explicit is equivalent:
<NotificationBell count={unread} sound={false}>{/* … */}</NotificationBell>`}
        >
          <NotificationBellDemo theme="auto" sound={false} />
        </Example>

        <Example
          title="Opt in to the chime"
          description="Add sound to play the bundled chime on each ring. It stays quiet until you have clicked somewhere on the page (the browser's autoplay rule), then “Send notification” both shakes and dings. Swap the sound with soundSrc and set the level with volume."
          code={`<NotificationBell
  count={unread}
  ring                 // wobble while there are unread items (default true)
  ringInterval={1700}  // ms between rings (the default cadence)
  sound                // opt-in: play a chime on each ring
  soundSrc="/sounds/ping.mp3" // optional: override the bundled chime
  volume={0.5}         // 0–1
>
  {/* …rows… */}
</NotificationBell>`}
        >
          <NotificationBellDemo theme="auto" sound />
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="04"
        title="Theming"
        description="theme is 'light' | 'dark' | 'auto' (the default 'auto' follows prefers-color-scheme). Every surface — the resting button, the hover pill, the badge, and the modal card and backdrop — is a CSS variable, so you can re-brand any piece without touching the markup."
      >
        <NotificationBellThemesDemo />
        <Code
          label="Variables"
          code={`.royui-bell {
  --royui-bell-accent: #f43f5e;     /* count badge */
  --royui-bell-pill-bg: #16181d;    /* dark hover pill */
  --royui-bell-pill-fg: #ffffff;
  --royui-bell-surface: #ffffff;    /* resting button */
}
.royui-bell-modal {
  --royui-modal-surface: #ffffff;   /* modal card */
  --royui-modal-backdrop: rgba(15,17,21,0.42);
}`}
        />
      </DocSection>

      <DocSection
        id="props"
        eyebrow="05"
        title="Props"
        description="Nothing is required — an empty bell renders with a zero badge. Pass count to drive the badge and ring, and children to fill the modal."
      >
        <PropsTable
          rows={[
            { name: 'count', type: 'number', def: '0', desc: 'Unread count shown in the badge and used to drive the ring.' },
            { name: 'max', type: 'number', def: '9', desc: 'Cap the badge; anything higher reads as `${max}+` (12 → "9+").' },
            { name: 'label', type: 'string', def: `'Notifications'`, desc: 'Text shown inside the dark hover/focus pill.' },
            { name: 'ring', type: 'boolean', def: 'true', desc: 'Whether the bell wobbles while there are unread items.' },
            { name: 'ringInterval', type: 'number', def: '1700', desc: 'Milliseconds between rings while count > 0.' },
            { name: 'sound', type: 'boolean', def: 'false', desc: 'Opt-in: play a chime on each ring (off due to autoplay rules).' },
            { name: 'soundSrc', type: 'string', def: '—', desc: 'Override the bundled chime with your own audio file.' },
            { name: 'volume', type: 'number', def: '0.5', desc: 'Chime volume, 0–1.' },
            { name: 'title', type: 'ReactNode', def: `'Notifications'`, desc: 'Heading shown in the modal header.' },
            { name: 'children', type: 'ReactNode', def: '—', desc: 'Headless modal body slot — you render the rows.' },
            { name: 'footer', type: 'ReactNode', def: '—', desc: 'Optional content pinned to the bottom of the modal.' },
            { name: 'open', type: 'boolean', def: '—', desc: 'Controlled open state.' },
            { name: 'defaultOpen', type: 'boolean', def: 'false', desc: 'Uncontrolled initial open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', def: '—', desc: 'Fires when the modal opens or closes.' },
            { name: 'closeOnBackdrop', type: 'boolean', def: 'true', desc: 'Close the modal when the dimmed backdrop is clicked.' },
            { name: 'theme', type: `'light' | 'dark' | 'auto'`, def: `'auto'`, desc: 'Follow the system or force a side.' },
            { name: 'className', type: 'string', def: '—', desc: 'Extra class on the bell root.' },
          ]}
        />
      </DocSection>
    </>
  );
}
