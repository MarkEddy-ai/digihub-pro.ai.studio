import { DigitalItem } from '@/types';

export const INITIAL_DIGITAL_ITEMS: DigitalItem[] = [
  // Windows 11 Pro Keys (type: 'key')
  {
    id: 'ditem-w11-001',
    product_id: 'prod-windows-11-pro',
    secret_data: 'W269N-WFGWX-YVC9B-4J6C9-T83GX',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-20T10:00:00Z',
  },
  {
    id: 'ditem-w11-002',
    product_id: 'prod-windows-11-pro',
    secret_data: 'VK7JG-NPHTM-C97JM-9MPGT-3V66T',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-20T10:00:00Z',
  },
  {
    id: 'ditem-w11-003',
    product_id: 'prod-windows-11-pro',
    secret_data: 'MH37W-N47XK-V7XM9-C7227-GCQG9',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-20T10:00:00Z',
  },
  {
    id: 'ditem-w11-004',
    product_id: 'prod-windows-11-pro',
    secret_data: 'NRG8B-VKK3Q-CXVCJ-9G2XF-6Q84J',
    is_delivered: true,
    order_id: 'ord-1001',
    date_added: '2026-09-19T10:00:00Z',
  },

  // Office 2024 Pro Plus Keys (type: 'key')
  {
    id: 'ditem-off-001',
    product_id: 'prod-office-2024-pro',
    secret_data: 'TKN68-GXG6P-F98CQ-9882V-34821',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-21T09:00:00Z',
  },
  {
    id: 'ditem-off-002',
    product_id: 'prod-office-2024-pro',
    secret_data: 'B9GN2-DXXQC-9DHKT-GGWCR-4X66T',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-21T09:00:00Z',
  },
  {
    id: 'ditem-off-003',
    product_id: 'prod-office-2024-pro',
    secret_data: 'FBFPP-2B96R-7RTGB-96DF2-4G882',
    is_delivered: true,
    order_id: 'ord-1001',
    date_added: '2026-09-18T09:00:00Z',
  },

  // ChatGPT Plus (type: 'account_text')
  {
    id: 'ditem-gpt-001',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'novalys_gpt_01@ai-access.dz:PassGPT2026!# (Accès garanti 30j)',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-22T14:30:00Z',
  },
  {
    id: 'ditem-gpt-002',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'novalys_gpt_02@ai-access.dz:MasterAI99#$ (Accès garanti 30j)',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-22T14:30:00Z',
  },
  {
    id: 'ditem-gpt-003',
    product_id: 'prod-chatgpt-plus',
    secret_data: 'novalys_gpt_03@ai-access.dz:OpenAIPro#2026 (Accès garanti 30j)',
    is_delivered: true,
    order_id: 'ord-1003',
    date_added: '2026-09-17T14:30:00Z',
  },

  // Claude Pro (type: 'account_text')
  {
    id: 'ditem-cld-001',
    product_id: 'prod-claude-pro',
    secret_data: 'anthropic_pro1@ai-vault.dz:ClaudeSonnet#35 (Accès garanti 30j)',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-23T11:00:00Z',
  },

  // Canva Pro (type: 'account_text' or link)
  {
    id: 'ditem-cnv-001',
    product_id: 'prod-canva-pro',
    secret_data: 'https://canva.com/brand/join?token=novalys_invitation_pro_994821',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-22T16:00:00Z',
  },
  {
    id: 'ditem-cnv-002',
    product_id: 'prod-canva-pro',
    secret_data: 'https://canva.com/brand/join?token=novalys_invitation_pro_773921',
    is_delivered: true,
    order_id: 'ord-1002',
    date_added: '2026-09-19T16:00:00Z',
  },

  // Xbox Game Pass Ultimate (type: 'key')
  {
    id: 'ditem-xbx-001',
    product_id: 'prod-xbox-game-pass',
    secret_data: 'XBGPU-994K2-QRT89-PLMC4-77291',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-21T08:00:00Z',
  },

  // Bitdefender (type: 'key')
  {
    id: 'ditem-btd-001',
    product_id: 'prod-bitdefender-total-security',
    secret_data: 'BTD-TS-2026-88492-XVCQ',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-20T12:00:00Z',
  },

  // Kaspersky (type: 'key')
  {
    id: 'ditem-ksp-001',
    product_id: 'prod-kaspersky-premium',
    secret_data: 'KSP-PREM-94821-48201-99',
    is_delivered: false,
    order_id: null,
    date_added: '2026-09-20T12:00:00Z',
  },
];
