import { Order, DigitalItem } from '@/types';

export interface GoogleSpreadsheetItem {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
}

/**
 * Searches for existing spreadsheets in Google Drive
 */
export async function listNovalysSpreadsheets(accessToken: string): Promise<GoogleSpreadsheetItem[]> {
  try {
    const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,modifiedTime)&pageSize=15`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Erreur lors de la recherche des fichiers Google Drive');
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing spreadsheets:', error);
    throw error;
  }
}

/**
 * Creates a complete Novalys Spreadsheet with 2 tabs:
 * 1. "Commandes & Ventes"
 * 2. "Coffre de Licences"
 */
export async function createNovalysSpreadsheet(
  accessToken: string,
  customTitle?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const title = customTitle || `Novalys Store - Commandes & Licences (${new Date().toLocaleDateString('fr-FR')})`;

  const payload = {
    properties: {
      title,
      locale: 'fr_FR',
      autoRecalc: 'ON_CHANGE',
    },
    sheets: [
      {
        properties: {
          title: 'Commandes & Ventes',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
      {
        properties: {
          title: 'Coffre de Licences',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Erreur lors de la création de la feuille Google Sheets');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl;

  // Initialize Headers
  const ordersHeader = [
    [
      'ID Commande',
      'Réf Code',
      'Date & Heure',
      'Nom Client',
      'Email',
      'Téléphone',
      'Produits',
      'Devise',
      'Total Payé',
      'Statut Commande',
      'Mode de Paiement',
      'Clé / Données Délivrées',
    ],
  ];

  const licensesHeader = [
    [
      'ID Item',
      'ID Produit',
      'Clé CD / Données Secrètes',
      'Statut Livraison',
      'Assigné à (Réf Commande)',
      'Date Ajout',
    ],
  ];

  // Batch update values
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: "'Commandes & Ventes'!A1:L1",
            values: ordersHeader,
          },
          {
            range: "'Coffre de Licences'!A1:F1",
            values: licensesHeader,
          },
        ],
      }),
    }
  );

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Synchronizes all orders into the 'Commandes & Ventes' sheet
 */
export async function syncOrdersToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  orders: Order[]
): Promise<number> {
  const rows = orders.map((ord) => {
    const customerFullName = ord.customer
      ? `${ord.customer.firstName || ''} ${ord.customer.lastName || ''}`.trim() || 'Client Inconnu'
      : 'Client Inconnu';
    const customerEmail = ord.customer?.email || ord.customer_email || '-';
    const customerPhone = ord.customer?.phone || ord.customer_phone || '-';
    const productsList = ord.items && ord.items.length > 0
      ? ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')
      : 'Produit Numérique';

    const deliveredKey = ord.delivered_secret_data || (ord.licenses && ord.licenses.length > 0 ? ord.licenses.map(l => l.licenseKey).join(' | ') : 'En attente de délivrance');

    const paymentMethodLabel = ord.payment_method === 'baridimob'
      ? 'BaridiMob (Virement)'
      : ord.payment_method === 'ccp'
      ? 'CCP Algérie Poste'
      : ord.payment_method === 'apple_pay'
      ? 'Apple Pay'
      : ord.payment_method === 'mada'
      ? 'Carte mada'
      : ord.payment_method === 'stripe'
      ? 'Carte Bancaire (Stripe)'
      : ord.payment_method === 'paypal'
      ? 'PayPal'
      : ord.payment_method || 'En ligne';

    return [
      ord.id,
      ord.orderNumber || ord.id.slice(0, 8),
      new Date(ord.createdAt).toLocaleString('fr-FR'),
      customerFullName,
      customerEmail,
      customerPhone,
      productsList,
      ord.currency || 'USD',
      ord.total || ord.total_amount || 0,
      ord.status === 'completed' || ord.status === 'delivered'
        ? 'Délivrée / Validée'
        : ord.status === 'pending_verification' || ord.status === 'pending_proof' || ord.status === 'pending'
        ? 'En Attente de Validation'
        : ord.status === 'cancelled' || ord.status === 'refunded'
        ? 'Annulée / Remboursée'
        : ord.status,
      paymentMethodLabel,
      deliveredKey,
    ];
  });

  // Clear previous data
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Commandes & Ventes'!A2:L${Math.max(rows.length + 50, 100)}:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (rows.length === 0) return 0;

  // Insert updated rows
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Commandes & Ventes'!A2?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur lors de l'export des commandes dans Google Sheets");
  }

  return rows.length;
}

/**
 * Synchronizes licenses inventory into 'Coffre de Licences' sheet
 */
export async function syncLicensesToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  digitalItems: DigitalItem[]
): Promise<number> {
  const rows = digitalItems.map((item) => [
    item.id,
    item.product_id,
    item.secret_data,
    item.is_delivered ? 'Délivré (Vendu)' : 'Disponible (En Stock)',
    item.order_id || '-',
    new Date(item.date_added).toLocaleString('fr-FR'),
  ]);

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Coffre de Licences'!A2:F${Math.max(rows.length + 50, 100)}:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (rows.length === 0) return 0;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Coffre de Licences'!A2?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Erreur lors de l'export des licences dans Google Sheets");
  }

  return rows.length;
}
