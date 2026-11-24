// SPDX-License-Identifier: Apache-2.0
//
// Client-side redirects for URLs that have moved or been removed. These are
// passed to @docusaurus/plugin-client-redirects in docusaurus.config.ts.
//
// To add a redirect, add a {from, to} entry below. Paths are relative to the
// site's base URL (so '/models/granite' is www.ibm.com/granite/docs/models/granite)
// and have no trailing slash. `from` can be a string or an array of strings.
// `to` must be an existing page; the build fails otherwise, and it also fails
// if `from` is a page that still exists.

type Redirect = {from: string | string[]; to: string};

// Old cookbook pages (previous site, /use-cases/*) that now point to the
// tutorials examples page.
const oldCookbooks = [
  'agentic-rag',
  'all-cookbooks',
  'beeai-basics',
  'beeai-requirement-agent',
  'beeai-workflows',
  'coding-assistant',
  'contract-analysis',
  'cookbooks',
  'docling-rag',
  'forecast-bike-rentals',
  'forecast-energy-demand',
  'getting-credentials',
  'granite-as-judge',
  'granite-bee',
  'granite-snack-cookbook',
  'hap-detection',
  'langchain-rag',
  'multimodal-rag',
  'prompt-declaration-language',
  'prompt-engineering',
  'risk-detection',
  'summarize',
  'travel-planner',
  'unitxt',
];

const redirects: Redirect[] = [
  // Model family pages from the previous site.
  {
    from: [
      '/models/granite',
      '/models/granite4-2',
      '/models/granite4-1',
      '/models/granite4-0',
      '/models/docling',
      '/models/vision',
      '/models/speech',
      '/models/embedding',
      '/models/time-series',
    ],
    to: '/models',
  },
  {from: '/models/guardian', to: '/models/trust/safety-and-security'},

  // Model standards and responsible AI.
  {from: '/model-standards/naming-guidance', to: '/models/concepts/naming-and-versions'},
  {from: '/model-standards/signature-verification', to: '/models/trust/verify-signatures'},
  {from: '/responsible-ai', to: '/models/trust'},

  // Run guides.
  {
    from: [
      '/run/granite-with-ollama-mac',
      '/run/granite-with-ollama-linux',
      '/run/granite-with-ollama-windows',
      '/run/granite-with-vllm-containerized',
      '/run/granite-with-lmstudio',
      '/run/granite-on-partners',
    ],
    to: '/models/get-started',
  },

  // Fine-tuning guides and cookbooks.
  {from: ['/fine-tune/unsloth', '/fine-tune/time-series'], to: '/tutorials'},
  {from: '/use-cases/granite-community', to: '/tutorials/community-artifacts'},
  {from: oldCookbooks.map((page) => `/use-cases/${page}`), to: '/tutorials/examples'},
];

export default redirects;
