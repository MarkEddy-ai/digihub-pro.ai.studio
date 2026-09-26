import { DigitalItem } from '@/types';

export const INITIAL_DIGITAL_ITEMS: DigitalItem[] = [
  // Windows 11 Pro Keys (prod-windows-11-pro)
  {
    id: 'key-win-001',
    product_id: 'prod-windows-11-pro',
    secret_data: 'W269N-WFGWX-YVC9B-4J6C9-T83GX',
    is_delivered: true,
    order_id: 'ord-stripe-03',
    date_added: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'key-win-002',
    product_id: 'prod-windows-11-pro',
    secret_data: 'VK7JG-NPHTM-C97JM-9MPGT-3V66T',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-21T11:30:00.000Z',
  },
  {
    id: 'key-win-003',
    product_id: 'prod-windows-11-pro',
    secret_data: 'MH37W-N47XK-V7XM9-C7227-GCQG9',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-22T09:15:00.000Z',
  },
  {
    id: 'key-win-004',
    product_id: 'prod-windows-11-pro',
    secret_data: 'NRG8B-VKK3Q-CXVCJ-9G2XF-6Q84J',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T14:20:00.000Z',
  },

  // Office 2024 Pro Keys (prod-office-2024-pro) - Stock faible (<3 dispo pour tester l'alerte !)
  {
    id: 'key-off-001',
    product_id: 'prod-office-2024-pro',
    secret_data: 'NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP',
    is_delivered: true,
    order_id: 'ord-1001',
    date_added: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'key-off-002',
    product_id: 'prod-office-2024-pro',
    secret_data: 'T6N4W-82CT9-XX64X-43KQ4-8G79T',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-22T16:00:00.000Z',
  },
  {
    id: 'key-off-003',
    product_id: 'prod-office-2024-pro',
    secret_data: 'XQNVK-8JYDB-WJ9W3-YJ8YR-WFG99',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T12:00:00.000Z',
  },
  // Only 2 available for Office 2024 -> Triggers the <3 alert!

  // ChatGPT Plus Accounts / Tokens (prod-chatgpt-plus)
  {
    id: 'key-gpt-001',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'openai_account_vip1@fastmail.com:TempPass2026!# (Auth Token: sk-proj-9921xx882)',
    is_delivered: true,
    order_id: 'ord-crypto-05',
    date_added: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'key-gpt-002',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'openai_plus_member04@proton.me:SecureGpt982!',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T10:00:00.000Z',
  },
  {
    id: 'key-gpt-003',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'openai_plus_member05@proton.me:MatrixGpt2026@',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T10:05:00.000Z',
  },
  {
    id: 'key-gpt-004',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'openai_plus_member06@proton.me:AlphaGpt441#',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T10:10:00.000Z',
  },
  {
    id: 'key-gpt-005',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'openai_plus_member07@proton.me:DeltaAi994!',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T15:00:00.000Z',
  },

  // Xbox Game Pass Ultimate (prod-xbox-game-pass) - Stock critique (1 dispo !)
  {
    id: 'key-xb-001',
    product_id: 'prod-xbox-game-pass',
    secret_data: 'XBOX-ULT-4M99-KLP8-9921-ZZ88',
    is_delivered: true,
    order_id: 'ord-applepay-04',
    date_added: '2026-09-21T09:00:00.000Z',
  },
  {
    id: 'key-xb-002',
    product_id: 'prod-xbox-game-pass',
    secret_data: 'XBOX-ULT-7P12-MN44-7719-QW02',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T08:00:00.000Z',
  },
  // Only 1 available -> Triggers critical stock alert < 3!

  // Claude Pro (prod-claude-pro)
  {
    id: 'key-cld-001',
    product_id: 'prod-claude-pro',
    secret_data: 'claude_pro_team01@vaultmail.com:Sonnet35Pro!2026',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-22T14:00:00.000Z',
  },
  {
    id: 'key-cld-002',
    product_id: 'prod-claude-pro',
    secret_data: 'claude_pro_team02@vaultmail.com:Artifacts99#sonnet',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-22T14:05:00.000Z',
  },
  {
    id: 'key-cld-003',
    product_id: 'prod-claude-pro',
    secret_data: 'claude_pro_team03@vaultmail.com:AnthropicPro88@!',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T11:00:00.000Z',
  },
  {
    id: 'key-cld-004',
    product_id: 'prod-claude-pro',
    secret_data: 'claude_pro_team04@vaultmail.com:SonnetSafe2026#',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T18:00:00.000Z',
  },

  // Canva Pro (prod-canva-pro)
  {
    id: 'key-cnv-001',
    product_id: 'prod-canva-pro',
    secret_data: 'https://www.canva.com/brand/join?token=novalys_enterprise_team_invitation_88291a',
    is_delivered: true,
    order_id: 'ord-1002',
    date_added: '2026-09-19T07:00:00.000Z',
  },
  {
    id: 'key-cnv-002',
    product_id: 'prod-canva-pro',
    secret_data: 'https://www.canva.com/brand/join?token=novalys_enterprise_team_invitation_99342b',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T13:00:00.000Z',
  },
  {
    id: 'key-cnv-003',
    product_id: 'prod-canva-pro',
    secret_data: 'https://www.canva.com/brand/join?token=novalys_enterprise_team_invitation_11452c',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T13:05:00.000Z',
  },
  {
    id: 'key-cnv-004',
    product_id: 'prod-canva-pro',
    secret_data: 'https://www.canva.com/brand/join?token=novalys_enterprise_team_invitation_77812d',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T09:30:00.000Z',
  },

  // Black Myth: Wukong (prod-black-myth-wukong) - Stock critique (2 dispo !)
  {
    id: 'key-bmw-001',
    product_id: 'prod-black-myth-wukong',
    secret_data: 'STEAM-BMW-9821-KLP9-7712-ZXCV',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T10:00:00.000Z',
  },
  {
    id: 'key-bmw-002',
    product_id: 'prod-black-myth-wukong',
    secret_data: 'STEAM-BMW-3341-MN88-5521-QWER',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T10:05:00.000Z',
  },

  // EA Sports FC 25 (prod-fc-25)
  {
    id: 'key-fc-001',
    product_id: 'prod-fc-25',
    secret_data: 'EA-FC25-8891-POIU-7744-LKJH',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T11:00:00.000Z',
  },
  {
    id: 'key-fc-002',
    product_id: 'prod-fc-25',
    secret_data: 'EA-FC25-4412-TREW-9901-MNBV',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T11:05:00.000Z',
  },
  {
    id: 'key-fc-003',
    product_id: 'prod-fc-25',
    secret_data: 'EA-FC25-1129-ZXAS-3388-GHJK',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T11:10:00.000Z',
  },
  {
    id: 'key-fc-004',
    product_id: 'prod-fc-25',
    secret_data: 'EA-FC25-7782-VCXZ-2299-FDSA',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-24T11:15:00.000Z',
  },
];
