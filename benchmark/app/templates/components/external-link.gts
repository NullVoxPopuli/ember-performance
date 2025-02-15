import { ExternalLink as UnstyledExternalLink } from 'ember-primitives/components/external-link';

import type { TOC } from '@ember/component/template-only';

export const ExternalLink: TOC<{ Element: HTMLAnchorElement; Blocks: { default: [] } }> = <template>
  <UnstyledExternalLink
    style="display: inline-flex; gap: 0.5rem; align-items: center;"
    ...attributes
  >
    {{yield}}
    <ExternalIcon style="width: 18px; height: 18px" />
  </UnstyledExternalLink>
</template>;

// https://designsystem.digital.gov/assets/img/usa-icons/launch.svg
const ExternalIcon: TOC<{ Element: SVGElement }> = <template>
  <svg
    ...attributes
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    data-ember-extension="1"
  ><path
      d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
    /></svg>
</template>;
